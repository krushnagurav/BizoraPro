import { createClient } from "@/src/lib/supabase/server";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { updateOrderStatusAction } from "@/src/actions/order-actions";
import { ArrowLeft, Phone } from "lucide-react";
import Link from "next/link";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch Order
  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (!order) return notFound();

  const items = order.items as any[];

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <Link href="/orders" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" /> Back to Orders
      </Link>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">Order #{order.id.slice(0, 6)}</h1>
        <Badge className="text-base px-4 py-1">{order.status}</Badge>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Details */}
        <Card className="md:col-span-2 bg-card border-border/50">
          <CardHeader>
            <CardTitle>Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="flex gap-4">
                  <div className="h-12 w-12 bg-secondary rounded flex items-center justify-center text-xs">IMG</div>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.qty}</p>
                  </div>
                </div>
                <p className="font-bold">₹{item.price * item.qty}</p>
              </div>
            ))}
            <Separator className="my-4" />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">₹{order.total_amount}</span>
            </div>
          </CardContent>
        </Card>

        {/* Customer Details */}
        <div className="space-y-6">
          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <p className="text-muted-foreground">Name</p>
                <p className="font-medium">{order.customer_info.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Phone</p>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{order.customer_info.phone}</p>
                  <a href={`https://wa.me/${order.customer_info.phone}`} target="_blank">
                    <Button size="icon" variant="ghost" className="h-6 w-6 text-green-500"><Phone className="h-3 w-3"/></Button>
                  </a>
                </div>
              </div>
              <div>
                <p className="text-muted-foreground">Address</p>
                <p className="font-medium">{order.customer_info.address}, {order.customer_info.city}</p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle>Update Status</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <form action={updateOrderStatusAction}>
                <input type="hidden" name="orderId" value={order.id} />
                <input type="hidden" name="status" value="confirmed" />
                <Button variant="outline" className="w-full justify-start">Mark as Confirmed</Button>
              </form>
              <form action={updateOrderStatusAction}>
                <input type="hidden" name="orderId" value={order.id} />
                <input type="hidden" name="status" value="delivered" />
                <Button variant="outline" className="w-full justify-start hover:bg-green-500/10 hover:text-green-500">Mark as Delivered</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}