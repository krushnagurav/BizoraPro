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
  Bell
} from "lucide-react";
import { logoutAction } from "@/src/actions/auth-actions";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Products", href: "/products", icon: ShoppingBag },
  { name: "Categories", href: "/categories", icon: Tag },
  { name: "Orders", href: "/orders", icon: ListOrdered },
  { name: "Support", href: "/dashboard/support", icon: Headphones },
  { name: "Appearance", href: "/settings/appearance", icon: Settings },
  { name: "Profile", href: "/settings/profile", icon: User },
  { name: "Policies", href: "/settings/policies", icon: ShieldCheck },
  { name: "Coupons", href: "/coupons", icon: TicketPercent },
  { name: "Inbox", href: "/notifications", icon: Bell },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="h-screen w-64 bg-card border-r border-border hidden md:flex flex-col fixed left-0 top-0">
      {/* Header */}
      <div className="h-16 flex items-center px-6 border-b border-border">
        <Store className="h-6 w-6 text-primary mr-2" />
        <span className="font-bold text-lg tracking-tight">Bizora<span className="text-primary">Pro</span></span>
      </div>

      {/* Nav Links */}
      <div className="flex-1 py-6 px-3 space-y-1">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-base font-normal",
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

      {/* Footer / Logout */}
      <div className="p-4 border-t border-border">
        <form action={logoutAction}>
          <Button variant="outline" className="w-full border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50">
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </form>
      </div>
    </div>
  );
}