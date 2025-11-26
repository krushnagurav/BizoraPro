"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star, Loader2 } from "lucide-react";
import { submitReviewAction } from "@/src/actions/marketing-actions";
import { toast } from "sonner";

export function ReviewForm({ shopId, productId }: { shopId: string, productId: string }) {
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append("shopId", shopId);
    formData.append("productId", productId);
    formData.append("rating", rating.toString());
    
    const res = await submitReviewAction(formData);
    setLoading(false);
    
    if (res?.error) toast.error(res.error);
    else {
      toast.success("Review submitted for approval!");
      (e.target as HTMLFormElement).reset();
    }
  };

  return (
    <div className="mt-12 pt-8 border-t border-border/30">
      <h3 className="text-xl font-bold mb-6">Leave a Review</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star 
              key={star} 
              className={`w-8 h-8 cursor-pointer transition ${star <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-400"}`}
              onClick={() => setRating(star)}
            />
          ))}
        </div>
        <Input name="name" placeholder="Your Name" required className="bg-background" />
        <Textarea name="comment" placeholder="Write your review..." required className="bg-background" />
        <Button disabled={loading} className="w-full font-bold">
          {loading ? <Loader2 className="animate-spin" /> : "Submit Review"}
        </Button>
      </form>
    </div>
  );
}