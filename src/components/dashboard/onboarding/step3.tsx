"use client";

import { createProductAction } from "@/src/actions/product-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function Step3Form() {
  return (
    <form action={async (formData) => {
      const res = await createProductAction(formData);
      if (res?.error) toast.error(res.error);
    }} className="space-y-4">
      <div className="p-6 border-2 border-dashed border-border rounded-xl text-center text-muted-foreground mb-4">
        <p>📸 Image Upload (Coming Soon)</p>
      </div>
      <div className="space-y-2">
        <Label>Product Name</Label>
        <Input name="productName" placeholder="Red Cotton Saree" required />
      </div>
      <div className="space-y-2">
        <Label>Price (₹)</Label>
        <Input name="productPrice" type="number" placeholder="999" required />
      </div>
      <Button className="w-full font-bold" size="lg">Finish Setup 🚀</Button>
    </form>
  );
}