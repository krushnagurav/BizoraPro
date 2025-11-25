import { CartBar } from "@/src/components/storefront/cart-bar";
import { ProductCard } from "@/src/components/storefront/product-card";
import { createClient } from "@/src/lib/supabase/server";
import { ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { hexToHsl } from "@/src/lib/utils";
import { Instagram, Facebook, Youtube, Twitter } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

// 1. Generate Dynamic Metadata
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: shop } = await supabase
    .from("shops")
    .select("name, theme_config, seo_config") // Fetch SEO config
    .eq("slug", slug)
    .single();

  if (!shop) return { title: "Shop Not Found" };

  const seo = shop.seo_config as any || {};
  const theme = shop.theme_config as any || {};

  return {
    title: seo.metaTitle || shop.name,
    description: seo.metaDescription || `Welcome to ${shop.name}`,
    openGraph: {
      images: [theme.bannerUrl || "/default-og.png"], // Use Banner as social image
    },
  };
}

export default async function ShopHomePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // 1. Await Params (Next.js 15)
  const { slug } = await params;
  const supabase = await createClient();

  // 2. Fetch Shop
  const { data: shop } = await supabase
    .from("shops")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!shop) return notFound();

  let isShopActuallyOpen = shop.is_open;

  if (shop.auto_close) {
    const now = new Date();
    // Convert current server time to HH:MM format for comparison
    // Note: Vercel servers are UTC. We need to adjust for India (UTC+5:30)
    // Simple hack: Get string time in 'en-IN' locale
    const indiaTime = now.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false });
    const currentHM = indiaTime.slice(0, 5); // "14:30"

    const openHM = shop.opening_time?.slice(0, 5) || "09:00";
    const closeHM = shop.closing_time?.slice(0, 5) || "21:00";

    if (currentHM < openHM || currentHM > closeHM) {
      isShopActuallyOpen = false;
    }
  }

  const social = shop.social_links || {};

  // 3. Fetch Active Products
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("shop_id", shop.id)
    .eq("status", "active")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  const theme = (shop.theme_config as any) || {};
  const banner = theme.bannerUrl || "";
  const primaryColorHex = theme.primaryColor || "#E6B800";
  const primaryColorHsl = hexToHsl(primaryColorHex);

  return (
    <div
      className="max-w-md mx-auto bg-background min-h-screen border-x border-border/30 shadow-2xl shadow-black"
      style={{ "--primary": primaryColorHsl } as React.CSSProperties}
    >
      {!isShopActuallyOpen && (
        <div className="bg-red-600 text-white text-center p-3 font-bold sticky top-0 z-50 shadow-md">
          {shop.is_open 
             ? `⛔ Shop is closed. Opens at ${shop.opening_time}` 
             : "⛔ This shop is currently closed."}
        </div>
     )}

      {/* HEADER / BANNER */}
      <div className="relative h-48 bg-gradient-to-b from-secondary to-background overflow-hidden">
        {banner ? (
          <Image
            src={banner}
            alt="Shop Banner"
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <ShoppingCart className="w-24 h-24" />
          </div>
        )}
        {/* Placeholder for Banner Image */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <ShoppingCart className="w-24 h-24" />
        </div>

        {/* Shop Info Overlay */}
        <div className="absolute -bottom-8 left-4 right-4 flex items-end gap-4">
          <div className="w-20 h-20 rounded-xl bg-card border-2 border-primary shadow-lg overflow-hidden flex items-center justify-center">
            <span className="text-2xl font-bold text-primary">
              {shop.name.charAt(0)}
            </span>
          </div>
          <div className="mb-2">
            <h1 className="text-xl font-bold text-foreground">{shop.name}</h1>
            <p className="text-xs text-muted-foreground">@ {shop.slug}</p>
          </div>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="mt-12 px-4 space-y-6">
        {/* Intro / Trust Badge */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/30 p-2 rounded-lg">
          <Star className="w-4 h-4 text-primary fill-primary" />
          <span>Trusted Seller • Verified by BizoraPro</span>
        </div>

        {/* PRODUCTS GRID */}
        <h2 className="font-bold text-lg">All Products</h2>

        <div className="grid grid-cols-2 gap-4">
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Empty State */}
        {products?.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            <p>No products added yet.</p>
          </div>
        )}
      </div>
      <CartBar slug={slug} />
      {/* SOCIAL LINKS */}
        <div className="flex justify-center gap-6 py-8 mt-8 border-t border-border/50">
          {social.instagram && (
            <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition">
              <Instagram className="w-6 h-6" />
            </a>
          )}
          {social.facebook && (
            <a href={social.facebook} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition">
              <Facebook className="w-6 h-6" />
            </a>
          )}
          {social.youtube && (
            <a href={social.youtube} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition">
              <Youtube className="w-6 h-6" />
            </a>
          )}
          {social.twitter && (
            <a href={social.twitter} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition">
              <Twitter className="w-6 h-6" />
            </a>
          )}
        </div>
        {/* Footer Links */}
        <div className="text-center py-4">
           {/* Corrected String Interpolation with backticks */}
           <Link href={`/${slug}/legal`} className="text-xs text-muted-foreground hover:text-primary underline underline-offset-4">
             Store Policies
           </Link>
        </div>

        {/* Footer Branding */}
        <div className="text-center pb-8 text-xs text-muted-foreground">
           Powered by <span className="font-bold text-foreground">BizoraPro</span>
        </div>
    </div>
  );
}