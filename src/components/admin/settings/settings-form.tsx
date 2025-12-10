// src/components/admin/settings/settings-form.tsx
/*  * Settings Form Component
 * This component renders
 * the settings form in the
 * admin dashboard, allowing
 * admins to configure system
 * settings such as maintenance
 * mode and global announcement
 * banners.
 */
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { updatePlatformSettingsAction } from "@/src/actions/admin-actions";
import { AlertTriangle, Info, Loader2, Power, UserPlus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function SettingsForm({ settings }: { settings: any }) {
  const [loading, setLoading] = useState(false);

  const [bannerTitle, setBannerTitle] = useState(settings?.banner_title || "");
  const [bannerMessage, setBannerMessage] = useState(
    settings?.global_banner || "",
  );
  const [variant, setVariant] = useState(settings?.banner_variant || "info");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await updatePlatformSettingsAction(formData);
    setLoading(false);

    if (res?.error) toast.error(res.error);
    else toast.success("Configuration Saved");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="bg-[#111] border-white/10 text-white">
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-lg border border-red-900/30 bg-red-950/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/20 rounded-full text-red-500">
                <Power className="h-5 w-5" />
              </div>
              <div>
                <Label className="text-base font-bold text-red-400">
                  Maintenance Mode
                </Label>
                <p className="text-xs text-gray-400">
                  Disable platform access for all users.
                </p>
              </div>
            </div>
            <Switch
              name="maintenance"
              defaultChecked={settings?.maintenance_mode}
              className="data-[state=checked]:bg-red-600"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border border-white/10 bg-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-full text-green-500">
                <UserPlus className="h-5 w-5" />
              </div>
              <div>
                <Label className="text-base font-bold">New Registrations</Label>
                <p className="text-xs text-gray-400">
                  Allow new users to sign up.
                </p>
              </div>
            </div>
            <Switch
              name="signups"
              defaultChecked={settings?.allow_new_signups}
              className="data-[state=checked]:bg-green-600"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#111] border-white/10 text-white">
        <CardHeader>
          <CardTitle>Global Announcement Banner</CardTitle>
          <CardDescription>Broadcast messages to dashboards.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Banner Title</Label>
            <Input
              name="bannerTitle"
              value={bannerTitle}
              onChange={(e) => setBannerTitle(e.target.value)}
              placeholder="e.g. Analytics Update"
              className="bg-[#050505] border-white/10"
            />
          </div>
          <div className="space-y-2">
            <Label>Message</Label>
            <Textarea
              name="bannerMessage"
              value={bannerMessage}
              onChange={(e) => setBannerMessage(e.target.value)}
              placeholder="Details about the update..."
              className="bg-[#050505] border-white/10"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Target Audience</Label>
              <Select
                name="targetAudience"
                defaultValue={settings?.target_audience || "all"}
              >
                <SelectTrigger className="bg-[#050505] border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Shop Owners</SelectItem>
                  <SelectItem value="free">Free Plan Users</SelectItem>
                  <SelectItem value="pro">Pro Plan Users</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Banner Style</Label>
              <Select
                name="bannerVariant"
                value={variant}
                onValueChange={setVariant}
              >
                <SelectTrigger className="bg-[#050505] border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Info (Blue)</SelectItem>
                  <SelectItem value="warning">Warning (Yellow)</SelectItem>
                  <SelectItem value="critical">Critical (Red)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Display Locations</Label>
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <Checkbox
                  name="loc_dashboard"
                  id="loc1"
                  defaultChecked={settings?.display_locations?.includes(
                    "dashboard",
                  )}
                />
                <Label
                  htmlFor="loc1"
                  className="text-sm font-normal text-gray-400"
                >
                  Shop Dashboard
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  name="loc_admin"
                  id="loc2"
                  defaultChecked={settings?.display_locations?.includes(
                    "admin",
                  )}
                />
                <Label
                  htmlFor="loc2"
                  className="text-sm font-normal text-gray-400"
                >
                  Super Admin
                </Label>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            <Label className="text-gray-500 text-xs uppercase tracking-wider mb-3 block">
              Banner Preview
            </Label>
            <div
              className={`p-4 rounded-lg flex items-start gap-3 border ${
                variant === "info"
                  ? "bg-blue-500/10 border-blue-500/30"
                  : variant === "warning"
                    ? "bg-yellow-500/10 border-yellow-500/30"
                    : "bg-red-500/10 border-red-500/30"
              }`}
            >
              <div
                className={`mt-0.5 ${
                  variant === "info"
                    ? "text-blue-400"
                    : variant === "warning"
                      ? "text-yellow-400"
                      : "text-red-400"
                }`}
              >
                {variant === "info" ? (
                  <Info className="h-5 w-5" />
                ) : (
                  <AlertTriangle className="h-5 w-5" />
                )}
              </div>
              <div className="flex-1">
                <h4
                  className={`text-sm font-bold ${
                    variant === "info"
                      ? "text-blue-100"
                      : variant === "warning"
                        ? "text-yellow-100"
                        : "text-red-100"
                  }`}
                >
                  {bannerTitle || "Banner Title"}
                </h4>
                <p className="text-xs text-gray-400 mt-1">
                  {bannerMessage ||
                    "Your announcement message will appear here."}
                </p>
              </div>
              <X className="h-4 w-4 text-gray-500 cursor-pointer" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={loading}
          className="bg-[#E6B800] text-black font-bold hover:bg-[#FFD700] px-8"
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Save Configuration"
          )}
        </Button>
      </div>
    </form>
  );
}
