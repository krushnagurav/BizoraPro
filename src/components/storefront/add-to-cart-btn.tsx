// src\components\storefront\add-to-cart-btn.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/src/hooks/use-cart";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

export function AddToCartButton({
  product,
  isShopOpen,
}: {
  product: any;
  isShopOpen: boolean;
}) {
  const cart = useCart();

  const handleAdd = () => {
    cart.addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      quantity: 1,
      shop_id: product.shop_id, // Updated to match your DB relation logic if needed
    });
    toast.success("Added to cart");
  };

  return (
    <Button
      onClick={isShopOpen ? handleAdd : undefined}
      disabled={!isShopOpen}
      className="w-full h-12 font-bold text-lg gap-2 bg-primary text-black hover:bg-primary/90"
    >
      {isShopOpen ? (
        <>
          <ShoppingCart className="w-5 h-5" /> Add to Cart{" "}
        </>
      ) : (
        "⛔ Shop Closed"
      )}
    </Button>
  );
}
