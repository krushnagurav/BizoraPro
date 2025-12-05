import { TemplatesManager } from "@/src/components/dashboard/marketing/templates-manager";
import { createClient } from "@/src/lib/supabase/server";
import { MessageSquare } from "lucide-react";

export default async function WhatsAppTemplatesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: shop } = await supabase
    .from("shops")
    .select("id")
    .eq("owner_id", user!.id)
    .single();

  const { data: templates } = await supabase
    .from("whatsapp_templates")
    .select("*")
    .eq("shop_id", shop?.id)
    .order("created_at", { ascending: false });

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
          <MessageSquare className="h-8 w-8" /> WhatsApp Templates
        </h1>
        <p className="text-muted-foreground">
          Create, edit, and manage your quick replies.
        </p>
      </div>

      <TemplatesManager templates={templates || []} />
    </div>
  );
}
