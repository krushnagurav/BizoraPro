import { createClient } from "@/src/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export async function LowStockWidget({ shopId }: { shopId: string }) {
  const supabase = await createClient();
  
  // Fetch Low Stock Products (< 5)
  const { data: products } = await supabase
    .from("products")
    .select("id, name, stock_count, image_url")
    .eq("shop_id", shopId)
    .lt("stock_count", 5)
    .is("deleted_at", null)
    .limit(3);

  return (
    <Card className="bg-card border-border/50 h-full flex flex-col">
      <CardHeader className="pb-2">
         <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" /> Low Stock
         </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 flex-1">
         {products?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm bg-secondary/10 rounded-lg h-full flex flex-col items-center justify-center border border-dashed border-border">
              <CheckCircle2 className="h-8 w-8 text-green-500 mb-2 opacity-50" />
              Inventory Healthy
            </div>
         ) : (
           products?.map((p) => (
             <div key={p.id} className="flex items-center justify-between border-b border-border/50 last:border-0 pb-2 last:pb-0">
                <div className="flex items-center gap-3">
                   <div className="h-10 w-10 bg-secondary rounded-md flex items-center justify-center text-[10px] relative overflow-hidden border border-border">
                     {p.image_url ? (
                        <Image src={p.image_url} alt="" fill className="object-cover" unoptimized />
                     ) : (
                        "IMG"
                     )}
                   </div>
                   <div>
                     <p className="text-sm font-medium truncate max-w-[100px]">{p.name}</p>
                     <p className="text-xs text-red-400 font-bold">{p.stock_count} left</p>
                   </div>
                </div>
                <Link href={`/products/${p.id}`}>
                  <Button size="sm" variant="ghost" className="h-7 text-xs hover:bg-secondary">Restock</Button>
                </Link>
             </div>
           ))
         )}
      </CardContent>
    </Card>
  );
}