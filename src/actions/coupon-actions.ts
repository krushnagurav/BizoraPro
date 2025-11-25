"use server";

import { createClient } from "@/src/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const couponSchema = z.object({
  code: z.string().min(3, "Code must be 3+ chars").toUpperCase().trim(),
  discountType: z.enum(["fixed", "percent"]),
  discountValue: z.coerce.number().min(1, "Value must be positive"),
  minOrderValue: z.coerce.number().default(0),
});

export async function createCouponAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // 1. Get Shop
  const { data: shop } = await supabase.from("shops").select("id").eq("owner_id", user?.id).single();
  if (!shop) return { error: "Shop not found" };

  // 2. Validate
  const raw = {
    code: formData.get("code"),
    discountType: formData.get("discountType"),
    discountValue: formData.get("discountValue"),
    minOrderValue: formData.get("minOrderValue"),
  };

  const parsed = couponSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  // 3. Insert
  const { error } = await supabase.from("coupons").insert({
    shop_id: shop.id,
    code: parsed.data.code,
    discount_type: parsed.data.discountType,
    discount_value: parsed.data.discountValue,
    min_order_value: parsed.data.minOrderValue,
    is_active: true
  });

  if (error) {
    if (error.code === "23505") return { error: "Coupon code already exists" };
    return { error: error.message };
  }

  revalidatePath("/coupons");
  return { success: "Coupon Created" };
}

export async function deleteCouponAction(formData: FormData) {
  const id = formData.get("id") as string;
  const supabase = await createClient();
  
  const { error } = await supabase.from("coupons").delete().eq("id", id);
  if (error) return { error: error.message };
  
  revalidatePath("/coupons");
}

// 3. VERIFY COUPON (Public)
export async function verifyCouponAction(code: string, shopSlug: string, cartTotal: number) {
  const supabase = await createClient();

  // 1. Get Shop ID from Slug
  const { data: shop } = await supabase
    .from("shops")
    .select("id")
    .eq("slug", shopSlug)
    .single();

  if (!shop) return { error: "Invalid Shop" };

  // 2. Find Coupon
  const { data: coupon } = await supabase
    .from("coupons")
    .select("*")
    .eq("shop_id", shop.id)
    .eq("code", code.toUpperCase().trim())
    .eq("is_active", true)
    .single();

  if (!coupon) return { error: "Invalid Coupon Code" };

  // 3. Check Rules
  if (coupon.min_order_value > cartTotal) {
    return { error: `Minimum order of ₹${coupon.min_order_value} required` };
  }

  if (coupon.used_count >= coupon.usage_limit) {
    return { error: "Coupon usage limit reached" };
  }

  // 4. Return Discount Details (Don't apply yet, just return info)
  return { 
    success: true, 
    coupon: {
      code: coupon.code,
      type: coupon.discount_type,
      value: coupon.discount_value
    } 
  };
}