// src/app/(storefront)/layout.tsx
import type { ReactNode } from "react";

export default function StorefrontLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="pb-24">{children}</main>
    </div>
  );
}