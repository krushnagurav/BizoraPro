"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

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
    <header className="border-b border-border/40 bg-background/95 backdrop-blur sticky top-0 z-50">
      <div className="container flex h-20 items-center justify-between px-6 md:px-12">
        
        {/* LOGO */}
        <Link href="/" className="text-2xl font-bold tracking-tight text-primary hover:opacity-90">
          Bizora<span className="text-foreground">Pro</span>
        </Link>
        
        {/* DESKTOP NAV */}
        <nav className="hidden md:flex gap-8 text-sm font-medium">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "transition-colors hover:text-primary",
                pathname === item.href 
                  ? "text-primary font-bold" 
                  : "text-muted-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        
        {/* DESKTOP BUTTONS */}
        <div className="hidden md:flex gap-4">
          <Link href="/login">
            <Button variant="ghost" className="hover:text-primary">Login</Button>
          </Link>
          <Link href="/signup">
            <Button className="font-bold">Create Shop</Button>
          </Link>
        </div>

        {/* MOBILE MENU */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6 text-primary" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-card border-border text-foreground w-[300px]">
              <SheetTitle className="text-left text-primary mb-6">Menu</SheetTitle>
              <div className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "text-lg font-medium transition-colors hover:text-primary",
                      pathname === item.href 
                        ? "text-primary" 
                        : "text-muted-foreground"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
                <hr className="border-border my-2" />
                <Link href="/login" onClick={() => setIsOpen(false)} className="text-lg font-medium text-muted-foreground hover:text-primary">
                  Login
                </Link>
                <Link href="/signup" onClick={() => setIsOpen(false)}>
                  <Button className="w-full font-bold mt-2">Create Shop</Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </header>
  );
}