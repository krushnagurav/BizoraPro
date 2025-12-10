// src/components/admin/payments/payment-toolbar.tsx
/*  * Payment Toolbar Component
 * This component provides
 * a toolbar for the payments
 * section in the admin
 * dashboard, allowing admins
 * to filter and search
 * payment transactions by
 * status and keywords.
 */
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function PaymentToolbar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "all");

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (query) params.set("q", query);
    else params.delete("q");
    if (status !== "all") params.set("status", status);
    else params.delete("status");

    params.set("page", "1");

    const timer = setTimeout(() => {
      router.push(`/admin/payments?${params.toString()}`);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, status, router, searchParams]);

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search Transaction ID or Shop Name..."
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
          <SelectTrigger className="w-[160px] bg-[#111] border-white/10 text-white">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-[#111] border-white/10 text-white">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="succeeded">Succeeded</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          className="border-white/10 text-white hover:bg-white/10 gap-2"
        >
          <Calendar className="h-4 w-4" /> This Month
        </Button>
      </div>
    </div>
  );
}
