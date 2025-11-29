"use server";

import { createClient } from "@/src/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Validation Schema
const orderSchema = z.object({
  slug: z.string(),
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Phone number is required"),
  city: z.string().min(2, "City is required"),
  address: z.string().optional(),
  cartItems: z.string(), 
  couponCode: z.string().optional().nullable(), // Allow null/undefined
});

export async function placeOrderAction(formData: FormData) {
  const supabase = await createClient();

  // 1. Validate Form Data
  const rawData = {
    slug: formData.get("slug"),
    name: formData.get("name"),
    phone: formData.get("phone"),
    city: formData.get("city"),
    address: formData.get("address"),
    cartItems: formData.get("cartItems"),
    couponCode: formData.get("couponCode"), // ✅ FIX: Added this line
  };

  const parsed = orderSchema.safeParse(rawData);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const cartItems = JSON.parse(parsed.data.cartItems);
  if (cartItems.length === 0) return { error: "Cart is empty" };

  // 2. Get Shop ID
const { data: shop } = await supabase
    .from("shops")
    .select("id, whatsapp_number, is_open, auto_close, opening_time, closing_time") // Fetch time settings
    .eq("slug", parsed.data.slug)
    .single();

  if (!shop) return { error: "Shop not found" };

  // 🔒 CHECK: IS SHOP OPEN?
  let isShopOpen = shop.is_open;
  if (shop.auto_close) {
    const now = new Date();
    const indiaTime = now.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false });
    const currentHM = indiaTime.slice(0, 5);
    if (currentHM < shop.opening_time || currentHM > shop.closing_time) {
      isShopOpen = false;
    }
  }

  if (!isShopOpen) {
    return { error: "Shop is currently closed. Please try again tomorrow." };
  }

  // 3. RE-CALCULATE TOTAL (Security Step)
  const productIds = cartItems.map((item: any) => item.id);
  const { data: products } = await supabase
    .from("products")
    .select("id, price, name")
    .in("id", productIds);

  let totalAmount = 0;
  const finalItems = cartItems.map((cartItem: any) => {
    const realProduct = products?.find((p) => p.id === cartItem.id);
    if (!realProduct) return null;
    
    const itemTotal = realProduct.price * cartItem.quantity;
    totalAmount += itemTotal;

    return {
      id: realProduct.id,
      name: realProduct.name,
      price: realProduct.price,
      qty: cartItem.quantity,
    };
  }).filter(Boolean);

  // 3.5 APPLY COUPON LOGIC (Server Side)
  if (parsed.data.couponCode) {
    const { data: coupon } = await supabase
      .from("coupons")
      .select("*")
      .eq("shop_id", shop.id)
      .eq("code", parsed.data.couponCode)
      .single();

    if (coupon && coupon.is_active) {
       // Calculate Discount
       let discount = 0;
       if (coupon.discount_type === 'fixed') {
         discount = coupon.discount_value;
       } else {
         discount = (totalAmount * coupon.discount_value) / 100;
       }
       totalAmount = Math.max(0, totalAmount - discount);

       // ✅ FIX: Increment usage directly (No RPC needed)
       await supabase
         .from("coupons")
         .update({ used_count: (coupon.used_count || 0) + 1 })
         .eq("id", coupon.id);
    }
  }

  // 4. Create Order in DB
  const { data: order, error } = await supabase
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
      status: "draft",
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  return { success: true, orderId: order.id };
}

export async function updateOrderStatusAction(formData: FormData) {
  const orderId = formData.get("orderId") as string;
  const newStatus = formData.get("status") as string;
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data: shop } = await supabase.from("shops").select("id").eq("owner_id", user?.id).single();
  if (!shop) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("orders")
    .update({ status: newStatus })
    .eq("id", orderId)
    .eq("shop_id", shop.id);

  if (error) return { error: error.message };
  
  revalidatePath(`/orders/${orderId}`);
  return { success: `Order marked as ${newStatus}` };
}