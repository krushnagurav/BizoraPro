"use server";

import { createClient } from "@/src/lib/supabase/server";
import crypto from "crypto";
import Razorpay from "razorpay";

// Initialize Razorpay instance safely
// (It won&apos;t crash the app if keys are missing, but payments will fail gracefully)
const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

// 1. INITIATE CHECKOUT (Create Order)
export async function createSubscriptionOrderAction(planType: "monthly" | "yearly") {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { error: "Login required" };

  // Check if keys exist
  if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return { error: "Payment gateway not configured (Missing API Keys)" };
  }

  const amount = planType === "monthly" ? 19900 : 199900; // Amount in Paisa (₹199.00)

  try {
    const order = await razorpay.orders.create({
      amount: amount,
      currency: "INR",
      receipt: `receipt_${user.id.slice(0, 10)}`,
      notes: {
        userId: user.id,
        planType: planType
      }
    });

    return { 
      success: true, 
      orderId: order.id, 
      amount: order.amount, 
      currency: order.currency,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID 
    };
  } catch (error) {
    console.error("Razorpay Error:", error);
    return { error: "Failed to create payment order" };
  }
}

// 2. VERIFY PAYMENT (After User Pays)
export async function verifyPaymentAction(
  razorpay_order_id: string, 
  razorpay_payment_id: string, 
  razorpay_signature: string,
  planType: "monthly" | "yearly"
) {
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  
  if (!process.env.RAZORPAY_KEY_SECRET) return { error: "Server Config Error" };

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (!isAuthentic) {
    return { error: "Payment verification failed" };
  }

  // 3. UPDATE DATABASE (Upgrade User)
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    // 1. Find Shop
    const { data: shop } = await supabase.from("shops").select("id").eq("owner_id", user.id).single();
    
    if (shop) {
       // 2. Update Shop Plan
       await supabase
        .from("shops")
        .update({ 
          plan: "pro",
          product_limit: 10000, // Unlimited
        })
        .eq("owner_id", user.id);

      // 3. Log Payment
      await supabase.from("payments").insert({
        shop_id: shop.id,
        amount: planType === "monthly" ? 199 : 1999,
        transaction_id: razorpay_payment_id,
        status: "succeeded",
        payment_method: "razorpay"
      });
    }
  }

  return { success: "Plan Upgraded Successfully" };
}