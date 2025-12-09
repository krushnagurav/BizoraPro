// src/components/admin/logs/log-viewer.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function LogViewer({
  log,
  open,
  onClose,
}: {
  log: any;
  open: boolean;
  onClose: () => void;
}) {
  if (!log) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#111] border-white/10 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle>Audit Log Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Actor</p>
              <p>{log.actor_email}</p>
            </div>
            <div>
              <p className="text-gray-500">Action</p>
              <Badge variant="outline" className="border-primary text-primary">
                {log.action}
              </Badge>
            </div>
            <div>
              <p className="text-gray-500">Target</p>
              <p>{log.target}</p>
            </div>
            <div>
              <p className="text-gray-500">Date</p>
              <p>{new Date(log.created_at).toLocaleString()}</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-gray-500 text-sm">Payload Data</p>
            <pre className="bg-black border border-white/10 p-4 rounded-lg text-xs font-mono overflow-auto max-h-[300px]">
              {JSON.stringify(log.details, null, 2)}
            </pre>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
