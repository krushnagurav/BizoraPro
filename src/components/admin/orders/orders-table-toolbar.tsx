// src/components/admin/orders/orders-table-toolbar.tsx
/*  * Orders Table Toolbar Component
 * This component provides
 * a toolbar for the orders
 * table in the admin
 * dashboard, allowing admins
 * to search and filter orders
 * by status.
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

export function OrdersTableToolbar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(() => searchParams.get("q") || "");
  const [status, setStatus] = useState(
    () => searchParams.get("status") || "all",
  );

  useEffect(() => {
    const currentParams = new URLSearchParams(searchParams.toString());
    const nextParams = new URLSearchParams(searchParams.toString());

    if (query) nextParams.set("q", query);
    else nextParams.delete("q");

    if (status !== "all") nextParams.set("status", status);
    else nextParams.delete("status");

    nextParams.set("page", "1");

    const current = currentParams.toString();
    const next = nextParams.toString();

    if (current === next) return;

    const timer = setTimeout(() => {
      router.push(`/admin/orders?${next}`);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, status, router]);

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search Order ID, Customer Name or Phone..."
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

      <div className="w-full md:w-[200px]">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="bg-[#111] border-white/10 text-white">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent className="bg-[#111] border-white/10 text-white">
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="placed">Placed (New)</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
