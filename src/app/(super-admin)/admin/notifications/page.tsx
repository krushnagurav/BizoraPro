"use client";

import { useState } from "react";
import { sendNotificationAction } from "@/src/actions/notification-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, BellRing } from "lucide-react";

export default function AdminNotificationsPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const res = await sendNotificationAction(formData);
    setLoading(false);
    
    if (res?.error) toast.error(res.error);
    else {
      toast.success("Notification Sent!");
      (event.target as HTMLFormElement).reset();
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-white flex items-center gap-2">
        <BellRing className="h-8 w-8 text-primary" /> Notification Center
      </h1>

      <Card className="bg-[#111] border-white/10 text-white">
        <CardHeader>
          <CardTitle>Send Announcement</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-2">
              <Label>Title</Label>
              <Input name="title" placeholder="e.g. System Maintenance" className="bg-[#050505] border-white/10" required />
            </div>

            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea name="message" placeholder="Details..." className="bg-[#050505] border-white/10" rows={4} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select name="type" defaultValue="info">
                  <SelectTrigger className="bg-[#050505] border-white/10"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Info (Blue)</SelectItem>
                    <SelectItem value="success">Success (Green)</SelectItem>
                    <SelectItem value="warning">Warning (Yellow)</SelectItem>
                    <SelectItem value="error">Urgent (Red)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Target User ID (Optional)</Label>
                <Input name="targetUserId" placeholder="Leave empty for ALL users" className="bg-[#050505] border-white/10" />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-primary text-black font-bold hover:bg-primary/90">
              {loading ? <Loader2 className="animate-spin" /> : "Send Notification"}
            </Button>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}