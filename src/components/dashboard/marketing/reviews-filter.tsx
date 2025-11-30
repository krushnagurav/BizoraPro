"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ReviewsFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilter = (key: string, val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val === 'all') params.delete(key);
    else params.set(key, val);
    router.push(`/marketing/reviews?${params.toString()}`);
  };

  return (
    <div className="flex gap-2">
       <Select defaultValue={searchParams.get("status") || "all"} onValueChange={(v) => handleFilter("status", v)}>
          <SelectTrigger className="w-[120px] bg-card"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
             <SelectItem value="all">All Status</SelectItem>
             <SelectItem value="pending">Pending</SelectItem>
             <SelectItem value="approved">Live</SelectItem>
          </SelectContent>
       </Select>
       <Select defaultValue={searchParams.get("stars") || "all"} onValueChange={(v) => handleFilter("stars", v)}>
          <SelectTrigger className="w-[120px] bg-card"><SelectValue placeholder="Rating" /></SelectTrigger>
          <SelectContent>
             <SelectItem value="all">All Ratings</SelectItem>
             <SelectItem value="5">5 Stars</SelectItem>
             <SelectItem value="4">4 Stars</SelectItem>
             <SelectItem value="3">3 Stars</SelectItem>
             <SelectItem value="2">2 Stars</SelectItem>
             <SelectItem value="1">1 Star</SelectItem>
          </SelectContent>
       </Select>
    </div>
  );
}