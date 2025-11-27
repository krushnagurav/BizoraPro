import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AddToCartButton } from "@/src/components/storefront/add-to-cart-btn";
import { ProductCard } from "@/src/components/storefront/product-card";
import { ReviewForm } from "@/src/components/storefront/review-form";
import { ShopFooter } from "@/src/components/storefront/shared/shop-footer";
import { ShopHeader } from "@/src/components/storefront/shared/shop-header";
import { ViewTracker } from "@/src/components/storefront/view-tracker";
import { createClient } from "@/src/lib/supabase/server";
import { hexToHsl } from "@/src/lib/utils";
import { Headphones, Heart, RotateCcw, Share2, ShieldCheck, Star, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

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
    .select("*, shops(id, name, theme_config, is_open, auto_close, opening_time, closing_time), categories(name)")
    .eq("id", id)
    .single();

  if (!product) return notFound();

  // 2. Fetch Reviews
  const { data: reviews } = await supabase
    .from("product_reviews")
    .select("*")
    .eq("product_id", id)
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  // 3. Fetch Upsells (You Might Also Like)
  const { data: upsells } = await supabase
    .from("upsells")
    .select("suggested:suggested_product_id(*)")
    .eq("trigger_product_id", id);

  const theme = product.shops.theme_config as any || {};
  const primaryColor = theme.primaryColor || "#E6B800";
  const primaryColorHsl = hexToHsl(primaryColor);

  // Auto-Close Logic
  let isShopActuallyOpen = product.shops.is_open;
  if (product.shops.auto_close) {
    const now = new Date();
    const indiaTime = now.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false });
    const currentHM = indiaTime.slice(0, 5);
    if (currentHM < (product.shops.opening_time || "09:00") || currentHM > (product.shops.closing_time || "21:00")) {
      isShopActuallyOpen = false;
    }
  }

  // Calculate Discount
  const discountPercentage = product.sale_price 
    ? Math.round(((product.sale_price - product.price) / product.sale_price) * 100) 
    : 0;

  return (
    <div 
      className="min-h-screen bg-white pb-20"
      style={{ "--primary": primaryColorHsl } as React.CSSProperties}
    >
      {/* Header */}
      <ShopHeader shop={product.shops} />

      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
           <Link href={`/${slug}`} className="hover:text-primary">Home</Link>
           <span>/</span>
           <Link href={`/${slug}?q=`} className="hover:text-primary">Shop</Link>
           <span>/</span>
           <span className="text-foreground font-medium">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
          
          {/* LEFT: Images */}
          <div className="space-y-4">
             <div className="aspect-square relative bg-secondary/10 rounded-2xl overflow-hidden border border-gray-100">
               {product.image_url ? (
                 <Image src={product.image_url} alt={product.name} fill className="object-cover" unoptimized />
               ) : (
                 <div className="flex items-center justify-center h-full text-muted-foreground">No Image</div>
               )}
               {/* Wishlist / Share overlay buttons could go here */}
               <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:text-red-500 transition">
                  <Heart className="w-5 h-5" />
               </button>
             </div>
             
             {/* Gallery Thumbnails (If any) */}
             {product.gallery_images?.length > 0 && (
                <div className="grid grid-cols-4 gap-4">
                   <div className="aspect-square relative rounded-lg overflow-hidden border-2 border-primary cursor-pointer">
                      <Image src={product.image_url} fill className="object-cover" alt="" unoptimized />
                   </div>
                   {product.gallery_images.map((img: string, i: number) => (
                      <div key={i} className="aspect-square relative rounded-lg overflow-hidden border border-transparent hover:border-primary/50 cursor-pointer bg-secondary/10">
                         <Image src={img} fill className="object-cover" alt="" unoptimized />
                      </div>
                   ))}
                </div>
             )}
          </div>

          {/* RIGHT: Details */}
          <div className="flex flex-col">
             {/* Category Tag */}
             <span className="text-sm font-medium text-primary mb-2">
                {product.categories?.name || "Featured"}
             </span>
             
             <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{product.name}</h1>

             {/* Rating */}
             <div className="flex items-center gap-4 mb-6">
                <div className="flex text-yellow-400">
                   {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <span className="text-sm text-muted-foreground">({reviews?.length || 0} reviews)</span>
             </div>

             {/* Price */}
             <div className="flex items-end gap-4 mb-8">
                <span className="text-4xl font-bold text-slate-900">₹{product.price}</span>
                {product.sale_price && (
                  <>
                    <span className="text-xl text-muted-foreground line-through mb-1">₹{product.sale_price}</span>
                    <Badge className="bg-red-100 text-red-600 hover:bg-red-100 mb-2">Save {discountPercentage}%</Badge>
                  </>
                )}
             </div>

             <Separator className="mb-8" />

             {/* Action Buttons */}
             <div className="flex gap-4 mb-8">
                <div className="flex-1">
                   <AddToCartButton product={product} isShopOpen={isShopActuallyOpen} />
                </div>
                <Button variant="outline" size="icon" className="h-12 w-12 shrink-0">
                   <Share2 className="h-5 w-5" />
                </Button>
             </div>

             {/* Trust Features */}
             <div className="grid grid-cols-2 gap-4 text-sm mb-8">
                <div className="flex items-center gap-3">
                   <Truck className="w-5 h-5 text-primary" />
                   <span>Free shipping over ₹999</span>
                </div>
                <div className="flex items-center gap-3">
                   <RotateCcw className="w-5 h-5 text-primary" />
                   <span>30-day returns</span>
                </div>
                <div className="flex items-center gap-3">
                   <ShieldCheck className="w-5 h-5 text-primary" />
                   <span>2-year warranty</span>
                </div>
                <div className="flex items-center gap-3">
                   <Headphones className="w-5 h-5 text-primary" />
                   <span>24/7 support</span>
                </div>
             </div>

             {/* Description Accordion/Text */}
             <div className="prose prose-slate max-w-none text-muted-foreground text-sm leading-relaxed mb-12">
                <h3 className="text-foreground font-bold mb-2 text-base">Description</h3>
                <p className="whitespace-pre-wrap">{product.description || "No description provided."}</p>
             </div>
          </div>
        </div>

        {/* YOU MIGHT ALSO LIKE */}
        {upsells && upsells.length > 0 && (
          <div className="mt-20">
             <h2 className="text-2xl font-bold mb-8">You might also like</h2>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {upsells.map((u: any) => (
                   <Link key={u.suggested.id} href={`/${slug}/p/${u.suggested.id}`}>
                      <ProductCard product={u.suggested} isShopOpen={isShopActuallyOpen} />
                   </Link>
                ))}
             </div>
          </div>
        )}

        {/* REVIEWS SECTION */}
        <div className="mt-20 bg-slate-50 rounded-3xl p-8 md:p-12">
           <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-8 text-center">Customer Reviews</h2>
              
              {/* List */}
              <div className="space-y-6 mb-12">
                 {reviews?.map((review) => (
                   <div key={review.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                      <div className="flex justify-between items-start mb-2">
                         <div>
                            <span className="font-bold text-slate-900 block">{review.customer_name}</span>
                            <span className="text-xs text-slate-400">{new Date(review.created_at).toLocaleDateString()}</span>
                         </div>
                         <div className="flex text-yellow-400">
                           {Array.from({ length: review.rating }).map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                         </div>
                      </div>
                      <p className="text-slate-600">{review.comment}</p>
                   </div>
                 ))}
                 {reviews?.length === 0 && (
                   <p className="text-center text-muted-foreground italic">No reviews yet. Be the first to review!</p>
                 )}
              </div>

              {/* Form */}
              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-lg">
                 <ReviewForm shopId={product.shops.id} productId={product.id} />
              </div>
           </div>
        </div>

      </div>
      
      {/* View Tracker */}
      <ViewTracker shopId={product.shop_id} productId={product.id} />

      {/* Footer */}
      <ShopFooter shop={product.shops} />

      {!isShopActuallyOpen && (
        <div className="fixed bottom-0 left-0 right-0 bg-red-600 text-white text-center p-3 font-bold z-50 shadow-lg">
          ⛔ Shop is currently closed
        </div>
      )}

    </div>
  );
}