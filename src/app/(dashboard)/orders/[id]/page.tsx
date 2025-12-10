// src/app/(dashboard)/orders/[id]/page.tsx
/*
 * Order Detail Page
 * This component displays detailed information about a specific order
 * in the BizoraPro dashboard. It includes customer details, order items,
 * status timeline, and options to update the order status.
 */
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateOrderStatusAction } from "@/src/actions/order-actions";
import { OrderTimeline } from "@/src/components/dashboard/orders/order-timeline";
import { TemplateSelector } from "@/src/components/dashboard/orders/template-selector";
import { createClient } from "@/src/lib/supabase/server";
import { ArrowLeft, Ban, MapPin, Phone, Printer, User } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: order } = await supabase
    .from("orders")
    .select("*, shops(name, whatsapp_number)")
    .eq("id", id)
    .single();

  if (!order) return notFound();

  const { data: templates } = await supabase
    .from("whatsapp_templates")
    .select("*")
    .eq("shop_id", order.shop_id)
    .order("created_at", { ascending: false });

  const items = order.items as any[];
  const customer = order.customer_info as any;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount = subtotal - order.total_amount;
  const isDiscounted = discount > 0;

  const currentStatus = order.status;
  const isFinal = ["delivered", "cancelled"].includes(currentStatus);

  const allowedActions: Record<string, string[]> = {
    placed: ["confirmed", "cancelled"],
    confirmed: ["shipped", "cancelled"],
    shipped: ["delivered"],
    delivered: [],
    cancelled: [],
  };

  const availableNextSteps = allowedActions[currentStatus] || [];

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/orders">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              Order #{order.id.slice(0, 5).toUpperCase()}
              <Badge
                variant={order.status === "delivered" ? "secondary" : "outline"}
                className="capitalize"
              >
                {order.status}
              </Badge>
            </h1>
            <p className="text-sm text-muted-foreground">
              Placed on {new Date(order.created_at).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Printer className="h-4 w-4" /> Print Invoice
          </Button>
          <TemplateSelector
            templates={templates || []}
            order={order}
            shopName={order.shops?.name}
          />
        </div>
      </div>

      <OrderTimeline status={order.status} />

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle>Items ({items.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center border-b border-border/50 pb-4 last:pb-0 last:border-0"
                  >
                    <div className="flex gap-4">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.qty} x ₹{item.price}
                        </p>
                      </div>
                    </div>
                    <div className="text-right font-bold">
                      ₹{item.qty * item.price}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-border space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                {isDiscounted && (
                  <div className="flex justify-between text-sm text-green-500">
                    <span>Discount</span>
                    <span>- ₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 font-bold text-xl text-foreground">
                  <span>Total</span>
                  <span>₹{order.total_amount}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {!isFinal && (
            <Card className="bg-card border-border/50">
              <CardHeader>
                <CardTitle>Update Status</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-3 flex-wrap">
                {availableNextSteps.map((status) => (
                  <form action={updateOrderStatusAction} key={status}>
                    <input type="hidden" name="orderId" value={order.id} />
                    <input type="hidden" name="status" value={status} />
                    <Button
                      variant={
                        status === "cancelled" ? "destructive" : "default"
                      }
                      className="capitalize gap-2"
                    >
                      {status === "cancelled" && <Ban className="w-4 h-4" />}
                      Mark as {status}
                    </Button>
                  </form>
                ))}
              </CardContent>
            </Card>
          )}

          {isFinal && (
            <div className="text-center p-6 bg-secondary/10 rounded-xl text-muted-foreground border border-border/50">
              Order is <strong>{order.status}</strong>. No further actions
              allowed.
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle>Customer Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-3 items-start">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-bold">{customer.name}</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">WhatsApp</p>
                  <p className="font-bold">{customer.phone}</p>
                  <a
                    href={`https://wa.me/${customer.phone}`}
                    target="_blank"
                    className="text-xs text-green-500 hover:underline"
                  >
                    Open Chat
                  </a>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500 shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Shipping Address
                  </p>
                  <p className="font-medium">
                    {customer.address || "No street address"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {customer.city}
                  </p>
                </div>
              </div>

              {customer.note && (
                <div className="bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/20 text-sm">
                  <span className="font-bold text-yellow-500 block mb-1">
                    Note:
                  </span>
                  {customer.note}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
