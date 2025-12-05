"use server";

import { createClient } from "@/src/lib/supabase/server";
import { revalidatePath } from "next/cache";

// 1. MARK SINGLE READ
export async function markNotificationReadAction(id: string) {
  const supabase = await createClient();
  await supabase.from("notifications").update({ is_read: true }).eq("id", id);
  revalidatePath("/notifications");
}

// 2. MARK ALL READ
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

// 3. SEND NOTIFICATION (Broadcast to All Shop Owners)
export async function sendNotificationAction(formData: FormData) {
  const title = formData.get("title") as string;
  const message = formData.get("message") as string;
  const type = (formData.get("type") as string) || "info"; // 'info', 'warning', 'announcement'

  const supabase = await createClient();

  // 1. Admin Check (Optional: You can add strict admin role check here)

  // 2. Fetch all Shop Owners
  // We send to everyone who has a shop.
  const { data: shops, error: fetchError } = await supabase
    .from("shops")
    .select("owner_id");

  if (fetchError || !shops) return { error: "Failed to fetch recipients" };

  // 3. Prepare Bulk Insert Payload
  const notifications = shops.map((shop) => ({
    user_id: shop.owner_id,
    title,
    message,
    type,
    is_read: false,
  }));

  // 4. Bulk Insert
  if (notifications.length > 0) {
    const { error } = await supabase
      .from("notifications")
      .insert(notifications);
    if (error) return { error: error.message };
  }

  revalidatePath("/admin/notifications");
  return { success: `Sent to ${notifications.length} users` };
}
