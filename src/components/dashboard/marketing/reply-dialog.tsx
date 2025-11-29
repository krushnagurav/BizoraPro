"use client";

import { useState } from "react";
import { replyToReviewAction } from "@/src/actions/marketing-actions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { MessageCircle, Loader2 } from "lucide-react";

export function ReplyDialog({ reviewId, existingReply }: { reviewId: string, existingReply?: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    formData.append("id", reviewId);
    
    const result = await replyToReviewAction(formData);
    setLoading(false);
    
    if (result?.error) toast.error(result.error);
    else {
      toast.success("Reply sent!");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-2">
           <MessageCircle className="h-3 w-3" /> {existingReply ? "Edit Reply" : "Reply"}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle>Reply to Customer</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <Textarea 
            name="reply" 
            placeholder="Thank you for your feedback..." 
            defaultValue={existingReply} 
            required 
          />
          <div className="flex justify-end">
             <Button type="submit" disabled={loading}>
               {loading ? <Loader2 className="animate-spin" /> : "Post Reply"}
             </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}