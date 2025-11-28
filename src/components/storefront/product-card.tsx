"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Check } from "lucide-react";
import { useCart } from "@/src/hooks/use-cart";
import { toast } from "sonner";
import { useState } from "react";

export function ProductCard({ product, isShopOpen }: { product: any, isShopOpen: boolean }) {
  const cart = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const onAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation if inside a Link
    
    cart.addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      quantity: 1,
      shop_id: product.shop_id,
    });

    setIsAdded(true);
    toast.success("Added to cart");
    setTimeout(() => setIsAdded(false), 1000);
  };

  // Calculate Discount %
  const discountPercentage = product.sale_price 
    ? Math.round(((product.sale_price - product.price) / product.sale_price) * 100) 
    : 0;

  return (
    <Card className="group overflow-hidden bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-300">
      {/* Image Container */}
      <div className="aspect-square relative bg-black">
        {product.image_url ? (
          <Image 
            src={product.image_url} 
            alt={product.name} 
            fill 
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            unoptimized
          />
        ) : (
          <div className="flex items-center justify-center h-full text-neutral-700 text-sm">
            No Image
          </div>
        )}
        
        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md">
            {discountPercentage}% OFF
          </div>
        )}
      </div>

      {/* Content */}
      <CardContent className="p-4">
        <h3 className="font-medium text-white text-base line-clamp-1 mb-1">{product.name}</h3>
        
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-xl font-bold text-[#E6B800]">₹{product.price}</span>
          {product.sale_price && (
            <span className="text-sm text-neutral-500 line-through">₹{product.sale_price}</span>
          )}
        </div>

        <Button 
          className={`w-full font-bold transition-all duration-300 ${
            isAdded 
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-[#E6B800] text-black hover:bg-[#FFD700]"
          }`}
          disabled={!isShopOpen}
          onClick={isShopOpen ? onAddToCart : undefined}
        >
          {isAdded ? (
            <><Check className="w-4 h-4 mr-2" /> Added</>
          ) : (
            <><Plus className="w-4 h-4 mr-2" /> Add to Cart</>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}