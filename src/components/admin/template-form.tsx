"use client";

import { saveTemplateAction } from "@/src/actions/admin-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export function TemplateForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    if (initialData?.id) {
        formData.append("id", initialData.id);
    }
    
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
    <form action={handleSubmit}>
        <Card className="bg-[#111] border-white/10 text-white">
          <CardContent className="p-6 space-y-6">
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Template Name</Label>
                <Input 
                    name="name" 
                    defaultValue={initialData?.name} 
                    placeholder="e.g. Welcome Email" 
                    className="bg-[#050505] border-white/10" 
                    required 
                />
              </div>
              <div className="space-y-2">
                <Label>Slug (Unique ID)</Label>
                <Input 
                    name="slug" 
                    defaultValue={initialData?.slug} 
                    placeholder="e.g. welcome-email" 
                    className="bg-[#050505] border-white/10" 
                    required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Channel</Label>
              <Select name="channel" defaultValue={initialData?.channel || "email"}>
                <SelectTrigger className="bg-[#050505] border-white/10"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="system">System Notification</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Subject / Title</Label>
              <Input 
                name="subject" 
                defaultValue={initialData?.subject} 
                placeholder="Welcome to BizoraPro!" 
                className="bg-[#050505] border-white/10" 
              />
            </div>

            <div className="space-y-2">
              <Label>Message Body (HTML allowed)</Label>
              <div className="text-xs text-gray-500 mb-2">Available variables: {"{{shop_name}}"}, {"{{user_name}}"}</div>
              <Textarea 
                name="body" 
                defaultValue={initialData?.body} 
                placeholder="Hi {{user_name}}..." 
                className="bg-[#050505] border-white/10 min-h-[200px] font-mono" 
                required 
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading} className="bg-primary text-black font-bold hover:bg-primary/90 px-8">
                {loading ? <Loader2 className="animate-spin" /> : "Save Template"}
              </Button>
            </div>

          </CardContent>
        </Card>
      </form>
  );
}