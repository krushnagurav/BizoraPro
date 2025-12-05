"use server";

import { createClient } from "@/src/lib/supabase/server";
import { revalidatePath } from "next/cache";

// 1. CREATE TICKET (Seller)
export async function createTicketAction(formData: FormData) {
  const subject = formData.get("subject") as string;
  const message = formData.get("message") as string;
  const priority = formData.get("priority") as string;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  // Get Shop ID
  const { data: shop } = await supabase
    .from("shops")
    .select("id")
    .eq("owner_id", user.id)
    .single();
  if (!shop) return { error: "Shop not found" };

  // Create Ticket
  const { data: ticket, error } = await supabase
    .from("support_tickets")
    .insert({ shop_id: shop.id, subject, priority, status: "open" })
    .select("id")
    .single();

  if (error) return { error: error.message };

  // Add First Message
  await supabase.from("ticket_messages").insert({
    ticket_id: ticket.id,
    sender_role: "owner", // Consistent role name
    message: message,
  });

  revalidatePath("/dashboard/support");
  return { success: "Ticket created" };
}

// 2. REPLY TO TICKET (Unified Function)
// Note: Use this for BOTH Admin and Seller forms.
export async function replyToTicketAction(formData: FormData): Promise<void> {
  const ticketId = formData.get("ticketId") as string;
  const message = (formData.get("message") as string)?.trim();
  const role = formData.get("role") as string; // 'admin' or 'owner'

  if (!ticketId || !message) {
    throw new Error("Missing ticketId or message");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("ticket_messages").insert({
    ticket_id: ticketId,
    sender_role: role,
    message,
  });

  if (error) {
    console.error("Failed to insert ticket message:", error.message);
    throw new Error(error.message);
  }

  // Update timestamp and status
  await supabase
    .from("support_tickets")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", ticketId);

  await Promise.all([
    revalidatePath("/admin/support"),
    revalidatePath(`/admin/support/${ticketId}`),
    revalidatePath("/dashboard/support"),
    revalidatePath(`/dashboard/support/${ticketId}`),
  ]);
}

// 3. UPDATE TICKET STATUS (Admin / Owner)
export async function updateTicketStatusAction(
  formData: FormData,
): Promise<void> {
  const ticketId = formData.get("ticketId") as string;
  const status = formData.get("status") as string; // 'open', 'resolved'

  const supabase = await createClient();

  const { error } = await supabase
    .from("support_tickets")
    .update({ status })
    .eq("id", ticketId);

  if (error) {
    console.error("Failed to update ticket status:", error.message);
    return;
  }

  // Revalidate lists and details in both admin + dashboard
  await Promise.all([
    revalidatePath("/admin/support"),
    revalidatePath(`/admin/support/${ticketId}`),
    revalidatePath("/dashboard/support"),
    revalidatePath(`/dashboard/support/${ticketId}`),
  ]);
}
