import { createClient } from "@/src/lib/supabase/server";
import { FeatureLock } from "@/src/components/dashboard/shared/feature-lock";
import { BulkImportForm } from "@/src/components/dashboard/products/bulk-import-form";

export default async function BulkImportPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: shop } = await supabase
    .from("shops")
    .select("plan")
    .eq("owner_id", user!.id)
    .single();

  return (
    <div className="p-8">
      <FeatureLock plan={shop?.plan} featureName="Bulk Import">
        <BulkImportForm />
      </FeatureLock>
    </div>
  );
}
