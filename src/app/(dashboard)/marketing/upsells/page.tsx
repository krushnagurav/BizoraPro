import { createClient } from "@/src/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FeatureLock } from "@/src/components/dashboard/shared/feature-lock";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { deleteUpsellAction } from "@/src/actions/marketing-actions";
import { TrendingUp, ArrowRight, Trash2 } from "lucide-react";
import { UpsellForm } from "@/src/components/dashboard/marketing/upsell-form";

export default async function UpsellPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // You can handle unauthenticated state however your app does globally
  if (!user) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <p className="text-muted-foreground">Please log in to manage upsell rules.</p>
      </div>
    );
  }

  const { data: shop } = await supabase
    .from("shops")
    .select("id, plan")
    .eq("owner_id", user.id)
    .single();

  // Fetch products (with stock_count + price)
  const { data: productsData  = [] } = await supabase
    .from("products")
    .select("id, name, image_url, price, stock_count")
    .eq("shop_id", shop?.id)
    .eq("status", "active");

  const { data: upsellsData = [] } = await supabase
    .from("upsells")
    .select(
      "*, trigger:trigger_product_id(name, image_url), suggested:suggested_product_id(name, image_url)"
    )
    .eq("shop_id", shop?.id);

  const upsells = upsellsData ?? [];
  const totalRevenue =
    upsells?.reduce((acc: number, u: any) => acc + (u.revenue_generated || 0), 0) || 0;

  const products = productsData ?? [];


  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            <TrendingUp className="h-8 w-8" /> Upsell Manager
          </h1>
          <p className="text-muted-foreground">
            Suggest products to increase order value.
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Extra Revenue Generated</p>
          <p className="text-2xl font-bold text-green-500">₹{totalRevenue}</p>
        </div>
      </div>

      <FeatureLock plan={shop?.plan} featureName="Upsell Recommendations">
        {/* CREATE FORM */}
        <Card className="bg-card border-border/50 mb-8">
          <CardHeader>
            <CardTitle>Add Recommendation</CardTitle>
          </CardHeader>
          <CardContent>
            <UpsellForm products={products} />
          </CardContent>
        </Card>

        {/* LIST */}
        <div className="space-y-4">
          {upsells.map((item: any) => (
            <Card
              key={item.id}
              className="bg-secondary/10 border-border/50"
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  {/* Trigger */}
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-black rounded-lg overflow-hidden relative border border-border">
                      {item.trigger?.image_url && (
                        <Image
                          src={item.trigger.image_url}
                          alt=""
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      )}
                    </div>
                    <span className="font-bold">{item.trigger?.name}</span>
                  </div>

                  <div className="flex flex-col items-center text-muted-foreground">
                    <span className="text-xs uppercase tracking-wider mb-1">
                      Recommends
                    </span>
                    <ArrowRight />
                  </div>

                  {/* Suggested */}
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-black rounded-lg overflow-hidden relative border border-border">
                      {item.suggested?.image_url && (
                        <Image
                          src={item.suggested.image_url}
                          alt=""
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{item.suggested?.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <Badge
                          variant="outline"
                          className="text-[10px] h-5 px-1 bg-green-500/10 text-green-500 border-green-500/20"
                        >
                          {item.conversions} Sales
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <form action={deleteUpsellAction}>
                  <input type="hidden" name="id" value={item.id} />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-red-500 hover:bg-red-900/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          ))}

          {upsells.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No upsells yet. Add products to boost sales!
            </div>
          )}
        </div>
      </FeatureLock>
    </div>
  );
}
