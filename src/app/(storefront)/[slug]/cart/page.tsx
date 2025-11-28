// src/app/(storefront)/[slug]/cart/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/src/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  ShoppingBag,
  ShieldCheck,
  MessageCircle,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { verifyCouponAction } from "@/src/actions/coupon-actions";
import { toast } from "sonner";

export default function CartPage() {
  const cart = useCart();
  const params = useParams();
  const [isMounted, setIsMounted] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const items = cart.items ?? [];

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setLoading(true);

    const subtotal = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
    const res = await verifyCouponAction(
      couponCode,
      params.slug as string,
      subtotal,
    );

    setLoading(false);
    if (res?.error) {
      toast.error(res.error);
      cart.removeCoupon();
    } else if (res?.coupon) {
      cart.applyCoupon(res.coupon);
      toast.success("Coupon Applied!");
      setCouponCode("");
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] text-slate-900 flex flex-col items-center justify-center p-4">
        <ShoppingBag className="h-24 w-24 mb-6 text-slate-300" />
        <h2 className="text-3xl font-bold mb-3">Your cart is empty</h2>
        <p className="text-slate-500 mb-8 text-center max-w-md text-lg">
          Looks like you haven&apos;t added anything to your cart yet.
        </p>
        <Link href={`/${params.slug}`}>
          <Button className="h-14 px-10 text-lg font-bold bg-slate-900 text-white hover:bg-slate-800">
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const total = cart.totalPrice();
  const discount = subtotal - total;

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 pb-20">
      {/* HEADER */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/${params.slug}`}>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-slate-50 text-slate-900"
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Shopping Cart</h1>
          </div>
          <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-full border border-green-100">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-sm font-bold">Secure Checkout</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* LEFT COLUMN: CART ITEMS */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <Card
                key={item.id}
                className="bg-white border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6 flex gap-6 sm:gap-8">
                  {/* Image */}
                  <div className="h-24 w-24 sm:h-32 sm:w-32 bg-slate-100 rounded-xl relative overflow-hidden flex-shrink-0 border border-gray-100">
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-slate-400 text-xs">
                        IMG
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg sm:text-xl text-slate-900 line-clamp-2 pr-4">
                          {item.name}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">Standard</p>
                      </div>
                      <button
                        onClick={() => cart.removeItem(item.id)}
                        className="text-slate-400 hover:text-red-500 transition p-2 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="flex justify-between items-end mt-4">
                      {/* Quantity Control */}
                      <div className="flex items-center bg-slate-50 rounded-lg border border-slate-200 h-10 sm:h-11">
                        <button
                          onClick={() =>
                            cart.updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-10 sm:w-12 h-full flex items-center justify-center hover:bg-white rounded-l-lg transition disabled:opacity-30 text-slate-600"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 sm:w-10 text-center font-mono font-bold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            cart.updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-10 sm:w-12 h-full flex items-center justify-center hover:bg-white rounded-r-lg transition text-slate-600"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                          Subtotal
                        </p>
                        <p className="font-bold text-xl sm:text-2xl text-slate-900">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Delivery Note (Desktop Position) */}
            <div className="hidden lg:flex bg-blue-50 border border-blue-100 p-6 rounded-xl gap-4 items-start">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl shrink-0">
                <MessageCircle className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-lg mb-1">
                  Delivery & Confirmation
                </h4>
                <p className="text-slate-600">
                  Shipping costs and delivery timelines will be calculated and
                  confirmed directly on WhatsApp after you place the order.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: SUMMARY (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              {/* Promo Code */}
              <div className="flex gap-3">
                <Input
                  placeholder="ENTER PROMO CODE"
                  className="bg-white border-slate-200 h-12 font-mono uppercase text-slate-900 placeholder:text-slate-400 focus-visible:ring-slate-900"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                />
                <Button
                  onClick={handleApplyCoupon}
                  disabled={loading}
                  className="h-12 px-6 font-bold bg-slate-900 text-white hover:bg-slate-800"
                >
                  Apply
                </Button>
              </div>

              {/* Order Summary Card */}
              <div className="bg-white border border-gray-100 shadow-lg shadow-slate-200/50 rounded-2xl p-6 space-y-6">
                <h3 className="font-bold text-xl text-slate-900">
                  Order Summary
                </h3>

                <div className="space-y-4 text-sm">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal</span>
                    <span className="text-slate-900 font-medium">
                      ₹{subtotal.toLocaleString()}
                    </span>
                  </div>

                  {cart.coupon && discount > 0 && (
                    <div className="flex justify-between text-green-600 bg-green-50 p-3 rounded-lg border border-green-100">
                      <span className="flex items-center gap-2 font-medium">
                        <Zap className="h-3 w-3 fill-current" /> Code:{" "}
                        {cart.coupon.code}
                      </span>
                      <span className="font-bold">
                        - ₹{discount.toLocaleString()}
                      </span>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                    <span className="text-lg font-bold text-slate-900">
                      Total
                    </span>
                    <span className="text-3xl font-bold text-slate-900">
                      ₹{total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <Link href={`/${params.slug}/checkout`} className="block">
                  <Button className="w-full h-14 text-lg font-bold bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-900/10 rounded-xl">
                    Proceed to Checkout
                  </Button>
                </Link>

                <p className="text-xs text-slate-400 text-center flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Secure checkout powered
                  by BizoraPro
                </p>
              </div>

              {/* Mobile Delivery Note */}
              <div className="lg:hidden bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 items-center">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg shrink-0">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <p className="text-xs text-slate-600">
                  Delivery confirmed on WhatsApp after order.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
