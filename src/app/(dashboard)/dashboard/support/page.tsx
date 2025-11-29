import { createClient } from "@/src/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Headphones, Clock, CheckCircle2, AlertCircle, MessageSquare } from "lucide-react";
import Link from "next/link";
import { CreateTicketDialog } from "@/src/components/dashboard/support/create-ticket-dialog";
import { redirect } from "next/navigation";

export default async function SupportPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if(!user) redirect('/login');

  // Fetch Shop
  const { data: shop } = await supabase.from("shops").select("id, plan").eq("owner_id", user.id).single();

  // Fetch Tickets
  const { data: tickets } = await supabase
    .from("support_tickets")
    .select("*")
    .eq("shop_id", shop?.id)
    .order("created_at", { ascending: false });

  const openTickets = tickets?.filter(t => t.status !== 'resolved') || [];
  const resolvedTickets = tickets?.filter(t => t.status === 'resolved') || [];

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            <Headphones className="h-8 w-8" /> Support Center
          </h1>
          <p className="text-muted-foreground">
             Get help with payments, domains, or orders. 
             <span className="text-xs ml-2 bg-secondary/50 px-2 py-0.5 rounded">
               SLA: {shop?.plan === 'pro' ? '4 Hours ⚡' : '24 Hours'}
             </span>
          </p>
        </div>
        <CreateTicketDialog />
      </div>

      {/* Tickets List */}
      <Tabs defaultValue="open" className="w-full">
        <TabsList className="bg-secondary/20">
          <TabsTrigger value="open">Open ({openTickets.length})</TabsTrigger>
          <TabsTrigger value="resolved">Resolved ({resolvedTickets.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="open" className="mt-6 space-y-4">
           {openTickets.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-border rounded-xl">
                 <p className="text-muted-foreground">No open tickets. Everything is running smoothly! 🎉</p>
              </div>
           ) : (
              openTickets.map(ticket => <TicketCard key={ticket.id} ticket={ticket} />)
           )}
        </TabsContent>

        <TabsContent value="resolved" className="mt-6 space-y-4">
           {resolvedTickets.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No resolved tickets history.</div>
           ) : (
              resolvedTickets.map(ticket => <TicketCard key={ticket.id} ticket={ticket} />)
           )}
        </TabsContent>
      </Tabs>

      {/* Help Footer */}
      <div className="grid md:grid-cols-2 gap-4 mt-8">
         <a href="mailto:support@bizorapro.com" className="block">
            <Card className="bg-card border-border/50 hover:border-primary/30 transition">
               <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg"><MessageSquare className="h-5 w-5"/></div>
                  <div>
                     <h4 className="font-bold">Email Support</h4>
                     <p className="text-xs text-muted-foreground">support@bizorapro.com</p>
                  </div>
               </CardContent>
            </Card>
         </a>
         {/* FAQ Link could go here */}
      </div>

    </div>
  );
}

function TicketCard({ ticket }: { ticket: any }) {
   const priorityColors: any = { low: "text-blue-500", medium: "text-yellow-500", high: "text-orange-500", critical: "text-red-500" };
   
   return (
      <Link href={`/dashboard/support/${ticket.id}`}>
         <Card className="bg-card border-border/50 hover:border-primary/30 transition cursor-pointer group">
            <CardContent className="p-4 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full bg-secondary ${ticket.status === 'resolved' ? 'text-green-500' : 'text-primary'}`}>
                     {ticket.status === 'resolved' ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                  </div>
                  <div>
                     <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{ticket.subject}</h3>
                     <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <span>#{ticket.id.slice(0,6)}</span>
                        <span>•</span>
                        <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                     </div>
                  </div>
               </div>
               <div className="text-right">
                  <Badge variant="outline" className={`${priorityColors[ticket.priority]} border-opacity-20 bg-opacity-10 capitalize`}>
                     {ticket.priority}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1 capitalize">{ticket.status.replace('_', ' ')}</p>
               </div>
            </CardContent>
         </Card>
      </Link>
   );
}