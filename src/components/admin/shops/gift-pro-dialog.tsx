// src/components/admin/shops/gift-pro-dialog.tsx
/**
 * Gift Pro Plan Dialog.
 *
 * This component provides a dialog for administrators to gift the Pro Plan to a shop.
 * It allows selecting the duration for which the shop will have free Pro access.
 */
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { giftProPlanAction } from "@/src/actions/admin-actions";
import { Gift, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function GiftProDialog({
  shopId,
  currentPlan,
}: {
  shopId: string;
  currentPlan: string;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await giftProPlanAction(formData);
    setLoading(false);

    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success(res.success);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-[#E6B800]/50 text-[#E6B800] hover:bg-[#E6B800]/10 gap-2"
        >
          <Gift className="h-4 w-4" /> Gift Pro
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#111] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="text-[#E6B800]" /> Gift Pro Access
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <input type="hidden" name="shopId" value={shopId} />

          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-sm text-yellow-200">
            This will manually upgrade the shop to the <strong>Pro Plan</strong>{" "}
            without charging them.
          </div>

          <div className="space-y-2">
            <Label>Duration (Free Access)</Label>
            <Select name="months" defaultValue="3">
              <SelectTrigger className="bg-[#050505] border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#111] border-white/10 text-white">
                <SelectItem value="1">1 Month (Trial Extension)</SelectItem>
                <SelectItem value="3">3 Months (Quarterly Gift)</SelectItem>
                <SelectItem value="6">6 Months (Half Yearly)</SelectItem>
                <SelectItem value="12">1 Year (Full Sponsorship)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#E6B800] text-black font-bold hover:bg-[#FFD700]"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : "Confirm Upgrade"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
