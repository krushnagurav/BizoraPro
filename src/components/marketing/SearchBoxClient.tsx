// src/components/marketing/SearchBoxClient.tsx
/*  * Search Box Client Component
 * This component provides a search input box for users to
 * search help articles. It handles user input and form
 * submission, redirecting to the specified action URL with
 * the search query as a parameter.
 */
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

export function SearchBoxClient({ action = "/docs" }: { action?: string }) {
  const [q, setQ] = useState("");
  const router = useRouter();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const url = `${action}?q=${encodeURIComponent(q)}`;
    router.push(url);
  };

  return (
    <div
      className="relative mx-auto max-w-2xl"
      role="search"
      aria-label="Search help articles"
    >
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
      />
      <form
        onSubmit={onSubmit}
        className="flex items-center"
        aria-label="Search help articles form"
      >
        <Input
          name="q"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          type="search"
          aria-label="Search help articles"
          placeholder='Search help articles (e.g. "create shop link")'
          className="h-12 rounded-xl border-white/10 bg-[#111] pl-12 text-sm focus:border-primary/50 md:h-14 md:text-base"
        />
        <button type="submit" className="sr-only">
          Search
        </button>
      </form>
    </div>
  );
}
