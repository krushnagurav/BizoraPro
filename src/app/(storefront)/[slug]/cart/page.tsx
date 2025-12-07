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
  Zap,
  X,
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

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setIsMounted(true), []);
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

  if (items.length === 0)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <ShoppingBag className="h-24 w-24 mb-6 text-slate-300" />
        <h2 className="text-3xl font-bold mb-3">Your cart is empty</h2>
        <Link href={`/${params.slug}`}>
          <Button className="h-14 px-10 text-lg font-bold bg-slate-900 text-white">
            Start Shopping
          </Button>
        </Link>
      </div>
    );

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const total = cart.totalPrice();
  const discount = subtotal - total;

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 pb-20">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link href={`/${params.slug}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Shopping Cart</h1>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <Card key={item.id} className="bg-white border-gray-100 shadow-sm">
              <CardContent className="p-6 flex gap-6">
                <div className="h-24 w-24 bg-slate-100 rounded-xl relative overflow-hidden shrink-0 border border-gray-100">
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : null}
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{item.name}</h3>
                      <p className="text-sm text-slate-500">{item.variant}</p>
                    </div>
                    <button
                      onClick={() => cart.removeItem(item.id)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      <Trash2 />
                    </button>
                  </div>
                  <div className="flex justify-between items-end mt-4">
                    <div className="flex items-center bg-slate-50 rounded-lg border border-slate-200 h-10">
                      <button
                        onClick={() =>
                          cart.updateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-10 h-full flex items-center justify-center hover:bg-white rounded-l-lg"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-10 text-center font-bold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          cart.updateQuantity(item.id, item.quantity + 1)
                        }
                        disabled={item.quantity >= (item.maxStock || 999)}
                        className="w-10 h-full flex items-center justify-center hover:bg-white rounded-r-lg"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="font-bold text-xl">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="lg:col-span-1 sticky top-28 space-y-6">
          <div className="flex gap-3">
            <Input
              placeholder="ENTER PROMO CODE"
              className="h-12 uppercase"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            />
            <Button
              onClick={handleApplyCoupon}
              disabled={loading}
              className="h-12 font-bold bg-slate-900 text-white"
            >
              Apply
            </Button>
          </div>
          <div className="bg-white border border-gray-100 shadow-lg rounded-2xl p-6 space-y-6">
            <h3 className="font-bold text-xl">Order Summary</h3>
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
                  <div className="flex items-center gap-2">
                    <span className="font-bold">
                      - ₹{discount.toLocaleString()}
                    </span>
                    <button onClick={() => cart.removeCoupon()}>
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
              <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                <span className="text-lg font-bold">Total</span>
                <span className="text-3xl font-bold">
                  ₹{total.toLocaleString()}
                </span>
              </div>
            </div>
            <Link href={`/${params.slug}/checkout`}>
              <Button className="w-full h-14 text-lg font-bold bg-slate-900 text-white shadow-xl rounded-xl">
                Proceed to Checkout
              </Button>
            </Link>
            <p className="text-xs text-slate-400 text-center flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Secure checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
