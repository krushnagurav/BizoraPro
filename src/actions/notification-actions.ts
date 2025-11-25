"use server";

import { createClient } from "@/src/lib/supabase/server";
import { revalidatePath } from "next/cache";

// 1. SEND NOTIFICATION (Admin Only)
export async function sendNotificationAction(formData: FormData) {
  const title = formData.get("title") as string;
  const message = formData.get("message") as string;
  const type = formData.get("type") as string;
  const targetUserId = formData.get("targetUserId") as string;

  const supabase = await createClient();
  
  // Security Check
  const { data: { user } } = await supabase.auth.getUser();
  if (user?.email !== "krishna@bizorapro.com") return { error: "Unauthorized" };

  const payload = {
    title,
    message,
    type,
    is_read: false
  };

  if (targetUserId) {
    // Option A: Send to Specific User
    const { error } = await supabase.from("notifications").insert({
      ...payload,
      user_id: targetUserId
    });
    if (error) return { error: error.message };

  } else {
    // Option B: Broadcast (Send to ALL Shop Owners)
    // 1. Get all shop owner IDs
    const { data: shops } = await supabase.from("shops").select("owner_id");
    
    if (!shops || shops.length === 0) return { error: "No shops found to message" };

    // 2. Create a notification for EACH owner
    const bulkNotifications = shops.map(shop => ({
      ...payload,
      user_id: shop.owner_id
    }));

    const { error } = await supabase.from("notifications").insert(bulkNotifications);
    
    if (error) return { error: error.message };
  }

  return { success: "Notification sent!" };
}

// 2. MARK AS READ (Shop Owner)
export async function markNotificationReadAction(notificationId: string) {
  const supabase = await createClient();
  console.log("Marking notification as read:", notificationId);
  await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId);
    
  // 👇 UPDATE THIS LINE
  // We need to refresh the specific page where the user is standing
  revalidatePath("/notifications"); 
  revalidatePath("/dashboard/notifications"); // Added just in case you moved folders
}