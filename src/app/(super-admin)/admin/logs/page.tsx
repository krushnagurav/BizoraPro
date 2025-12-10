// src/app/(super-admin)/admin/logs/page.tsx
/*
 * Audit Logs Page
 *
 * This page displays a comprehensive list of audit logs for super administrators.
 * It provides insights into all actions taken within the platform for security and compliance purposes.
 */
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LogsTable } from "@/src/components/admin/logs/logs-table";
import { createClient } from "@/src/lib/supabase/server";
import { Download, ShieldAlert } from "lucide-react";

export default async function AuditLogsPage() {
  const supabase = await createClient();

  const { data: logs } = await supabase
    .from("audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <ShieldAlert className="h-8 w-8 text-primary" /> Audit Logs
          </h1>
          <p className="text-gray-400">Security trail of all actions.</p>
        </div>
        <Button
          variant="outline"
          className="border-white/20 text-white hover:bg-white/10 gap-2"
        >
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      <Card className="bg-[#111] border-white/10 text-white">
        <CardContent className="p-0">
          <LogsTable logs={logs || []} />
        </CardContent>
      </Card>
    </div>
  );
}
