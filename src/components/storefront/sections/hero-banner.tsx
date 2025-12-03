// src/components/storefront/sections/hero-banner.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

export function HeroBanner({ shop }: { shop: any }) {
  const theme = shop.theme_config || {};
  const banner: string | null = theme.bannerUrl || null;

  return (
    <section className="relative w-full h-56 md:h-72 bg-slate-200 overflow-hidden">
      {banner && (
        <Image
          src={banner}
          alt={shop.name}
          fill
          className="object-cover"
          unoptimized
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />

      <div className="relative h-full flex items-end">
        <div className="container mx-auto px-4 pb-6 flex flex-col gap-3">
          <div>
            <p className="inline-flex items-center gap-1 text-xs font-semibold text-yellow-300 mb-1">
              <Star className="w-3 h-3 fill-yellow-300 text-yellow-300" />
              Trusted Business
            </p>
            <h1 className="text-2xl md:text-4xl font-bold text-white drop-shadow">
              {shop.name}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/${shop.slug}/shop`}
              className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-white text-slate-900 text-sm font-semibold shadow-sm hover:bg-slate-100 transition"
            >
              View menu &amp; prices
            </Link>
            <p className="text-xs md:text-sm text-slate-100/80">
              Order in a few taps. No app download needed.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
