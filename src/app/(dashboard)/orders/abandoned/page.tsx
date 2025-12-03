import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createClient } from "@/src/lib/supabase/server";
import { ArrowLeft, MessageCircle } from "lucide-react";
import Link from "next/link";

export default async function AbandonedOrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: shop } = await supabase.from("shops").select("id, name").eq("owner_id", user!.id).single();

  // Fetch ONLY Draft Orders
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("shop_id", shop?.id)
    .eq("status", "draft") // <--- The Filter
    .order("created_at", { ascending: false });

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/orders">
          <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-primary">Abandoned Checkouts</h1>
          <p className="text-muted-foreground">Customers who didn&apos;t complete the WhatsApp step.</p>
        </div>
      </div>

      <Card className="bg-card border-border/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border">
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Value</TableHead>
                <TableHead className="text-right">Recovery Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    No abandoned carts found. Good job!
                  </TableCell>
                </TableRow>
              ) : (
                orders?.map((order) => {
                  // Generate Recovery Link
                  const recoveryMsg = `Hi ${order.customer_info.name}, we noticed you left items in your cart at ${shop?.name || 'our shop'}. Would you like to complete your order?`;
                  const waLink = `https://wa.me/${order.customer_info.phone}?text=${encodeURIComponent(recoveryMsg)}`;

                  return (
                    <TableRow key={order.id} className="border-border hover:bg-secondary/10">
                      <TableCell>
                        <div className="font-medium">{order.customer_info.name}</div>
                        <div className="text-xs text-muted-foreground">{order.customer_info.phone}</div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{order.items.length} items</span>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                         {new Date(order.created_at).toLocaleDateString()} 
                         {/* Use date-fns here for "2 hours ago" if you want */}
                      </TableCell>
                      <TableCell className="font-bold text-red-400">
                        ₹{order.total_amount}
                      </TableCell>
                      <TableCell className="text-right">
                        <a href={waLink} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white gap-2">
                            <MessageCircle className="h-4 w-4" /> Recover
                          </Button>
                        </a>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}