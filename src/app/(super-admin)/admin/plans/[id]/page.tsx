// src/app/(super-admin)/admin/plans/[id]/page.tsx
/*
 * Edit Plan Page
 *
 * This page allows super administrators to edit the details of a specific subscription plan.
 * It fetches the plan data based on the provided ID and displays a form for editing.
 */
import { PlanForm } from "@/src/components/admin/plans/plan-form";
import { createClient } from "@/src/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function EditPlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: plan } = await supabase
    .from("plans")
    .select("*")
    .eq("id", id)
    .single();
  if (!plan) return notFound();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-white">Edit Plan</h1>
      <PlanForm initialData={plan} />
    </div>
  );
}
