"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { placeOrderAction } from "@/src/actions/order-actions";
import { useCart } from "@/src/hooks/use-cart";
import { ArrowLeft, Headset, Loader2, MessageCircle, ShieldCheck, Wallet } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CheckoutPage() {
  const cart = useCart();
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  if (!isMounted) return null;
  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] text-slate-900 flex flex-col items-center justify-center p-4">
        <p className="text-lg">Your cart is empty.</p>
        <Link href={`/${params.slug}`}>
          <Button variant="link">Go Back</Button>
        </Link>
      </div>
    );
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    // Append hidden data
    formData.append("slug", params.slug as string);
    formData.append("cartItems", JSON.stringify(cart.items));
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

  // Totals
  const subtotal = cart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discount = subtotal - cart.totalPrice();
  const total = cart.totalPrice();

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20">
      
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/${params.slug}/cart`}>
              <Button variant="ghost" size="icon" className="hover:bg-slate-50 text-slate-900">
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
               <div className="bg-[#E6B800] p-1.5 rounded-lg">
                  <ShieldCheck className="w-5 h-5 text-white" />
               </div>
               <div>
                 <h1 className="text-lg font-bold text-slate-900 leading-none">BizoraPro</h1>
                 <p className="text-xs text-slate-500">Secure Checkout</p>
               </div>
            </div>
          </div>
          <div className="text-green-600 flex items-center gap-2 text-sm font-medium">
             <ShieldCheck className="w-4 h-4" /> Secure
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: FORM */}
          <div className="lg:col-span-7 space-y-6">
            
            <Card className="bg-white border-gray-100 shadow-sm">
              <CardHeader className="pb-4 border-b border-gray-50">
                <CardTitle className="text-xl text-slate-900">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-2">
                  <Label className="text-slate-700">Full Name *</Label>
                  <Input name="name" placeholder="Enter your full name" className="h-12 bg-white border-slate-200" required />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-700">WhatsApp Number *</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-3 flex items-center gap-2 border-r border-slate-200 pr-2">
                       <span className="text-xl">🇮🇳</span>
                       <span className="text-sm font-medium text-slate-600">+91</span>
                    </div>
                    <Input name="phone" placeholder="98765 43210" type="tel" className="h-12 pl-24 bg-white border-slate-200" required />
                  </div>
                  <p className="text-xs text-slate-500">We'll send order confirmation via WhatsApp</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-100 shadow-sm">
              <CardHeader className="pb-4 border-b border-gray-50">
                <CardTitle className="text-xl text-slate-900">Delivery Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-2">
                  <Label className="text-slate-700">City / Area *</Label>
                  <Input name="city" placeholder="Enter your city or area" className="h-12 bg-white border-slate-200" required />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-700">Full Address (Optional)</Label>
                  <Input name="address" placeholder="House No, Street name..." className="h-12 bg-white border-slate-200" />
                </div>
              </CardContent>
            </Card>

          </div>

          {/* RIGHT COLUMN: SUMMARY */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="bg-white border-gray-100 shadow-lg sticky top-28">
              <CardHeader className="pb-4 border-b border-gray-50 flex flex-row justify-between items-center">
                <CardTitle className="text-xl text-slate-900">Order Summary</CardTitle>
                {/* Chevron up/down could go here for mobile toggle */}
              </CardHeader>
              
              <CardContent className="space-y-6 pt-6">
                
                {/* Product List (Mini) */}
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                       <div className="h-16 w-16 bg-slate-100 rounded-lg relative overflow-hidden shrink-0 border border-gray-100">
                          {item.image_url && <Image src={item.image_url} fill className="object-cover" alt="" unoptimized />}
                       </div>
                       <div className="flex-1 flex justify-between">
                          <div>
                             <p className="font-bold text-slate-900 text-sm line-clamp-2">{item.name}</p>
                             <p className="text-xs text-slate-500 mt-1">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-bold text-slate-900 text-sm">₹{(item.price * item.quantity).toLocaleString()}</p>
                       </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-3 pt-4 border-t border-gray-100 text-sm">
                   <div className="flex justify-between text-slate-600">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toLocaleString()}</span>
                   </div>
                   {cart.coupon && (
                     <div className="flex justify-between text-green-600 font-medium">
                        <span>Discount (20%)</span>
                        <span>- ₹{discount.toLocaleString()}</span>
                     </div>
                   )}
                   <div className="flex justify-between items-end pt-4 border-t border-gray-100">
                      <span className="font-bold text-lg text-slate-900">Total</span>
                      <span className="font-bold text-2xl text-slate-900">₹{total.toLocaleString()}</span>
                   </div>
                </div>

                <Button className="w-full h-14 text-lg font-bold bg-[#E6B800] text-black hover:bg-[#FFD700] shadow-lg shadow-[#E6B800]/20 rounded-xl gap-2" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin" /> : <><MessageCircle className="w-5 h-5" /> Order on WhatsApp</>}
                </Button>

                {/* Trust Badges */}
                <div className="space-y-3 pt-4">
                   <div className="flex items-center gap-3 text-xs text-slate-500">
                      <ShieldCheck className="w-4 h-4 text-green-600" /> Secure Order Process
                   </div>
                   <div className="flex items-center gap-3 text-xs text-slate-500">
                      <Wallet className="w-4 h-4 text-blue-600" /> No Hidden Fees
                   </div>
                   <div className="flex items-center gap-3 text-xs text-slate-500">
                      <Headset className="w-4 h-4 text-purple-600" /> Direct Business Support
                   </div>
                </div>

              </CardContent>
            </Card>
          </div>

        </form>
      </div>
    </div>
  );
}