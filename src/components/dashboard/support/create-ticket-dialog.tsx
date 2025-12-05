"use client";

import { useState } from "react";
import { createTicketAction } from "@/src/actions/support-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, PlusCircle } from "lucide-react";

export function CreateTicketDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);

    const result = await createTicketAction(formData);

    setLoading(false);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Ticket created! We'll reply soon.");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="font-bold gap-2 bg-primary text-black hover:bg-primary/90">
          <PlusCircle className="h-4 w-4" /> Create Ticket
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#111] border-white/10 text-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Support Ticket</DialogTitle>
          <DialogDescription className="text-gray-400">
            Describe your issue and our team will help you ASAP.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label>Subject</Label>
            <Input
              name="subject"
              placeholder="e.g. Payment failed during checkout"
              required
              className="bg-[#050505] border-white/10"
            />
          </div>

          <div className="space-y-2">
            <Label>Priority</Label>
            <Select name="priority" defaultValue="medium">
              <SelectTrigger className="bg-[#050505] border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low - Suggestion / Feedback</SelectItem>
                <SelectItem value="medium">
                  Medium - Configuration / How-to
                </SelectItem>
                <SelectItem value="high">
                  High - Payment / Order Issue
                </SelectItem>
                <SelectItem value="critical">Critical - Shop Down</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-[10px] text-muted-foreground">
              High/Critical priority is for business-stopping issues only.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              name="message"
              placeholder="Describe the issue... Include error messages or steps to reproduce."
              rows={4}
              required
              className="bg-[#050505] border-white/10"
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="font-bold w-full"
            >
              {loading ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                "Submit Ticket"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
