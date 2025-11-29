// src/components/marketing/site-header.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Features", href: "/features" },
  { name: "Pricing", href: "/pricing" },
  { name: "Examples", href: "/examples" },
  { name: "Support", href: "/support" },
  { name: "Contact", href: "/contact" },
  { name: "About", href: "/about" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 md:h-20 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* LOGO */}
        <Link
          href="/"
          className="flex items-center gap-1 text-xl md:text-2xl font-bold tracking-tight"
        >
          <span className="text-primary">Bizora</span>
          <span className="text-slate-50">Pro</span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative transition-colors hover:text-primary",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {item.name}
                {isActive && (
                  <span className="absolute -bottom-2 left-0 right-0 mx-auto h-[2px] w-6 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* DESKTOP CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login">
            <Button
              variant="ghost"
              className="text-sm font-medium text-muted-foreground hover:text-primary"
            >
              Login
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="text-sm font-semibold bg-primary text-black hover:bg-primary/90">
              Create Shop
            </Button>
          </Link>
        </div>

        {/* MOBILE MENU */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open navigation menu"
              >
                <Menu className="h-6 w-6 text-primary" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-black border-l border-white/10 text-foreground w-[280px] sm:w-[320px] pt-10"
            >
              <SheetTitle className="mb-6 text-left text-sm font-semibold text-primary">
                BizoraPro Menu
              </SheetTitle>

              <div className="flex flex-col gap-4">
                {navItems.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "text-base font-medium transition-colors hover:text-primary",
                        isActive ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      {item.name}
                    </Link>
                  );
                })}

                <hr className="my-3 border-white/10" />

                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="text-base font-medium text-muted-foreground hover:text-primary"
                >
                  Login
                </Link>
                <Link href="/signup" onClick={() => setIsOpen(false)}>
                  <Button className="mt-2 w-full text-sm font-semibold bg-primary text-black hover:bg-primary/90">
                    Create Shop
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}