"use client";

import { useState } from "react";
import { createUpsellAction } from "@/src/actions/marketing-actions";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ArrowRight, Plus, ArrowLeftRight, Loader2, AlertTriangle } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: string;
  name: string;
  image_url: string | null;
  price: number;
  stock_count: number;
}

export function UpsellForm({ products }: { products: Product[] }) {
  const [loading, setLoading] = useState(false);
  const [triggerId, setTriggerId] = useState("");
  const [suggestedId, setSuggestedId] = useState("");

  // 1️⃣ Logic: Filter out the selected trigger from suggestions
  const availableSuggestions = products.filter(p => p.id !== triggerId);
  
  // 2️⃣ Logic: Check if suggestion is OOS
  const selectedSuggestion = products.find(p => p.id === suggestedId);
  const isSuggestionOOS = selectedSuggestion ? selectedSuggestion.stock_count === 0 : false;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (triggerId === suggestedId) {
      toast.error("Cannot suggest the same product.");
      return;
    }
    if (isSuggestionOOS) {
      toast.warning("Warning: Suggesting an out-of-stock product.");
    }

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await createUpsellAction(formData);
    setLoading(false);

    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success("Recommendation added!");
      // Reset
      setTriggerId("");
      setSuggestedId("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start">
        
        {/* Trigger Product */}
        <div className="space-y-2 flex-1 w-full">
          <span className="text-sm font-medium text-muted-foreground">When user views...</span>
          <Select name="triggerId" value={triggerId} onValueChange={setTriggerId} required>
            <SelectTrigger className="h-14 bg-background/50 border-border/50">
              <SelectValue placeholder="Select Product" />
            </SelectTrigger>
            <SelectContent>
              {products.map(p => (
                <SelectItem key={p.id} value={p.id}>
                  <div className="flex items-center gap-3">
                    <div className="relative h-8 w-8 bg-secondary rounded overflow-hidden">
                      {p.image_url && <Image src={p.image_url} fill alt="" className="object-cover" unoptimized />}
                    </div>
                    <span className="truncate max-w-[150px]">{p.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="hidden md:flex h-24 items-center justify-center">
           <ArrowRight className="text-muted-foreground w-5 h-5" />
        </div>

        {/* Suggestion Product */}
        <div className="space-y-2 flex-1 w-full">
          <span className="text-sm font-medium text-muted-foreground">Suggest this...</span>
          <Select name="suggestedId" value={suggestedId} onValueChange={setSuggestedId} required>
            <SelectTrigger className="h-14 bg-background/50 border-border/50">
              <SelectValue placeholder="Select Recommendation" />
            </SelectTrigger>
            <SelectContent>
              {availableSuggestions.map(p => (
                <SelectItem key={p.id} value={p.id} disabled={p.stock_count === 0} className={p.stock_count === 0 ? "opacity-50" : ""}>
                  <div className="flex items-center justify-between w-full gap-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-8 w-8 bg-secondary rounded overflow-hidden">
                        {p.image_url && <Image src={p.image_url} fill alt="" className="object-cover" unoptimized />}
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="truncate max-w-[140px]">{p.name}</span>
                        <span className="text-xs text-muted-foreground">₹{p.price}</span>
                      </div>
                    </div>
                    {p.stock_count === 0 && <Badge variant="destructive" className="text-[10px] h-5">Out of Stock</Badge>}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* OOS Warning */}
          {isSuggestionOOS && (
             <div className="text-xs text-amber-500 flex items-center gap-1 animate-in fade-in">
                <AlertTriangle className="w-3 h-3" /> Warning: This item is currently out of stock.
             </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center pt-2">
        <div className="flex items-center gap-2">
          <Checkbox id="reciprocal" name="reciprocal" defaultChecked className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:text-black" />
          <Label htmlFor="reciprocal" className="cursor-pointer flex items-center gap-2 text-sm text-muted-foreground">
             Link both ways <ArrowLeftRight className="h-3 w-3" />
          </Label>
        </div>
        <Button type="submit" className="font-bold bg-primary text-black hover:bg-primary/90" disabled={loading || !triggerId || !suggestedId}>
          {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <><Plus className="h-4 w-4 mr-2" /> Add Rule</>}
        </Button>
      </div>
    </form>
  );
}