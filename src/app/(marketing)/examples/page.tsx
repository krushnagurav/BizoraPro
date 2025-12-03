// src/app/(marketing)/examples/page.tsx
import type { Metadata } from "next";
import { ExamplesClient } from "./examples-client";

export const metadata: Metadata = {
  title: "BizoraPro Examples – Ready-made WhatsApp Shop Designs",
  description:
    "See how boutiques, salons, bakeries and more use BizoraPro. Explore WhatsApp-first, mobile-ready storefront layouts for different business types.",
};

export default function ExamplesPage() {
  return <ExamplesClient />;
}