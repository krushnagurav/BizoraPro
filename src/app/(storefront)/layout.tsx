// src/app/(storefront)/layout.tsx
/*
 * Storefront Layout
 * This layout component is used for storefront-related pages.
 * It provides a consistent structure and styling for all storefront pages.
 */
import type { ReactNode } from "react";

export default function StorefrontLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      <main className="flex-1">{children}</main>
    </div>
  );
}
