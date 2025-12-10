// src/components/dashboard/products/sku-manager.tsx
/*  * SKU Manager Component
 * This component generates and manages
 * Stock Keeping Units (SKUs) based on
 * product variants, allowing users to
 * set pricing and stock levels for each SKU.
 */
"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Variant {
  name: string;
  values: string[];
}

interface Sku {
  code: string;
  attributes: Record<string, string>;
  stock: number;
  price: number;
}

export function SkuManager({
  variants,
  value,
  onChange,
  defaultPrice,
}: {
  variants: Variant[];
  value: Sku[];
  onChange: (s: Sku[]) => void;
  defaultPrice: number;
}) {
  const [skus, setSkus] = useState<Sku[]>(value || []);

  useEffect(() => {
    if (variants.length === 0) {
      setSkus([]);
      return;
    }

    const generateCombinations = (
      vars: Variant[],
      prefix: Record<string, string> = {},
    ): Record<string, string>[] => {
      if (vars.length === 0) return [prefix];
      const first = vars[0];
      const rest = vars.slice(1);
      const combinations: Record<string, string>[] = [];

      for (const val of first.values) {
        combinations.push(
          ...generateCombinations(rest, { ...prefix, [first.name]: val }),
        );
      }
      return combinations;
    };

    const combos = generateCombinations(variants);

    const newSkus = combos.map((combo) => {
      const code = Object.values(combo).join("-").toUpperCase();
      const existing = skus.find((s) => s.code === code);
      return {
        code,
        attributes: combo,
        stock: existing ? existing.stock : 10,
        price: existing ? existing.price : defaultPrice,
      };
    });

    if (JSON.stringify(newSkus) !== JSON.stringify(skus)) {
      setSkus(newSkus);
      onChange(newSkus);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variants]);

  const updateSku = (index: number, field: keyof Sku, val: any) => {
    const updated = [...skus];
    updated[index] = { ...updated[index], [field]: val };
    setSkus(updated);
    onChange(updated);
  };

  if (variants.length === 0) return null;

  return (
    <div className="space-y-4 border rounded-lg p-4 bg-secondary/5">
      <Label>Inventory & Pricing (SKUs)</Label>

      <div className="border rounded-md overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Variant</TableHead>
              <TableHead className="w-[100px]">Price (₹)</TableHead>
              <TableHead className="w-[100px]">Stock</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {skus.map((sku, i) => (
              <TableRow key={sku.code}>
                <TableCell>
                  <div className="flex gap-2">
                    {Object.entries(sku.attributes).map(([key, val]) => (
                      <Badge key={key} variant="outline" className="text-xs">
                        {key}: {val}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={sku.price}
                    onChange={(e) =>
                      updateSku(i, "price", Number(e.target.value))
                    }
                    className="h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={sku.stock}
                    onChange={(e) =>
                      updateSku(i, "stock", Number(e.target.value))
                    }
                    className={`h-8 ${sku.stock === 0 ? "border-red-500 bg-red-50 text-red-900" : ""}`}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <p className="text-xs text-muted-foreground">
        Set stock to 0 to mark a variant as Out of Stock.
      </p>
    </div>
  );
}
