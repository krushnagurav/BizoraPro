"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  ShoppingBag,
  ListOrdered,
  Settings,
  LogOut,
  Store,
  Tag,
  Headphones,
  User,
  ShieldCheck,
  TicketPercent,
  Bell,
  Share2,
  MessageSquare,
  Star,
  Users,
  TrendingUp,
  Instagram,
  BellRing,
  Globe,
  CreditCard,
} from "lucide-react";
import { logoutAction } from "@/src/actions/auth-actions";

// GROUPED NAVIGATION
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
      {name: "Store Settings", href: "/settings", icon: Store },
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

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="h-screen w-64 bg-card border-r border-border hidden md:flex flex-col fixed left-0 top-0">
      <div className="h-16 flex items-center px-6 border-b border-border shrink-0">
        <Store className="h-6 w-6 text-primary mr-2" />
        <span className="font-bold text-lg tracking-tight">
          Bizora<span className="text-primary">Pro</span>
        </span>
      </div>

      <div className="flex-1 py-6 px-3 space-y-6 overflow-y-auto">
        {navGroups.map((group, i) => (
          <div key={i}>
            <h4 className="px-4 text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
              {group.label}
            </h4>
            <div className="space-y-1">
              {group.items.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-sm font-normal h-9",
                      pathname === item.href
                        ? "bg-secondary text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground"
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
    </div>
  );
}