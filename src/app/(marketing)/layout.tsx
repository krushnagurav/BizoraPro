// src/app/(marketing)/layout.tsx
import { ReactNode } from "react";
import { SiteFooter } from "@/src/components/marketing/site-footer";
import { SiteHeader } from "@/src/components/marketing/site-header";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black via-slate-950 to-black text-slate-50">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:bg-emerald-500 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-black"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main-content" role="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}