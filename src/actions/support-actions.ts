"use server";

import { createClient } from "@/src/lib/supabase/server";
import { revalidatePath } from "next/cache";

// 1. CREATE TICKET (Seller)
export async function createTicketAction(formData: FormData) {
  const subject = formData.get("subject") as string;
  const message = formData.get("message") as string;
  const priority = formData.get("priority") as string;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Get Shop ID
  const { data: shop } = await supabase.from("shops").select("id").eq("owner_id", user?.id).single();
  if (!shop) return { error: "Shop not found" };

  // Create Ticket
  const { data: ticket, error } = await supabase
    .from("support_tickets")
    .insert({ shop_id: shop.id, subject, priority })
    .select("id")
    .single();

  if (error) return { error: error.message };

  // Add First Message
  await supabase.from("ticket_messages").insert({
    ticket_id: ticket.id,
    sender_role: "seller",
    message: message
  });

  revalidatePath("/support");
  return { success: "Ticket created" };
}

// 2. SEND REPLY (Shared)
export async function sendReplyAction(formData: FormData) {
  const ticketId = formData.get("ticketId") as string;
  const message = formData.get("message") as string;
  const role = formData.get("role") as string; // 'admin' or 'seller'

  const supabase = await createClient();
  
  await supabase.from("ticket_messages").insert({
    ticket_id: ticketId,
    sender_role: role,
    message: message
  });

  // Update timestamp
  await supabase.from("support_tickets").update({ updated_at: new Date() }).eq("id", ticketId);

  revalidatePath(`/support`);
  revalidatePath(`/admin/support`);
}

// 3. UPDATE TICKET STATUS (Admin)
export async function updateTicketStatusAction(formData: FormData) {
  const ticketId = formData.get("ticketId") as string;
  const status = formData.get("status") as string; // 'open', 'resolved'

  const supabase = await createClient();
  
  const { error } = await supabase
    .from("support_tickets")
    .update({ status })
    .eq("id", ticketId);

  if (error) return { error: error.message };

  revalidatePath(`/admin/support/${ticketId}`);
  revalidatePath("/admin/support");
  return { success: "Status updated" };
}