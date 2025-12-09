// src/components/admin/template-form.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { saveTemplateAction } from "@/src/actions/admin-actions";
import { Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const AVAILABLE_VARIABLES = [
  { label: "Shop Name", value: "{{shop_name}}" },
  { label: "Owner Name", value: "{{owner_name}}" },
  { label: "Plan Name", value: "{{plan_name}}" },
  { label: "Expiry Date", value: "{{expiry_date}}" },
  { label: "Invoice ID", value: "{{invoice_id}}" },
];

export function TemplateForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [body, setBody] = useState(initialData?.body || "");

  // Insert variable into text
  const insertVariable = (variable: string) => {
    setBody((prev: string) => prev + " " + variable);
  };

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    if (initialData?.id) {
      formData.append("id", initialData.id);
    }
    // Append the controlled body state
    formData.set("body", body);

    const res = await saveTemplateAction(formData);

    setLoading(false);
    if (res?.error) toast.error(res.error);
    else {
      toast.success("Template Saved");
      router.push("/admin/templates");
      router.refresh();
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8 h-[calc(100vh-140px)]">
      {/* LEFT: EDITOR */}
      <div className="lg:col-span-2 flex flex-col">
        <form action={handleSubmit} className="flex-1 flex flex-col gap-6">
          <Card className="bg-[#111] border-white/10 text-white flex-1 flex flex-col">
            <CardHeader className="border-b border-white/10 pb-4">
              <div className="flex justify-between items-center">
                <CardTitle>Template Editor</CardTitle>
                <div className="flex gap-2">
                  <Select
                    name="status"
                    defaultValue={initialData?.is_active ? "active" : "draft"}
                  >
                    <SelectTrigger className="w-[100px] h-8 text-xs bg-white/5 border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6 flex-1 overflow-y-auto">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Template Name</Label>
                  <Input
                    name="name"
                    defaultValue={initialData?.name}
                    placeholder="e.g. Trial Ending Reminder"
                    className="bg-[#050505] border-white/10"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Channel</Label>
                  <Select
                    name="channel"
                    defaultValue={initialData?.channel || "email"}
                  >
                    <SelectTrigger className="bg-[#050505] border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="system">
                        System Notification
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Unique Slug (Trigger ID)</Label>
                <Input
                  name="slug"
                  defaultValue={initialData?.slug}
                  placeholder="e.g. trial-ending-3days"
                  className="bg-[#050505] border-white/10 font-mono text-xs"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Subject Line</Label>
                <Input
                  name="subject"
                  defaultValue={initialData?.subject}
                  placeholder="Your trial ends in 3 days!"
                  className="bg-[#050505] border-white/10"
                />
              </div>

              <div className="space-y-2 flex-1 flex flex-col">
                <Label>Message Body (HTML supported)</Label>
                <Textarea
                  name="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="<html><body>Hi {{owner_name}}...</body></html>"
                  className="bg-[#050505] border-white/10 min-h-[300px] font-mono text-sm flex-1 resize-none"
                  required
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              className="border-white/10 text-white"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#E6B800] text-black font-bold hover:bg-[#FFD700] px-8"
            >
              {loading ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" /> Save Template
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* RIGHT: VARIABLES & PREVIEW */}
      <div className="lg:col-span-1 space-y-6">
        {/* Variables Helper */}
        <Card className="bg-[#111] border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-base">Available Variables</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_VARIABLES.map((v) => (
                <Badge
                  key={v.value}
                  variant="outline"
                  className="cursor-pointer hover:bg-white/10 border-dashed border-white/30 py-1 px-2 text-xs"
                  onClick={() => insertVariable(v.value)}
                >
                  {v.value}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Click to insert into the message body.
            </p>
          </CardContent>
        </Card>

        {/* Mock Preview */}
        <Card className="bg-[#1C1C1C] border-2 border-white/10 text-white">
          <CardHeader className="bg-white/5 border-b border-white/5 py-3">
            <CardTitle className="text-sm font-medium">Email Preview</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="h-4 w-3/4 bg-white/10 rounded animate-pulse" />
            <div className="h-4 w-1/2 bg-white/10 rounded animate-pulse" />
            <div className="h-32 w-full bg-white/5 rounded border border-white/5 p-4 text-xs text-gray-400">
              {/* Simple text preview logic */}
              {body ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: body.replace(
                      /{{.*?}}/g,
                      '<span class="text-yellow-500">...</span>',
                    ),
                  }}
                />
              ) : (
                "Start typing to see preview..."
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
