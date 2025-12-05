"use client";

import { useState } from "react";
import { createCouponAction } from "@/src/actions/coupon-actions";
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
import { Plus, Loader2, TicketPercent, Wand2 } from "lucide-react";
import { DatePicker } from "@/src/components/ui/date-picker";

export function AddCouponDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [type, setType] = useState("percent");
  const [date, setDate] = useState<Date>(); // State for Date

  // Auto-Generator
  const handleGenerate = () => {
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    setCode(`SAVE${random}`);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);

    // Append the date from state manually since it's not in a native input
    if (date) {
      formData.append("endDate", date.toISOString());
    }

    const result = await createCouponAction(formData);

    setLoading(false);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Coupon created!");
      setOpen(false);
      // Reset form
      setCode("");
      setDate(undefined);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="font-bold gap-2 bg-primary text-black hover:bg-primary/90">
          <Plus className="h-4 w-4" /> Create Coupon
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#111] border-white/10 text-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New Coupon</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Code */}
          <div className="space-y-2">
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

          {/* Discount Logic */}
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
                placeholder={type === "percent" ? "20" : "100"}
                className="bg-[#050505] border-white/10"
                required
              />
            </div>
          </div>

          {/* Limits */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Min Order (₹)</Label>
              <Input
                name="minOrderValue"
                type="number"
                placeholder="0"
                defaultValue="0"
                className="bg-[#050505] border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label>Max Usage Limit</Label>
              <Input
                name="maxUsesTotal"
                type="number"
                placeholder="Unlimited"
                className="bg-[#050505] border-white/10"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 flex flex-col">
              <Label className="mb-2">End Date</Label>
              {/* Use the new DatePicker Component */}
              <DatePicker date={date} setDate={setDate} />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="font-bold bg-primary text-black hover:bg-primary/90 w-full"
            >
              {loading ? (
                <Loader2 className="animate-spin mr-2" />
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
