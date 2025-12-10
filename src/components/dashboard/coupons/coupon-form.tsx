// src/components/dashboard/coupons/coupon-form.tsx
/*  * Coupon Form Component
 * This component allows users
 * to create or edit coupons
 * in the coupons dashboard.
 * Users can set various parameters
 * such as discount type, value,
 * usage limits, and expiry date.
 */
"use client";

import { useState } from "react";
import {
  createCouponAction,
  updateCouponAction,
} from "@/src/actions/coupon-actions";
import { Button } from "@/components/ui/button";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Loader2, TicketPercent, Wand2, Pencil } from "lucide-react";
import { DatePicker } from "@/src/components/ui/date-picker";

export function CouponForm({ initialData }: { initialData?: any }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [code, setCode] = useState(initialData?.code || "");
  const [type, setType] = useState(initialData?.discount_type || "percent");
  const [date, setDate] = useState<Date | undefined>(
    initialData?.end_date ? new Date(initialData.end_date) : undefined,
  );
  const [isActive, setIsActive] = useState(
    initialData ? (initialData.is_active ? "active" : "inactive") : "active",
  );

  const handleGenerate = () => {
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    setCode(`SAVE${random}`);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);

    if (date) formData.append("endDate", date.toISOString());
    formData.append("status", isActive);

    let result;
    if (initialData) {
      formData.append("id", initialData.id);
      result = await updateCouponAction(formData);
    } else {
      result = await createCouponAction(formData);
    }

    setLoading(false);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success(initialData ? "Coupon Updated!" : "Coupon Created!");
      setOpen(false);
      if (!initialData) {
        setCode("");
        setDate(undefined);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {initialData ? (
          <Button variant="ghost" size="icon" title="Edit Coupon">
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button className="font-bold gap-2 bg-primary text-black hover:bg-primary/90">
            <Plus className="h-4 w-4" /> Create Coupon
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-[#111] border-white/10 text-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Coupon" : "New Coupon"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-2">
              <Label>Coupon Code</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <TicketPercent className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    name="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="WELCOME50"
                    className="pl-9 uppercase font-mono bg-[#050505] border-white/10"
                    required
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGenerate}
                  className="border-white/10 hover:bg-white/10"
                >
                  <Wand2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={isActive} onValueChange={setIsActive}>
                <SelectTrigger className="bg-[#050505] border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select name="discountType" value={type} onValueChange={setType}>
                <SelectTrigger className="bg-[#050505] border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percent">Percentage (%)</SelectItem>
                  <SelectItem value="fixed">Flat Amount (₹)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Value</Label>
              <Input
                name="discountValue"
                type="number"
                defaultValue={initialData?.discount_value}
                placeholder="20"
                className="bg-[#050505] border-white/10"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Min Order (₹)</Label>
              <Input
                name="minOrderValue"
                type="number"
                defaultValue={initialData?.min_order_value || 0}
                className="bg-[#050505] border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label>Max Uses (Total)</Label>
              <Input
                name="maxUsesTotal"
                type="number"
                defaultValue={initialData?.usage_limit}
                placeholder="Unlimited"
                className="bg-[#050505] border-white/10"
              />
            </div>
          </div>

          <div className="space-y-2 flex flex-col">
            <Label className="mb-1">Expiry Date</Label>
            <DatePicker date={date} setDate={setDate} />
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="font-bold bg-primary text-black hover:bg-primary/90 w-full"
            >
              {loading ? (
                <Loader2 className="animate-spin mr-2" />
              ) : initialData ? (
                "Update Coupon"
              ) : (
                "Save Coupon"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
