// src/app/(storefront)/[slug]/page.tsx
import type { CSSProperties } from "react";
import { createClient } from "@/src/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShopHeader } from "@/src/components/storefront/shared/shop-header";
import { ShopFooter } from "@/src/components/storefront/shared/shop-footer";
import { ProductCard } from "@/src/components/storefront/product-card";
import { NewsletterForm } from "@/src/components/storefront/newsletter-form";
import { Button } from "@/components/ui/button";
import { hexToHsl } from "@/src/lib/utils";
import { ThemeConfig } from "@/src/types/custom";
import { ArrowRight, Instagram, Store } from "lucide-react";

export default async function ShopHomePage({ params, searchParams }: any) {
  const { slug } = await params;
  const { cat: categoryId } = (await searchParams) ?? {};

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

  if (categoryId) productQuery = productQuery.eq("category_id", categoryId);

  const { data: allProducts } = await productQuery;

  // Limit to 4 products for Featured section
  const featuredProducts = allProducts?.slice(0, 4) || [];

  const theme = shop.theme_config as unknown as ThemeConfig;
  const primaryColorHsl = hexToHsl(theme.primaryColor || "#E6B800");
  const banner = theme.bannerUrl || "";
  console.log("shop: ", shop);
  // Auto-Close Logic
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
      className="min-h-screen bg-[#F8F9FA] text-slate-900 pb-20"
      style={{ "--primary": primaryColorHsl } as CSSProperties}
    >
      {/* ⛔ STORE CLOSED BANNER (Moved to Top) */}
      {!isShopActuallyOpen && (
        <div className="bg-red-600 text-white text-center py-2 px-4 text-sm font-bold sticky top-0 z-[60]">
          Store is currently closed. You can browse, but orders will be
          processed when we open.
        </div>
      )}

      <ShopHeader shop={shop} />

      {/* 1. HERO BANNER */}
      <div className="relative w-full h-56 md:h-96 bg-slate-900 overflow-hidden">
        {banner ? (
          <Image
            src={banner}
            alt="Banner"
            fill
            className="object-cover opacity-90"
            priority
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center bg-gradient-to-r from-slate-900 to-slate-800">
            <h1 className="text-4xl md:text-6xl font-bold mb-2">{shop.name}</h1>
            <p className="text-white/80 text-sm md:text-lg">
              Welcome to our official online store.
            </p>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-16">
        {/* 2. CATEGORIES */}
        <div>
          <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
            <Link href={`/${slug}`}>
              <Button
                variant={!categoryId ? "default" : "outline"}
                className={`rounded-full px-6 ${!categoryId ? "bg-primary text-black hover:bg-primary/90" : "border-slate-200 hover:border-primary hover:text-primary"}`}
              >
                All
              </Button>
            </Link>
            {categories?.map((cat) => (
              <Link key={cat.id} href={`/${slug}?cat=${cat.id}`}>
                <Button
                  variant={
                    categoryId === String(cat.id) ? "default" : "outline"
                  }
                  className={`rounded-full px-6 ${categoryId === String(cat.id) ? "bg-primary text-black hover:bg-primary/90" : "border-slate-200 hover:border-primary hover:text-primary"}`}
                >
                  {cat.name}
                </Button>
              </Link>
            ))}
          </div>
        </div>

        {/* 3. FEATURED COLLECTION (Max 4) */}
        <div>
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              {categoryId ? "Category Results" : "Featured Collection"}
            </h2>
            <Link href={`/${slug}/search`}>
              <Button variant="link" className="text-primary font-bold gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
              {featuredProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  isShopOpen={isShopActuallyOpen}
                  slug={slug}
                />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center text-slate-400 bg-white rounded-2xl border border-slate-100">
              <Store className="w-12 h-12 mx-auto mb-3 opacity-20" />
              No products found.
            </div>
          )}

          {/* View More Button (Mobile Only) */}
          <div className="mt-6 md:hidden">
            <Link href={`/${slug}/search`}>
              <Button className="w-full bg-white border border-slate-200 text-slate-900 hover:bg-slate-50">
                View All Products
              </Button>
            </Link>
          </div>
        </div>

        {/* 4. INSTAGRAM FEED (If setup) */}
        {shop.instagram_feed && shop.instagram_feed.length > 0 && (
          <div>
            <div className="flex items-center justify-center gap-2 mb-8">
              <Instagram className="w-6 h-6 text-pink-600" />
              <h2 className="text-2xl font-bold">Follow Us on Instagram</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
              {shop.instagram_feed.map((url: string, i: number) => (
                <div
                  key={i}
                  className="aspect-square relative bg-slate-100 overflow-hidden rounded-lg hover:opacity-90 transition cursor-pointer group"
                >
                  <Image
                    src={url}
                    fill
                    className="object-cover group-hover:scale-110 transition duration-500"
                    alt="Instagram Post"
                    unoptimized
                  />
                </div>
              ))}
            </div>
            {shop.social_links?.instagram && (
              <div className="text-center mt-6">
                <a href={shop.social_links.instagram} target="_blank">
                  <Button
                    variant="outline"
                    className="rounded-full px-8 border-pink-200 text-pink-600 hover:bg-pink-50"
                  >
                    View Profile
                  </Button>
                </a>
              </div>
            )}
          </div>
        )}

        {/* 5. EXCLUSIVE OFFERS (Improved UI) */}
        <div className="relative overflow-hidden bg-slate-900 rounded-3xl p-8 md:p-16 text-center">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-500 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10 max-w-xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Join the Club
            </h2>
            <p className="text-slate-300 mb-8 text-lg">
              Get exclusive discounts, early access to new drops, and special
              offers directly on WhatsApp.
            </p>
            <div className="bg-white p-2 rounded-xl shadow-xl">
              <NewsletterForm shopId={shop.id} />
            </div>
          </div>
        </div>
      </div>

      <ShopFooter shop={shop} />
    </div>
  );
}
