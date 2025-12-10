// src/components/storefront/shared/shop-header.tsx
/*  * Shop Header Component
 * This component renders the header for the storefront,
 * including the shop logo, navigation links, search button,
 * and cart icon with item count. It is responsive for mobile
 * and desktop views.
 */
import Link from "next/link";
import { Store, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CartBar } from "@/src/components/storefront/cart-bar";
import { CartIcon } from "@/src/components/storefront/cart-icon";

export function ShopHeader({ shop }: { shop: any }) {
  return (
    <>
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden -ml-2">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px]">
                <SheetHeader className="text-left border-b pb-4 mb-4">
                  <SheetTitle className="flex items-center gap-2">
                    <Store className="h-5 w-5" /> {shop.name}
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 text-lg">
                  <Link
                    href={`/${shop.slug}`}
                    className="font-medium hover:text-primary"
                  >
                    Home
                  </Link>
                  <Link
                    href={`/${shop.slug}/search`}
                    className="font-medium hover:text-primary"
                  >
                    Shop All
                  </Link>
                  <Link
                    href={`/${shop.slug}/about`}
                    className="font-medium hover:text-primary"
                  >
                    About
                  </Link>
                </div>
              </SheetContent>
            </Sheet>

            <Link
              href={`/${shop.slug}`}
              className="flex items-center gap-2 font-bold text-xl text-slate-900"
            >
              {shop.theme_config?.logoUrl ? (
                <img
                  src={shop.theme_config.logoUrl}
                  alt={shop.name}
                  className="h-8 w-8 rounded-md object-cover"
                />
              ) : (
                <Store className="w-6 h-6 text-primary" />
              )}
              <span className="hidden sm:inline">{shop.name}</span>
            </Link>
          </div>

          <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
            <Link
              href={`/${shop.slug}`}
              className="hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              href={`/${shop.slug}/search`}
              className="hover:text-primary transition-colors"
            >
              Shop All
            </Link>
            <Link
              href={`/${shop.slug}/about`}
              className="hover:text-primary transition-colors"
            >
              About
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link href={`/${shop.slug}/search`}>
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-600 hover:text-primary hover:bg-slate-50"
              >
                <Search className="h-5 w-5" />
              </Button>
            </Link>

            <CartIcon slug={shop.slug} />
          </div>
        </div>
      </header>

      <CartBar slug={shop.slug} />
    </>
  );
}
