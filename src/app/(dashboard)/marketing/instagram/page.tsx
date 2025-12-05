import { createClient } from "@/src/lib/supabase/server";
import { FeatureLock } from "@/src/components/dashboard/shared/feature-lock";
import { InstagramForm } from "@/src/components/dashboard/marketing/instagram-form";
import { Instagram } from "lucide-react";

export default async function InstagramPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: shop } = await supabase
    .from("shops")
    .select("plan, instagram_feed")
    .eq("owner_id", user!.id)
    .single();

  // Extract feed safely
  const feed = (shop?.instagram_feed as string[]) || [];

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
          <Instagram className="h-8 w-8" /> Instagram Integration
        </h1>
        <p className="text-muted-foreground">
          Upload your best photos to show a Live Feed on your shop.
        </p>
      </div>

      <FeatureLock plan={shop?.plan} featureName="Instagram Feed">
        <InstagramForm initialFeed={feed} />
      </FeatureLock>
    </div>
  );
}
