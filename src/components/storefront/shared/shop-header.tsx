import Link from "next/link";
import { Store, ShoppingCart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartBar } from "../cart-bar";

export function ShopHeader({ shop }: { shop: any }) {
  return (
    <>
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          
          {/* 1. Logo / Name */}
          <Link href={`/${shop.slug}`} className="flex items-center gap-2 font-bold text-lg text-slate-900 hover:opacity-80 transition">
            <Store className="w-5 h-5 text-primary" />
            {shop.name}
          </Link>

          {/* 2. Desktop Navigation */}
          <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-500">
            <Link href={`/${shop.slug}`} className="hover:text-primary transition-colors">Home</Link>
            <Link href={`/${shop.slug}?q=`} className="hover:text-primary transition-colors">Shop</Link>
            <Link href={`/${shop.slug}/about`} className="hover:text-primary transition-colors">About</Link>
            <Link href={`/${shop.slug}/contact`} className="hover:text-primary transition-colors">Contact</Link>
          </nav>

          {/* 3. Icons (Search & Cart) */}
          <div className="flex items-center gap-2">
            <Link href={`/${shop.slug}?q=`}>
              <Button variant="ghost" size="icon" className="text-slate-500 hover:text-primary">
                <Search className="h-5 w-5" />
              </Button>
            </Link>
            <Link href={`/${shop.slug}/cart`}>
              <Button variant="ghost" size="icon" className="text-slate-500 hover:text-primary">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Sticky Bottom Cart Bar (Mobile) - Preserving this UX */}
      <CartBar slug={shop.slug} />
    </>
  );
}