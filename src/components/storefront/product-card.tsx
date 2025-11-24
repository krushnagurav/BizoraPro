"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Check } from "lucide-react";
import { useCart } from "@/src/hooks/use-cart";
import { toast } from "sonner";
import { useState } from "react";

export function ProductCard({ product }: { product: any }) {
  const cart = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const onAddToCart = () => {
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
    
    // Reset icon after 1 second
    setTimeout(() => setIsAdded(false), 1000);
  };

  return (
    <Card className="overflow-hidden border-border/50 hover:border-primary/50 transition group">
      <div className="aspect-square relative bg-secondary">
        {product.image_url ? (
          <Image 
            src={product.image_url} 
            alt={product.name} 
            fill 
            className="object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground text-xs">
            No Image
          </div>
        )}
      </div>
      <CardContent className="p-3">
        <h3 className="font-medium text-sm truncate">{product.name}</h3>
        <div className="flex items-center justify-between mt-2">
          <div className="flex flex-col">
            {product.sale_price && (
              <span className="text-[10px] text-muted-foreground line-through">
                ₹{product.sale_price}
              </span>
            )}
            <span className="font-bold text-primary">₹{product.price}</span>
          </div>
          <Button 
            size="icon" 
            className={`h-8 w-8 rounded-full transition-all ${isAdded ? "bg-green-500 hover:bg-green-600" : ""}`}
            onClick={onAddToCart}
          >
            {isAdded ? <Check className="h-4 w-4 text-white" /> : <Plus className="h-4 w-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}