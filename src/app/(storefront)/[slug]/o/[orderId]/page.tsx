import { createClient } from "@/src/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, MessageCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function OrderSuccessPage({
  params,
}: {
  params: Promise<{ slug: string; orderId: string }>;
}) {
  const { slug, orderId } = await params;
  const supabase = await createClient();

  // 1. Fetch Order
  const { data: order } = await supabase
    .from("orders")
    .select("*, shops(whatsapp_number, name)")
    .eq("id", orderId)
    .single();

  if (!order) return notFound();

  // 2. Construct WhatsApp Message
  const shopPhone = order.shops?.whatsapp_number || "";
  const itemList = (order.items as any[])
    .map((i) => `• ${i.name} (x${i.qty}) - ₹${i.price * i.qty}`)
    .join("\n");

  const message = `
Hi, I placed a new order! 🛍️
*Order #${order.id.slice(0, 5).toUpperCase()}*

${itemList}

*Total: ₹${order.total_amount}*

Customer: ${order.customer_info.name}
City: ${order.customer_info.city}

Track Order: https://bizorapro.com/${slug}/o/${order.id}
  `.trim();

  const whatsappUrl = `https://wa.me/${shopPhone}?text=${encodeURIComponent(
    message
  )}`;

  if (!shopPhone) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-destructive/50">
          <CardContent className="pt-6 text-center">
            <h1 className="text-xl font-bold text-destructive">Configuration Error</h1>
            <p className="mt-2 text-muted-foreground">
              The shop owner has not set a WhatsApp number yet.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-border text-center">
        <CardContent className="pt-12 pb-12 space-y-6">
          <div className="mx-auto w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>

          <h1 className="text-2xl font-bold">Order Placed!</h1>
          <p className="text-muted-foreground">
            To confirm your order, please send the message on WhatsApp to the
            seller.
          </p>

          <div className="bg-secondary/30 p-4 rounded-lg text-left text-sm space-y-2">
            <p>
              <strong>Order ID:</strong> #{order.id.slice(0, 5).toUpperCase()}
            </p>
            <p>
              <strong>Amount:</strong> ₹{order.total_amount}
            </p>
          </div>

          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <Button className="w-full h-14 text-lg font-bold bg-[#25D366] hover:bg-[#20BD5C] text-white gap-2">
              <MessageCircle className="h-6 w-6" /> Send on WhatsApp
            </Button>
          </a>

          <Link href={`/${slug}`}>
            <Button variant="ghost" className="mt-4">
              Return to Shop
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
