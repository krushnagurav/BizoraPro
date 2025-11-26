import { createClient } from "@/src/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Trash2, MessageSquare, Plus } from "lucide-react";
import { createTemplateAction, deleteTemplateAction } from "@/src/actions/marketing-actions";

export default async function WhatsAppTemplatesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: shop } = await supabase.from("shops").select("id").eq("owner_id", user!.id).single();

  const { data: templates } = await supabase
    .from("whatsapp_templates")
    .select("*")
    .eq("shop_id", shop?.id)
    .order("created_at", { ascending: false });

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
          <MessageSquare className="h-8 w-8" /> WhatsApp Templates
        </h1>
        <p className="text-muted-foreground">Save quick replies to send to customers.</p>
      </div>

      {/* CREATE FORM */}
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle>New Template</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createTemplateAction} className="space-y-4">
            <div className="space-y-2">
              <Label>Template Name</Label>
              <Input name="name" placeholder="e.g. Payment Received" required />
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea name="message" placeholder="Hi, we received your payment! Your order will ship tomorrow." required />
            </div>
            <Button type="submit" className="font-bold gap-2">
              <Plus className="h-4 w-4" /> Save Template
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* LIST */}
      <div className="grid md:grid-cols-2 gap-4">
        {templates?.map((t) => (
          <Card key={t.id} className="bg-secondary/10 border-border/50">
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg">{t.name}</h3>
                <form action={deleteTemplateAction}>
                  <input type="hidden" name="id" value={t.id} />
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </form>
              </div>
              <p className="text-sm text-muted-foreground bg-background p-3 rounded border border-border">
                {t.message}
              </p>
              <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => {
                  // In a real app, this would copy to clipboard or open WhatsApp
                  // For MVP, we assume user copies it manually
              }}>
                Copy Text
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}