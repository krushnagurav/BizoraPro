"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet"; // Added SheetTitle/Header for accessibility
import { logoutAction } from "@/src/actions/auth-actions";
import { 
  Menu, 
  Store, 
  LayoutDashboard, 
  ShoppingBag, 
  ListOrdered, 
  Settings, 
  Tag,
  LogOut 
} from "lucide-react";
import { useState } from "react";

// Same navigation items as Desktop Sidebar
const navItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Products", href: "/products", icon: ShoppingBag },
  { name: "Categories", href: "/categories", icon: Tag },
  { name: "Orders", href: "/orders", icon: ListOrdered },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function MobileHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false); // State to close menu on click

  return (
    <header className="md:hidden h-16 border-b border-border bg-card flex items-center px-4 fixed top-0 left-0 right-0 z-50">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        
        <SheetContent side="left" className="p-0 w-72 bg-card border-r border-border flex flex-col">
          {/* 1. Menu Header */}
          <SheetHeader className="h-16 flex items-center justify-center border-b border-border px-6">
             <SheetTitle className="flex items-center font-bold text-lg tracking-tight text-foreground">
                <Store className="h-6 w-6 text-primary mr-2" />
                Bizora<span className="text-primary">Pro</span>
             </SheetTitle>
          </SheetHeader>

          {/* 2. Menu Links */}
          <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-base font-normal mb-1",
                    pathname === item.href 
                      ? "bg-secondary text-primary font-medium" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Button>
              </Link>
            ))}
          </div>

          {/* 3. Menu Footer (Logout) */}
          <div className="p-4 border-t border-border">
            <form action={logoutAction}>
              <Button variant="outline" className="w-full border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50">
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </form>
          </div>
        </SheetContent>
      </Sheet>
      
      {/* Header Title (Visible when menu closed) */}
      <div className="ml-4 flex items-center font-bold text-lg">
        <Store className="h-5 w-5 text-primary mr-2" />
        Seller Panel
      </div>
    </header>
  );
}