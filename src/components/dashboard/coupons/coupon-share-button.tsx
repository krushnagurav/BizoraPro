"use client";

import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";

type CouponShareButtonProps = {
  code: string;
};

export function CouponShareButton({ code }: CouponShareButtonProps) {
  const handleClick = () => {
    const text = `Use code ${code} to get a discount on our shop!`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  return (
    <Button size="icon" variant="ghost" onClick={handleClick}>
      <Share2 className="h-4 w-4 text-green-500" />
    </Button>
  );
}
