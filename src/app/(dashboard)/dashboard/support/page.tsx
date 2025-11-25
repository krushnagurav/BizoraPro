import { createClient } from "@/src/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createTicketAction } from "@/src/actions/support-actions";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function SupportPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Get Shop
  const { data: shop } = await supabase.from("shops").select("id").eq("owner_id", user?.id).single();

  // Fetch My Tickets
  const { data: tickets } = await supabase
    .from("support_tickets")
    .select("*")
    .eq("shop_id", shop?.id)
    .order("updated_at", { ascending: false });

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-primary">Support Center</h1>

      {/* CREATE TICKET FORM */}
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle>Create New Ticket</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createTicketAction} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Input name="subject" placeholder="Subject (e.g., Payment Issue)" required />
              <Select name="priority" defaultValue="medium">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Textarea name="message" placeholder="Describe your issue..." rows={3} required />
            <Button type="submit" className="font-bold">Submit Ticket</Button>
          </form>
        </CardContent>
      </Card>

      {/* TICKET LIST */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Your Tickets</h2>
        {tickets?.map((ticket) => (
          <Link key={ticket.id} href={`/dashboard/support/${ticket.id}`} className="block">
          <Card key={ticket.id} className="bg-card border-border/50 hover:border-primary/30 transition">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">{ticket.subject}</h3>
                <p className="text-sm text-muted-foreground">
                  Last updated: {new Date(ticket.updated_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Badge>{ticket.status}</Badge>
                <Badge variant="outline">{ticket.priority}</Badge>
              </div>
            </CardContent>
          </Card>
          </Link>
        ))}
        {tickets?.length === 0 && <p className="text-muted-foreground">No tickets yet.</p>}
      </div>
    </div>
  );
}