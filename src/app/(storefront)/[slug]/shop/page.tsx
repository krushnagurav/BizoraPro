// src/app/(storefront)/[slug]/shop/page.tsx
/* Shop Products Page
 * This page displays all products for a specific shop identified by its slug.
 * It includes search and category filtering functionalities, allowing users
 * to easily find products within the shop's catalog. The page layout and
 * styling adapt based on the shop's theme configuration.
 */
import type { CSSProperties } from "react";
import { createClient } from "@/src/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";

import { ShopHeader } from "@/src/components/storefront/shared/shop-header";
import { ShopFooter } from "@/src/components/storefront/shared/shop-footer";
import { ProductCard } from "@/src/components/storefront/product-card";
import { CartBar } from "@/src/components/storefront/cart-bar";
import {
  ShopSearch,
  CategoryFilter,
} from "@/src/components/storefront/search-filter";
import { ViewTracker } from "@/src/components/storefront/view-tracker";

import { hexToHsl } from "@/src/lib/utils";
import { fontMapper } from "@/src/lib/fonts";
import type { ThemeConfig } from "@/src/types/custom";

export default async function ShopPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { q?: string; cat?: string };
}) {
  const { slug } = await params;
  const { q: searchQuery, cat: categoryId } = (await searchParams) ?? {};

  const supabase = await createClient();

  const { data: shop } = await supabase
    .from("shops")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!shop) return notFound();

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, image_url")
    .eq("shop_id", shop.id);

  let productQuery = supabase
    .from("products")
    .select("*, categories(name)")
    .eq("shop_id", shop.id)
    .eq("status", "active")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (searchQuery) {
    productQuery = productQuery.ilike("name", `%${searchQuery}%`);
  }

  if (categoryId) {
    productQuery = productQuery.eq("category_id", categoryId);
  }

  const { data: products } = await productQuery;

  const theme = shop.theme_config as unknown as ThemeConfig;
  const primaryColor = theme.primaryColor || "#E6B800";
  const primaryColorHsl = hexToHsl(primaryColor);
  const fontKey = theme.font || "inter";
  const fontClass = fontMapper[fontKey as keyof typeof fontMapper];
  const radius = theme.radius || "0.5rem";

  let isShopActuallyOpen = shop.is_open;
  if (shop.auto_close) {
    const now = new Date();
    const indiaTime = now.toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour12: false,
    });
    const currentHM = indiaTime.slice(0, 5);
    if (
      currentHM < (shop.opening_time || "09:00") ||
      currentHM > (shop.closing_time || "21:00")
    ) {
      isShopActuallyOpen = false;
    }
  }

  return (
    <div
      className={`min-h-screen bg-[#F8F9FA] text-slate-900 ${fontClass}`}
      style={
        {
          "--primary": primaryColorHsl,
          "--radius": radius,
        } as CSSProperties
      }
    >
      <ShopHeader shop={shop} />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">All Products</h1>
            <p className="text-sm text-slate-500">
              Browse the full catalog and filter by category.
            </p>
          </div>
          <Link
            href={`/${slug}`}
            className="hidden text-sm font-medium text-[hsl(var(--primary))] md:inline-block"
          >
            ← Back to Home
          </Link>
        </div>

        <section className="space-y-4">
          <div className="p-1 bg-white border border-slate-200 rounded-xl shadow-sm">
            <ShopSearch slug={slug} />
          </div>
          <CategoryFilter categories={categories || []} slug={slug} />
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-slate-500">
              {products?.length ?? 0} items
            </span>
          </div>

          {products && products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <Link href={`/${slug}/p/${product.id}`} key={product.id}>
                  <ProductCard
                    product={product}
                    isShopOpen={isShopActuallyOpen}
                    slug={slug}
                  />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-slate-400">
              No products match your filters.
            </div>
          )}
        </section>
      </main>

      <ShopFooter shop={shop} />
      <CartBar slug={slug} />

      {products?.map((p) => (
        <ViewTracker key={p.id} shopId={shop.id} productId={p.id} />
      ))}
    </div>
  );
}
