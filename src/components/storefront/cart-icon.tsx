// src\components\storefront\cart-icon.tsx
/*  * Cart Icon Component
 * This component displays a shopping cart icon in the storefront.
 * It shows the number of items in the cart and links to the cart page.
 */
"use client";

import { useCart } from "@/src/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

export function CartIcon({ slug }: { slug: string }) {
  const cart = useCart();
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="text-slate-600">
        <ShoppingCart className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Link href={`/${slug}/cart`}>
      <Button
        variant="ghost"
        size="icon"
        className="text-slate-600 hover:text-primary hover:bg-slate-50 relative"
      >
        <ShoppingCart className="h-5 w-5" />
        {cart.items.length > 0 && (
          <span className="absolute top-0 right-0 -mt-0.5 -mr-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
            {cart.items.length}
          </span>
        )}
      </Button>
    </Link>
  );
}
