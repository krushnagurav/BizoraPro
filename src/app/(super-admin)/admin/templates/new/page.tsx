import { TemplateForm } from "@/src/components/admin/template-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewTemplatePage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/admin/templates" className="flex items-center gap-2 text-gray-400 hover:text-white mb-4">
        <ArrowLeft className="h-4 w-4" /> Back to Templates
      </Link>
      <h1 className="text-3xl font-bold text-white">Create Template</h1>
      
      {/* Reusable Form */}
      <TemplateForm />
    </div>
  );
}