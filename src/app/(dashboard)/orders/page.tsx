import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderRowActions } from "@/src/components/dashboard/orders/order-row-actions";
import { createClient } from "@/src/lib/supabase/server";
import { Eye, Ghost, Search } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string }>;
}) {
  const params = await searchParams;
  const statusFilter = params.status || "all";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: shop } = await supabase
    .from("shops")
    .select("id")
    .eq("owner_id", user.id)
    .single();

  if (!shop) {
    redirect("/onboarding");
  }

  // Build Query
  let query = supabase
    .from("orders")
    .select("*")
    .eq("shop_id", shop.id)
    .order("created_at", { ascending: false });

  // Apply Status Filter
  if (statusFilter !== "all") {
    if (statusFilter === "abandoned") {
      query = query.eq("status", "draft");
    } else {
      query = query.eq("status", statusFilter);
    }
  } else {
    // Default: Don't show drafts in "All" unless asked
    query = query.neq("status", "draft");
  }

  // Apply Search (Client-side filtering for JSONB is hard in basic SQL,
  // but we can search ID or use a simple text search if columns existed.
  // For MVP, we fetch 50 and filter in JS or stick to basic filters)

  const { data: orders } = await query.limit(50);

  // Simple Filter Tabs
  const tabs = [
    { id: "all", label: "All Orders" },
    { id: "placed", label: "New" },
    { id: "confirmed", label: "Confirmed" },
    { id: "shipped", label: "Shipped" },
    { id: "delivered", label: "Completed" },
    { id: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Orders</h1>
          <p className="text-muted-foreground">
            Manage and fulfill your customer orders.
          </p>
        </div>

        <div className="flex gap-2">
          {/* 👇 NEW BUTTON 👇 */}
          <Link href="/orders/abandoned">
            <Button
              variant="outline"
              className="gap-2 text-red-500 border-red-500/30 hover:bg-red-500/10 hover:text-red-600"
            >
              <Ghost className="h-4 w-4" /> View Abandoned
            </Button>
          </Link>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search Order ID or Customer..."
            className="pl-9 bg-card"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <Link key={tab.id} href={`/orders?status=${tab.id}`}>
              <Button
                variant={statusFilter === tab.id ? "default" : "outline"}
                size="sm"
                className="whitespace-nowrap"
              >
                {tab.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>

      {/* TABLE */}
      <Card className="bg-card border-border/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border">
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-32 text-center text-muted-foreground"
                  >
                    No orders found.
                  </TableCell>
                </TableRow>
              ) : (
                orders?.map((order) => (
                  <TableRow
                    key={order.id}
                    className="border-border hover:bg-secondary/10"
                  >
                    <TableCell className="font-mono font-bold">
                      #{order.id.slice(0, 5).toUpperCase()}
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{order.customer_info.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.customer_info.phone}
                      </p>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-bold">
                      ₹{order.total_amount}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right" colSpan={2}>
                      <div className="flex justify-end items-center gap-2">
                        <OrderRowActions order={order} />
                        <Link href={`/orders/${order.id}`}>
                          <Button size="icon" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
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
