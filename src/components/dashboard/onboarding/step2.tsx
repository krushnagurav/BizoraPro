// src/components/dashboard/onboarding/step2.tsx
"use client";
import { completeStep2 } from "@/src/actions/shop-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { MessageCircle, ArrowRight } from "lucide-react";

export function Step2Form() {
  return (
    <form action={async (formData) => {
      const res = await completeStep2(formData);
      if (res?.error) toast.error(res.error);
    }} className="space-y-6">
      
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center shadow-[0_0_30px_-5px_rgba(34,197,94,0.3)]">
           <MessageCircle className="w-8 h-8 text-green-500" />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-gray-300">WhatsApp Number</Label>
        <div className="relative">
           <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-white/10 pr-3">
             <span>🇮🇳</span> <span className="text-gray-400 text-sm">+91</span>
           </div>
           <Input 
             name="whatsapp" 
             placeholder="98765 43210" 
             type="tel" 
             className="pl-24 bg-[#0A0A0A] border-white/10 h-12 text-white focus-visible:ring-green-500/50"
             required 
           />
        </div>
        <p className="text-xs text-gray-500">We will send orders to this number.</p>
      </div>

      <div className="space-y-2">
        <Label className="text-gray-300">Business Category</Label>
        <Select name="category" required>
          <SelectTrigger className="bg-[#0A0A0A] border-white/10 h-12 text-white"><SelectValue placeholder="Select Category" /></SelectTrigger>
          <SelectContent className="bg-[#111] border-white/10 text-white">
            <SelectItem value="Fashion">Clothing & Fashion</SelectItem>
            <SelectItem value="Electronics">Electronics</SelectItem>
            <SelectItem value="Food">Food & Bakery</SelectItem>
            <SelectItem value="Beauty">Beauty & Personal Care</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button className="w-full h-12 font-bold text-lg bg-primary text-black hover:bg-primary/90 gap-2">
        Next: Add Product <ArrowRight className="w-5 h-5" />
      </Button>
    </form>
  );
}