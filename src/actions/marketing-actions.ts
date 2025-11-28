"use server";

import { createClient } from "@/src/lib/supabase/server";
import { revalidatePath } from "next/cache";

// --- TEMPLATES ---
export async function createTemplateAction(formData: FormData) {
  const name = formData.get("name") as string;
  const message = formData.get("message") as string;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data: shop } = await supabase.from("shops").select("id").eq("owner_id", user?.id).single();

  const { error } = await supabase.from("whatsapp_templates").insert({
    shop_id: shop?.id,
    name,
    message
  });

  if (error) return { error: error.message };
  revalidatePath("/marketing/templates");
  return { success: "Template saved" };
}

export async function deleteTemplateAction(formData: FormData) {
  const id = formData.get("id") as string;
  const supabase = await createClient();
  await supabase.from("whatsapp_templates").delete().eq("id", id);
  revalidatePath("/marketing/templates");
}

// 2. SUBMIT REVIEW (Public)
export async function submitReviewAction(formData: FormData) {
  const shopId = formData.get("shopId") as string;
  const productId = formData.get("productId") as string;
  const rating = Number(formData.get("rating"));
  const comment = formData.get("comment") as string;
  const name = formData.get("name") as string;

  const supabase = await createClient();
  
  const { error } = await supabase.from("product_reviews").insert({
    shop_id: shopId,
    product_id: productId,
    customer_name: name,
    rating,
    comment,
    is_approved: false // Pending by default
  });

  if (error) return { error: error.message };
  return { success: "Review submitted for approval!" };
}

// 3. APPROVE/DELETE REVIEW (Seller)
export async function toggleReviewStatusAction(formData: FormData) {
  const id = formData.get("id") as string;
  const action = formData.get("action") as string; // 'approve' or 'delete'

  const supabase = await createClient();
  
  if (action === 'delete') {
    await supabase.from("product_reviews").delete().eq("id", id);
  } else {
    await supabase.from("product_reviews").update({ is_approved: true }).eq("id", id);
  }
  
  revalidatePath("/marketing/reviews");
}

// 4. SUBMIT LEAD (Public)
export async function submitLeadAction(formData: FormData) {
  const shopId = formData.get("shopId") as string;
  const phone = formData.get("phone") as string;

  const supabase = await createClient();
  
  const { error } = await supabase.from("leads").insert({
    shop_id: shopId,
    name: "Guest", // Or add name input
    phone: phone, // or email, based on what you collect
    // You might need to add an 'email' column to 'leads' table if not there
  });

  if (error) return { error: error.message };
  return { success: "Subscribed successfully!" };
}

// 5. CREATE UPSELL
export async function createUpsellAction(formData: FormData) {
  const triggerId = formData.get("triggerId") as string;
  const suggestedId = formData.get("suggestedId") as string;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Get Shop
  const { data: shop } = await supabase.from("shops").select("id").eq("owner_id", user?.id).single();
  if (!shop) return { error: "Shop not found" };

  // Validate: Can&apos;t upsell the same product
  if (triggerId === suggestedId) return { error: "Cannot suggest the same product" };

  const { error } = await supabase.from("upsells").insert({
    shop_id: shop.id,
    trigger_product_id: triggerId,
    suggested_product_id: suggestedId
  });

  if (error) return { error: error.message };

  revalidatePath("/marketing/upsells");
  return { success: "Recommendation added" };
}

// 6. DELETE UPSELL
export async function deleteUpsellAction(formData: FormData) {
  const id = formData.get("id") as string;
  const supabase = await createClient();
  await supabase.from("upsells").delete().eq("id", id);
  revalidatePath("/marketing/upsells");
}

// ... existing imports

// 7. UPDATE INSTAGRAM FEED (Seller)
export async function updateInstagramFeedAction(formData: FormData) {
  const feedRaw = formData.get("feed") as string;
  const feed = feedRaw ? JSON.parse(feedRaw) : [];

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Login required" };

  const { error } = await supabase
    .from("shops")
    .update({ instagram_feed: feed })
    .eq("owner_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/marketing/instagram");
  return { success: "Instagram feed updated successfully" };
}