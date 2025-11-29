// src/app/(storefront)/[slug]/page.tsx
import type { CSSProperties } from "react";
import { createClient } from "@/src/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShopHeader } from "@/src/components/storefront/shared/shop-header";
import { ShopFooter } from "@/src/components/storefront/shared/shop-footer";
import { ProductCard } from "@/src/components/storefront/product-card";
import { CartBar } from "@/src/components/storefront/cart-bar";
import { ViewTracker } from "@/src/components/storefront/view-tracker";
import { NewsletterForm } from "@/src/components/storefront/newsletter-form";
import { ShopSearch } from "@/src/components/storefront/search-filter";
import { Metadata } from "next";
import { Star, Store } from "lucide-react";
import { hexToHsl } from "@/src/lib/utils";
import { fontMapper } from "@/src/lib/fonts";
import { ThemeConfig } from "@/src/types/custom";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: shop } = await supabase
    .from("shops")
    .select("name, seo_config, theme_config")
    .eq("slug", slug)
    .single();

  if (!shop) return { title: "Shop Not Found" };

  const seo = (shop.seo_config as any) || {};

  return {
    title: seo.metaTitle || shop.name,
    description: seo.metaDescription || `Welcome to ${shop.name}`,
  };
}

export default async function ShopHomePage({
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
    .select("id, name")
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

  const banner = theme.bannerUrl || "";

  return (
    <div
      className={`min-h-screen bg-[#F8F9FA] text-slate-900 pb-20 ${fontClass}`}
      style={
        {
          "--primary": primaryColorHsl,
          "--radius": radius,
        } as CSSProperties
      }
    >
      {/* Header */}
      <ShopHeader shop={shop} />

      {/* Shop Banner */}
      <div className="relative w-full h-64 md:h-80 bg-slate-100 overflow-hidden shadow-sm">
        {banner ? (
          <Image
            src={banner}
            alt="Shop Banner"
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate-300">
            <Store className="w-16 h-16 opacity-50" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute bottom-0 left-0 right-0 p-6 container mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow-md">
            {shop.name}
          </h1>
          <div className="flex items-center gap-2 text-sm text-white/90 font-medium">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>Trusted Business</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Search & Filters */}
        <div className="space-y-4">
          <div className="p-1 bg-white border border-slate-200 rounded-xl shadow-sm">
            <ShopSearch slug={slug} />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            <Link href={`/${slug}`}>
              <button
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all border ${
                  !categoryId
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                }`}
              >
                All Products
              </button>
            </Link>
            {categories?.map((cat) => (
              <Link key={cat.id} href={`/${slug}?cat=${cat.id}`}>
                <button
                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap border ${
                    categoryId === String(cat.id)
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {cat.name}
                </button>
              </Link>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">
              {searchQuery
                ? `Results for "${searchQuery}"`
                : categoryId
                ? "Category Results"
                : "Featured Collection"}
            </h2>
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
                  />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-slate-400">
              <p>No products found in this collection.</p>
            </div>
          )}
        </div>

        {/* Newsletter */}
        <div className="mt-12">
          <NewsletterForm shopId={shop.id} />
        </div>
      </div>

      <ShopFooter shop={shop} />
      <CartBar slug={slug} />

      {products?.map((p) => (
        <ViewTracker key={p.id} shopId={shop.id} productId={p.id} />
      ))}

      {!isShopActuallyOpen && (
        <div className="fixed bottom-16 left-0 right-0 bg-red-600 text-white text-center p-3 font-bold z-50 shadow-lg">
          ⛔ Shop is currently closed
        </div>
      )}
    </div>
  );
}
