"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { sendNotificationAction } from "@/src/actions/notification-actions";
import { Loader2, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { MobilePreview } from "./mobile-preview";

export function NotificationCenter({ history }: { history: any[] }) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState({
    title: "",
    message: "",
    type: "info",
  });

  const handleChange = (key: string, val: string) => {
    setPreview((prev) => ({ ...prev, [key]: val }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const res = await sendNotificationAction(formData);
    setLoading(false);

    if (res?.error) toast.error(res.error);
    else {
      toast.success(res.success);
      setPreview({ title: "", message: "", type: "info" });
      (event.target as HTMLFormElement).reset();
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8 h-[calc(100vh-140px)]">
      {/* LEFT: CONTROLS */}
      <div className="flex flex-col gap-6">
        <Tabs defaultValue="compose" className="w-full flex-1 flex flex-col">
          <TabsList className="bg-[#111] border border-white/10 w-full justify-start">
            <TabsTrigger value="compose" className="gap-2">
              Compose
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="compose" className="mt-6 flex-1">
            <Card className="bg-[#111] border-white/10 text-white h-full">
              <CardHeader>
                <CardTitle>Compose Broadcast</CardTitle>
                <CardDescription>
                  Send a message to all shop owners.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label>Notification Title</Label>
                    <Input
                      name="title"
                      placeholder="e.g. System Maintenance"
                      className="bg-[#050505] border-white/10"
                      onChange={(e) => handleChange("title", e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select
                        name="type"
                        defaultValue="info"
                        onValueChange={(v) => handleChange("type", v)}
                      >
                        <SelectTrigger className="bg-[#050505] border-white/10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="info">Info (Blue)</SelectItem>
                          <SelectItem value="success">
                            Success (Green)
                          </SelectItem>
                          <SelectItem value="warning">
                            Warning (Yellow)
                          </SelectItem>
                          <SelectItem value="announcement">
                            Announcement
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Target Audience</Label>
                      <Select name="audience" defaultValue="all" disabled>
                        <SelectTrigger className="bg-[#050505] border-white/10">
                          <SelectValue placeholder="All Users" />
                        </SelectTrigger>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Message Body</Label>
                    <Textarea
                      name="message"
                      placeholder="Enter your message details..."
                      className="bg-[#050505] border-white/10 min-h-[150px]"
                      onChange={(e) => handleChange("message", e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-black font-bold hover:bg-primary/90"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin mr-2" />
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" /> Send Broadcast
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-6 flex-1 overflow-auto">
            <div className="space-y-3">
              {history.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  No recent notifications.
                </div>
              ) : (
                history.map((n) => (
                  <div
                    key={n.id}
                    className="p-4 bg-[#111] border border-white/10 rounded-xl flex justify-between items-start"
                  >
                    <div>
                      <h4 className="font-bold text-sm text-white">
                        {n.title}
                      </h4>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                        {n.message}
                      </p>
                      <span className="text-[10px] text-gray-600 mt-2 block">
                        {new Date(n.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-xs border-white/20 capitalize"
                    >
                      {n.type}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* RIGHT: PREVIEW */}
      <div className="hidden lg:flex flex-col items-center justify-center bg-[#111] border border-white/10 rounded-xl p-8">
        <div className="mb-6 text-center">
          <h3 className="text-lg font-bold text-white mb-1">
            Live Mobile Preview
          </h3>
          <p className="text-sm text-gray-500">
            See exactly what users will see.
          </p>
        </div>
        <MobilePreview
          title={preview.title}
          message={preview.message}
          type={preview.type}
        />
      </div>
    </div>
  );
}
