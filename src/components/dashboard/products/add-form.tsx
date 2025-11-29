"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createProductAction } from "@/src/actions/product-actions";
import { ImageUpload } from "@/src/components/dashboard/image-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { VariantBuilder } from "./variant-builder";
import { MultiImageUpload } from "../multi-image-upload";
import { BadgeSelector } from "./badge-selector";
import { SkuManager } from "./sku-manager";

export function AddProductForm({
  categories,
  plan,
}: {
  categories: any[];
  plan: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Client State
  const [imageUrl, setImageUrl] = useState("");
  const [price, setPrice] = useState(""); // 👈 Added State for Price
  const [variants, setVariants] = useState<any[]>([]);
  const [gallery, setGallery] = useState<string[]>([]);
  const [badges, setBadges] = useState<string[]>([]);
  const [skus, setSkus] = useState<any[]>([]);
  const [stock, setStock] = useState(0);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    const rawData = {
      name: formData.get("name") as string,
      price: Number(formData.get("price")),
      salePrice: formData.get("salePrice")
        ? Number(formData.get("salePrice"))
        : null,
      category: formData.get("category") as string,
      description: formData.get("description") as string,

      imageUrl: imageUrl,
      variants: JSON.stringify(variants),
      productSkus: JSON.stringify(skus),
      galleryImages: JSON.stringify(gallery),
      badges: JSON.stringify(badges),
      stock: stock.toString(),
    };

    const result = await createProductAction(rawData);

    setLoading(false);

    if (result?.serverError) {
      toast.error("Server Error: " + result.serverError);
    } else if (result?.validationErrors) {
      const firstError = Object.values(result.validationErrors)[0];
      toast.error(firstError ? String(firstError) : "Validation Failed");
    } else if (result?.data?.success) {
      toast.success("Product created!");
      if (result.data.redirect) {
        router.push(result.data.redirect);
        router.refresh();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card className="bg-card border-border/50">
        <CardContent className="pt-6">
          <Label className="mb-4 block">Main Image</Label>
          <ImageUpload value={imageUrl} onChange={setImageUrl} />

          <div className="mt-6 pt-6 border-t border-border">
            <Label className="mb-4 block">Gallery Images (Optional)</Label>
            {plan === "free" && (
              <span className="text-[10px] bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded border border-yellow-500/20">
                PRO Feature
              </span>
            )}
            {plan === "pro" ? (
              <MultiImageUpload value={gallery} onChange={setGallery} />
            ) : (
              <div className="bg-secondary/10 border border-border rounded-lg p-6 text-center opacity-60">
                <p className="text-sm text-muted-foreground mb-2">
                  Gallery images are available on the <strong>Pro Plan</strong>.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open("/billing", "_blank")}
                >
                  Upgrade to Unlock
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border/50">
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label>Product Name</Label>
            <Input name="name" placeholder="e.g. Red Cotton Saree" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Price (₹)</Label>
              <Input
                name="price"
                type="number"
                placeholder="999"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Original Price</Label>
              <Input name="salePrice" type="number" placeholder="1299" />
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <VariantBuilder value={variants} onChange={setVariants} />
          </div>

          {variants.length === 0 && (
            <div className="space-y-2">
              <Label>Stock Quantity</Label>
              <Input
                name="stock"
                type="number"
                placeholder="10"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
              />
            </div>
          )}

          <div className="mt-4">
            <SkuManager
              variants={variants}
              value={skus}
              onChange={setSkus}
              defaultPrice={Number(price) || 0}
            />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select name="category">
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    No categories created
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea name="description" placeholder="Details..." rows={4} />
          </div>

          <div className="space-y-2">
            <Label>Promotion Labels</Label>
            <BadgeSelector value={badges} onChange={setBadges} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" className="font-bold" disabled={loading}>
          {loading ? <Loader2 className="animate-spin mr-2" /> : "Save Product"}
        </Button>
      </div>
    </form>
  );
}