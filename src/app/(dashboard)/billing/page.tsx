import { createClient } from "@/src/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { PlanManager } from "@/src/components/dashboard/billing/plan-manager";

export default async function BillingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 1. Fetch Shop Info
  const { data: shop } = await supabase
    .from("shops")
    .select("id, plan, product_limit")
    .eq("owner_id", user!.id)
    .single();

  // 2. Fetch Product Count
  const { count } = await supabase
    .from("products")
    .select("*", { count: 'exact', head: true })
    .eq("shop_id", shop?.id)
    .is("deleted_at", null);

  // 3. Fetch Invoices (Payments)
  const { data: invoices } = await supabase
    .from("payments")
    .select("*")
    .eq("shop_id", shop?.id)
    .order("created_at", { ascending: false });

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-primary">Billing & Subscription</h1>
        <p className="text-muted-foreground">Manage your plan and view invoices.</p>
      </div>

      {/* UPGRADE SECTION */}
      <PlanManager 
        currentPlan={shop?.plan || 'free'} 
        productCount={count || 0}
        productLimit={shop?.product_limit || 10}
      />

      {/* INVOICES SECTION */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FileText className="h-5 w-5" /> Invoice History
        </h2>
        
        <Card className="bg-card border-border/50">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Download</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      No invoices found. You are on the Free plan.
                    </TableCell>
                  </TableRow>
                ) : (
                  invoices?.map((inv) => (
                    <TableRow key={inv.id} className="border-border hover:bg-secondary/10">
                      <TableCell className="text-muted-foreground">
                        {new Date(inv.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-bold">₹{inv.amount}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          inv.status === 'succeeded' ? "text-green-500 border-green-500/50" : "text-red-500 border-red-500/50"
                        }>
                          {inv.status === 'succeeded' ? 'Paid' : inv.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="capitalize text-xs">{inv.payment_method}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}