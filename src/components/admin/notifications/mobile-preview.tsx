// src/components/admin/notifications/mobile-preview.tsx
/*  * Mobile Preview Component
 * This component simulates
 * a mobile device preview
 * for admin notifications,
 * allowing admins to see
 * how notifications will
 * appear on shop owner
 * dashboards.
 */
"use client";

import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Info,
  Megaphone,
  Menu,
  X,
} from "lucide-react";

export function MobilePreview({
  title,
  message,
  type,
}: {
  title: string;
  message: string;
  type: string;
}) {
  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "announcement":
        return <Megaphone className="h-5 w-5 text-blue-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="mx-auto w-[300px] h-[600px] bg-black border-8 border-gray-800 rounded-[3rem] overflow-hidden relative shadow-2xl">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-gray-800 rounded-b-xl z-20" />

      <div className="bg-[#050505] w-full h-full pt-10 px-4 text-white relative">
        <div className="flex justify-between items-center mb-6 opacity-50">
          <Menu className="h-5 w-5" />
          <span className="text-xs font-bold">BizoraPro</span>
          <Bell className="h-5 w-5" />
        </div>

        <div className="space-y-3 opacity-30">
          <div className="h-24 bg-white/10 rounded-xl w-full" />
          <div className="grid grid-cols-2 gap-3">
            <div className="h-20 bg-white/10 rounded-xl" />
            <div className="h-20 bg-white/10 rounded-xl" />
          </div>
          <div className="h-40 bg-white/10 rounded-xl w-full" />
        </div>

        <div className="absolute top-16 left-4 right-4 z-10 animate-in slide-in-from-top-4 fade-in duration-500">
          <div className="bg-[#1C1C1C] border border-white/10 p-4 rounded-xl shadow-2xl flex gap-3 items-start">
            <div className="mt-1 shrink-0">{getIcon()}</div>
            <div className="flex-1 space-y-1">
              <div className="flex justify-between items-start">
                <h4 className="text-sm font-bold text-white leading-none">
                  {title || "Notification Title"}
                </h4>
                <X className="h-3 w-3 text-gray-500" />
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                {message ||
                  "This is how your message will appear to shop owners."}
              </p>
              {type === "announcement" && (
                <Badge
                  variant="secondary"
                  className="mt-2 text-[10px] bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border-0"
                >
                  New Feature
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
