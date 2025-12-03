// src/components/storefront/sections/featured-products.tsx
"use client";

import Link from "next/link";
import { ProductCard } from "@/src/components/storefront/product-card";

export function FeaturedProducts({
  slug,
  products,
  isShopOpen,
}: {
  slug: string;
  products: any[];
  isShopOpen: boolean;
}) {
  if (!products || products.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Featured Collection</h2>
        <Link
          href={`/${slug}/shop`}
          className="text-sm font-semibold text-[hsl(var(--primary))]"
        >
          Browse all →
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <Link href={`/${slug}/p/${product.id}`} key={product.id}>
            <ProductCard product={product} isShopOpen={isShopOpen} />
          </Link>
        ))}
      </div>
    </section>
  );
}
