import { createClient } from "@/src/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Activity, ShieldAlert } from "lucide-react";

export default async function AuditLogsPage() {
  const supabase = await createClient();

  const { data: logs } = await supabase
    .from("audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white flex items-center gap-2">
        <ShieldAlert className="h-8 w-8 text-primary" /> Audit Logs
      </h1>
      <p className="text-gray-400">Security trail of platform activities.</p>

      <Card className="bg-[#111] border-white/10 text-white">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-white/10">
                <TableHead className="text-gray-400">Time</TableHead>
                <TableHead className="text-gray-400">Actor</TableHead>
                <TableHead className="text-gray-400">Action</TableHead>
                <TableHead className="text-gray-400">Target</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs?.map((log) => (
                <TableRow key={log.id} className="border-white/10 hover:bg-white/5">
                  <TableCell className="text-gray-500 text-xs font-mono">
                    {new Date(log.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell className="font-medium text-primary">
                    {log.actor_email}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-white/20 text-white">
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-400 text-sm">
                    {log.target}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}