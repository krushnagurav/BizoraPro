"use server";

import { createClient } from "@/src/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "../lib/supabase/admin";
import { logActivity } from "../lib/logger";

// 1. GET GLOBAL STATS
export async function getAdminStats() {
  const supabase = await createClient();

  // Run parallel queries for speed
  const [shops, orders, users] = await Promise.all([
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
export async function toggleShopStatusAction(formData: FormData) {
  const shopId = formData.get("shopId") as string;
  const currentStatus = formData.get("currentStatus") === "true"; // "true" if suspended

  const supabase = await createClient();

  // We use 'is_published' or create a new 'status' column.
  // Let's assume we use 'is_published' as a proxy for "Active" for now,
  // or better: add a 'status' column to shops table.

  // Let's use is_open for now to force close.
  const { error } = await supabase
    .from("shops")
    .update({ is_open: !currentStatus })
    .eq("id", shopId);

  if (error) return { error: error.message };

  revalidatePath("/admin/shops");
  return { success: "Shop status updated" };
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
  const { data: targetUser } = await supabaseAdmin.auth.admin.getUserById(
    userId
  );
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
    role
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/users");
  return { success: "Team member added" };
}