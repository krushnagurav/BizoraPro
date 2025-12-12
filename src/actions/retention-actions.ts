"use server";

import { createClient } from "@/src/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function sendRecoveryNudgeAction(shopId: string, ownerId: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("notifications").insert({
    user_id: ownerId,
    title: "⚠️ Your shop is empty!",
    message:
      "We noticed you haven't added any products yet. Need help getting started? Click here to add your first product.",
    type: "warning",
    is_read: false,
  });

  if (error) return { error: error.message };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  await supabase.from("audit_logs").insert({
    actor_id: user?.id,
    actor_email: user?.email,
    action: "Sent Recovery Nudge",
    target: `Shop: ${shopId}`,
    details: { type: "abandoned_cart_recovery" },
  });

  revalidatePath("/admin");
  return { success: "Nudge sent successfully!" };
}
