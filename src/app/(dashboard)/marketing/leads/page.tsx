import { createClient } from "@/src/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Phone } from "lucide-react";
import { ExportLeadsButton } from "@/src/components/dashboard/marketing/export-leads-btn";

export default async function LeadsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // 1. Get Shop ID
  const { data: shop } = await supabase.from("shops").select("id").eq("owner_id", user!.id).single();

  // 2. Fetch Leads
  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .eq("shop_id", shop?.id)
    .order("created_at", { ascending: false });

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            <Users className="h-8 w-8" /> Customer Leads
          </h1>
          <p className="text-muted-foreground">People who subscribed to your offers.</p>
        </div>
        
        {/* Client Component for Download Logic */}
        <ExportLeadsButton data={leads || []} />
      </div>

      <Card className="bg-card border-border/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border">
                <TableHead>Name</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Joined Date</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    No leads yet. Share your shop link!
                  </TableCell>
                </TableRow>
              ) : (
                leads?.map((lead) => (
                  <TableRow key={lead.id} className="border-border hover:bg-secondary/10">
                    <TableCell className="font-medium">
                      {lead.name || "Guest"}
                    </TableCell>
                    <TableCell className="flex items-center gap-2">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      {lead.phone}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Subscribed
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}