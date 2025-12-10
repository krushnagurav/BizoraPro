// src/app/(super-admin)/admin/plans/new/page.tsx
/*  * New Plan Page
 *
 * This page allows super administrators to create new subscription plans.
 * It provides a form for entering plan details and saving them to the system.
 */
import { PlanForm } from "@/src/components/admin/plans/plan-form";

export default function CreatePlanPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-white">Create New Plan</h1>
      <PlanForm />
    </div>
  );
}
