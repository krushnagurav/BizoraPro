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
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { OrdersTrendChart } from "@/src/components/admin/orders-trend-chart";
import Link from "next/link";

export default async function AdminOrdersPage() {
  const supabase = await createClient();

  // 1. Fetch All Orders (Limit 100 for performance)
  const { data: orders } = await supabase
    .from("orders")
    .select("*, shops(name, slug)")
    .order("created_at", { ascending: false })
    .limit(100);

  // 2. Prepare Chart Data (Last 30 days grouping)
  const dateMap = new Map();
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    dateMap.set(key, { date: key, orders: 0 });
  }

  orders?.forEach((order) => {
    const key = new Date(order.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    if (dateMap.has(key)) {
      dateMap.get(key).orders += 1;
    }
  });
  const chartData = Array.from(dateMap.values());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">WhatsApp Orders</h1>
        <Badge variant="outline" className="text-green-500 border-green-500">
          Live Monitor
        </Badge>
      </div>

      {/* GRAPH */}
      <OrdersTrendChart data={chartData} />

      {/* TABLE */}
      <Card className="bg-[#111] border-white/10 text-white">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-white/10">
                <TableHead className="text-gray-400">Order ID</TableHead>
                <TableHead className="text-gray-400">Shop</TableHead>
                <TableHead className="text-gray-400">Customer</TableHead>
                <TableHead className="text-gray-400">Total</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-gray-400">Time</TableHead>
                <TableHead className="text-right text-gray-400">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders?.map((order) => (
                <TableRow
                  key={order.id}
                  className="border-white/10 hover:bg-white/5"
                >
                  <TableCell className="font-mono text-xs text-gray-500">
                    #{order.id.slice(0, 6)}
                  </TableCell>
                  <TableCell className="font-medium text-primary">
                    {order.shops?.name}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{order.customer_info.name}</span>
                      <span className="text-xs text-gray-500">
                        {order.customer_info.phone}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-bold">
                    ₹{order.total_amount}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        order.status === "draft" ? "destructive" : "secondary"
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-gray-400">
                    {new Date(order.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {/* Admin can view public order tracking page */}
                    <Link
                      href={`/${order.shops.slug}/o/${order.id}`}
                      target="_blank"
                    >
                      <Button
                        size="icon"
                        variant="ghost"
                        className="hover:bg-white/10 hover:text-white"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
