// src/app/(storefront)/[slug]/p/[id]/page.tsx
import { createClient } from "@/src/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShopHeader } from "@/src/components/storefront/shared/shop-header";
import { ShopFooter } from "@/src/components/storefront/shared/shop-footer";
import { ProductView } from "@/src/components/storefront/product-view";
import { ProductCard } from "@/src/components/storefront/product-card";
import { ViewTracker } from "@/src/components/storefront/view-tracker";
import { hexToHsl } from "@/src/lib/utils";
import { Truck, RotateCcw, ShieldCheck, Headphones } from "lucide-react";

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

  const { data: upsells } = await supabase
    .from("upsells")
    .select("suggested:suggested_product_id(*)")
    .eq("trigger_product_id", id);

  const theme = (product.shops.theme_config as any) || {};
  const primaryColorHsl = hexToHsl(theme.primaryColor || "#E6B800");

  return (
    <div
      className="min-h-screen bg-white pb-20"
      style={{ "--primary": primaryColorHsl } as any}
    >
      <ShopHeader shop={product.shops} />
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href={`/${slug}`} className="hover:text-primary">
            Home
          </Link>{" "}
          / <span className="text-slate-900 font-medium">{product.name}</span>
        </div>
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
          <div className="space-y-4">
            <div className="aspect-square relative bg-slate-100 rounded-2xl overflow-hidden border border-slate-200">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400">
                  No Image
                </div>
              )}
            </div>
            {/* Gallery would go here */}
          </div>
          <div>
            <ProductView product={product} isShopOpen={product.shops.is_open} />
            <div className="grid grid-cols-2 gap-4 text-sm mt-8 pt-8 border-t border-slate-100 text-slate-500">
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
                <Headphones className="w-4 h-4 text-primary" /> 24/7 Support
              </div>
            </div>
            <div className="mt-8 prose prose-slate text-sm text-slate-600">
              <h3 className="text-slate-900 font-bold mb-2">Description</h3>
              <p className="whitespace-pre-wrap">
                {product.description || "No details available."}
              </p>
            </div>
          </div>
        </div>
        {upsells && upsells.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-bold mb-8">You might also like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {upsells.map((u: any) => (
                <ProductCard
                  key={u.suggested.id}
                  product={u.suggested}
                  isShopOpen={product.shops.is_open}
                  slug={slug}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <ViewTracker shopId={product.shop_id} productId={product.id} />
      <ShopFooter shop={product.shops} />
    </div>
  );
}
