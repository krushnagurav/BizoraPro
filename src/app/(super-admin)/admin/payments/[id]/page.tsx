// src/app/(super-admin)/admin/payments/[id]/page.tsx
/*
 * Payment Detail Page
 *
 * This page displays detailed information about a specific payment transaction.
 * Super administrators can view transaction summary, billed shop details, and download invoices.
 */
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/src/lib/supabase/server";
import { ArrowLeft, CreditCard, Download, Store, User } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function PaymentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: payment } = await supabase
    .from("payments")
    .select("*, shops(name, email, owner_id)")
    .eq("id", id)
    .single();

  if (!payment) return notFound();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/payments">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              Payment Detail
              <Badge
                className={
                  payment.status === "succeeded"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                }
              >
                {payment.status}
              </Badge>
            </h1>
            <p className="text-gray-500 text-sm">
              ID: {payment.transaction_id || payment.id}
            </p>
          </div>
        </div>
        <Button className="bg-[#E6B800] text-black font-bold hover:bg-[#FFD700] gap-2">
          <Download className="h-4 w-4" /> Download Invoice
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-[#111] border-white/10 text-white md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" /> Transaction Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between items-center text-lg font-medium">
              <span>Amount Paid</span>
              <span className="text-3xl font-bold text-[#E6B800]">
                ₹{payment.amount}
              </span>
            </div>
            <Separator className="bg-white/10" />
            <div className="grid grid-cols-2 gap-y-4 text-sm">
              <div>
                <p className="text-gray-500">Date</p>
                <p>{new Date(payment.created_at).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-500">Payment Method</p>
                <p className="capitalize">{payment.payment_method}</p>
              </div>
              <div>
                <p className="text-gray-500">Gateway</p>
                <p>Razorpay</p>
              </div>
              <div>
                <p className="text-gray-500">Invoice No.</p>
                <p>INV-{payment.id.slice(0, 6).toUpperCase()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#111] border-white/10 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="w-4 h-4" /> Billed To
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="font-bold text-lg">{payment.shops?.name}</p>
              <p className="text-gray-500">
                Shop ID: {payment.shop_id.slice(0, 8)}
              </p>
            </div>
            <Separator className="bg-white/10" />
            <div className="flex items-center gap-2 text-gray-400">
              <User className="h-4 w-4" /> Owner
            </div>
            <Link href={`/admin/shops/${payment.shop_id}`}>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-white/10 hover:bg-white/5"
              >
                View Shop Profile
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
