"use client";

import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { incrementTemplateUsageAction } from "@/src/actions/marketing-actions";

export function CopyButton({ text, id }: { text: string; id: string }) {
  const handleCopy = async () => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");

    await incrementTemplateUsageAction(id);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="w-full mt-2 gap-2"
      onClick={handleCopy}
    >
      <Copy className="h-4 w-4" /> Copy Text
    </Button>
  );
}
