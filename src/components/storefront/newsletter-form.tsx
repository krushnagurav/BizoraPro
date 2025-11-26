"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { submitLeadAction } from "@/src/actions/marketing-actions";

export function NewsletterForm({ shopId }: { shopId: string }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append("shopId", shopId);

    const res = await submitLeadAction(formData);
    setLoading(false);

    if (res?.error) toast.error(res.error);
    else {
      toast.success("Subscribed!");
      (e.target as HTMLFormElement).reset();
    }
  };

  return (
    <div className="bg-secondary/20 p-6 rounded-xl mt-12 text-center">
      <h3 className="font-bold text-lg mb-2">Get Exclusive Offers</h3>
      <p className="text-sm text-muted-foreground mb-4">Join our WhatsApp list for discounts.</p>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input name="phone" placeholder="WhatsApp Number" required className="bg-background" />
        <Button disabled={loading}>Join</Button>
      </form>
    </div>
  );
}