/* eslint-disable react-hooks/set-state-in-effect */
// src/components/storefront/product-view.tsx
/*  * Product View Component
 * This component displays detailed information about a product
 * in the storefront, including name, price, variants, stock status,
 * and an "Add to Cart" button. It handles variant selection and
 * integrates with the shopping cart.
 */
"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/src/hooks/use-cart";
import { AlertCircle, Check, Heart, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function ProductView({
  product,
  isShopOpen,
}: {
  product: any;
  isShopOpen: boolean;
}) {
  const cart = useCart();
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [selectedSku, setSelectedSku] = useState<any>(null);

  useEffect(() => {
    if (product.variants?.length > 0) {
      const defaults: Record<string, string> = {};
      product.variants.forEach((v: any) => {
        if (v.values?.length > 0) defaults[v.name] = v.values[0];
      });
      setSelections(defaults);
    }
  }, [product]);

  useEffect(() => {
    if (!product.product_skus?.length) {
      setSelectedSku(null);
      return;
    }
    const match = product.product_skus.find((sku: any) => {
      return Object.entries(sku.attributes).every(
        ([key, val]) => selections[key] === val,
      );
    });
    setSelectedSku(match || null);
  }, [selections, product.product_skus]);

  const currentPrice = selectedSku ? selectedSku.price : product.price;
  const currentStock = selectedSku ? selectedSku.stock : product.stock_count;
  const isOutOfStock = currentStock <= 0;

  const handleAddToCart = () => {
    cart.addItem({
      id: selectedSku ? selectedSku.code : product.id,
      name: product.name,
      price: currentPrice,
      image_url: product.image_url,
      quantity: 1,
      shop_id: product.shop_id,
      variant: selectedSku
        ? Object.values(selectedSku.attributes).join(" / ")
        : "",
      maxStock: currentStock,
    });
    toast.success("Added to cart");
  };

  return (
    <div className="flex flex-col h-full">
      <span className="text-sm font-medium text-primary mb-2">
        {product.categories?.name || "Featured"}
      </span>
      <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
        {product.name}
      </h1>

      <div className="flex items-end gap-4 mb-6">
        <span className="text-4xl font-bold text-slate-900">
          ₹{currentPrice}
        </span>
        {product.sale_price && !selectedSku && (
          <span className="text-xl text-muted-foreground line-through mb-1">
            ₹{product.sale_price}
          </span>
        )}
      </div>

      {product.variants?.length > 0 && (
        <div className="space-y-6 mb-8 border-y border-slate-100 py-6">
          {product.variants.map((variant: any) => (
            <div key={variant.name} className="space-y-3">
              <span className="font-bold text-sm text-slate-900">
                {variant.name}:{" "}
                <span className="text-slate-500 font-normal">
                  {selections[variant.name]}
                </span>
              </span>
              <div className="flex flex-wrap gap-2">
                {variant.values.map((val: string) => (
                  <button
                    key={val}
                    onClick={() =>
                      setSelections({ ...selections, [variant.name]: val })
                    }
                    className={cn(
                      "px-4 py-2 rounded-lg border text-sm font-medium transition-all",
                      selections[variant.name] === val
                        ? "border-primary bg-primary/10 text-primary ring-1 ring-primary"
                        : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50",
                    )}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mb-6">
        {isOutOfStock ? (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 w-fit px-3 py-1.5 rounded-full text-sm font-bold">
            <AlertCircle className="w-4 h-4" /> Out of Stock
          </div>
        ) : (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 w-fit px-3 py-1.5 rounded-full text-sm font-bold">
            <Check className="w-4 h-4" /> In Stock{" "}
            {currentStock < 5 && (
              <span className="text-red-500 font-normal ml-1">
                ({currentStock} left!)
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-4 mb-8 mt-auto">
        <Button
          size="lg"
          className="flex-1 h-14 text-lg font-bold bg-[#E6B800] text-black hover:bg-[#FFD700] shadow-lg shadow-yellow-500/20"
          disabled={!isShopOpen || isOutOfStock}
          onClick={handleAddToCart}
        >
          {isShopOpen ? (
            isOutOfStock ? (
              "Sold Out"
            ) : (
              <>
                <ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart
              </>
            )
          ) : (
            "Shop Closed"
          )}
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-14 w-14 border-slate-200 text-slate-500 hover:text-red-500"
        >
          <Heart className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}
