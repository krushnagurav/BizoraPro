import { createClient } from "@/src/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function OrdersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1. Get Shop ID
  const { data: shop } = await supabase
    .from("shops")
    .select("id")
    .eq("owner_id", user!.id)
    .single();

  // 2. Fetch Orders (Newest first)
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("shop_id", shop?.id)
    // .neq("status", "draft")
    .order("created_at", { ascending: false });

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold text-primary">Orders</h1>

      {/* NEW BUTTON */}
      <Link href="/orders/abandoned">
        <Button
          variant="outline"
          className="border-red-500/50 text-red-500 hover:bg-red-500/10 gap-2"
        >
          <MessageCircle className="h-4 w-4" /> View Abandoned
        </Button>
      </Link>

      <Card className="bg-card border-border/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border">
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No orders yet. Share your shop link!
                  </TableCell>
                </TableRow>
              ) : (
                orders?.map((order) => (
                  <TableRow
                    key={order.id}
                    className="border-border hover:bg-secondary/10"
                  >
                    <TableCell className="font-mono text-xs">
                      #{order.id.slice(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {order.customer_info.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {order.customer_info.phone}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(order.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          order.status === "delivered"
                            ? "secondary"
                            : order.status === "draft"
                            ? "destructive"
                            : "outline"
                        }
                      >
                        {order.status === "draft"
                          ? "Abandoned / Draft"
                          : order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-bold">
                      ₹{order.total_amount}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/orders/${order.id}`}>
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
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
