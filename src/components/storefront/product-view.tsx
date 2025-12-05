"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart, Check, AlertCircle } from "lucide-react";
import { useCart } from "@/src/hooks/use-cart";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ProductViewProps {
  product: any; // Full product object with skus and variants
  isShopOpen: boolean;
}

export function ProductView({ product, isShopOpen }: ProductViewProps) {
  const cart = useCart();

  const [selections, setSelections] = useState<Record<string, string>>({});
  const [selectedSku, setSelectedSku] = useState<any>(null);

  useEffect(() => {
    if (product.variants && product.variants.length > 0) {
      const defaults: Record<string, string> = {};
      product.variants.forEach((v: any) => {
        if (v.values && v.values.length > 0) {
          defaults[v.name] = v.values[0];
        }
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelections(defaults);
    }
  }, [product]);

  useEffect(() => {
    if (!product.product_skus || product.product_skus.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedSku(null);
      return;
    }

    const match = product.product_skus.find((sku: any) =>
      Object.entries(sku.attributes).every(
        ([key, val]) => selections[key] === val,
      ),
    );
    setSelectedSku(match || null);
  }, [selections, product.product_skus]);

  const currentPrice = selectedSku ? selectedSku.price : product.price;
  const currentStock = selectedSku ? selectedSku.stock : product.stock_count;
  const isOutOfStock = currentStock <= 0;

  const variantLabel = selectedSku
    ? Object.values(selectedSku.attributes).join(" / ")
    : "";

  const baseDisabled = !isShopOpen || isOutOfStock;

  const handleAddToCart = () => {
    if (baseDisabled) return;

    cart.addItem({
      id: selectedSku ? selectedSku.code : product.id,
      name: product.name,
      price: currentPrice,
      image_url: product.image_url,
      quantity: 1,
      shop_id: product.shop_id,
      variant: variantLabel,
      maxStock: currentStock,
    });
    toast.success("Added to cart");
  };

  return (
    <>
      <div className="flex flex-col h-full">
        {/* Category / badge */}
        <span className="text-xs font-medium text-primary mb-1">
          {product.categories?.name || "Featured"}
        </span>

        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
          {product.name}
        </h1>

        {product.description && (
          <p className="text-sm text-slate-500 mb-4 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Price */}
        <div className="flex items-end gap-3 mb-6">
          <span className="text-3xl md:text-4xl font-bold text-slate-900">
            ₹{currentPrice}
          </span>
          {product.sale_price && !selectedSku && (
            <>
              <span className="text-base md:text-lg text-muted-foreground line-through mb-1">
                ₹{product.sale_price}
              </span>
              <Badge className="bg-red-100 text-red-600 hover:bg-red-100 mb-1">
                Sale
              </Badge>
            </>
          )}
        </div>

        {/* Variants – buttons for small sets, dropdown for large */}
        {product.variants?.length > 0 && (
          <div className="space-y-6 mb-8 border-y border-slate-100 py-6">
            {product.variants.map((variant: any) => {
              const useDropdown = variant.values.length > 4;
              const currentValue = selections[variant.name];

              return (
                <div key={variant.name} className="space-y-3">
                  <span className="font-semibold text-sm text-slate-900">
                    {variant.name}:{" "}
                    <span className="text-slate-500 font-normal">
                      {currentValue || "Select"}
                    </span>
                  </span>

                  {useDropdown ? (
                    <select
                      className="w-full max-w-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/60"
                      value={currentValue || ""}
                      onChange={(e) =>
                        setSelections({
                          ...selections,
                          [variant.name]: e.target.value,
                        })
                      }
                    >
                      <option value="" disabled>
                        Select {variant.name}
                      </option>
                      {variant.values.map((val: string) => (
                        <option key={val} value={val}>
                          {val}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {variant.values.map((val: string) => {
                        const isSelected = currentValue === val;
                        return (
                          <button
                            key={val}
                            type="button"
                            onClick={() =>
                              setSelections({
                                ...selections,
                                [variant.name]: val,
                              })
                            }
                            className={cn(
                              "px-4 py-2 rounded-lg border text-sm font-medium transition-all",
                              isSelected
                                ? "border-primary bg-primary/10 text-primary ring-1 ring-primary"
                                : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50",
                            )}
                          >
                            {val}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Stock status */}
        <div className="mb-6">
          {isOutOfStock ? (
            <div className="inline-flex items-center gap-2 text-red-600 bg-red-50 px-3 py-1.5 rounded-full text-sm font-semibold">
              <AlertCircle className="w-4 h-4" />
              Out of Stock
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-full text-sm font-semibold">
              <Check className="w-4 h-4" />
              In Stock
              {currentStock < 5 && (
                <span className="text-xs font-normal text-red-500 ml-1">
                  (Only {currentStock} left!)
                </span>
              )}
            </div>
          )}
        </div>

        {/* Primary actions (desktop / general) */}
        <div className="flex gap-4 mb-8 mt-auto">
          <Button
            size="lg"
            className="flex-1 h-14 text-base md:text-lg font-bold bg-[#E6B800] text-black hover:bg-[#FFD700] shadow-lg shadow-yellow-500/20"
            disabled={baseDisabled}
            onClick={handleAddToCart}
          >
            {isShopOpen ? (
              isOutOfStock ? (
                "Sold Out"
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </>
              )
            ) : (
              "Shop Closed"
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-14 w-14 border-slate-200 text-slate-500 hover:text-red-500 hover:bg-red-50 hover:border-red-200"
          >
            <Heart className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Sticky mobile bar */}
      {!baseDisabled && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur md:hidden">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
            <div className="flex flex-col">
              <span className="text-xs text-slate-500">Total</span>
              <span className="font-semibold text-base">
                ₹{currentPrice}
                {variantLabel && (
                  <span className="text-xs text-slate-500 ml-1">
                    ({variantLabel})
                  </span>
                )}
              </span>
            </div>
            <Button
              className="h-11 flex-1 font-semibold bg-[#E6B800] text-black hover:bg-[#FFD700]"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              Add to Cart
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
