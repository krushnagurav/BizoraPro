// src/components/admin/shops/shops-table-toolbar.tsx
/*  * Shops Table Toolbar Component
 * This component provides
 * a toolbar for the shops
 * table in the admin
 * dashboard, allowing admins
 * to search and filter shops
 * by status and plan.
 */
"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function ShopsTableToolbar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "all");
  const [plan, setPlan] = useState(searchParams.get("plan") || "all");

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (query) params.set("q", query);
    else params.delete("q");

    if (status !== "all") params.set("status", status);
    else params.delete("status");

    if (plan !== "all") params.set("plan", plan);
    else params.delete("plan");

    params.set("page", "1");

    const timer = setTimeout(() => {
      router.push(`/admin/shops?${params.toString()}`);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, status, plan, router, searchParams]);

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search shops, owners, or emails..."
          className="pl-9 bg-[#111] border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-primary/50"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex gap-2">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[140px] bg-[#111] border-white/10 text-white">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-[#111] border-white/10 text-white">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>

        <Select value={plan} onValueChange={setPlan}>
          <SelectTrigger className="w-[140px] bg-[#111] border-white/10 text-white">
            <SelectValue placeholder="Plan" />
          </SelectTrigger>
          <SelectContent className="bg-[#111] border-white/10 text-white">
            <SelectItem value="all">All Plans</SelectItem>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="pro">Pro</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
