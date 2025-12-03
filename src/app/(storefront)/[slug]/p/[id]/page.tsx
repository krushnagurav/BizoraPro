import type { CSSProperties } from "react";
import { createClient } from "@/src/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ShopHeader } from "@/src/components/storefront/shared/shop-header";
import { ShopFooter } from "@/src/components/storefront/shared/shop-footer";
import { ProductView } from "@/src/components/storefront/product-view";
import { ViewTracker } from "@/src/components/storefront/view-tracker";
import { ReviewForm } from "@/src/components/storefront/review-form";
import { ProductCard } from "@/src/components/storefront/product-card";
import { ProductGallery } from "@/src/components/storefront/product-gallery";
import { hexToHsl } from "@/src/lib/utils";
import {
  Truck,
  RotateCcw,
  ShieldCheck,
  Headphones,
  Star,
  Info,
} from "lucide-react";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("*, shops(*), categories(name)")
    .eq("id", id)
    .single();

  if (!product) return notFound();

  const { data: reviewsArr } = await supabase
    .from("product_reviews")
    .select("*")
    .eq("product_id", id)
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  const { data: upsells } = await supabase
    .from("upsells")
    .select("suggested:suggested_product_id(*)")
    .eq("trigger_product_id", id);

  const theme = (product.shops?.theme_config as any) || {};
  const primaryColorHsl = hexToHsl(theme.primaryColor || "#E6B800");
  const reviews = reviewsArr ?? [];

  // Auto-close logic (same behaviour as homepage)
  let isShopActuallyOpen: boolean = product.shops.is_open;
  if (product.shops.auto_close) {
    const now = new Date();
    const indiaTime = now.toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour12: false,
    });
    const currentHM = indiaTime.slice(0, 5);

    const opening = (product.shops.opening_time || "09:00:00").slice(0, 5);
    const closing = (product.shops.closing_time || "21:00:00").slice(0, 5);

    if (currentHM < opening || currentHM > closing) {
      isShopActuallyOpen = false;
    }
  }

  const avgRating =
    reviews && reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
        ).toFixed(1)
      : null;

  return (
    <div
      className="min-h-screen bg-white pb-20"
      style={{ "--primary": primaryColorHsl } as CSSProperties}
    >
      <ShopHeader shop={product.shops} isOpen={isShopActuallyOpen} />

      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 space-y-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href={`/${slug}`} className="hover:text-primary">
            Home
          </Link>
          <span>/</span>
          <Link href={`/${slug}?q=`} className="hover:text-primary">
            Shop
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-medium truncate">
            {product.name}
          </span>
        </div>

        {/* Main layout */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
          {/* LEFT: Zoom + lightbox gallery */}
          <ProductGallery
            name={product.name}
            mainImage={product.image_url}
            gallery={product.gallery_images || []}
          />

          {/* RIGHT: Product info + trust badges */}
          <div>
            {/* Rating summary */}
            {avgRating && (
              <div className="flex items-center gap-1 mb-2 text-primary font-semibold">
                <Star className="w-4 h-4 fill-primary" />
                <span>{avgRating}</span>
                <span className="text-xs text-slate-500">
                  ({reviews?.length} review{reviews.length > 1 ? "s" : ""})
                </span>
              </div>
            )}

            <ProductView product={product} isShopOpen={isShopActuallyOpen} />

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-4 text-sm mt-10 pt-6 border-t border-slate-200 text-slate-600">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-primary" /> Fast Delivery
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-primary" /> Easy Returns
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" /> Secure Payments
              </div>
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-primary" /> Support on
                WhatsApp
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Info className="w-4 h-4 text-primary" />
            Description
          </h2>
          <p className="text-sm text-slate-600 whitespace-pre-wrap">
            {product.description || "More product details coming soon."}
          </p>
        </section>

        {/* Upsells */}
        {upsells && upsells.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">You may also like</h2>
              <Link
                href={`/${slug}?q=`}
                className="text-sm text-primary hover:underline"
              >
                Browse all products →
              </Link>
            </div>

            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {upsells.map((u: any) =>
                u.suggested ? (
                  <div className="min-w-[180px]" key={u.suggested.id}>
                    <Link href={`/${slug}/p/${u.suggested.id}`}>
                      <ProductCard
                        product={u.suggested}
                        isShopOpen={isShopActuallyOpen}
                      />
                    </Link>
                  </div>
                ) : null
              )}
            </div>
          </section>
        )}

        {/* Reviews */}
        <section className="space-y-6">
          <h2 className="font-bold text-xl">Customer Reviews</h2>

          {reviews && reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((r: any) => (
                <div
                  key={r.id}
                  className="rounded-xl border border-slate-200 p-4 space-y-2"
                >
                  <div className="flex items-center gap-1 text-yellow-500 text-sm">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-500 text-yellow-500"
                      />
                    ))}
                  </div>
                  <p className="font-medium text-slate-900">
                    {r.customer_name}
                  </p>
                  <p className="text-sm text-slate-600">{r.comment}</p>
                  {r.reply && (
                    <p className="text-xs text-primary">
                      Shop reply: {r.reply}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-sm">No reviews yet.</p>
          )}

          <ReviewForm shopId={product.shop_id} productId={product.id} />
        </section>
      </div>

      <ViewTracker shopId={product.shop_id} productId={product.id} />
      <ShopFooter shop={product.shops} />
    </div>
  );
}
