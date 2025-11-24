"use client";

import { completeStep1 } from "@/src/actions/shop-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function Step1Form() {
  return (
    <form action={async (formData) => {
      const res = await completeStep1(formData);
      if (res?.error) toast.error(res.error);
    }} className="space-y-4">
      <div className="space-y-2">
        <Label>Shop Name</Label>
        <Input name="name" placeholder="Raj Fashion" required />
      </div>
      <div className="space-y-2">
        <Label>Shop URL</Label>
        <Input name="slug" placeholder="raj-fashion" required />
      </div>
      <Button className="w-full font-bold" size="lg">Next: Category →</Button>
    </form>
  );
}