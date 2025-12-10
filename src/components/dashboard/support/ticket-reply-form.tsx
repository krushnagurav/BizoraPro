// src/components/dashboard/support/ticket-reply-form.tsx
/*  * Ticket Reply Form Component
 * This component provides a form for replying
 * to support tickets within the dashboard.
 */
"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, AlertCircle } from "lucide-react";
import { replyToTicketAction } from "@/src/actions/support-actions";

export function TicketReplyForm({
  ticketId,
  role,
}: {
  ticketId: string;
  role: "owner" | "admin";
}) {
  return (
    <div className="p-4 bg-background border-t border-border/50">
      <form action={replyToTicketAction} className="relative">
        <input type="hidden" name="ticketId" value={ticketId} />
        <input type="hidden" name="role" value={role} />
        <Textarea
          name="message"
          placeholder="Type your reply..."
          className="min-h-[80px] pr-12 resize-none bg-secondary/10 border-border/50 focus-visible:ring-primary/30"
          required
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              e.currentTarget.form?.requestSubmit();
            }
          }}
        />
        <Button
          type="submit"
          size="icon"
          className="absolute bottom-3 right-3 h-8 w-8 bg-primary text-black hover:bg-primary/90"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
      <p className="text-[10px] text-muted-foreground mt-2 text-center flex items-center justify-center gap-1">
        <AlertCircle className="h-3 w-3" /> Please avoid sharing passwords or
        full card details.
      </p>
    </div>
  );
}
