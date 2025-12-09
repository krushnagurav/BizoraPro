// src/actions/admin-actions.ts
/**
 * Admin Actions.
 *
 * This file contains server-side actions for administrative tasks such as
 * managing shops, plans, platform settings, and user impersonation.
 */
"use server";

import { createClient } from "@/src/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { logActivity } from "../lib/logger";
import { createAdminClient } from "../lib/supabase/admin";

export async function getAdminStats() {
  const supabase = await createClient();

  const [shops, orders] = await Promise.all([
    supabase.from("shops").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase.auth.admin.listUsers(),
  ]);

  return {
    totalShops: shops.count || 0,
    totalOrders: orders.count || 0,
    totalRevenue: 0,
  };
}

export async function toggleShopStatusAction(
  formData: FormData,
): Promise<void> {
  const shopId = formData.get("shopId") as string | null;
  const desiredStatusRaw = formData.get("desiredStatus");

  if (!shopId) {
    throw new Error("Missing shopId");
  }

  const desiredStatus = desiredStatusRaw === "true";

  const supabase = await createClient();

  const { error } = await supabase
    .from("shops")
    .update({ is_open: desiredStatus })
    .eq("id", shopId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/shops");
}

export async function createPlanAction(formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const priceMonthly = Number(formData.get("priceMonthly"));
  const priceYearly = Number(formData.get("priceYearly"));
  const productLimit = Number(formData.get("productLimit"));
  const storageLimit = formData.get("storageLimit") as string;
  const isPopular = formData.get("isPopular") === "on";

  const { error } = await supabase.from("plans").insert({
    name,
    price_monthly: priceMonthly,
    price_yearly: priceYearly,
    product_limit: productLimit,
    storage_limit: storageLimit,
    is_popular: isPopular,
    features: [
      "WhatsApp Integration",
      "Analytics",
      "Custom Domain",
      `${storageLimit} Storage`,
    ],
    theme_access: "basic",
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/plans");
  return { success: "Plan created successfully" };
}

export async function updatePlanAction(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const priceMonthly = Number(formData.get("priceMonthly"));
  const priceYearly = Number(formData.get("priceYearly"));
  const productLimit = Number(formData.get("productLimit"));
  const storageLimit = formData.get("storageLimit") as string;
  const isPopular = formData.get("isPopular") === "on";
  const supabase = await createClient();

  const { error } = await supabase
    .from("plans")
    .update({
      name,
      price_monthly: priceMonthly,
      price_yearly: priceYearly,
      product_limit: productLimit,
      storage_limit: storageLimit,
      is_popular: isPopular,

      features: [
        "WhatsApp Integration",
        "Analytics",
        "Custom Domain",
        `${storageLimit} Storage`,
      ],
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/plans");
  return { success: "Plan updated successfully" };
}

export async function deletePlanAction(formData: FormData): Promise<void> {
  const id = formData.get("id") as string;
  const supabase = await createClient();

  const { error } = await supabase.from("plans").delete().eq("id", id);

  if (error) {
    console.error("Failed to delete plan. Possibly in use.", error);
    return;
  }

  revalidatePath("/admin/plans");
}

export async function impersonateUserAction(userId: string) {
  const supabaseAdmin = createAdminClient();

  const { data: targetUser } =
    await supabaseAdmin.auth.admin.getUserById(userId);
  if (!targetUser?.user?.email) return { error: "User not found" };

  const origin = process.env.NEXT_PUBLIC_APP_URL;

  const { data, error } = await supabaseAdmin.auth.admin.generateLink({
    type: "magiclink",
    email: targetUser.user.email,
    options: {
      redirectTo: `${origin}/verify`,
    },
  });

  if (error) return { error: error.message };

  await logActivity("impersonated_user", `User ID: ${userId}`, {
    target_email: targetUser.user.email,
  });

  return { success: true, url: data.properties.action_link };
}

export async function updatePlatformSettingsAction(formData: FormData) {
  const maintenance = formData.get("maintenance") === "on";
  const signups = formData.get("signups") === "on";

  const bannerMessage = formData.get("bannerMessage") as string;
  const bannerTitle = formData.get("bannerTitle") as string;
  const bannerVariant = formData.get("bannerVariant") as string;
  const targetAudience = formData.get("targetAudience") as string;

  const displayLocations = [];
  if (formData.get("loc_dashboard") === "on")
    displayLocations.push("dashboard");
  if (formData.get("loc_admin") === "on") displayLocations.push("admin");
  if (formData.get("loc_public") === "on") displayLocations.push("public");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("platform_settings")
    .update({
      maintenance_mode: maintenance,
      allow_new_signups: signups,
      global_banner: bannerMessage,
      banner_title: bannerTitle,
      banner_variant: bannerVariant,
      target_audience: targetAudience,
      display_locations: displayLocations,
    })
    .eq("id", 1);

  if (error) return { error: error.message };

  await supabase.from("audit_logs").insert({
    actor_id: user?.id,
    actor_email: user?.email,
    action: "Updated Platform Settings",
    target: "System Configuration",
    details: { maintenance, bannerTitle },
  });

  revalidatePath("/");
  revalidatePath("/admin/settings");
  return { success: "Platform settings updated" };
}

export async function createAdminUserAction(formData: FormData) {
  const email = formData.get("email") as string;
  const fullName = formData.get("fullName") as string;
  const role = formData.get("role") as string;

  const supabase = await createClient();

  const { error } = await supabase.from("admin_users").insert({
    email,
    full_name: fullName,
    role,
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/users");
  return { success: "Team member added" };
}

export async function saveTemplateAction(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const channel = formData.get("channel") as string;
  const subject = formData.get("subject") as string;
  const body = formData.get("body") as string;
  const status = formData.get("status") === "active";

  const supabase = await createClient();

  const payload = { name, slug, channel, subject, body, is_active: status };

  if (id) {
    const { error } = await supabase
      .from("notification_templates")
      .update(payload)
      .eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase
      .from("notification_templates")
      .insert(payload);
    if (error) return { error: error.message };
  }

  revalidatePath("/admin/templates");
  return { success: "Template saved successfully" };
}

export async function deleteTemplateAction(formData: FormData) {
  const id = formData.get("id") as string;
  const supabase = await createClient();
  await supabase.from("notification_templates").delete().eq("id", id);
  revalidatePath("/admin/templates");
}
