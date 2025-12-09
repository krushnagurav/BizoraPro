import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SettingsForm } from "@/src/components/admin/settings/settings-form";
import { createClient } from "@/src/lib/supabase/server";
import { History, Wrench } from "lucide-react";

export default async function AdminSettingsPage() {
  const supabase = await createClient();

  const [settingsRes, logsRes] = await Promise.all([
    supabase.from("platform_settings").select("*").single(),
    supabase
      .from("audit_logs")
      .select("*")
      .eq("target", "System Configuration")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const settings = settingsRes.data;
  const logs = logsRes.data || [];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <Wrench className="h-8 w-8 text-primary" /> Platform Settings
        </h1>
        <p className="text-gray-400">
          Control maintenance mode and global banners.
        </p>
      </div>

      <SettingsForm settings={settings} />

      {/* Recent Changes Log */}
      <Card className="bg-[#111] border-white/10 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <History className="h-4 w-4" /> Recent System Changes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {logs.length === 0 ? (
            <p className="text-sm text-gray-500">No recent changes.</p>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-300">
                      {log.action}
                    </p>
                    <p className="text-xs text-gray-500">
                      by {log.actor_email}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-gray-600">
                  {new Date(log.created_at).toLocaleDateString()}
                </span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
