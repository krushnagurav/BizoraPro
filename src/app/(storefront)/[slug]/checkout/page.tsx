"use client";

import { useCart } from "@/src/hooks/use-cart";
import { placeOrderAction } from "@/src/actions/order-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";
import { Loader2, ArrowLeft, MapPin, Phone, User, X, TicketPercent } from "lucide-react";
import Link from "next/link";
import { verifyCouponAction } from "@/src/actions/coupon-actions";

export default function CheckoutPage() {
  const cart = useCart();
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [couponCode, setCouponCode] = useState("");

  useEffect(() => setIsMounted(true), []);

  if (!isMounted) return null;
  if (cart.items.length === 0) {
    return <div className="p-8 text-center">Your cart is empty.</div>;
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
      cart.clearCart(); // Clear items
      router.push(`/${params.slug}/o/${result.orderId}`); // Redirect to success
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setLoading(true);
    
    // Calculate current subtotal manually for validation
    const subtotal = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

    const res = await verifyCouponAction(couponCode, params.slug as string, subtotal);
    
    setLoading(false);
    if (res?.error) {
      toast.error(res.error);
      cart.removeCoupon();
    } else if (res?.coupon) {
      cart.applyCoupon(res.coupon);
      toast.success("Coupon Applied!");
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 max-w-md mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href={`/${params.slug}/cart`}>
          <Button variant="ghost" size="icon"><ArrowLeft className="h-6 w-6" /></Button>
        </Link>
        <h1 className="text-2xl font-bold">Checkout</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Contact Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input name="name" placeholder="Raj Kumar" className="pl-9" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>WhatsApp Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input name="phone" placeholder="9876543210" type="tel" className="pl-9" required />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Delivery</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>City / Area</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input name="city" placeholder="Varachha, Surat" className="pl-9" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Full Address (Optional)</Label>
              <Input name="address" placeholder="House No, Street..." />
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <div className="bg-secondary/20 p-4 rounded-lg space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal ({cart.items.length} items)</span>
            <span>₹{cart.totalPrice()}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t border-border pt-2 mt-2">
            <span>Total to Pay</span>
            <span className="text-primary">₹{cart.totalPrice()}</span>
          </div>
        </div>

        {/* COUPON SECTION */}
        <Card className="bg-card border-border/50">
          <CardContent className="p-4">
            {cart.coupon ? (
              <div className="flex items-center justify-between bg-green-500/10 p-3 rounded border border-green-500/20">
                <div className="flex items-center gap-2 text-green-600">
                  <TicketPercent className="h-4 w-4" />
                  <span className="font-mono font-bold">{cart.coupon.code}</span>
                  <span className="text-xs">
                    ({cart.coupon.type === 'percent' ? `${cart.coupon.value}%` : `₹${cart.coupon.value}`} Off)
                  </span>
                </div>
                <Button 
                  type="button" 
                  size="icon" 
                  variant="ghost" 
                  className="h-6 w-6 hover:text-red-500"
                  onClick={() => cart.removeCoupon()}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input 
                  placeholder="Promo Code" 
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="font-mono uppercase"
                />
                <Button type="button" variant="outline" onClick={handleApplyCoupon} disabled={loading}>
                  Apply
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Summary (Updated) */}
        <div className="bg-secondary/20 p-4 rounded-lg space-y-2 text-sm">
           {/* ... existing subtotal ... */}
           
           {/* ADD DISCOUNT ROW */}
           {cart.coupon && (
             <div className="flex justify-between text-green-600">
               <span>Discount ({cart.coupon.code})</span>
               <span>- ₹{(cart.items.reduce((a, b) => a + b.price * b.quantity, 0) - cart.totalPrice()).toFixed(2)}</span>
             </div>
           )}

           {/* ... existing total ... */}
        </div>

        <Button className="w-full h-14 text-lg font-bold bg-green-600 hover:bg-green-700 text-white" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : "Confirm Order"}
        </Button>
      </form>
    </div>
  );
}