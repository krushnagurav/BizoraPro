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
import { Loader2, ArrowLeft, MapPin, Phone, User } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const cart = useCart();
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

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

    const result = await placeOrderAction(formData);

    if (result?.error) {
      toast.error(result.error);
      setLoading(false);
    } else if (result?.success) {
      cart.clearCart(); // Clear items
      router.push(`/${params.slug}/o/${result.orderId}`); // Redirect to success
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

        <Button className="w-full h-14 text-lg font-bold bg-green-600 hover:bg-green-700 text-white" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : "Confirm Order"}
        </Button>
      </form>
    </div>
  );
}