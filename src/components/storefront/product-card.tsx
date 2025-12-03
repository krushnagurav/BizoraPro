// src\components\storefront\product-card.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Check } from "lucide-react";
import { useCart } from "@/src/hooks/use-cart";
import { toast } from "sonner";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export function ProductCard({ product, isShopOpen }: { product: any, isShopOpen: boolean }) {
  const cart = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const hasVariants = product.variants && product.variants.length > 0;
  const isOutOfStock = product.stock_count <= 0;
  const discountPercentage = product.sale_price 
    ? Math.round(((product.sale_price - product.price) / product.sale_price) * 100) 
    : 0;

  const onAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
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

  return (
    <Card className="group overflow-hidden bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-300 h-full flex flex-col">
      
      {/* IMAGE AREA */}
      <div className="aspect-square relative bg-slate-100 overflow-hidden">
        {product.image_url ? (
          <Image 
            src={product.image_url} 
            alt={product.name} 
            fill 
            className={`object-cover transition-transform duration-500 group-hover:scale-110 ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
            unoptimized
          />
        ) : (
          <div className="flex items-center justify-center h-full text-neutral-400 text-xs">No Image</div>
        )}
        
        {/* BADGES OVERLAY */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
           {isOutOfStock && <Badge variant="destructive" className="text-[10px] px-2">Out of Stock</Badge>}
           {!isOutOfStock && discountPercentage > 0 && <Badge className="bg-red-600 text-[10px] px-2">{discountPercentage}% OFF</Badge>}
           {!isOutOfStock && product.badges?.includes("bestseller") && <Badge className="bg-yellow-500 text-black text-[10px] px-2">Bestseller</Badge>}
           {!isOutOfStock && product.badges?.includes("new") && <Badge className="bg-blue-600 text-[10px] px-2">New</Badge>}
        </div>
      </div>

      {/* CONTENT AREA */}
      <CardContent className="p-4 flex flex-col flex-1">
        <h3 className="font-medium text-slate-900 text-sm sm:text-base line-clamp-2 mb-1 flex-1" title={product.name}>
           {product.name}
        </h3>
        
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-lg font-bold text-slate-900">₹{product.price}</span>
          {product.sale_price && (
            <span className="text-xs text-slate-400 line-through">₹{product.sale_price}</span>
          )}
        </div>

        {/* SMART ACTION BUTTON */}
        {hasVariants ? (
           <Link href={`/product/${product.id}`} className="w-full">
              <Button variant="outline" className="w-full font-bold border-primary/50 text-primary hover:bg-primary hover:text-black transition-colors">
                 Select Options
              </Button>
           </Link>
        ) : (
           <Button 
             onClick={isShopOpen && !isOutOfStock ? onAddToCart : undefined}
             disabled={!isShopOpen || isOutOfStock}
             className={`w-full font-bold transition-all ${
                isAdded ? "bg-green-600 text-white" : "bg-[#E6B800] text-black hover:bg-[#FFD700]"
             }`}
           >
             {isOutOfStock ? (
               "Out of Stock"
             ) : !isShopOpen ? (
               "Store Closed"
             ) : isAdded ? (
               <><Check className="w-4 h-4 mr-2" /> Added</>
             ) : (
               <><Plus className="w-4 h-4 mr-2" /> Add</>
             )}
           </Button>
        )}
      </CardContent>
    </Card>
  );
}