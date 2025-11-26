import { createClient } from "@/src/lib/supabase/server";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Mail, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default async function AdminInvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: inv } = await supabase
    .from("payments")
    .select("*, shops(*)")
    .eq("id", id)
    .single();

  if (!inv) return notFound();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Breadcrumb / Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/invoices">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-white">Invoice Details</h1>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
             <Mail className="h-4 w-4 mr-2" /> Resend Invoice
           </Button>
           <Button className="bg-primary text-black font-bold hover:bg-primary/90">
             <Download className="h-4 w-4 mr-2" /> Download PDF
           </Button>
        </div>
      </div>

      {/* Status Banner */}
      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <CheckCircle2 className="text-green-500 h-5 w-5" />
            <span className="text-green-500 font-medium">Payment successful via {inv.payment_method} on {new Date(inv.created_at).toLocaleString()}</span>
         </div>
         <Badge className="bg-green-900 text-green-300 hover:bg-green-900">Status: PAID</Badge>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        
        {/* INVOICE PREVIEW */}
        <Card className="md:col-span-2 bg-[#111] border-white/10 text-white">
          <CardHeader className="border-b border-white/10 pb-6">
             <div className="flex justify-between">
                <div>
                   <h2 className="text-xl font-bold text-white">Invoice Summary</h2>
                   <p className="text-sm text-gray-500 mt-1">INV-{inv.id.slice(0,8).toUpperCase()}</p>
                </div>
             </div>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold mb-2">Billed To</p>
                <p className="text-white font-medium text-lg">{inv.shops?.name}</p>
                <p className="text-gray-400 text-sm">{inv.shops?.whatsapp_number || "No Phone"}</p>
                <p className="text-gray-400 text-sm mt-1">{inv.shops?.slug}.bizorapro.com</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase font-bold mb-2">Details</p>
                <div className="space-y-1">
                    <div className="flex justify-between gap-8">
                        <span className="text-gray-400">Issue Date:</span>
                        <span className="text-white">{new Date(inv.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between gap-8">
                        <span className="text-gray-400">Gateway:</span>
                        <span className="text-white capitalize">Razorpay</span>
                    </div>
                    <div className="flex justify-between gap-8">
                        <span className="text-gray-400">Transaction ID:</span>
                        <span className="text-white font-mono text-xs">{inv.transaction_id || "-"}</span>
                    </div>
                </div>
              </div>
            </div>

            {/* Line Items */}
            <div className="border rounded-lg border-white/10 overflow-hidden">
               <table className="w-full text-sm">
                 <thead className="bg-white/5 text-gray-400">
                   <tr>
                     <th className="px-4 py-3 text-left font-medium">Description</th>
                     <th className="px-4 py-3 text-right font-medium">Amount</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-white/10">
                   <tr>
                     <td className="px-4 py-4">
                        <span className="block text-white font-medium">BizoraPro Subscription</span>
                        <span className="text-xs text-gray-500">Plan Upgrade ({inv.shops?.plan})</span>
                     </td>
                     <td className="px-4 py-4 text-right text-white">₹{inv.amount}</td>
                   </tr>
                 </tbody>
               </table>
               <div className="bg-white/5 px-4 py-4 flex justify-between items-center border-t border-white/10">
                 <span className="font-bold text-lg text-white">Total Paid</span>
                 <span className="font-bold text-xl text-primary">₹{inv.amount}</span>
               </div>
            </div>

          </CardContent>
        </Card>

        {/* SIDEBAR INFO */}
        <div className="space-y-6">
           <Card className="bg-[#111] border-white/10 text-white">
             <CardHeader><CardTitle className="text-base">Shop Owner Information</CardTitle></CardHeader>
             <CardContent className="space-y-4">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">
                    {inv.shops?.name.charAt(0)}
                 </div>
                 <div>
                   <p className="font-medium text-sm text-white">{inv.shops?.name}</p>
                   <p className="text-xs text-gray-500">ID: {inv.shop_id.slice(0,8)}</p>
                 </div>
               </div>
               <div className="space-y-2 pt-2 border-t border-white/10">
                  <div className="flex justify-between text-sm">
                     <span className="text-gray-500">Plan</span>
                     <Badge variant="outline" className="border-primary text-primary capitalize">{inv.shops?.plan}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                     <span className="text-gray-500">Shop Status</span>
                     <span className={inv.shops?.is_open ? "text-green-400" : "text-red-400"}>
                        {inv.shops?.is_open ? "Active" : "Closed"}
                     </span>
                  </div>
               </div>
               <a href={`${process.env.NEXT_PUBLIC_APP_URL}/${inv.shops?.slug}`} target="_blank">
                 <Button className="w-full bg-primary text-black font-bold mt-2 hover:bg-primary/90">
                    Open Shop Profile
                 </Button>
               </a>
             </CardContent>
           </Card>
        </div>

      </div>
    </div>
  );
}