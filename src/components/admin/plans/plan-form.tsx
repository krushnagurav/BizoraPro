// src/components/admin/plans/plan-form.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createPlanAction,
  updatePlanAction,
} from "@/src/actions/admin-actions";
import { CheckCircle2, Eye, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function PlanForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: initialData?.name || "",
    priceMonthly: initialData?.price_monthly || "",
    priceYearly: initialData?.price_yearly || "",
    productLimit: initialData?.product_limit || "",
    storageLimit: initialData?.storage_limit || "1GB",
    isPopular: initialData?.is_popular || false,
  });

  const handleChange = (key: string, val: any) => {
    setForm((prev) => ({ ...prev, [key]: val }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    let res;
    if (initialData) {
      formData.append("id", initialData.id);
      res = await updatePlanAction(formData);
    } else {
      res = await createPlanAction(formData);
    }

    setLoading(false);

    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success(initialData ? "Plan Updated!" : "Plan Created!");
      router.push("/admin/plans");
      router.refresh();
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* LEFT: FORM */}
      <div className="lg:col-span-2">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="bg-[#111] border-white/10 text-white">
            <CardHeader>
              <CardTitle>{initialData ? "Edit Plan" : "New Plan"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Plan Name</Label>
                <Input
                  name="name"
                  placeholder="e.g. Pro Business"
                  className="bg-[#050505] border-white/10"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Monthly Price (₹)</Label>
                  <Input
                    name="priceMonthly"
                    type="number"
                    value={form.priceMonthly}
                    className="bg-[#050505] border-white/10"
                    required
                    onChange={(e) =>
                      handleChange("priceMonthly", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Yearly Price (₹)</Label>
                  <Input
                    name="priceYearly"
                    type="number"
                    value={form.priceYearly}
                    className="bg-[#050505] border-white/10"
                    required
                    onChange={(e) =>
                      handleChange("priceYearly", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <Checkbox
                  id="popular"
                  name="isPopular"
                  checked={form.isPopular}
                  onCheckedChange={(c) => handleChange("isPopular", !!c)}
                />
                <Label htmlFor="popular">Show Best Value badge</Label>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#111] border-white/10 text-white">
            <CardHeader>
              <CardTitle>Feature Limits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Product Limit</Label>
                <Input
                  name="productLimit"
                  type="number"
                  value={form.productLimit}
                  className="bg-[#050505] border-white/10"
                  onChange={(e) => handleChange("productLimit", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Storage Limit</Label>
                <Select
                  name="storageLimit"
                  onValueChange={(v) => handleChange("storageLimit", v)}
                  value={form.storageLimit}
                >
                  <SelectTrigger className="bg-[#050505] border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1GB">1 GB</SelectItem>
                    <SelectItem value="5GB">5 GB</SelectItem>
                    <SelectItem value="20GB">20 GB</SelectItem>
                    <SelectItem value="100GB">100 GB</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary text-black font-bold hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : initialData ? (
                "Update Plan"
              ) : (
                "Create Plan"
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* RIGHT: PREVIEW CARD */}
      <div className="lg:col-span-1">
        <div className="sticky top-6">
          <h3 className="text-gray-400 mb-4 flex items-center gap-2">
            <Eye className="w-4 h-4" /> Preview
          </h3>
          <Card className="bg-[#1C1C1C] border-2 border-white/10 text-white relative overflow-hidden">
            {form.isPopular && (
              <div className="absolute top-0 right-0 bg-yellow-500 text-black text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                Best Value
              </div>
            )}
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-2">
                {form.name || "Plan Name"}
              </h3>
              <div className="flex items-baseline justify-center gap-1 mb-6">
                <span className="text-4xl font-bold text-primary">
                  ₹{form.priceMonthly || "0"}
                </span>
                <span className="text-sm text-gray-500">/mo</span>
              </div>

              <div className="space-y-3 text-sm text-gray-400 text-left mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />{" "}
                  {form.productLimit || "0"} Products
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />{" "}
                  {form.storageLimit} Storage
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-green-500" /> WhatsApp
                  Integration
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-green-500" /> Advanced
                  Analytics
                </div>
              </div>

              <Button className="w-full bg-primary text-black hover:bg-primary/90 font-bold">
                Choose Plan
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
