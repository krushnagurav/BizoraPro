"use client";

import { Button } from "@/components/ui/button";
import { markAllReadAction } from "@/src/actions/notification-actions";
import { CheckCheck } from "lucide-react";
import { toast } from "sonner";

export function MarkAllReadBtn() {
  const handleMark = async () => {
    await markAllReadAction();
    toast.success("All notifications marked as read");
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleMark} className="text-xs text-muted-foreground hover:text-primary">
      <CheckCheck className="mr-2 h-4 w-4" /> Mark all as read
    </Button>
  );
}