"use client";
import { completeStep1 } from "@/src/actions/shop-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Store, ArrowRight } from "lucide-react";

export function Step1Form() {
  return (
    <form action={async (formData) => {
      const res = await completeStep1(formData);
      if (res?.error) toast.error(res.error);
    }} className="space-y-6">
      
      {/* Hero Icon */}
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center shadow-[0_0_30px_-5px_rgba(230,184,0,0.3)]">
           <Store className="w-8 h-8 text-primary" />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-gray-300">Shop Name</Label>
        <Input 
          name="name" 
          placeholder="e.g. Raj Fashion" 
          className="bg-[#0A0A0A] border-white/10 h-12 text-white placeholder:text-gray-600 focus-visible:ring-primary/50"
          required 
        />
      </div>
      
      <div className="space-y-2">
        <Label className="text-gray-300">Shop URL</Label>
        <div className="flex">
          <span className="inline-flex items-center px-4 rounded-l-md border border-r-0 border-white/10 bg-[#1A1A1A] text-gray-500 text-sm">
            bizorapro.com/
          </span>
          <Input 
            name="slug" 
            placeholder="raj-fashion" 
            className="rounded-l-none bg-[#0A0A0A] border-white/10 h-12 text-white focus-visible:ring-primary/50"
            required 
          />
        </div>
        <p className="text-xs text-gray-500">Only lowercase letters, numbers, and hyphens.</p>
      </div>

      <Button className="w-full h-12 font-bold text-lg bg-primary text-black hover:bg-primary/90 gap-2">
        Next Step <ArrowRight className="w-5 h-5" />
      </Button>
    </form>
  );
}