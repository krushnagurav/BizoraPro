"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ProductFilters({ categories }: { categories: any[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.set("page", "1"); // Reset to page 1 on filter change
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="flex gap-2">
      {/* Status Filter */}
      <Select
        defaultValue={searchParams.get("status") || "all"}
        onValueChange={(val) => handleFilterChange("status", val)}
      >
        <SelectTrigger className="w-[130px] bg-card">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="draft">Draft</SelectItem>
          <SelectItem value="archived">Archived</SelectItem>
        </SelectContent>
      </Select>

      {/* Category Filter */}
      <Select
        defaultValue={searchParams.get("category") || "all"}
        onValueChange={(val) => handleFilterChange("category", val)}
      >
        <SelectTrigger className="w-[150px] bg-card">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
