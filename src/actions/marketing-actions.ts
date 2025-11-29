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
  const name = formData.get("name") as string; // New field

  const supabase = await createClient();
  
  const { error } = await supabase.from("leads").insert({
    shop_id: shopId,
    name: name || "Guest",
    phone: phone,
    source: "storefront"
  });

  if (error) {
    // Handle duplicate phone gracefully
    if (error.code === '23505') return { error: "You are already subscribed!" };
    return { error: error.message };
  }
  return { success: "Subscribed successfully!" };
}

// 5. CREATE UPSELL
export async function createUpsellAction(formData: FormData) {
  const triggerId = formData.get("triggerId") as string;
  const suggestedId = formData.get("suggestedId") as string;
  const isReciprocal = formData.get("reciprocal") === "on";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get Shop
  const { data: shop } = await supabase
    .from("shops")
    .select("id")
    .eq("owner_id", user?.id)
    .single();
  if (!shop) return { error: "Shop not found" };

  // Validate: Can't upsell the same product
  if (triggerId === suggestedId)
    return { error: "Cannot suggest the same product" };

  const payload = [
    {
      shop_id: shop.id,
      trigger_product_id: triggerId,
      suggested_product_id: suggestedId,
    },
  ];

  if (isReciprocal) {
    payload.push({
      shop_id: shop.id,
      trigger_product_id: suggestedId,
      suggested_product_id: triggerId,
    });
  }

  const { error } = await supabase.from("upsells").insert(payload);

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

// 8. REPLY TO REVIEW
export async function replyToReviewAction(formData: FormData) {
  const id = formData.get("id") as string;
  const reply = formData.get("reply") as string;

  const supabase = await createClient();
  
  const { error } = await supabase
    .from("product_reviews")
    .update({ 
      reply: reply,
      replied_at: new Date().toISOString()
    })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/marketing/reviews");
  return { success: "Reply posted successfully" };
}

// 9. UPDATE TEMPLATE
export async function updateTemplateAction(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const message = formData.get("message") as string;
  const category = formData.get("category") as string;

  const supabase = await createClient();
  
  const { error } = await supabase
    .from("whatsapp_templates")
    .update({ name, message, category })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/marketing/templates");
  return { success: "Template updated" };
}

// 10. SEED TEMPLATES (Call this on Onboarding Step 4 or First Visit)
export async function seedTemplatesAction(shopId: string) {
  const supabase = await createClient();
  
  const defaults = [
    { name: "Order Confirmation", category: "order", message: "Hi {{customer_name}}, thanks for your order #{{order_id}}! We are processing it now." },
    { name: "Payment Received", category: "payment", message: "We received your payment of {{amount}}. Thanks!" },
    { name: "Review Request", category: "marketing", message: "Hi! How was your experience with {{shop_name}}? Please leave a review here: {{link}}" }
  ];

  // Insert individually to avoid duplicates if ran twice (simple check)
  for (const t of defaults) {
     await supabase.from("whatsapp_templates").insert({ shop_id: shopId, ...t });
  }
}

// 11. INCREMENT USAGE COUNT
export async function incrementTemplateUsageAction(id: string) {
  const supabase = await createClient();
  
  // Simple increment using RPC or raw SQL is best, but for now standard update works
  // We fetch first to get current count to be safe, or use a stored procedure if available
  // For MVP, we just do a read-write cycle or use postgrest increment if supported.
  // Supabase/Postgrest doesn't have a simple +1 in JS client without RPC usually, 
  // but we can do it efficiently:
  
  const { error } = await supabase.rpc('increment_template_usage', { row_id: id });
  
  // Fallback if RPC doesn't exist (Create this RPC in SQL if you want atomic updates)
  if (error) {
      // Manual method (slower but works without SQL setup)
      const { data } = await supabase.from("whatsapp_templates").select("used_count").eq("id", id).single();
      const newCount = (data?.used_count || 0) + 1;
      await supabase.from("whatsapp_templates").update({ used_count: newCount, last_used_at: new Date().toISOString() }).eq("id", id);
  }

  revalidatePath("/marketing/templates");
}

// 12. LOG LEAD CONTACT (Admin)
export async function logLeadContactAction(leadId: string) {
  const supabase = await createClient();
  await supabase.from("leads").update({ last_contacted_at: new Date().toISOString() }).eq("id", leadId);
  revalidatePath("/marketing/leads");
}