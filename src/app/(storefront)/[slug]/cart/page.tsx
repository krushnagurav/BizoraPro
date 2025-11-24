"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/src/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function CartPage() {
  const cart = useCart();
  const params = useParams();
  const [isMounted, setIsMounted] = useState(false);

  // Prevent Hydration Error
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-background text-foreground p-4 max-w-md mx-auto">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href={`/${params.slug}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Shopping Cart</h1>
      </div>

      {/* Empty State */}
      {cart.items.length === 0 && (
        <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground">
          <ShoppingBag className="h-16 w-16 mb-4 text-secondary" />
          <p className="text-lg">Your cart is empty</p>
          <Link href={`/${params.slug}`} className="mt-4">
            <Button variant="outline">Browse Products</Button>
          </Link>
        </div>
      )}

      {/* Cart Items List */}
      <div className="space-y-4 mb-24">
        {cart.items.map((item) => (
          <Card key={item.id} className="bg-card border-border/50">
            <CardContent className="p-3 flex gap-4">
              {/* Image */}
              <div className="h-20 w-20 bg-secondary rounded-md relative overflow-hidden flex-shrink-0">
                {item.image_url && (
                  <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                )}
              </div>

              {/* Details */}
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium line-clamp-1">{item.name}</h3>
                  <button 
                    onClick={() => cart.removeItem(item.id)}
                    className="text-muted-foreground hover:text-red-500 transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="flex justify-between items-end">
                  <p className="font-bold text-primary">₹{item.price}</p>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 bg-secondary/50 rounded-lg p-1">
                    <button 
                      onClick={() => cart.updateQuantity(item.id, item.quantity - 1)}
                      className="h-6 w-6 flex items-center justify-center bg-background rounded hover:text-primary"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => cart.updateQuantity(item.id, item.quantity + 1)}
                      className="h-6 w-6 flex items-center justify-center bg-background rounded hover:text-primary"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Footer Summary (Sticky) */}
      {cart.items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
          <div className="max-w-md mx-auto space-y-4">
            
            {/* Delivery Note */}
            <div className="bg-secondary/30 p-2 rounded text-center">
              <p className="text-[10px] text-muted-foreground">
                🚚 Delivery charges will be calculated on WhatsApp
              </p>
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Total Amount</span>
              <span className="text-2xl font-bold text-primary">₹{cart.totalPrice()}</span>
            </div>

            <Link href={`/${params.slug}/checkout`}>
              <Button size="lg" className="w-full font-bold text-lg h-12">
                Proceed to Checkout
              </Button>
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}