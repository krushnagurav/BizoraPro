// src/actions/marketing-actions.ts
/**
 * Marketing Actions.
 *
 * This file contains server-side actions for managing marketing-related
 * functionalities such as WhatsApp templates, product reviews, upsells,
 * Instagram feeds, and lead management.
 */
"use server";

import { createClient } from "@/src/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createTemplateAction(formData: FormData) {
  const name = formData.get("name") as string;
  const message = formData.get("message") as string;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: shop } = await supabase
    .from("shops")
    .select("id")
    .eq("owner_id", user?.id)
    .single();

  const { error } = await supabase.from("whatsapp_templates").insert({
    shop_id: shop?.id,
    name,
    message,
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
    is_approved: false,
  });

  if (error) return { error: error.message };
  return { success: "Review submitted for approval!" };
}

export async function toggleReviewStatusAction(formData: FormData) {
  const id = formData.get("id") as string;
  const action = formData.get("action") as string;

  const supabase = await createClient();

  if (action === "delete") {
    await supabase.from("product_reviews").delete().eq("id", id);
  } else {
    await supabase
      .from("product_reviews")
      .update({ is_approved: true })
      .eq("id", id);
  }

  revalidatePath("/marketing/reviews");
}

export async function submitLeadAction(formData: FormData) {
  const shopId = formData.get("shopId") as string;
  const phone = formData.get("phone") as string;
  const name = formData.get("name") as string;

  const supabase = await createClient();

  const { error } = await supabase.from("leads").insert({
    shop_id: shopId,
    name: name || "Guest",
    phone: phone,
    source: "storefront",
  });

  if (error) {
    if (error.code === "23505") return { error: "You are already subscribed!" };
    return { error: error.message };
  }
  return { success: "Subscribed successfully!" };
}

export async function createUpsellAction(formData: FormData) {
  const triggerId = formData.get("triggerId") as string;
  const suggestedId = formData.get("suggestedId") as string;
  const isReciprocal = formData.get("reciprocal") === "on";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: shop } = await supabase
    .from("shops")
    .select("id")
    .eq("owner_id", user?.id)
    .single();
  if (!shop) return { error: "Shop not found" };

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

export async function deleteUpsellAction(formData: FormData) {
  const id = formData.get("id") as string;
  const supabase = await createClient();
  await supabase.from("upsells").delete().eq("id", id);
  revalidatePath("/marketing/upsells");
}

export async function updateInstagramFeedAction(formData: FormData) {
  const feedRaw = formData.get("feed") as string;
  const feed = feedRaw ? JSON.parse(feedRaw) : [];

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Login required" };

  const { error } = await supabase
    .from("shops")
    .update({ instagram_feed: feed })
    .eq("owner_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/marketing/instagram");
  return { success: "Instagram feed updated successfully" };
}

export async function replyToReviewAction(formData: FormData) {
  const id = formData.get("id") as string;
  const reply = formData.get("reply") as string;

  const supabase = await createClient();

  const { error } = await supabase
    .from("product_reviews")
    .update({
      reply: reply,
      replied_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/marketing/reviews");
  return { success: "Reply posted successfully" };
}

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

export async function seedTemplatesAction(shopId: string) {
  const supabase = await createClient();

  const defaults = [
    {
      name: "Order Confirmation",
      category: "order",
      message:
        "Hi {{customer_name}}, thanks for your order #{{order_id}}! We are processing it now.",
    },
    {
      name: "Payment Received",
      category: "payment",
      message: "We received your payment of {{amount}}. Thanks!",
    },
    {
      name: "Review Request",
      category: "marketing",
      message:
        "Hi! How was your experience with {{shop_name}}? Please leave a review here: {{link}}",
    },
  ];

  for (const t of defaults) {
    await supabase.from("whatsapp_templates").insert({ shop_id: shopId, ...t });
  }
}

export async function incrementTemplateUsageAction(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.rpc("increment_template_usage", {
    row_id: id,
  });

  if (error) {
    const { data } = await supabase
      .from("whatsapp_templates")
      .select("used_count")
      .eq("id", id)
      .single();
    const newCount = (data?.used_count || 0) + 1;
    await supabase
      .from("whatsapp_templates")
      .update({ used_count: newCount, last_used_at: new Date().toISOString() })
      .eq("id", id);
  }

  revalidatePath("/marketing/templates");
}

export async function logLeadContactAction(leadId: string) {
  const supabase = await createClient();
  await supabase
    .from("leads")
    .update({ last_contacted_at: new Date().toISOString() })
    .eq("id", leadId);
  revalidatePath("/marketing/leads");
}
