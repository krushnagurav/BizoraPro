// src\components\storefront\view-tracker.tsx
"use client";

import { useEffect } from "react";
import { trackEventAction } from "@/src/actions/analytics-actions";

export function ViewTracker({
  shopId,
  productId,
}: {
  shopId: string;
  productId: string;
}) {
  useEffect(() => {
    // Fire and forget - don&apos;t block UI
    trackEventAction(shopId, "view_product", { productId });
  }, [shopId, productId]);

  return null; // Invisible
}
