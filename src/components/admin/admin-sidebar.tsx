"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Store, 
  CreditCard, 
  Settings, 
  ShieldAlert,
  LogOut,
  Activity,
  Bell
} from "lucide-react";

const adminNav = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "All Shops", href: "/admin/shops", icon: Store },
  { name: "Payments", href: "/admin/payments", icon: CreditCard },
  { name: "Settings", href: "/admin/settings", icon: Settings },
  { name: "Audit Logs", href: "/admin/logs", icon: Activity },
  { name: "Notifications", href: "/admin/notifications", icon: Bell },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="h-screen w-64 bg-[#050505] border-r border-white/10 hidden md:flex flex-col fixed left-0 top-0 text-white">
      {/* Header */}
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <ShieldAlert className="h-6 w-6 text-primary mr-2" />
        <span className="font-bold text-lg">Super<span className="text-primary">Admin</span></span>
      </div>

      {/* Nav */}
      <div className="flex-1 py-6 px-3 space-y-1">
        {adminNav.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-base font-normal",
                pathname === item.href 
                  ? "bg-primary/20 text-primary font-bold" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Button>
          </Link>
        ))}
      </div>
      
      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <Link href="/dashboard">
           <Button variant="outline" className="w-full border-white/10 text-gray-400 hover:text-white hover:bg-white/5">
             <LogOut className="mr-2 h-4 w-4" /> Exit Admin
           </Button>
        </Link>
      </div>
    </div>
  );
}