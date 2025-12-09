// src/actions/shop-actions.ts
/**
 * Shop Actions.
 *
 * This file contains server-side actions for managing shop-related
 * functionalities such as onboarding, appearance settings, shop settings,
 * store policies, notification preferences, and custom domain management.
 */
"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "../lib/supabase/server";
import { revalidatePath } from "next/cache";
import { categoryPresets } from "@/src/lib/fonts";

const step1Schema = z.object({
  name: z.string().min(3, "Shop name too short"),
  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9-]+$/, "Invalid URL format"),
});

const step2Schema = z.object({
  whatsapp: z.string().min(10, "Invalid Phone Number"),
  category: z.string().min(2, "Please select a category"),
});

export async function completeStep1(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Login required" };

  const raw = { name: formData.get("name"), slug: formData.get("slug") };
  const parsed = step1Schema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid shop details" };
  }

  const { data: exists } = await supabase
    .from("shops")
    .select("id")
    .eq("slug", parsed.data.slug)
    .single();
  if (exists) return { error: "URL already taken" };

  const { error } = await supabase.from("shops").insert({
    owner_id: user.id,
    name: parsed.data.name,
    slug: parsed.data.slug,
    onboarding_step: 2,
  });

  if (error) return { error: error.message };

  redirect("/onboarding");
}

export async function completeStep2(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const raw = {
    whatsapp: formData.get("whatsapp"),
    category: formData.get("category"),
  };
  const parsed = step2Schema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid details" };
  }
  const category = parsed.data.category;

  const preset = categoryPresets[category] || categoryPresets["Other"];

  const { data: shop } = await supabase
    .from("shops")
    .select("id")
    .eq("owner_id", user?.id)
    .single();
  if (!shop) return { error: "Shop not found" };

  const { error: catError } = await supabase
    .from("categories")
    .insert({ shop_id: shop.id, name: parsed.data.category })
    .select("id")
    .single();

  if (catError) return { error: "Failed to save category" };

  const { error } = await supabase
    .from("shops")
    .update({
      whatsapp_number: parsed.data.whatsapp,
      onboarding_step: 3,
      theme_config: {
        primaryColor: preset.primaryColor,
        font: preset.font,
        radius: preset.radius,
        bannerUrl: "",
        logoUrl: "",
      },
    })
    .eq("id", shop.id);

  if (error) return { error: error.message };

  redirect("/onboarding");
}

export async function completeStep3(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Login required" };

  const { data: shop } = await supabase
    .from("shops")
    .select("id")
    .eq("owner_id", user.id)
    .single();

  if (!shop) return { error: "Shop not found" };

  const name = formData.get("productName") as string;
  const price = Number(formData.get("productPrice"));

  const { error } = await supabase.from("products").insert({
    shop_id: shop.id,
    name,
    price,
    status: "active",
    image_url: "",
  });

  if (error) return { error: error.message };

  await supabase.from("shops").update({ onboarding_step: 4 }).eq("id", shop.id);

  redirect("/dashboard");
}

export async function updateShopAppearanceAction(formData: FormData) {
  const bannerUrl = formData.get("bannerUrl") as string;
  const primaryColor = formData.get("primaryColor") as string;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const logoUrl = formData.get("logoUrl") as string;

  if (!user) return { error: "Login required" };

  const { error } = await supabase
    .from("shops")
    .update({
      theme_config: {
        primaryColor: primaryColor || "#E6B800",
        bannerUrl: bannerUrl || "",
        logoUrl: logoUrl,
      },
    })
    .eq("owner_id", user.id);

  if (error) return { error: error.message };

  return { success: "Shop appearance updated!" };
}

export async function updateShopSettingsAction(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Login required" };

  const isOpen = formData.get("isOpen") === "on";
  const minOrder = Number(formData.get("minOrder"));
  const deliveryNote = formData.get("deliveryNote") as string;

  const { data: shop } = await supabase
    .from("shops")
    .select("plan")
    .eq("owner_id", user.id)
    .single();

  const isPro = shop?.plan === "pro";

  const autoClose = isPro ? formData.get("autoClose") === "on" : false;
  const openingTime = formData.get("openingTime") as string;
  const closingTime = formData.get("closingTime") as string;

  const socialLinks = isPro
    ? {
        instagram: formData.get("instagram") as string,
        facebook: formData.get("facebook") as string,
        youtube: formData.get("youtube") as string,
        twitter: formData.get("twitter") as string,
      }
    : {};

  const seoConfig = {
    metaTitle: formData.get("metaTitle") as string,
    metaDescription: formData.get("metaDescription") as string,
  };

  const { error } = await supabase
    .from("shops")
    .update({
      is_open: isOpen,
      min_order_value: minOrder,
      delivery_note: deliveryNote,
      auto_close: autoClose,
      opening_time: openingTime,
      closing_time: closingTime,
      social_links: socialLinks,
      seo_config: seoConfig,
    })
    .eq("owner_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/settings");
  return { success: "Settings updated" };
}

export async function updateStorePoliciesAction(formData: FormData) {
  const privacy = formData.get("privacy") as string;
  const terms = formData.get("terms") as string;
  const refund = formData.get("refund") as string;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Login required" };

  const { error } = await supabase
    .from("shops")
    .update({
      policies: { privacy, terms, refund },
    })
    .eq("owner_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/settings/policies");
  return { success: "Policies updated successfully" };
}

export async function updateNotificationPrefsAction(formData: FormData) {
  const emailOrder = formData.get("email_order") === "on";
  const emailLowStock = formData.get("email_low_stock") === "on";
  const whatsappOrder = formData.get("whatsapp_order") === "on";
  const marketingUpdates = formData.get("marketing_updates") === "on";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Login required" };

  const { error } = await supabase
    .from("shops")
    .update({
      notification_preferences: {
        email_order: emailOrder,
        email_low_stock: emailLowStock,
        whatsapp_order: whatsappOrder,
        marketing_updates: marketingUpdates,
      },
    })
    .eq("owner_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/settings/notifications");
  return { success: "Preferences updated" };
}

export async function updateCustomDomainAction(formData: FormData) {
  const domain = formData.get("domain") as string;

  const cleanDomain = domain
    .replace("https://", "")
    .replace("http://", "")
    .replace("www.", "")
    .replace(/\/$/, "") // remove trailing slash
    .toLowerCase();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Login required" };

  const { data: existing } = await supabase
    .from("shops")
    .select("id")
    .eq("custom_domain", cleanDomain)
    .neq("owner_id", user.id)
    .single();

  if (existing)
    return { error: "This domain is already connected to another shop." };

  const { error } = await supabase
    .from("shops")
    .update({
      custom_domain: cleanDomain,
      domain_verified: false,
    })
    .eq("owner_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/settings/domain");
  return { success: "Domain added! Please configure your DNS." };
}

export async function removeCustomDomainAction() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Login required" };

  const { error } = await supabase
    .from("shops")
    .update({
      custom_domain: null,
      domain_verified: false,
    })
    .eq("owner_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/settings/domain");
  return { success: "Domain disconnected successfully." };
}
