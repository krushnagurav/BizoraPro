import { createClient } from "@/src/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Star, ShoppingCart, Truck, ShieldCheck } from "lucide-react";
import { AddToCartButton } from "@/src/components/storefront/add-to-cart-btn"; // We'll create this small helper
import { ReviewForm } from "@/src/components/storefront/review-form"; // You already have this
import { ViewTracker } from "@/src/components/storefront/view-tracker";
import { Card } from "@/components/ui/card";

export default async function ProductDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string; id: string }> 
}) {
  const { slug, id } = await params;
  const supabase = await createClient();

  // 1. Fetch Product + Shop Info
  const { data: product } = await supabase
    .from("products")
    .select("*, shops(id, name, theme_config)")
    .eq("id", id)
    .single();

  if (!product) return notFound();

  // 2. Fetch Approved Reviews
  const { data: reviews } = await supabase
    .from("product_reviews")
    .select("*")
    .eq("product_id", id)
    .eq("is_approved", true) // Only show approved
    .order("created_at", { ascending: false });

  const { data: upsells } = await supabase
    .from("upsells")
    .select("suggested:suggested_product_id(*)") // Get full product data
    .eq("trigger_product_id", id);

  const theme = product.shops.theme_config as any || {};
  const primaryColor = theme.primaryColor || "#E6B800";

  let isShopActuallyOpen = product.shops.is_open;

  if (product.shops.auto_close) {
    const now = new Date();
    // Convert current server time to HH:MM format for comparison
    // Note: Vercel servers are UTC. We need to adjust for India (UTC+5:30)
    // Simple hack: Get string time in 'en-IN' locale
    const indiaTime = now.toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour12: false,
    });
    const currentHM = indiaTime.slice(0, 5); // "14:30"

    const openHM = product.shops.opening_time?.slice(0, 5) || "09:00";
    const closeHM = product.shops.closing_time?.slice(0, 5) || "21:00";

    if (currentHM < openHM || currentHM > closeHM) {
      isShopActuallyOpen = false;
    }
  }

  return (
    <div 
      className="min-h-screen bg-background pb-24"
      style={{ "--primary": primaryColor } as React.CSSProperties}
    >
      {/* Header */}
      <div className="p-4 border-b border-border/40 flex items-center gap-4 sticky top-0 bg-background/95 backdrop-blur z-10">
        <Link href={`/${slug}`}>
          <Button variant="ghost" size="icon"><ArrowLeft className="h-6 w-6" /></Button>
        </Link>
        <h1 className="font-bold truncate flex-1">{product.name}</h1>
      </div>

      <div className="max-w-2xl mx-auto">
        
        {/* Product Image */}
        <div className="aspect-square relative bg-secondary">
          {product.image_url ? (
            <Image src={product.image_url} alt={product.name} fill className="object-cover" unoptimized />
          ) : (
             <div className="flex items-center justify-center h-full text-muted-foreground">No Image</div>
          )}
        </div>

        {/* Details */}
        <div className="p-6 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
               <Badge variant="outline" className="text-xs border-primary/50 text-primary">
                 In Stock
               </Badge>
               <div className="flex items-center gap-1 text-yellow-500 text-sm font-bold">
                 <Star className="w-4 h-4 fill-current" />
                 <span>{reviews?.length ? "4.8" : "New"}</span> 
                 {/* (In Phase 2, calculate real average) */}
               </div>
            </div>
            
            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
            
            <div className="flex items-baseline gap-3">
               <span className="text-3xl font-bold text-primary">₹{product.price}</span>
               {product.sale_price && (
                 <span className="text-lg text-muted-foreground line-through">₹{product.sale_price}</span>
               )}
               {product.sale_price && (
                 <span className="text-xs text-green-500 font-bold">
                   {Math.round(((product.sale_price - product.price) / product.sale_price) * 100)}% OFF
                 </span>
               )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 bg-secondary/20 p-3 rounded">
              <Truck className="w-4 h-4" /> Fast Delivery
            </div>
            <div className="flex items-center gap-2 bg-secondary/20 p-3 rounded">
              <ShieldCheck className="w-4 h-4" /> Secure Order
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-2">Description</h3>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {product.description || "No description available."}
            </p>
          </div>

          {/* REVIEWS SECTION */}
          <div className="pt-8 border-t border-border/50">
             <h3 className="font-bold text-xl mb-4">Customer Reviews ({reviews?.length})</h3>
             
             {/* List */}
             <div className="space-y-4 mb-8">
               {reviews?.map((review) => (
                 <div key={review.id} className="bg-secondary/10 p-4 rounded-lg">
                    <div className="flex justify-between mb-2">
                       <span className="font-bold">{review.customer_name}</span>
                       <div className="flex text-yellow-500">
                         {Array.from({ length: review.rating }).map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                       </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                 </div>
               ))}
               {reviews?.length === 0 && <p className="text-muted-foreground text-sm">No reviews yet. Be the first!</p>}
             </div>

             {/* The Form */}
             <ReviewForm shopId={product.shops.id} productId={product.id} />
          </div>

        </div>
      </div>

      {/* UPSELL SECTION */}
{upsells && upsells.length > 0 && (
  <div className="mt-8">
    <h3 className="font-bold mb-4 text-lg">You might also like</h3>
    <div className="grid grid-cols-2 gap-4">
      {upsells.map((u: any) => (
        <Link key={u.suggested.id} href={`/${slug}/p/${u.suggested.id}`}>
           <Card className="overflow-hidden border-border/50">
              {/* ... render mini product card UI ... */}
              <div className="aspect-square relative bg-secondary">
                 {u.suggested.image_url && <Image src={u.suggested.image_url} fill className="object-cover" unoptimized alt="suggested product" />}
              </div>
              <div className="p-2">
                 <p className="text-sm font-medium truncate">{u.suggested.name}</p>
                 <p className="text-xs font-bold text-primary">₹{u.suggested.price}</p>
              </div>
           </Card>
        </Link>
      ))}
    </div>
  </div>
)}

      <ViewTracker shopId={product.shop_id} productId={product.id} />

      {/* Sticky Footer: Add to Cart */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border/50 z-50">
        <div className="max-w-2xl mx-auto flex gap-4">
           <AddToCartButton product={product} isShopOpen={isShopActuallyOpen}/>
        </div>
      </div>

    </div>
  );
}