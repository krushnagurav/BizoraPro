// src/components/dashboard/mobile-header.tsx
/*  * Mobile Header Component
 * This component renders the mobile header for the dashboard
 * section of the application. It includes a menu button that
 * opens a sidebar navigation sheet for easy access to dashboard
 * features on mobile devices.
 */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";
import { logoutAction } from "@/src/actions/auth-actions";
import {
  Menu,
  Store,
  LayoutDashboard,
  ShoppingBag,
  ListOrdered,
  Settings,
  Tag,
  LogOut,
  User,
  ShieldCheck,
  TicketPercent,
  Bell,
  Share2,
  MessageSquare,
  Star,
  Users,
  Headphones,
  TrendingUp,
  Instagram,
  BellRing,
  Globe,
  CreditCard,
} from "lucide-react";
import { useState } from "react";

const navGroups = [
  {
    label: "Main",
    items: [
      { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
      { name: "Orders", href: "/orders", icon: ListOrdered },
      { name: "Inbox", href: "/notifications", icon: Bell },
    ],
  },
  {
    label: "Inventory",
    items: [
      { name: "Products", href: "/products", icon: ShoppingBag },
      { name: "Categories", href: "/categories", icon: Tag },
    ],
  },
  {
    label: "Marketing",
    items: [
      { name: "Share Store", href: "/marketing/share", icon: Share2 },
      { name: "Coupons", href: "/coupons", icon: TicketPercent },
      { name: "Reviews", href: "/marketing/reviews", icon: Star },
      { name: "Templates", href: "/marketing/templates", icon: MessageSquare },
      { name: "Leads", href: "/marketing/leads", icon: Users },
      { name: "Upsells", href: "/marketing/upsells", icon: TrendingUp },
      { name: "Instagram", href: "/marketing/instagram", icon: Instagram },
    ],
  },
  {
    label: "Settings",
    items: [
      { name: "Store Settings", href: "/settings", icon: Store },
      { name: "Appearance", href: "/settings/appearance", icon: Settings },
      { name: "Billing", href: "/billing", icon: CreditCard },
      { name: "Policies", href: "/settings/policies", icon: ShieldCheck },
      { name: "Profile", href: "/settings/profile", icon: User },
      { name: "Alerts", href: "/settings/notifications", icon: BellRing },
      { name: "Support", href: "/dashboard/support", icon: Headphones },
      { name: "Domain", href: "/settings/domain", icon: Globe },
    ],
  },
];

export function MobileHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="md:hidden h-16 border-b border-border bg-card flex items-center px-4 fixed top-0 left-0 right-0 z-50">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>

        <SheetContent
          side="left"
          className="p-0 w-72 bg-card border-r border-border flex flex-col"
        >
          <SheetHeader className="h-16 flex items-center justify-center border-b border-border px-6 shrink-0">
            <SheetTitle className="flex items-center font-bold text-lg tracking-tight text-foreground">
              <Store className="h-6 w-6 text-primary mr-2" />
              Bizora<span className="text-primary">Pro</span>
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 py-6 px-3 space-y-6 overflow-y-auto">
            {navGroups.map((group, i) => (
              <div key={i}>
                <h4 className="px-4 text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                  {group.label}
                </h4>
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                    >
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start text-sm font-normal h-10 mb-1",
                          pathname === item.href
                            ? "bg-secondary text-primary font-medium"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        <item.icon className="mr-3 h-4 w-4" />
                        {item.name}
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-border shrink-0">
            <form action={logoutAction}>
              <Button
                variant="outline"
                className="w-full border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50"
              >
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </form>
          </div>
        </SheetContent>
      </Sheet>

      <div className="ml-4 flex items-center font-bold text-lg">
        <Store className="h-5 w-5 text-primary mr-2" />
        Seller Panel
      </div>
    </header>
  );
}
