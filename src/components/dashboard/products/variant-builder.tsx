// src/components/dashboard/products/variant-builder.tsx
/*  * Variant Builder Component
 * This component allows users to
 * create and manage product variants
 * within the product dashboard.
 */
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Trash2 } from "lucide-react";

interface Variant {
  name: string;
  values: string[];
}

export function VariantBuilder({
  value,
  onChange,
}: {
  value: Variant[];
  onChange: (v: Variant[]) => void;
}) {
  const [variants, setVariants] = useState<Variant[]>(value || []);
  const [isAdding, setIsAdding] = useState(false);

  const [tempName, setTempName] = useState("");
  const [tempValue, setTempValue] = useState("");
  const [tempValues, setTempValues] = useState<string[]>([]);

  useEffect(() => {
    onChange(variants);
  }, [variants, onChange]);

  const addValue = () => {
    if (!tempValue) return;
    if (!tempValues.includes(tempValue)) {
      setTempValues([...tempValues, tempValue]);
    }
    setTempValue("");
  };

  const saveVariant = () => {
    if (!tempName || tempValues.length === 0) return;
    setVariants([...variants, { name: tempName, values: tempValues }]);
    setTempName("");
    setTempValues([]);
    setTempValue("");
    setIsAdding(false);
  };

  const removeVariant = (index: number) => {
    const newVars = [...variants];
    newVars.splice(index, 1);
    setVariants(newVars);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Product Variants</Label>
        {!isAdding && variants.length < 3 && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsAdding(true)}
            type="button"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Option
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {variants.map((v, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 bg-secondary/20 border border-border rounded-md"
          >
            <div>
              <span className="font-bold text-sm">{v.name}: </span>
              <span className="text-sm text-muted-foreground">
                {v.values.join(", ")}
              </span>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => removeVariant(i)}
              type="button"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>

      {isAdding && (
        <div className="p-4 border border-primary/20 bg-secondary/10 rounded-lg space-y-4">
          <div className="space-y-2">
            <Label className="text-xs">Option Name</Label>
            <Input
              placeholder="e.g. Size, Color"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Option Values</Label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g. Small"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addValue())
                }
              />
              <Button type="button" onClick={addValue} variant="secondary">
                Add
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {tempValues.map((val, i) => (
                <Badge key={i} variant="secondary" className="gap-1">
                  {val}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                    onClick={() =>
                      setTempValues(tempValues.filter((_, idx) => idx !== i))
                    }
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsAdding(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={saveVariant} className="font-bold">
              Save Option
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
