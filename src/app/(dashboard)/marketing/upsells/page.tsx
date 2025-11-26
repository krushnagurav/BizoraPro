import { createClient } from "@/src/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createUpsellAction, deleteUpsellAction } from "@/src/actions/marketing-actions";
import { ArrowRight, Trash2, Plus } from "lucide-react";
import Image from "next/image";

export default async function UpsellPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: shop } = await supabase.from("shops").select("id").eq("owner_id", user!.id).single();

  // Fetch Products for Dropdown
  const { data: products } = await supabase
    .from("products")
    .select("id, name")
    .eq("shop_id", shop?.id)
    .eq("status", "active");

  // Fetch Existing Upsells
  const { data: upsells } = await supabase
    .from("upsells")
    .select("*, trigger:trigger_product_id(name, image_url), suggested:suggested_product_id(name, image_url)")
    .eq("shop_id", shop?.id);

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-primary">Upsell Manager</h1>
        <p className="text-muted-foreground">Suggest products to increase order value.</p>
      </div>

      {/* CREATE FORM */}
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle>Add Recommendation</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createUpsellAction} className="flex flex-col md:flex-row gap-4 items-end">
            
            <div className="space-y-2 flex-1 w-full">
              <span className="text-sm font-medium">When user views...</span>
              <Select name="triggerId" required>
                <SelectTrigger><SelectValue placeholder="Select Product" /></SelectTrigger>
                <SelectContent>
                  {products?.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <ArrowRight className="hidden md:block mb-3 text-muted-foreground" />

            <div className="space-y-2 flex-1 w-full">
              <span className="text-sm font-medium">Suggest this...</span>
              <Select name="suggestedId" required>
                <SelectTrigger><SelectValue placeholder="Select Product" /></SelectTrigger>
                <SelectContent>
                  {products?.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="font-bold">
              <Plus className="h-4 w-4 mr-2" /> Add
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* LIST */}
      <div className="space-y-4">
        {upsells?.map((item: any) => (
          <Card key={item.id} className="bg-secondary/10 border-border/50">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-6">
                {/* Trigger */}
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-black rounded overflow-hidden relative">
                     {item.trigger?.image_url && <Image src={item.trigger.image_url} alt="" fill className="object-cover" unoptimized />}
                  </div>
                  <span className="font-bold">{item.trigger?.name}</span>
                </div>

                <ArrowRight className="text-muted-foreground" />

                {/* Suggested */}
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-black rounded overflow-hidden relative">
                     {item.suggested?.image_url && <Image src={item.suggested.image_url} alt="" fill className="object-cover" unoptimized />}
                  </div>
                  <span>{item.suggested?.name}</span>
                </div>
              </div>

              <form action={deleteUpsellAction}>
                <input type="hidden" name="id" value={item.id} />
                <Button size="icon" variant="ghost" className="text-red-500 hover:bg-red-900/10">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}