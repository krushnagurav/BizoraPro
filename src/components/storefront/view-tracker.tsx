// src\components\storefront\view-tracker.tsx
/*  * View Tracker Component
 * This component tracks when a product is viewed in the storefront.
 * It sends a "view_product" event to the analytics system with the
 * relevant shop and product identifiers.
 */
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
    trackEventAction(shopId, "view_product", { productId });
  }, [shopId, productId]);

  return null;
}
