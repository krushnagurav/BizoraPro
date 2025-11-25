import { createClient } from "@/src/lib/supabase/server";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { sendReplyAction } from "@/src/actions/support-actions";
import { User, ShieldAlert, ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";

export default async function SellerTicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 1. Fetch Ticket (Secure: Must belong to this user's shop)
  const { data: ticket } = await supabase
    .from("support_tickets")
    .select("*, shops(owner_id)")
    .eq("id", id)
    .single();

  // Security Check: Does this ticket belong to the logged-in user?
  if (!ticket || ticket.shops.owner_id !== user?.id) {
    return notFound();
  }

  // 2. Fetch Messages
  const { data: messages } = await supabase
    .from("ticket_messages")
    .select("*")
    .eq("ticket_id", id)
    .order("created_at", { ascending: true });

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/support">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-primary">Ticket #{ticket.id.slice(0,6)}</h1>
            <Badge variant={ticket.status === 'resolved' ? 'secondary' : 'outline'}>
              {ticket.status.toUpperCase()}
            </Badge>
          </div>
          <p className="text-muted-foreground">{ticket.subject}</p>
        </div>
      </div>

      {/* Chat Area */}
      <Card className="bg-card border-border/50">
        <CardContent className="p-6 space-y-6">
          
          {/* Messages List */}
          <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
            {messages?.map((msg) => {
              const isMe = msg.sender_role === 'seller';
              return (
                <div key={msg.id} className={`flex gap-4 ${isMe ? 'flex-row-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 
                    ${isMe ? 'bg-secondary text-foreground' : 'bg-primary/10 text-primary'}`}>
                    {isMe ? <User className="h-5 w-5" /> : <ShieldAlert className="h-5 w-5" />}
                  </div>
                  
                  {/* Bubble */}
                  <div className={`max-w-[80%] rounded-2xl p-4 text-sm 
                    ${isMe ? 'bg-secondary text-foreground' : 'bg-primary/10 border border-primary/20 text-foreground'}`}>
                    <p>{msg.message}</p>
                    <p className="text-[10px] mt-2 opacity-50 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(msg.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <Separator />

          {/* Reply Form */}
          {ticket.status !== 'resolved' ? (
            <form action={sendReplyAction} className="space-y-4">
              <input type="hidden" name="ticketId" value={ticket.id} />
              <input type="hidden" name="role" value="seller" />
              
              <Textarea 
                name="message" 
                placeholder="Type your reply..." 
                className="min-h-[100px]"
                required
              />
              <div className="flex justify-end">
                <Button type="submit" className="font-bold">
                  Send Reply
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-center py-4 text-muted-foreground bg-secondary/20 rounded-lg">
              This ticket has been marked as resolved. 
              <br /> Create a new ticket if you need more help.
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}