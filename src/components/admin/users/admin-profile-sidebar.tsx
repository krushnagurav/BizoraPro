"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Ban, Check, KeyRound } from "lucide-react";

export function AdminProfileSidebar({ user }: { user: any }) {
  if (!user) {
    return (
      <div className="hidden lg:block w-80 shrink-0">
        <div className="h-full border border-dashed border-white/10 rounded-xl flex items-center justify-center text-gray-500">
          Select a user to view details
        </div>
      </div>
    );
  }

  // Mock Permissions based on Role
  const permissions =
    user.role === "super_admin"
      ? [
          "Shops Management",
          "Billing & Revenue",
          "Support Tickets",
          "System Settings",
        ]
      : ["Support Tickets", "Shops Management"];

  return (
    <div className="w-80 shrink-0 space-y-6">
      <Card className="bg-[#1C1C1C] border-white/10 text-white">
        <CardContent className="pt-8 text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary to-orange-500 rounded-full flex items-center justify-center text-3xl font-bold text-black shadow-lg shadow-primary/20">
            {user.full_name.charAt(0)}
          </div>
          <div>
            <h3 className="text-xl font-bold">{user.full_name}</h3>
            <p className="text-sm text-gray-400">{user.email}</p>
          </div>
          <Badge className="bg-yellow-500 text-black font-bold uppercase tracking-wider">
            {user.role.replace("_", " ")}
          </Badge>
        </CardContent>
      </Card>

      {/* Permissions */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-400 uppercase">
          Permissions
        </h4>
        <div className="space-y-2">
          {permissions.map((p) => (
            <div
              key={p}
              className="flex items-center gap-2 text-sm text-gray-300"
            >
              <Check className="w-4 h-4 text-green-500" /> {p}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <Button
          variant="outline"
          className="w-full justify-start gap-3 border-white/10 hover:bg-white/5 bg-[#E6B800] text-black hover:bg-[#FFD700] border-none font-bold"
        >
          <KeyRound className="w-4 h-4" /> Reset Password
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start gap-3 border-white/10 hover:bg-white/5"
        >
          <Ban className="w-4 h-4" /> Disable Account
        </Button>
      </div>

      {/* Activity */}
      <div className="space-y-3 pt-4 border-t border-white/10">
        <h4 className="text-sm font-semibold text-gray-400 uppercase">
          Recent Activity
        </h4>
        <div className="text-xs space-y-3 text-gray-500">
          <div className="flex justify-between">
            <span>Logged in</span> <span>2h ago</span>
          </div>
          <div className="flex justify-between">
            <span>Updated shop settings</span> <span>5h ago</span>
          </div>
          <div className="flex justify-between">
            <span>Resolved ticket #123</span> <span>1d ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
