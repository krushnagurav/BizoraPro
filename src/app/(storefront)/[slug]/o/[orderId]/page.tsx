import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/src/lib/supabase/server";
import { CheckCircle2, Home, MapPin, MessageCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function OrderSuccessPage({ 
  params 
}: { 
  params: Promise<{ slug: string; orderId: string }> 
}) {
  const { slug, orderId } = await params;
  const supabase = await createClient();

  const { data: order } = await supabase
    .from("orders")
    .select("*, shops(whatsapp_number, name)")
    .eq("id", orderId)
    .single();

  if (!order) return notFound();

  const shopPhone = order.shops?.whatsapp_number || "";
  
  // Fallback for missing phone (should be blocked by checkout, but safe to handle)
  if (!shopPhone) {
    return <div className="p-8 text-center text-red-500">Error: Shop phone missing.</div>;
  }

  // WhatsApp Message Construction
  const itemList = (order.items as any[])
    .map((i) => `• ${i.name} (x${i.qty})`)
    .join("\n");
  
  const message = `Hi, I placed a new order! 🛍️\n*Order #${order.id.slice(0, 8).toUpperCase()}*\n\n${itemList}\n\n*Total: ₹${order.total_amount}*`.trim();
  const whatsappUrl = `https://wa.me/${shopPhone}?text=${encodeURIComponent(message)}`;

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 pb-20">
      
      {/* Header */}
      <div className="bg-white border-b border-gray-100 p-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
           <Link href={`/${slug}`} className="font-bold text-lg flex items-center gap-2">
             <Home className="w-5 h-5 text-slate-400" /> Return to Shop
           </Link>
           <div className="text-sm text-slate-500">Order Confirmation</div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">

        {/* 1. Success Hero */}
        <div className="text-center space-y-4">
           <div className="relative mx-auto w-24 h-24">
              <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20" />
              <div className="relative w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                 <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
           </div>
           <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Order Placed Successfully!</h1>
           <p className="text-slate-500 max-w-md mx-auto">
             Thank you for your purchase. We've prepared your order details below.
           </p>
        </div>

        {/* 2. Order Details Card */}
        <Card className="bg-white border-0 shadow-xl shadow-slate-200/60 rounded-3xl overflow-hidden">
           <CardContent className="p-8 space-y-8">
              
              <div className="flex justify-between items-end border-b border-slate-100 pb-6">
                 <div>
                    <p className="text-xs font-bold text-green-600 uppercase tracking-wider mb-1">Order Number</p>
                    <p className="text-2xl font-bold text-slate-900">#{order.id.slice(0, 8).toUpperCase()}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Date</p>
                    <p className="text-sm font-medium text-slate-900">{new Date(order.created_at).toLocaleDateString()}</p>
                 </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="grid md:grid-cols-2 gap-4">
                 <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full h-14 text-lg font-bold bg-[#25D366] hover:bg-[#20BD5C] text-white shadow-lg shadow-green-500/20 rounded-xl gap-2">
                       <MessageCircle className="w-5 h-5" /> Send Order Message
                    </Button>
                 </a>
                 <Button variant="outline" className="w-full h-14 text-lg font-bold border-slate-200 hover:bg-slate-50 text-slate-900 rounded-xl gap-2">
                    <MapPin className="w-5 h-5" /> Track Your Order
                 </Button>
              </div>

              {/* TIMELINE */}
              <div className="bg-green-50/50 rounded-2xl p-6 space-y-6">
                 <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> What Happens Next?
                 </h3>
                 
                 <div className="relative pl-4 space-y-8 border-l-2 border-green-200 ml-2">
                    <div className="relative">
                       <div className="absolute -left-[21px] top-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm" />
                       <p className="font-bold text-sm text-slate-900">Order Confirmation</p>
                       <p className="text-xs text-slate-500 mt-1">Send the message on WhatsApp to confirm your order.</p>
                    </div>
                    <div className="relative opacity-50">
                       <div className="absolute -left-[21px] top-0 w-4 h-4 bg-slate-200 rounded-full border-2 border-white" />
                       <p className="font-bold text-sm text-slate-900">Processing & Packing</p>
                       <p className="text-xs text-slate-500 mt-1">Seller will pack your items securely.</p>
                    </div>
                    <div className="relative opacity-50">
                       <div className="absolute -left-[21px] top-0 w-4 h-4 bg-slate-200 rounded-full border-2 border-white" />
                       <p className="font-bold text-sm text-slate-900">Delivery</p>
                       <p className="text-xs text-slate-500 mt-1">Expected within 3-5 business days.</p>
                    </div>
                 </div>
              </div>

           </CardContent>
        </Card>

        {/* 3. Need Help */}
        <div className="bg-[#0F172A] rounded-3xl p-8 md:p-12 text-center space-y-4 shadow-2xl text-white">
           <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto">
              <MessageCircle className="w-6 h-6 text-white" />
           </div>
           <h2 className="text-2xl font-bold">Need Help?</h2>
           <p className="text-slate-400 max-w-sm mx-auto text-sm">
              Our customer support team is here to assist you. Reach out via email or chat.
           </p>
           <div className="flex justify-center gap-4 pt-4">
              <Button variant="secondary" className="font-bold">Email Support</Button>
              <Button className="bg-[#25D366] hover:bg-[#20BD5C] text-white font-bold">Live Chat</Button>
           </div>
        </div>

      </div>
    </div>
  );
}