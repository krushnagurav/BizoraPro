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
  Bell,
  MessageCircle,
  Users,
  Mail,
  FileText,
  TicketPercent, // For Plans
  Headphones     // For Support
} from "lucide-react";

// ORGANIZED GROUPS
const adminGroups = [
  {
    label: "Monitor",
    items: [
      { name: "Overview", href: "/admin", icon: LayoutDashboard },
      { name: "WhatsApp Orders", href: "/admin/orders", icon: MessageCircle },
      { name: "Audit Logs", href: "/admin/logs", icon: Activity },
    ]
  },
  {
    label: "Management",
    items: [
      { name: "All Shops", href: "/admin/shops", icon: Store },
      { name: "Team & Roles", href: "/admin/users", icon: Users },
      { name: "Support Queue", href: "/admin/support", icon: Headphones },
    ]
  },
  {
    label: "Billing",
    items: [
      { name: "Payments", href: "/admin/payments", icon: CreditCard },
      { name: "Invoices", href: "/admin/invoices", icon: FileText },
      { name: "Plans", href: "/admin/plans", icon: TicketPercent },
    ]
  },
  {
    label: "System",
    items: [
      { name: "Notifications", href: "/admin/notifications", icon: Bell },
      { name: "Templates", href: "/admin/templates", icon: Mail },
      { name: "Settings", href: "/admin/settings", icon: Settings },
      {name: "Analytics", href: "/admin/analytics", icon: ShieldAlert },
    ]
  }
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="h-screen w-64 bg-[#050505] border-r border-white/10 hidden md:flex flex-col fixed left-0 top-0 text-white">
      
      {/* Header */}
      <div className="h-16 flex items-center px-6 border-b border-white/10 shrink-0">
        <ShieldAlert className="h-6 w-6 text-primary mr-2" />
        <span className="font-bold text-lg">Super<span className="text-primary">Admin</span></span>
      </div>

      {/* Nav (Scrollable) */}
      <div className="flex-1 py-6 px-3 space-y-6 overflow-y-auto">
        {adminGroups.map((group, i) => (
          <div key={i}>
            <h4 className="px-4 text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">
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
                        ? "bg-primary/20 text-primary font-bold" 
                        : "text-gray-400 hover:text-white hover:bg-white/5"
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
      
      {/* Footer */}
      <div className="p-4 border-t border-white/10 shrink-0">
        <Link href="/dashboard">
           <Button variant="outline" className="w-full border-white/10 text-gray-400 hover:text-white hover:bg-white/5">
             <LogOut className="mr-2 h-4 w-4" /> Exit Admin
           </Button>
        </Link>
      </div>
    </div>
  );
}