import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { updateTicketStatusAction } from "@/src/actions/support-actions"; // Need to ensure these exist
import { TicketReplyForm } from "@/src/components/dashboard/support/ticket-reply-form";
import { createClient } from "@/src/lib/supabase/server";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: ticket } = await supabase
    .from("support_tickets")
    .select("*")
    .eq("id", id)
    .single();
  if (!ticket) return notFound();

  const { data: messages } = await supabase
    .from("ticket_messages")
    .select("*")
    .eq("ticket_id", id)
    .order("created_at", { ascending: true });

  return (
    <div className="p-8 max-w-3xl mx-auto h-[calc(100vh-64px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/support">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="font-bold text-xl flex items-center gap-2">
              {ticket.subject}
              <Badge
                variant={ticket.status === "resolved" ? "secondary" : "outline"}
                className="capitalize"
              >
                {ticket.status.replace("_", " ")}
              </Badge>
            </h1>
            <p className="text-xs text-muted-foreground">
              Ticket #{ticket.id.slice(0, 8)} • {ticket.priority} priority
            </p>
          </div>
        </div>

        {ticket.status !== "resolved" && (
          <form action={updateTicketStatusAction}>
            <input type="hidden" name="ticketId" value={ticket.id} />
            <input type="hidden" name="status" value="resolved" />
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-green-500 hover:text-green-600 hover:bg-green-500/10"
            >
              <CheckCircle2 className="h-4 w-4" /> Mark Resolved
            </Button>
          </form>
        )}
      </div>

      {/* Chat Area */}
      <Card className="flex-1 bg-card border-border/50 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Initial System Message */}
          <div className="flex justify-center">
            <span className="text-[10px] bg-secondary/50 text-muted-foreground px-3 py-1 rounded-full">
              Ticket created on {new Date(ticket.created_at).toLocaleString()}
            </span>
          </div>

          {messages?.map((msg) => {
            const isMe = msg.sender_role === "owner"; // Assuming 'owner' is the role for shop owner
            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                    isMe
                      ? "bg-primary text-black rounded-tr-sm"
                      : "bg-secondary/30 text-foreground rounded-tl-sm border border-border/50"
                  }`}
                >
                  <p>{msg.message}</p>
                  <p
                    className={`text-[10px] mt-2 text-right ${isMe ? "text-black/50" : "text-muted-foreground"}`}
                  >
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })}

          {ticket.status === "resolved" && (
            <div className="flex justify-center">
              <div className="bg-green-500/10 text-green-500 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> This ticket has been marked
                as resolved.
              </div>
            </div>
          )}
        </div>

        {/* Reply Box */}
        {ticket.status !== "resolved" && (
          <TicketReplyForm ticketId={ticket.id} role="owner" />
        )}
      </Card>
    </div>
  );
}
