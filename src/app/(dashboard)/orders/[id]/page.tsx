import { createClient } from "@/src/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MapPin, Phone, User, Calendar, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TemplateSelector } from "@/src/components/dashboard/orders/template-selector"; // 👈 Import

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 1. Fetch Order
  const { data: order } = await supabase
    .from("orders")
    .select("*, shops(id, name)")
    .eq("id", id)
    .single();

  if (!order) return notFound();

  // 2. Fetch Templates (For the smart button)
  const { data: templates } = await supabase
    .from("whatsapp_templates")
    .select("*")
    .eq("shop_id", order.shop_id)
    .order("created_at", { ascending: false });

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
           <Link href="/orders">
              <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
           </Link>
           <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                 Order #{order.id.slice(0, 5).toUpperCase()}
                 <Badge variant={order.status === 'delivered' ? 'secondary' : 'outline'}>{order.status}</Badge>
              </h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                 <Calendar className="h-3 w-3" />
                 {new Date(order.created_at).toLocaleString()}
              </div>
           </div>
        </div>

        <div className="flex gap-2">
           {/* 👇 THE SMART BUTTON 👇 */}
           <TemplateSelector 
              templates={templates || []} 
              order={order} 
              shopName={order.shops?.name} 
           />
           
           {/* ... other buttons like Print/Update Status ... */}
        </div>
      </div>

      {/* ... Rest of the Order Details (Items, Customer Info) ... */}
      {/* (Assuming you have the existing UI for items/customer here) */}
      
      <div className="grid md:grid-cols-3 gap-6">
         {/* Main Order Info */}
         <div className="md:col-span-2 space-y-6">
            <Card className="bg-card border-border/50">
               <CardHeader><CardTitle>Items</CardTitle></CardHeader>
               <CardContent>
                  {/* List Items */}
                  {order.items.map((item: any, i: number) => (
                     <div key={i} className="flex justify-between py-3 border-b last:border-0 border-border/50">
                        <div>
                           <p className="font-medium">{item.name}</p>
                           <p className="text-sm text-muted-foreground">x{item.qty}</p>
                        </div>
                        <p className="font-bold">₹{item.price * item.qty}</p>
                     </div>
                  ))}
                  <div className="flex justify-between pt-4 font-bold text-lg">
                     <span>Total</span>
                     <span>₹{order.total_amount}</span>
                  </div>
               </CardContent>
            </Card>
         </div>

         {/* Customer Info */}
         <div className="space-y-6">
            <Card className="bg-card border-border/50">
               <CardHeader><CardTitle>Customer</CardTitle></CardHeader>
               <CardContent className="space-y-4">
                  <div className="flex gap-3 items-start">
                     <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                     <div>
                        <p className="font-bold">{order.customer_info.name}</p>
                        <p className="text-sm text-muted-foreground">Customer</p>
                     </div>
                  </div>
                  <div className="flex gap-3 items-start">
                     <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                     <div>
                        <p className="font-bold">{order.customer_info.phone}</p>
                        <p className="text-sm text-muted-foreground">WhatsApp</p>
                     </div>
                  </div>
                  <div className="flex gap-3 items-start">
                     <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                     <div>
                        <p className="font-medium">{order.customer_info.city}</p>
                        <p className="text-sm text-muted-foreground">{order.customer_info.address || "No address provided"}</p>
                     </div>
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>

    </div>
  );
}