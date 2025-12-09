// src/lib/logger.ts
/**
 * Activity Logger.
 *
 * This file provides a function to log user activities into the audit_logs table
 * in the database for tracking and auditing purposes.
 */
import { createClient } from "@/src/lib/supabase/server";

export async function logActivity(
  action: string,
  target: string,
  details: any = {},
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase.from("audit_logs").insert({
      actor_id: user.id,
      actor_email: user.email,
      action: action,
      target: target,
      details: details,
    });
  } catch (error) {
    console.error("Audit Log Failed:", error);
  }
}
