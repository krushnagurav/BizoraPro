import { createClient } from "@/src/lib/supabase/server";
import { updatePlatformSettingsAction } from "@/src/actions/admin-actions";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Power, UserPlus } from "lucide-react";

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("platform_settings")
    .select("*")
    .single();

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-white">Platform Settings</h1>

      <form
        action={async (formData) => {
          "use server";
          await updatePlatformSettingsAction(formData);
        }}
      >
        <div className="space-y-6">
          {/* 1. Maintenance Mode */}
          <Card className="bg-[#111] border-red-900/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-500">
                <Power className="h-5 w-5" /> Maintenance Mode
              </CardTitle>
              <CardDescription>
                If enabled, the entire site (except Admin) will show a Under
                Maintenance screen.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between bg-red-950/10 p-4 rounded-lg border border-red-900/20">
              <span className="text-white font-bold">Enable Maintenance</span>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="maintenance"
                  defaultChecked={settings?.maintenance_mode}
                  className="h-5 w-5 accent-red-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* 2. New Signups */}
          <Card className="bg-[#111] border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <UserPlus className="h-5 w-5" /> New Registrations
              </CardTitle>
              <CardDescription>
                Control whether new users can create accounts.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between p-4 rounded-lg border border-white/10">
              <span className="text-white">Allow Signups</span>
              <input
                type="checkbox"
                name="signups"
                defaultChecked={settings?.allow_new_signups}
                className="h-5 w-5 accent-green-500"
              />
            </CardContent>
          </Card>

          {/* 3. Global Announcement */}
          <Card className="bg-[#111] border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <AlertTriangle className="h-5 w-5 text-yellow-500" /> Global
                Announcement
              </CardTitle>
              <CardDescription>
                This message appears on top of every Dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Label className="text-white">Banner Message</Label>
              <Input
                name="banner"
                defaultValue={settings?.global_banner || ""}
                placeholder="e.g., System upgrade scheduled for Saturday 10 PM"
                className="bg-[#050505] border-white/10 text-white mt-2"
              />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-primary text-black font-bold hover:bg-primary/90"
              size="lg"
            >
              Save Configuration
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
