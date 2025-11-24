"use client";

import { completeStep2 } from "@/src/actions/shop-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export function Step2Form() {
  return (
    <form action={async (formData) => {
      const res = await completeStep2(formData);
      if (res?.error) toast.error(res.error);
    }} className="space-y-4">
      <div className="space-y-2">
        <Label>WhatsApp Number</Label>
        <Input name="whatsapp" placeholder="9876543210" type="tel" required />
      </div>
      <div className="space-y-2">
        <Label>Business Category</Label>
        <Select name="category" required>
          <SelectTrigger>
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Fashion">Clothing & Fashion</SelectItem>
            <SelectItem value="Electronics">Electronics</SelectItem>
            <SelectItem value="Food">Food & Bakery</SelectItem>
            <SelectItem value="Beauty">Beauty & Personal Care</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button className="w-full font-bold" size="lg">Next: Add Product →</Button>
    </form>
  );
}