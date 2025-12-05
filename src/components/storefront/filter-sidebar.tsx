// src\components\storefront\filter-sidebar.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Slider } from "@/components/ui/slider"; // Ensure shadcn slider is installed: npx shadcn@latest add slider
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

export function FilterSidebar({ slug }: { slug: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [inStock, setInStock] = useState(searchParams.get("stock") === "true");
  const [rating, setRating] = useState<number | null>(null);

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("min", priceRange[0].toString());
    params.set("max", priceRange[1].toString());
    if (inStock) params.set("stock", "true");
    else params.delete("stock");
    if (rating) params.set("rating", rating.toString());
    else params.delete("rating");

    router.push(`/${slug}/search?${params.toString()}`);
  };

  return (
    <div className="w-64 shrink-0 space-y-8 hidden lg:block">
      {/* Price Range */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-900">Price Range</h3>
        <Slider
          defaultValue={[0, 10000]}
          max={10000}
          step={100}
          value={priceRange}
          onValueChange={setPriceRange}
          className="py-4"
        />
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>₹{priceRange[0]}</span>
          <span>₹{priceRange[1]}+</span>
        </div>
      </div>

      {/* Availability */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-900">Availability</h3>
        <div className="flex items-center gap-2">
          <Checkbox
            id="stock"
            checked={inStock}
            onCheckedChange={(c) => setInStock(!!c)}
          />
          <Label
            htmlFor="stock"
            className="text-slate-600 font-normal cursor-pointer"
          >
            In Stock Only
          </Label>
        </div>
      </div>

      {/* Rating */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-900">Rating</h3>
        {[5, 4, 3].map((stars) => (
          <div
            key={stars}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setRating(stars)}
          >
            <Checkbox
              checked={rating === stars}
              onCheckedChange={() => setRating(stars)}
              id={`r-${stars}`}
            />
            <label
              htmlFor={`r-${stars}`}
              className="flex items-center gap-1 cursor-pointer text-sm text-slate-600"
            >
              <div className="flex text-yellow-400">
                {Array.from({ length: stars }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-current" />
                ))}
              </div>
              <span>& Up</span>
            </label>
          </div>
        ))}
      </div>

      <Button
        onClick={applyFilters}
        className="w-full font-bold bg-slate-900 text-white"
      >
        Apply Filters
      </Button>
    </div>
  );
}
