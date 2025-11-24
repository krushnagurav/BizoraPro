import { CartBar } from "@/src/components/storefront/cart-bar";
import { ProductCard } from "@/src/components/storefront/product-card";
import { createClient } from "@/src/lib/supabase/server";
import { ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { hexToHsl } from "@/src/lib/utils";

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
      {!shop.is_open && (
        <div className="bg-red-600 text-white text-center p-3 font-bold sticky top-0 z-50 shadow-md">
          ⛔ This shop is currently closed. We are not accepting orders.
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
    </div>
  );
}