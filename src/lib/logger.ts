import { createClient } from "@/src/lib/supabase/server";

export async function logActivity(action: string, target: string, details: any = {}) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return; // Don't log anonymous actions for now

    await supabase.from("audit_logs").insert({
      actor_id: user.id,
      actor_email: user.email,
      action: action,
      target: target,
      details: details,
    });
  } catch (error) {
    console.error("Audit Log Failed:", error);
    // We don't throw error here to prevent blocking the main user action
  }
}