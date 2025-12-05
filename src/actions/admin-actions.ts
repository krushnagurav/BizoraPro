"use server";

import { createClient } from "@/src/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "../lib/supabase/admin";
import { logActivity } from "../lib/logger";

// 1. GET GLOBAL STATS
export async function getAdminStats() {
  const supabase = await createClient();

  // Run parallel queries for speed
  const [shops, orders] = await Promise.all([
    supabase.from("shops").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase.auth.admin.listUsers(), // Requires Service Role Key if using admin api, but for MVP we count rows in public table if linked
  ]);

  // Note: supabase.auth.admin requires SERVICE_ROLE_KEY.
  // For now, we will just count shops and orders which is safer.

  return {
    totalShops: shops.count || 0,
    totalOrders: orders.count || 0,
    totalRevenue: 0, // We will calculate this later from payments
  };
}

// 2. TOGGLE SHOP STATUS (Suspend/Activate)
export async function toggleShopStatusAction(
  formData: FormData,
): Promise<void> {
  const shopId = formData.get("shopId") as string | null;
  const desiredStatusRaw = formData.get("desiredStatus");

  if (!shopId) {
    // fatal — throw so platform shows the error (or handle via your toast system)
    throw new Error("Missing shopId");
  }

  const desiredStatus = desiredStatusRaw === "true";

  const supabase = await createClient();

  const { error } = await supabase
    .from("shops")
    .update({ is_open: desiredStatus })
    .eq("id", shopId);

  if (error) {
    // either throw to show an error page or use your notification system
    // throwing will surface the error in Next.js server-action error UI
    throw new Error(error.message);
  }

  // revalidate the admin listing so the change shows up on the next render
  revalidatePath("/admin/shops");
}

export async function createPlanAction(formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const priceMonthly = Number(formData.get("priceMonthly"));
  const priceYearly = Number(formData.get("priceYearly"));
  const productLimit = Number(formData.get("productLimit"));
  const isPopular = formData.get("isPopular") === "on";

  const { error } = await supabase.from("plans").insert({
    name,
    price_monthly: priceMonthly,
    price_yearly: priceYearly,
    product_limit: productLimit,
    is_popular: isPopular,
    features: ["WhatsApp Integration", "Analytics", "Custom Domain"], // Default for MVP
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/plans");
  return { success: "Plan created successfully" };
}

// 3. IMPERSONATE SHOP OWNER
export async function impersonateUserAction(userId: string) {
  const supabaseAdmin = createAdminClient();

  // 1. Get the Target User's Email
  const { data: targetUser } =
    await supabaseAdmin.auth.admin.getUserById(userId);
  if (!targetUser?.user?.email) return { error: "User not found" };

  // 2. Determine Current Domain
  // We use NEXT_PUBLIC_APP_URL from env, or fallback to origin header
  const origin = process.env.NEXT_PUBLIC_APP_URL;

  // 3. Generate Magic Link with Explicit Redirect
  const { data, error } = await supabaseAdmin.auth.admin.generateLink({
    type: "magiclink",
    email: targetUser.user.email,
    options: {
      // Force redirect to /dashboard after login
      redirectTo: `${origin}/verify`,
    },
  });

  if (error) return { error: error.message };

  await logActivity("impersonated_user", `User ID: ${userId}`, {
    target_email: targetUser.user.email,
  });

  return { success: true, url: data.properties.action_link };
}

// 4. UPDATE PLATFORM SETTINGS
export async function updatePlatformSettingsAction(formData: FormData) {
  const maintenance = formData.get("maintenance") === "on";
  const signups = formData.get("signups") === "on";
  const banner = formData.get("banner") as string;

  const supabase = await createClient();

  const { error } = await supabase
    .from("platform_settings")
    .update({
      maintenance_mode: maintenance,
      allow_new_signups: signups,
      global_banner: banner,
    })
    .eq("id", 1); // Always update row 1

  if (error) return { error: error.message };

  revalidatePath("/"); // Refresh entire site logic
  return { success: "Platform settings updated" };
}

// 5. CREATE ADMIN USER
export async function createAdminUserAction(formData: FormData) {
  const email = formData.get("email") as string;
  const fullName = formData.get("fullName") as string;
  const role = formData.get("role") as string;

  const supabase = await createClient();

  // Security: Only Super Admin can do this
  // (RLS handles it, but good to double check)

  const { error } = await supabase.from("admin_users").insert({
    email,
    full_name: fullName,
    role,
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/users");
  return { success: "Team member added" };
}

// 6. MANAGE TEMPLATES
export async function saveTemplateAction(formData: FormData) {
  const id = formData.get("id") as string; // If ID exists, it&apos;s an update
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const channel = formData.get("channel") as string;
  const subject = formData.get("subject") as string;
  const body = formData.get("body") as string;

  const supabase = await createClient();

  const payload = { name, slug, channel, subject, body };

  if (id) {
    // UPDATE
    const { error } = await supabase
      .from("notification_templates")
      .update(payload)
      .eq("id", id);
    if (error) return { error: error.message };
  } else {
    // CREATE
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
