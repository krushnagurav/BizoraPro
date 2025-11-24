"use server";

import { createClient } from "@/src/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Validation Schema
const orderSchema = z.object({
  slug: z.string(), // Shop Slug
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Phone number is required"),
  city: z.string().min(2, "City is required"),
  address: z.string().optional(),
  // We receive items as a JSON string from the client
  cartItems: z.string(), 
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
  };

  const parsed = orderSchema.safeParse(rawData);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const cartItems = JSON.parse(parsed.data.cartItems);
  if (cartItems.length === 0) return { error: "Cart is empty" };

  // 2. Get Shop ID
  const { data: shop } = await supabase
    .from("shops")
    .select("id, whatsapp_number")
    .eq("slug", parsed.data.slug)
    .single();

  if (!shop) return { error: "Shop not found" };

  // 3. RE-CALCULATE TOTAL (Security Step)
  // We fetch real prices from DB to prevent tampering
  const productIds = cartItems.map((item: any) => item.id);
  const { data: products } = await supabase
    .from("products")
    .select("id, price, name")
    .in("id", productIds);

  let totalAmount = 0;
  const finalItems = cartItems.map((cartItem: any) => {
    const realProduct = products?.find((p) => p.id === cartItem.id);
    if (!realProduct) return null; // Product deleted? Skip.
    
    const itemTotal = realProduct.price * cartItem.quantity;
    totalAmount += itemTotal;

    // Create Snapshot Item
    return {
      id: realProduct.id,
      name: realProduct.name,
      price: realProduct.price, // Snapshot price
      qty: cartItem.quantity,
    };
  }).filter(Boolean); // Remove nulls

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
      status: "draft", // Draft until they click WhatsApp
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  // 5. Return Success + Order ID (Client will redirect)
  return { success: true, orderId: order.id };
}

export async function updateOrderStatusAction(formData: FormData) {
  const orderId = formData.get("orderId") as string;
  const newStatus = formData.get("status") as string;
  
  const supabase = await createClient();
  
  // Update Status
  const { error } = await supabase
    .from("orders")
    .update({ status: newStatus })
    .eq("id", orderId);

  if (error) return { error: error.message };
  
  // Tell Next.js to refresh the Order List
  revalidatePath("/orders");
  
  // Tell Next.js to refresh the specific Order Detail page
  revalidatePath(`/orders/${orderId}`);
  
  return { success: "Order status updated" };
}