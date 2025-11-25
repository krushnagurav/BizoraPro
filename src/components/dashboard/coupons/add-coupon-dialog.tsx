"use client";

import { useState } from "react";
import { createCouponAction } from "@/src/actions/coupon-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Loader2, TicketPercent } from "lucide-react";

export function AddCouponDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    
    const result = await createCouponAction(formData);
    
    setLoading(false);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Coupon created!");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="font-bold gap-2">
          <Plus className="h-4 w-4" /> Create Coupon
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Coupon</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          
          <div className="space-y-2">
            <Label>Coupon Code</Label>
            <div className="relative">
              <TicketPercent className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input name="code" placeholder="WELCOME50" className="pl-9 uppercase font-mono" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select name="discountType" defaultValue="fixed">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Flat Amount (₹)</SelectItem>
                  <SelectItem value="percent">Percentage (%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Value</Label>
              <Input name="discountValue" type="number" placeholder="50" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Min Order Amount (₹)</Label>
            <Input name="minOrderValue" type="number" placeholder="0" defaultValue="0" />
            <p className="text-[10px] text-muted-foreground">Code won't work below this total.</p>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={loading} className="font-bold">
              {loading ? <Loader2 className="animate-spin mr-2" /> : "Save Coupon"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}