"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { submitLeadAction } from "@/src/actions/marketing-actions";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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
      toast.success("Subscribed successfully!");
      (e.target as HTMLFormElement).reset();
    }
  };

  return (
    <div className="bg-white border border-slate-200 p-8 rounded-3xl text-center shadow-sm">
      <h3 className="font-bold text-xl text-slate-900 mb-2">Get Exclusive Offers</h3>
      <p className="text-sm text-slate-500 mb-6">Join our WhatsApp list for discounts and new arrivals.</p>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-sm mx-auto">
        <Input name="name" placeholder="Your Name (Optional)" className="h-12 bg-slate-50 border-slate-200" />
        <div className="flex gap-2">
           <Input name="phone" placeholder="WhatsApp Number" required className="h-12 bg-slate-50 border-slate-200" />
           <Button disabled={loading} className="h-12 px-6 bg-slate-900 text-white hover:bg-slate-800 font-bold">
             {loading ? <Loader2 className="animate-spin" /> : "Join"}
           </Button>
        </div>
      </form>
    </div>
  );
}