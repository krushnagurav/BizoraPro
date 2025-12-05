// src/app/(storefront)/layout.tsx
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
