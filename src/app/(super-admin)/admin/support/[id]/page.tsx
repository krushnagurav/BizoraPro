import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { replyToTicketAction, updateTicketStatusAction } from "@/src/actions/support-actions";
import { TicketReplyForm } from "@/src/components/dashboard/support/ticket-reply-form";
import { createClient } from "@/src/lib/supabase/server";
import { ArrowLeft, Box, CheckCircle2, DollarSign, Send } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function AdminTicketDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  
  // 1. Fetch Ticket + Shop + Shop Stats (Join is tricky for stats, so separate queries)
  const { data: ticket } = await supabase.from("support_tickets").select("*, shops(*)").eq("id", id).single();
  if (!ticket) return notFound();

  // Fetch messages
  const { data: messages } = await supabase.from("ticket_messages").select("*").eq("ticket_id", id).order("created_at", { ascending: true });

  // Fetch Shop Vital Stats (Context for Admin)
  const { count: productCount } = await supabase.from("products").select("*", { count: 'exact', head: true }).eq("shop_id", ticket.shop_id);
  const { data: orders } = await supabase.from("orders").select("total_amount").eq("shop_id", ticket.shop_id);
  const totalRevenue = orders?.reduce((acc, o) => acc + Number(o.total_amount), 0) || 0;

  return (
    <div className="h-[calc(100vh-100px)] flex gap-6">
      
      {/* LEFT: CHAT AREA */}
      <div className="flex-1 flex flex-col gap-4">
        
        {/* Header */}
        <div className="flex items-center justify-between bg-[#111] p-4 rounded-xl border border-white/10">
           <div className="flex items-center gap-3">
              <Link href="/admin/support">
                 <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white"><ArrowLeft className="h-5 w-5" /></Button>
              </Link>
              <div>
                 <h1 className="font-bold text-lg text-white flex items-center gap-2">
                    {ticket.subject}
                    <Badge variant={ticket.status === 'resolved' ? 'secondary' : 'outline'} className="capitalize border-white/20 text-gray-300">
                       {ticket.status.replace('_', ' ')}
                    </Badge>
                 </h1>
                 <p className="text-xs text-gray-500">Ticket #{ticket.id.slice(0,8)} • Priority: {ticket.priority}</p>
              </div>
           </div>
           
           {ticket.status !== 'resolved' && (
              <form action={updateTicketStatusAction}>
                 <input type="hidden" name="ticketId" value={ticket.id} />
                 <input type="hidden" name="status" value="resolved" />
                 <Button variant="outline" size="sm" className="border-green-500/30 text-green-500 hover:bg-green-500/10">
                    <CheckCircle2 className="h-4 w-4 mr-2" /> Mark Resolved
                 </Button>
              </form>
           )}
        </div>

        {/* Messages */}
        <Card className="flex-1 bg-[#111] border-white/10 flex flex-col overflow-hidden">
           <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages?.map((msg) => {
                 const isAdmin = msg.sender_role === 'admin';
                 return (
                    <div key={msg.id} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                       <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                          isAdmin 
                            ? 'bg-primary text-black rounded-tr-sm' 
                            : 'bg-white/10 text-white rounded-tl-sm'
                       }`}>
                          <p>{msg.message}</p>
                          <p className={`text-[10px] mt-2 text-right ${isAdmin ? 'text-black/50' : 'text-gray-400'}`}>
                             {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                       </div>
                    </div>
                 )
              })}
           </div>
           
           {/* Reply Input */}
           {ticket.status !== 'resolved' && (
            <TicketReplyForm ticketId={ticket.id} role="admin" />
         )}
        </Card>
      </div>

      {/* RIGHT: SHOP CONTEXT (The "Spy" Panel) */}
      <div className="w-80 shrink-0 space-y-6">
         <Card className="bg-[#111] border-white/10 text-white">
            <CardHeader className="pb-3 border-b border-white/5">
               <CardTitle className="text-base">Shop Details</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                     {ticket.shops.name.charAt(0)}
                  </div>
                  <div>
                     <p className="font-bold">{ticket.shops.name}</p>
                     <Link href={`/admin/shops/${ticket.shops.id}`} className="text-xs text-primary hover:underline">View Admin Profile</Link>
                  </div>
               </div>
               
               <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="p-3 bg-white/5 rounded-lg">
                     <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><Box className="h-3 w-3"/> Products</p>
                     <p className="font-bold text-lg">{productCount}</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg">
                     <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><DollarSign className="h-3 w-3"/> Revenue</p>
                     <p className="font-bold text-lg">₹{totalRevenue > 1000 ? (totalRevenue/1000).toFixed(1)+'k' : totalRevenue}</p>
                  </div>
               </div>

               <div className="pt-2 border-t border-white/5">
                  <p className="text-xs text-gray-500 mb-2">Plan Status</p>
                  <Badge variant="outline" className={ticket.shops.plan === 'pro' ? "text-primary border-primary/50" : "text-gray-400"}>
                     {ticket.shops.plan === 'pro' ? 'PRO BUSINESS' : 'FREE STARTER'}
                  </Badge>
               </div>
            </CardContent>
         </Card>
      </div>

    </div>
  );
}