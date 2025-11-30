"use server";

import { createClient } from "@/src/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// ----------------------------
// Validation Schema
// ----------------------------
const orderSchema = z.object({
  slug: z.string(),
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Phone number is required"),
  city: z.string().min(2, "City is required"),
  address: z.string().optional().nullable(),
  cartItems: z.string(), // JSON string from client
  couponCode: z.string().optional().nullable(),
});

// Type for cart items coming from client
type CartItemInput = {
  id: string;
  quantity: number;
};

type FinalOrderItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
};

// ----------------------------
// 1. PLACE ORDER (Storefront)
// ----------------------------
export async function placeOrderAction(formData: FormData) {
  const supabase = await createClient();

  // 1. Validate form data with Zod
  const rawData = {
    slug: formData.get("slug"),
    name: formData.get("name"),
    phone: formData.get("phone"),
    city: formData.get("city"),
    address: formData.get("address"),
    cartItems: formData.get("cartItems"),
    couponCode: formData.get("couponCode"),
  };

  const parsed = orderSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  // 2. Parse cart items safely
  let cartItems: CartItemInput[] = [];
  try {
    cartItems = JSON.parse(parsed.data.cartItems || "[]");
  } catch {
    return { error: "Invalid cart data" };
  }

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return { error: "Cart is empty" };
  }

  // 3. Get Shop + open/close logic
  const { data: shop, error: shopError } = await supabase
    .from("shops")
    .select(
      "id, whatsapp_number, is_open, auto_close, opening_time, closing_time"
    )
    .eq("slug", parsed.data.slug)
    .single();

  if (shopError || !shop) {
    return { error: "Shop not found" };
  }

  // 🔒 CHECK: IS SHOP OPEN?
  let isShopOpen = shop.is_open;
  if (shop.auto_close) {
    const now = new Date();
    const indiaTime = now.toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour12: false,
    }); // "HH:mm:ss"
    const currentHM = indiaTime.slice(0, 5); // "HH:mm"

    if (currentHM < shop.opening_time || currentHM > shop.closing_time) {
      isShopOpen = false;
    }
  }

  if (!isShopOpen) {
    return { error: "Shop is currently closed. Please try again later." };
  }

  // 4. Recalculate totals from DB (security)
  const productIds = cartItems.map((item) => item.id);

  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, price, name, stock_count")
    .in("id", productIds);

  if (productsError || !products || products.length === 0) {
    return { error: "Products not found" };
  }

  // First pass: validate all products + stock, calculate total
  let totalAmount = 0;
  const finalItems: FinalOrderItem[] = [];

  for (const cartItem of cartItems) {
    const product = products.find((p) => p.id === cartItem.id);

    if (!product) {
      return { error: "Some products are no longer available." };
    }

    const quantity = Number(cartItem.quantity) || 0;
    if (quantity <= 0) {
      return { error: "Invalid quantity in cart." };
    }

    if (product.stock_count < quantity) {
      return { error: `Out of stock: ${product.name}` };
    }

    const itemTotal = product.price * quantity;
    totalAmount += itemTotal;

    finalItems.push({
      id: product.id,
      name: product.name,
      price: product.price,
      qty: quantity,
    });
  }

  // 5. Apply coupon (if any)
  let discount = 0;

  if (parsed.data.couponCode) {
    const { data: coupon } = await supabase
      .from("coupons")
      .select("*")
      .eq("shop_id", shop.id)
      .eq("code", parsed.data.couponCode)
      .single();

    if (coupon && coupon.is_active) {
      if (coupon.discount_type === "fixed") {
        discount = coupon.discount_value;
      } else {
        // percentage
        discount = (totalAmount * coupon.discount_value) / 100;
      }

      totalAmount = Math.max(0, totalAmount - discount);

      // Increment usage (simple, non-transactional)
      await supabase
        .from("coupons")
        .update({ used_count: (coupon.used_count || 0) + 1 })
        .eq("id", coupon.id);
    }
  }

  // 6. Deduct stock (after validation + coupon)
  // NOTE: still not fully race-safe; for serious prod use RPC/transaction.
  for (const cartItem of cartItems) {
    const product = products.find((p) => p.id === cartItem.id);
    if (!product) continue;

    const quantity = Number(cartItem.quantity) || 0;

    await supabase
      .from("products")
      .update({ stock_count: product.stock_count - quantity })
      .eq("id", product.id);
  }

  // 7. Create Order in DB
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      shop_id: shop.id,
      customer_info: {
        name: parsed.data.name,
        phone: parsed.data.phone,
        city: parsed.data.city,
        address: parsed.data.address,
      },
      items: finalItems,
      total_amount: totalAmount,
      status: "placed", // change to "draft" if you want manual confirmation
      whatsapp_sent: false,
      coupon_code: parsed.data.couponCode || null,
      discount_amount: discount,
    })
    .select("id")
    .single();

  if (orderError) {
    return { error: orderError.message };
  }

  return { success: true, orderId: order.id };
}

// ----------------------------
// 2. UPDATE ORDER STATUS (Dashboard)
// ----------------------------
export async function updateOrderStatusAction(formData: FormData) {
  const orderId = formData.get("orderId") as string | null;
  const newStatus = formData.get("status") as string | null; // 'confirmed', 'shipped', 'delivered', 'cancelled', etc.

  if (!orderId || !newStatus) {
    return { error: "Invalid request" };
  }

  const supabase = await createClient();

  // Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  // Get shop of this owner
  const { data: shop, error: shopError } = await supabase
    .from("shops")
    .select("id")
    .eq("owner_id", user.id)
    .single();

  if (shopError || !shop) {
    return { error: "Unauthorized" };
  }

  // Fetch order scoped to this shop
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("status, items, shop_id")
    .eq("id", orderId)
    .eq("shop_id", shop.id)
    .single();

  if (orderError || !order) {
    return { error: "Order not found" };
  }

  // If cancelling, restore stock (only once)
  if (newStatus === "cancelled" && order.status !== "cancelled") {
    const items = (order.items || []) as Array<{
      id: string;
      qty?: number;
      quantity?: number;
    }>;

    for (const item of items) {
      const quantity = (item.qty ?? item.quantity) ?? 0;
      if (!item.id || !quantity) continue;

      const { data: product } = await supabase
        .from("products")
        .select("stock_count")
        .eq("id", item.id)
        .single();

      if (product) {
        await supabase
          .from("products")
          .update({ stock_count: product.stock_count + quantity })
          .eq("id", item.id);
      }
    }
  }

  // Update status (still scoped to this shop)
  const { error: updateError } = await supabase
    .from("orders")
    .update({ status: newStatus })
    .eq("id", orderId)
    .eq("shop_id", shop.id);

  if (updateError) {
    return { error: updateError.message };
  }

  revalidatePath("/orders");
  revalidatePath(`/orders/${orderId}`);

  return { success: `Order marked as ${newStatus}` };
}
