// src\components\storefront\cart-bar.tsx
/*  * Cart Bar Component
 * This component displays a fixed cart bar at the bottom of the
 * storefront when there are items in the cart. It shows the total
 * number of items and total price, and provides a link to view the cart.
 */
"use client";

import { useCart } from "@/src/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function CartBar({ slug }: { slug: string }) {
  const cart = useCart();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setIsMounted(true), []);

  if (!isMounted || cart.items.length === 0) return null;

  if (pathname.includes("/cart") || pathname.includes("/checkout")) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto">
      <div className="bg-foreground text-background p-4 rounded-xl shadow-2xl flex items-center justify-between animate-in slide-in-from-bottom-10 fade-in">
        <div className="flex flex-col">
          <span className="text-xs font-medium text-muted-foreground/80 uppercase tracking-wider">
            Total
          </span>
          <div className="flex items-center gap-2 font-bold text-lg">
            <ShoppingBag className="h-4 w-4" />
            {cart.items.length} Items • ₹{cart.totalPrice()}
          </div>
        </div>

        <Link href={`/${slug}/cart`}>
          <Button
            size="sm"
            className="font-bold bg-primary text-black hover:bg-primary/90"
          >
            View Cart <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
