// src\components\storefront\search-filter.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

// Debounce Hook
function useDebounceValue(value: string, delay: 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export function ShopSearch({ slug }: { slug: string }) {
  const router = useRouter();
  const pathname = usePathname(); // <--- 1. Get current path (e.g. /diyara-cloth)
  const searchParams = useSearchParams();
  const [text, setText] = useState(searchParams.get("q") || "");
  const debouncedText = useDebounceValue(text, 500);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (debouncedText) {
      params.set("q", debouncedText);
    } else {
      params.delete("q");
    }

    // 2. Use pathname instead of manual slug construction
    // This prevents double slashes or wrong slug issues
    router.replace(`${pathname}?${params.toString()}`);
  }, [debouncedText, router, pathname, searchParams]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Search products..."
        className="pl-10 bg-secondary/20 border-transparent focus:border-primary rounded-xl h-12"
      />
      {text && (
        <button
          onClick={() => setText("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

// ... (Keep CategoryFilter as is) ...
export function CategoryFilter({
  categories,
  slug,
}: {
  categories: any[];
  slug: string;
}) {
  const router = useRouter();
  const pathname = usePathname(); // Use here too
  const searchParams = useSearchParams();
  const activeCat = searchParams.get("cat");

  const toggleCat = (catId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (activeCat === catId) {
      params.delete("cat");
    } else {
      params.set("cat", catId);
    }
    // Use replace to prevent history spam
    router.replace(`${pathname}?${params.toString()}`);
  };

  if (!categories || categories.length === 0) return null;

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
      <button
        onClick={() => toggleCat("")}
        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${
          !activeCat
            ? "bg-primary text-black border-primary"
            : "bg-background border-border text-muted-foreground"
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => toggleCat(cat.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${
            activeCat === cat.id
              ? "bg-primary text-black border-primary"
              : "bg-background border-border text-muted-foreground"
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
