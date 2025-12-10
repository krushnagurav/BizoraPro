// src/components/admin/support/support-toolbar.tsx
/*  * Support Toolbar Component
 * This component provides
 * a toolbar for the support
 * section in the admin
 * dashboard, allowing admins
 * to filter and search
 * support tickets by status,
 * priority, and keywords.
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

export function SupportToolbar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "all");
  const [priority, setPriority] = useState(
    searchParams.get("priority") || "all",
  );

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (query) params.set("q", query);
    else params.delete("q");
    if (status !== "all") params.set("status", status);
    else params.delete("status");
    if (priority !== "all") params.set("priority", priority);
    else params.delete("priority");

    params.set("page", "1");

    const timer = setTimeout(() => {
      router.push(`/admin/support?${params.toString()}`);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, status, priority, router, searchParams]);

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search Ticket ID or Subject..."
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

      <div className="flex gap-2 w-full md:w-auto">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[140px] bg-[#111] border-white/10 text-white">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-[#111] border-white/10 text-white">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger className="w-[140px] bg-[#111] border-white/10 text-white">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent className="bg-[#111] border-white/10 text-white">
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
