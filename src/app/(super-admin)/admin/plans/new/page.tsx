// src/app/(super-admin)/admin/plans/new/page.tsx
import { PlanForm } from "@/src/components/admin/plans/plan-form";

export default function CreatePlanPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-white">Create New Plan</h1>
      <PlanForm />
    </div>
  );
}
