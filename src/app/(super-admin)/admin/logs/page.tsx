import { createClient } from "@/src/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

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
          <p className="text-gray-400">Monitor all system activities and user actions.</p>
        </div>
        <Button className="bg-[#111] text-white border border-white/20 hover:bg-white/5">
           Export CSV
        </Button>
      </div>

      <Card className="bg-[#111] border-white/10 text-white">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-white/10">
                <TableHead className="text-gray-400">Timestamp</TableHead>
                <TableHead className="text-gray-400">User / Admin</TableHead>
                <TableHead className="text-gray-400">Action Type</TableHead>
                <TableHead className="text-gray-400">Target</TableHead>
                <TableHead className="text-right text-gray-400">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs?.map((log) => (
                <TableRow key={log.id} className="border-white/10 hover:bg-white/5">
                  <TableCell className="text-gray-500 text-xs font-mono">
                    {new Date(log.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell className="font-medium text-white">
                    <div className="flex items-center gap-2">
                       <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] text-primary">
                          {log.actor_email?.charAt(0).toUpperCase()}
                       </div>
                       {log.actor_email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-white/20 text-primary bg-primary/10">
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-400 text-sm">
                    {log.target}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="icon" variant="ghost" className="hover:text-primary hover:bg-white/10">
                      <Eye className="h-4 w-4" />
                    </Button>
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