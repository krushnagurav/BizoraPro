// src/app/(storefront)/[slug]/search/page.tsx
import type { CSSProperties } from "react";
import { createClient } from "@/src/lib/supabase/server";
import { ShopHeader } from "@/src/components/storefront/shared/shop-header";
import { ShopFooter } from "@/src/components/storefront/shared/shop-footer";
import { FilterSidebar } from "@/src/components/storefront/filter-sidebar";
import { ProductCard } from "@/src/components/storefront/product-card";
import { ShopSearch } from "@/src/components/storefront/search-filter";
import { hexToHsl } from "@/src/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { q?: string; min?: string; max?: string; stock?: string };
}) {
  const { slug } = await params;
  const { q, min, max } =await searchParams ?? {};
  const supabase = await createClient();

  // 1. Fetch Shop
  const { data: shop } = await supabase
    .from("shops")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!shop) return notFound();

  // 2. Build Query
  let query = supabase
    .from("products")
    .select("*")
    .eq("shop_id", shop.id)
    .eq("status", "active")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  // Apply Filters
  if (q) query = query.ilike("name", `%${q}%`);
  if (min) query = query.gte("price", Number(min));
  if (max) query = query.lte("price", Number(max));
  // stock filter can be added when inventory is implemented

  const { data: products } = await query;

  // Theme
  const theme = (shop.theme_config as any) || {};
  const primaryColorHsl = hexToHsl(theme.primaryColor || "#E6B800");

  // Auto-Close Check
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
      className="min-h-screen bg-[#F8F9FA]"
      style={{ "--primary": primaryColorHsl } as CSSProperties}
    >
      <ShopHeader shop={shop} />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">
            {products?.length ?? 0} results found{" "}
            {q && (
              <span className="text-slate-500">
                for <span className="font-semibold">{q}</span>
              </span>
            )}
          </h1>
          <div className="max-w-md">
            <ShopSearch slug={slug} />
          </div>
        </div>

        <div className="flex gap-8 items-start">
          {/* Sidebar Filters */}
          <FilterSidebar slug={slug} />

          {/* Results Grid */}
          <div className="flex-1">
            {products && products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {products.map((product) => (
                  <Link
                    href={`/${slug}/p/${product.id}`}
                    key={product.id}
                  >
                    <ProductCard
                      product={product}
                      isShopOpen={isShopActuallyOpen}
                    />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <p className="text-slate-400 text-lg">
                  No products found matching your criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <ShopFooter shop={shop} />
    </div>
  );
}