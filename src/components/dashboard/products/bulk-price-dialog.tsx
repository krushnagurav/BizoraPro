"use client";

import { useState } from "react";
import { bulkPriceUpdateAction } from "@/src/actions/product-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, TrendingUp, AlertTriangle } from "lucide-react";

export function BulkPriceDialog({ categories }: { categories: any[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!confirm("Are you sure? This will change prices for ALL selected products.")) return;

    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const result = await bulkPriceUpdateAction(formData);
    setLoading(false);
    
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success(result.success);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="gap-2">
          <TrendingUp className="h-4 w-4" /> Bulk Edit Prices
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Bulk Price Editor</DialogTitle>
          <DialogDescription>
             Quickly update prices for multiple products at once.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          
          {/* Category Filter */}
          <div className="space-y-2">
            <Label>Apply to Category</Label>
            <Select name="categoryId" defaultValue="all">
              <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Operation */}
            <div className="space-y-2">
               <Label>Action</Label>
               <Select name="operation" defaultValue="increase">
                 <SelectTrigger><SelectValue /></SelectTrigger>
                 <SelectContent>
                   <SelectItem value="increase">Increase By (+)</SelectItem>
                   <SelectItem value="decrease">Decrease By (-)</SelectItem>
                 </SelectContent>
               </Select>
            </div>

            {/* Type */}
            <div className="space-y-2">
               <Label>Type</Label>
               <Select name="type" defaultValue="percent">
                 <SelectTrigger><SelectValue /></SelectTrigger>
                 <SelectContent>
                   <SelectItem value="percent">Percentage (%)</SelectItem>
                   <SelectItem value="flat">Flat Amount (₹)</SelectItem>
                 </SelectContent>
               </Select>
            </div>
          </div>

          {/* Value */}
          <div className="space-y-2">
            <Label>Value</Label>
            <Input name="value" type="number" placeholder="e.g. 10" required min="1" />
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-lg flex gap-2 items-start text-xs text-yellow-600">
             <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
             <p>This action cannot be undone automatically. Prices will be rounded to the nearest rupee.</p>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={loading} className="font-bold bg-primary text-black hover:bg-primary/90 w-full">
              {loading ? <Loader2 className="animate-spin mr-2" /> : "Update Prices"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}