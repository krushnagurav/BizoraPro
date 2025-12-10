// src/components/admin/logs/logs-table.tsx
/*  * Logs Table Component
 * This component displays
 * a table of admin logs,
 * allowing admins to
 * view actions taken
 * within the admin
 * dashboard, including
 * timestamps, actors,
 * actions, and targets.
 */
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye } from "lucide-react";
import { useState } from "react";
import { LogViewer } from "./log-viewer";

export function LogsTable({ logs }: { logs: any[] }) {
  const [selectedLog, setSelectedLog] = useState<any>(null);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-white/10">
            <TableHead className="text-gray-400">Timestamp</TableHead>
            <TableHead className="text-gray-400">Actor</TableHead>
            <TableHead className="text-gray-400">Action</TableHead>
            <TableHead className="text-gray-400">Target</TableHead>
            <TableHead className="text-right text-gray-400">View</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id} className="border-white/10 hover:bg-white/5">
              <TableCell className="text-gray-500 text-xs font-mono">
                {new Date(log.created_at).toLocaleString()}
              </TableCell>
              <TableCell className="text-white">{log.actor_email}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className="border-white/20 text-primary bg-primary/10"
                >
                  {log.action}
                </Badge>
              </TableCell>
              <TableCell className="text-gray-400">{log.target}</TableCell>
              <TableCell className="text-right">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setSelectedLog(log)}
                  className="hover:text-primary hover:bg-white/10"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <LogViewer
        log={selectedLog}
        open={!!selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </>
  );
}
