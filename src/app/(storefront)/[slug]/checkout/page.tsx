// src/app/(storefront)/[slug]/checkout/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { placeOrderAction } from "@/src/actions/order-actions";
import { useCart } from "@/src/hooks/use-cart";
import { ArrowLeft, MessageCircle, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, FormEvent } from "react";
import { toast } from "sonner";

export default function CheckoutPage() {
  const cart = useCart();
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setIsMounted(true), []);
  if (!isMounted) return null;

  const items = cart.items ?? [];
  if (items.length === 0) return null; // Redirect handled in useEffect normally

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    formData.append("slug", params.slug as string);
    formData.append("cartItems", JSON.stringify(items));
    if (cart.coupon) formData.append("couponCode", cart.coupon.code);

    const result = await placeOrderAction(formData);
    if (result?.error) {
      toast.error(result.error);
      setLoading(false);
    } else if (result?.success) {
      cart.clearCart();
      router.push(`/${params.slug}/o/${result.orderId}`);
    }
  };

  const total = cart.totalPrice();

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link href={`/${params.slug}/cart`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <div className="bg-[#E6B800] p-1.5 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold">BizoraPro</h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <Card className="bg-white border-gray-100 shadow-sm">
              <CardHeader className="border-b border-gray-50">
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input
                    name="name"
                    required
                    className="h-12"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label>WhatsApp Number *</Label>
                  <Input
                    name="phone"
                    type="tel"
                    required
                    className="h-12"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-gray-100 shadow-sm">
              <CardHeader className="border-b border-gray-50">
                <CardTitle>Delivery Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-2">
                  <Label>City / Area *</Label>
                  <Input name="city" required className="h-12" />
                </div>
                <div className="space-y-2">
                  <Label>Full Address *</Label>
                  <Input
                    name="address"
                    required
                    className="h-12"
                    placeholder="House No, Street..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-gray-100 shadow-lg rounded-2xl p-6 space-y-6 sticky top-28">
              <h3 className="font-bold text-xl">Order Summary</h3>
              <div className="flex justify-between items-end pt-4 border-t">
                <span className="font-bold text-lg">Total Payble</span>
                <span className="font-bold text-3xl">
                  ₹{total.toLocaleString()}
                </span>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 text-lg font-bold bg-[#E6B800] text-black hover:bg-[#FFD700] rounded-xl gap-2"
              >
                {loading ? (
                  "Processing..."
                ) : (
                  <>
                    <MessageCircle className="w-5 h-5" /> Place Order on
                    WhatsApp
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
