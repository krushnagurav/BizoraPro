import { createClient } from "@/src/lib/supabase/server";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { sendReplyAction, updateTicketStatusAction } from "@/src/actions/support-actions";
import { User, ShieldAlert, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";

export default async function AdminTicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  // 1. Fetch Ticket & Shop Info
  const { data: ticket } = await supabase
    .from("support_tickets")
    .select("*, shops(name, owner_id)")
    .eq("id", id)
    .single();

  if (!ticket) return notFound();

  // 2. Fetch Messages
  const { data: messages } = await supabase
    .from("ticket_messages")
    .select("*")
    .eq("ticket_id", id)
    .order("created_at", { ascending: true });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/support">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Ticket #{ticket.id.slice(0,6)}</h1>
            <p className="text-gray-400">From: <span className="text-primary">{ticket.shops?.name}</span></p>
          </div>
        </div>
        
        {/* Status Actions */}
        <div className="flex gap-2">
          <Badge variant="outline" className="border-white/20 text-white px-3 py-1">
            {ticket.priority.toUpperCase()}
          </Badge>
          
          {ticket.status !== 'resolved' ? (
            <form action={updateTicketStatusAction}>
              <input type="hidden" name="ticketId" value={ticket.id} />
              <input type="hidden" name="status" value="resolved" />
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                <CheckCircle className="h-4 w-4 mr-2" /> Mark Resolved
              </Button>
            </form>
          ) : (
            <Badge className="bg-green-900 text-green-300">RESOLVED</Badge>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <Card className="bg-[#111] border-white/10 text-white">
        <CardHeader className="border-b border-white/10 pb-4">
          <CardTitle className="text-lg">{ticket.subject}</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          
          {/* Messages List */}
          <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
            {messages?.map((msg) => {
              const isAdmin = msg.sender_role === 'admin';
              return (
                <div key={msg.id} className={`flex gap-4 ${isAdmin ? 'flex-row-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 
                    ${isAdmin ? 'bg-primary/20 text-primary' : 'bg-gray-800 text-gray-400'}`}>
                    {isAdmin ? <ShieldAlert className="h-5 w-5" /> : <User className="h-5 w-5" />}
                  </div>
                  
                  {/* Bubble */}
                  <div className={`max-w-[80%] rounded-2xl p-4 text-sm 
                    ${isAdmin ? 'bg-primary text-black' : 'bg-[#222] border border-white/10'}`}>
                    <p>{msg.message}</p>
                    <p className={`text-[10px] mt-2 ${isAdmin ? 'text-black/60' : 'text-gray-500'}`}>
                      {new Date(msg.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <Separator className="bg-white/10" />

          {/* Reply Form */}
          {ticket.status !== 'resolved' && (
            <form action={sendReplyAction} className="space-y-4">
              <input type="hidden" name="ticketId" value={ticket.id} />
              <input type="hidden" name="role" value="admin" />
              
              <Textarea 
                name="message" 
                placeholder="Type your reply..." 
                className="bg-[#050505] border-white/10 text-white min-h-[100px]"
                required
              />
              <div className="flex justify-end">
                <Button type="submit" className="font-bold bg-primary text-black hover:bg-primary/90">
                  Send Reply
                </Button>
              </div>
            </form>
          )}
          
          {ticket.status === 'resolved' && (
            <div className="text-center text-gray-500 py-4">
              This ticket is closed. Re-open it to reply.
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}