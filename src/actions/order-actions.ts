// src/actions/order-actions.ts
/**
 * Order Actions.
 *
 * This file contains server-side actions for placing orders and updating
 * order statuses in the system.
 */
"use server";

import { createClient } from "@/src/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const orderSchema = z.object({
  slug: z.string(),
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Phone number is required"),
  city: z.string().min(2, "City is required"),
  address: z.string().optional().nullable(),
  cartItems: z.string(),
  couponCode: z.string().optional().nullable(),
});

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

export async function placeOrderAction(formData: FormData) {
  const supabase = await createClient();

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

  let cartItems: CartItemInput[] = [];
  try {
    cartItems = JSON.parse(parsed.data.cartItems || "[]");
  } catch {
    return { error: "Invalid cart data" };
  }

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return { error: "Cart is empty" };
  }

  const { data: shop, error: shopError } = await supabase
    .from("shops")
    .select(
      "id, whatsapp_number, is_open, auto_close, opening_time, closing_time",
    )
    .eq("slug", parsed.data.slug)
    .single();

  if (shopError || !shop) {
    return { error: "Shop not found" };
  }

  let isShopOpen = shop.is_open;
  if (shop.auto_close) {
    const now = new Date();
    const indiaTime = now.toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour12: false,
    });
    const currentHM = indiaTime.slice(0, 5);

    if (currentHM < shop.opening_time || currentHM > shop.closing_time) {
      isShopOpen = false;
    }
  }

  if (!isShopOpen) {
    return { error: "Shop is currently closed. Please try again later." };
  }

  const productIds = cartItems.map((item) => item.id);

  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, price, name, stock_count")
    .in("id", productIds);

  if (productsError || !products || products.length === 0) {
    return { error: "Products not found" };
  }

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
        discount = (totalAmount * coupon.discount_value) / 100;
      }

      totalAmount = Math.max(0, totalAmount - discount);

      await supabase
        .from("coupons")
        .update({ used_count: (coupon.used_count || 0) + 1 })
        .eq("id", coupon.id);
    }
  }

  for (const cartItem of cartItems) {
    const product = products.find((p) => p.id === cartItem.id);
    if (!product) continue;

    const quantity = Number(cartItem.quantity) || 0;

    await supabase
      .from("products")
      .update({ stock_count: product.stock_count - quantity })
      .eq("id", product.id);
  }

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
      status: "placed",
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

export async function updateOrderStatusAction(
  formData: FormData,
): Promise<void> {
  const orderId = formData.get("orderId") as string | null;
  const newStatus = formData.get("status") as string | null;

  if (!orderId || !newStatus) {
    console.error("Invalid request");
    return;
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("Unauthorized");
    return;
  }

  const { data: shop, error: shopError } = await supabase
    .from("shops")
    .select("id")
    .eq("owner_id", user.id)
    .single();

  if (shopError || !shop) {
    console.error("Shop not found / unauthorized");
    return;
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("status, items, shop_id")
    .eq("id", orderId)
    .eq("shop_id", shop.id)
    .single();

  if (orderError || !order) {
    console.error("Order not found");
    return;
  }

  if (newStatus === "cancelled" && order.status !== "cancelled") {
    const items = (order.items || []) as Array<{
      id: string;
      qty?: number;
      quantity?: number;
    }>;

    for (const item of items) {
      const quantity = item.qty ?? item.quantity ?? 0;
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

  const { error: updateError } = await supabase
    .from("orders")
    .update({ status: newStatus })
    .eq("id", orderId)
    .eq("shop_id", shop.id);

  if (updateError) {
    console.error(updateError.message);
    return;
  }

  revalidatePath("/orders");
  revalidatePath(`/orders/${orderId}`);
}
