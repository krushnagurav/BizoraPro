// src/app/(storefront)/[slug]/page.tsx
import type { CSSProperties } from "react";
import { createClient } from "@/src/lib/supabase/server";
import { notFound } from "next/navigation";
import { Metadata } from "next";

import { ShopHeader } from "@/src/components/storefront/shared/shop-header";
import { ShopFooter } from "@/src/components/storefront/shared/shop-footer";
import { CartBar } from "@/src/components/storefront/cart-bar";
import { NewsletterForm } from "@/src/components/storefront/newsletter-form";
import { HeroBanner } from "@/src/components/storefront/sections/hero-banner";
import { CategoryCard } from "@/src/components/storefront/category-card";
import { FeaturedProducts } from "@/src/components/storefront/sections/featured-products";

import { hexToHsl } from "@/src/lib/utils";
import { fontMapper } from "@/src/lib/fonts";
import type { ThemeConfig } from "@/src/types/custom";
import Link from "next/link";

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
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
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

  const { data: featuredProducts } = await supabase
    .from("products")
    .select("*")
    .eq("shop_id", shop.id)
    .eq("status", "active")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(6);

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
      <ShopHeader shop={shop} isOpen={isShopActuallyOpen} />

      <HeroBanner shop={shop} />

      <main className="container mx-auto px-4 py-10 space-y-12">
        {/* Categories */}
        {categories && categories.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Shop by Category</h2>
              <Link
                href={`/${slug}/shop`}
                className="text-sm font-semibold text-[hsl(var(--primary))]"
              >
                View all products →
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <CategoryCard key={cat.id} category={cat} slug={slug} />
              ))}
            </div>
          </section>
        )}

        {/* Featured products */}
        <FeaturedProducts
          slug={slug}
          products={featuredProducts || []}
          isShopOpen={isShopActuallyOpen}
        />

        {/* WhatsApp CTA strip */}
        {shop.whatsapp_number && (
          <section className="bg-[hsl(var(--primary))]/10 border border-[hsl(var(--primary))]/25 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left space-y-1">
              <p className="text-sm font-medium text-slate-700">
                Prefer WhatsApp?
              </p>
              <p className="text-lg font-bold text-slate-800">
                Order directly on WhatsApp in one tap
              </p>
              <p className="text-sm text-slate-600">
                Faster checkout than cart — no app download needed.
              </p>
            </div>
            <Link
              href={`https://wa.me/${shop.whatsapp_number.replace(
                /\D/g,
                "",
              )}?text=${encodeURIComponent(
                `Hi! I want to order from ${shop.name}.`,
              )}`}
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[hsl(var(--primary))] text-black font-semibold text-sm shadow-sm hover:bg-[hsl(var(--primary))]/90 transition"
            >
              Chat on WhatsApp
            </Link>
          </section>
        )}

        <section className="mt-16">
          <NewsletterForm shopId={shop.id} />
        </section>
      </main>

      <ShopFooter shop={shop} />
      <CartBar slug={slug} />

      {!isShopActuallyOpen && (
        <div className="fixed bottom-16 left-0 right-0 bg-red-600 text-white text-center p-3 font-bold z-50 shadow-lg">
          ⛔ Shop is currently closed
        </div>
      )}
    </div>
  );
}
