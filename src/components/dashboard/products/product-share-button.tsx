"use client";

import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { toast } from "sonner";

interface ProductShareProps {
  slug: string;
  productId: string;
  name: string;
}

export function ProductShareButton({ slug, productId, name }: ProductShareProps) {
  const handleShare = () => {
    const baseUrl = window.location.origin;
    const url = `${baseUrl}/${slug}/p/${productId}`;
    const text = `Check out ${name} on our shop! ${url}`;
    
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    toast.success("Link copied & WhatsApp opened!");
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={handleShare} 
      title="Share on WhatsApp"
      className="text-green-500 hover:text-green-600 hover:bg-green-500/10"
    >
      <Share2 className="h-4 w-4" />
    </Button>
  );
}