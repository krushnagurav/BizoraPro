// src/components/storefront/shared/shop-header.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, Search, ShoppingCart, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

type ShopHeaderProps = {
  shop: any;
  isOpen?: boolean;
};

export function ShopHeader({ shop, isOpen }: ShopHeaderProps) {
  const theme = shop.theme_config || {};
  const logo: string | null = theme.logoUrl || shop.logo_url || null;

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* LEFT: Logo + Name + Badges */}
        <Link
          href={`/${shop.slug}`}
          className="flex items-center gap-3 min-w-0"
        >
          {logo ? (
            <div className="relative h-9 w-9 rounded-full overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
              <Image
                src={logo}
                alt={shop.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
              {shop.name?.[0] ?? "S"}
            </div>
          )}

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm sm:text-base truncate">
                {shop.name}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-0.5">
              {/* Open / Closed */}
              {typeof isOpen === "boolean" && (
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] ${
                    isOpen
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-rose-50 text-rose-700"
                  }`}
                >
                  <Circle
                    className={`h-2 w-2 ${
                      isOpen
                        ? "fill-emerald-500 text-emerald-500"
                        : "fill-rose-500 text-rose-500"
                    }`}
                  />
                  {isOpen ? "Open now" : "Closed"}
                </span>
              )}
            </div>
          </div>
        </Link>

        {/* CENTER: Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link
            href={`/${shop.slug}`}
            className="hover:text-[hsl(var(--primary))] transition-colors"
          >
            Home
          </Link>
          <Link
            href={`/${shop.slug}?q=`}
            className="hover:text-[hsl(var(--primary))] transition-colors"
          >
            Shop
          </Link>
          <Link
            href={`/${shop.slug}/about`}
            className="hover:text-[hsl(var(--primary))] transition-colors"
          >
            About
          </Link>
          <Link
            href={`/${shop.slug}/contact`}
            className="hover:text-[hsl(var(--primary))] transition-colors"
          >
            Contact
          </Link>
        </nav>

        {/* RIGHT: Actions */}
        <div className="flex items-center gap-2">
          <Link href={`/${shop.slug}?q=`}>
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:inline-flex text-slate-500 hover:text-[hsl(var(--primary))]"
            >
              <Search className="h-5 w-5" />
            </Button>
          </Link>

          <Link href={`/${shop.slug}/cart`}>
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-500 hover:text-[hsl(var(--primary))]"
            >
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </Link>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden ml-1 text-slate-600"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-6 space-y-6">
              <div className="flex items-center gap-3">
                {logo && (
                  <div className="relative h-8 w-8 rounded-full overflow-hidden border border-slate-200 bg-slate-100">
                    <Image
                      src={logo}
                      alt={shop.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="font-semibold">{shop.name}</span>
                  {typeof isOpen === "boolean" && (
                    <span className="text-xs text-slate-500">
                      {isOpen ? "Open now" : "Currently closed"}
                    </span>
                  )}
                </div>
              </div>

              <nav className="flex flex-col gap-3 text-sm font-medium">
                <Link href={`/${shop.slug}`}>Home</Link>
                <Link href={`/${shop.slug}?q=`}>Shop</Link>
                <Link href={`/${shop.slug}/about`}>About</Link>
                <Link href={`/${shop.slug}/contact`}>Contact</Link>
                <Link href={`/${shop.slug}/legal`}>Policies</Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}