import { createClient } from "@/src/lib/supabase/server";
import { notFound } from "next/navigation";
import { TemplateForm } from "@/src/components/admin/template-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function EditTemplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // 1. Await params (Next.js 15)
  const { id } = await params;
  const supabase = await createClient();

  // 2. Fetch the existing template
  const { data: template } = await supabase
    .from("notification_templates")
    .select("*")
    .eq("id", id)
    .single();

  if (!template) return notFound();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        href="/admin/templates"
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-4"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Templates
      </Link>

      <h1 className="text-3xl font-bold text-white">Edit Template</h1>

      {/* 3. Pass data to the form to pre-fill it */}
      <TemplateForm initialData={template} />
    </div>
  );
}
