import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { createClient } from "@/src/lib/supabase/server";
import { Clock, ShoppingBag } from "lucide-react";
import Link from "next/link";

export async function OrdersWidget({ shopId }: { shopId: string }) {
  const supabase = await createClient();
  const [pending, recent] = await Promise.all([
    supabase
      .from("orders")
      .select("*")
      .eq("shop_id", shopId)
      .eq("status", "placed")
      .order("created_at", { ascending: true })
      .limit(5),
    supabase
      .from("orders")
      .select("*")
      .eq("shop_id", shopId)
      .neq("status", "draft")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Pending Actions */}
      <Card className="bg-card border-border/50 border-l-4 border-l-red-500">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-red-500" /> Pending (
            {pending.data?.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableBody>
              {pending.data?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center py-8 text-muted-foreground"
                  >
                    All caught up! 🎉
                  </TableCell>
                </TableRow>
              ) : (
                pending.data?.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell>{o.customer_info.name}</TableCell>
                    <TableCell className="font-bold">
                      ₹{o.total_amount}
                    </TableCell>
                    <TableCell className="text-right">
                      <a
                        href={`https://wa.me/${o.customer_info.phone}`}
                        target="_blank"
                      >
                        <Button size="sm" className="bg-green-600 h-7 text-xs">
                          Chat
                        </Button>
                      </a>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card className="bg-card border-border/50">
        <CardHeader className="flex flex-row justify-between">
          <CardTitle className="flex gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" /> Recent
          </CardTitle>
          <Link href="/orders" className="text-sm text-primary">
            View All
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableBody>
              {recent.data?.map((o) => (
                <TableRow key={o.id}>
                  <TableCell>{o.customer_info.name}</TableCell>
                  <TableCell>₹{o.total_amount}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className="capitalize">
                      {o.status}
                    </Badge>
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
