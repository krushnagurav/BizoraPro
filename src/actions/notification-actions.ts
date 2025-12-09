// src/actions/notification-actions.ts
/**
 * Notification Actions.
 *
 * This file contains server-side actions for managing user notifications,
 * including marking notifications as read and sending new notifications.
 */
"use server";

import { createClient } from "@/src/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function markNotificationReadAction(id: string) {
  const supabase = await createClient();
  await supabase.from("notifications").update({ is_read: true }).eq("id", id);
  revalidatePath("/notifications");
}

export async function markAllReadAction() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", user.id)
    .eq("is_read", false);

  revalidatePath("/notifications");
}

export async function sendNotificationAction(formData: FormData) {
  const title = formData.get("title") as string;
  const message = formData.get("message") as string;
  const type = (formData.get("type") as string) || "info";

  const supabase = await createClient();

  const { data: shops, error: fetchError } = await supabase
    .from("shops")
    .select("owner_id");

  if (fetchError || !shops) return { error: "Failed to fetch recipients" };

  const notifications = shops.map((shop) => ({
    user_id: shop.owner_id,
    title,
    message,
    type,
    is_read: false,
  }));

  if (notifications.length > 0) {
    const { error } = await supabase
      .from("notifications")
      .insert(notifications);
    if (error) return { error: error.message };
  }

  revalidatePath("/admin/notifications");
  return { success: `Sent to ${notifications.length} users` };
}
