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
import {
  Menu,
  ShieldAlert,
  LayoutDashboard,
  Store,
  CreditCard,
  Settings,
  Activity,
  Bell,
  MessageCircle,
  Users,
  Mail,
  FileText,
  LogOut,
  TicketPercent,
  Headphones,
} from "lucide-react";
import { useState } from "react";

// Same groups as admin-sidebar.tsx
const adminGroups = [
  {
    label: "Monitor",
    items: [
      { name: "Overview", href: "/admin", icon: LayoutDashboard },
      { name: "WhatsApp Orders", href: "/admin/orders", icon: MessageCircle },
      { name: "Audit Logs", href: "/admin/logs", icon: Activity },
    ],
  },
  {
    label: "Management",
    items: [
      { name: "All Shops", href: "/admin/shops", icon: Store },
      { name: "Team & Roles", href: "/admin/users", icon: Users },
      { name: "Support Queue", href: "/admin/support", icon: Headphones },
    ],
  },
  {
    label: "Billing",
    items: [
      { name: "Payments", href: "/admin/payments", icon: CreditCard },
      { name: "Invoices", href: "/admin/invoices", icon: FileText },
      { name: "Plans", href: "/admin/plans", icon: TicketPercent },
    ],
  },
  {
    label: "System",
    items: [
      { name: "Notifications", href: "/admin/notifications", icon: Bell },
      { name: "Templates", href: "/admin/templates", icon: Mail },
      { name: "Settings", href: "/admin/settings", icon: Settings },
      { name: "Analytics", href: "/admin/analytics", icon: ShieldAlert },
    ],
  },
];

export function AdminMobileHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="md:hidden h-16 border-b border-white/10 bg-[#050505] flex items-center px-4 fixed top-0 left-0 right-0 z-50 text-white">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>

        <SheetContent
          side="left"
          className="p-0 w-72 bg-[#050505] border-r border-white/10 flex flex-col text-white"
        >
          {/* Header */}
          <SheetHeader className="h-16 flex items-center justify-center border-b border-white/10 px-6 shrink-0">
            <SheetTitle className="flex items-center font-bold text-lg tracking-tight text-white">
              <ShieldAlert className="h-6 w-6 text-primary mr-2" />
              Super<span className="text-primary">Admin</span>
            </SheetTitle>
          </SheetHeader>

          {/* Links */}
          <div className="flex-1 py-6 px-3 space-y-6 overflow-y-auto">
            {adminGroups.map((group, i) => (
              <div key={i}>
                <h4 className="px-4 text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
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
                            ? "bg-primary/20 text-primary font-bold"
                            : "text-gray-400 hover:text-white hover:bg-white/5",
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
              <Button
                variant="outline"
                className="w-full border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
              >
                <LogOut className="mr-2 h-4 w-4" /> Exit Admin
              </Button>
            </Link>
          </div>
        </SheetContent>
      </Sheet>

      <div className="ml-4 flex items-center font-bold text-lg">
        <ShieldAlert className="h-5 w-5 text-primary mr-2" />
        Super Admin
      </div>
    </header>
  );
}
