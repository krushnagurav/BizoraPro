// src/app/(super-admin)/admin/templates/[id]/page.tsx
/*
 * Edit Template Page
 *
 * This page allows super administrators to edit the details of a specific notification template.
 * It fetches the template data based on the provided ID and displays a form for editing.
 */
import { TemplateForm } from "@/src/components/admin/template-form";
import { createClient } from "@/src/lib/supabase/server";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditTemplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

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

      <TemplateForm initialData={template} />
    </div>
  );
}
