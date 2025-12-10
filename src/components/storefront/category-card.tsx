// src/components/storefront/category-card.tsx
/*  * Category Card Component
 * This component displays a category card in the storefront,
 * including category image and name. It links to the category's
 * product listing page.
 */
"use client";

import Link from "next/link";
import Image from "next/image";

type Category = {
  id: string;
  name: string;
  image_url?: string | null;
};

export function CategoryCard({
  category,
  slug,
}: {
  category: Category;
  slug: string;
}) {
  const initials = category.name?.[0] || "C";

  return (
    <Link href={`/${slug}/shop?cat=${category.id}`}>
      <div className="group rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer">
        <div className="relative h-28 md:h-32 bg-slate-100">
          {category.image_url ? (
            <Image
              src={category.image_url}
              alt={category.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              unoptimized
            />
          ) : (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-1
    bg-gradient-to-br from-primary/20 to-primary/40 text-primary"
            >
              <div className="w-8 h-8 rounded-md bg-white/30 flex items-center justify-center">
                <span className="text-sm font-bold">{initials}</span>
              </div>
              <span className="text-[10px] font-medium opacity-80">
                No Image
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/25 transition-colors" />
        </div>
        <div className="px-3 py-2">
          <p className="text-sm font-semibold text-slate-900 truncate">
            {category.name}
          </p>
          <p className="text-[11px] text-slate-500">Tap to explore</p>
        </div>
      </div>
    </Link>
  );
}
