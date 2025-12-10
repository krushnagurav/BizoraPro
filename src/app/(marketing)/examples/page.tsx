// src/app/(marketing)/examples/page.tsx
/*
 * Examples Page
 *
 * This page showcases ready-made WhatsApp shop designs for various business types.
 * It provides examples of how different shops can utilize BizoraPro to create
 * mobile-friendly storefronts.
 */
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
