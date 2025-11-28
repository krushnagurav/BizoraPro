"use client";

import { createPlanAction } from "@/src/actions/admin-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CreatePlanPage() {
  const router = useRouter();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-white">Create New Plan</h1>

      <form action={async (formData) => {
        const res = await createPlanAction(formData);
        if (res?.error) toast.error(res.error);
        else {
          toast.success("Plan Created");
          router.push("/admin/plans");
        }
      }}>
        <Card className="bg-[#111] border-white/10 text-white">
          <CardContent className="p-6 space-y-6">
            
            <div className="space-y-2">
              <Label>Plan Name</Label>
              <Input name="name" placeholder="e.g. Enterprise" className="bg-[#050505] border-white/10" required />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Monthly Price (₹)</Label>
                <Input name="priceMonthly" type="number" placeholder="999" className="bg-[#050505] border-white/10" required />
              </div>
              <div className="space-y-2">
                <Label>Yearly Price (₹)</Label>
                <Input name="priceYearly" type="number" placeholder="9999" className="bg-[#050505] border-white/10" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Product Limit</Label>
              <Input name="productLimit" type="number" placeholder="1000" className="bg-[#050505] border-white/10" required />
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" name="isPopular" className="h-4 w-4 accent-primary" />
              <Label>Mark as Best Value</Label>
            </div>

            <Button type="submit" className="w-full bg-primary text-black font-bold hover:bg-primary/90">
              Save Plan
            </Button>

          </CardContent>
        </Card>
      </form>
    </div>
  );
}