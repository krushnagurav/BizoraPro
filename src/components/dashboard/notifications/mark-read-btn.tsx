"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { markNotificationReadAction } from "@/src/actions/notification-actions"; // Fix import path if needed
import { Button } from "@/components/ui/button";
import { CheckCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function MarkReadButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleMark = async () => {
    setLoading(true);
    
    // 1. Call Server Action
    await markNotificationReadAction(id);
    
    // 2. Force Browser Refresh (The Magic Fix)
    router.refresh();
    
    setLoading(false);
    toast.success("Marked as read");
  };

  return (
    <Button 
      size="icon" 
      variant="ghost" 
      title="Mark as read" 
      onClick={handleMark}
      disabled={loading}
    >
      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCheck className="h-5 w-5 text-primary" />}
    </Button>
  );
}