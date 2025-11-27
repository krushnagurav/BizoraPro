"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProductAction } from "@/src/actions/product-actions";
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

export function EditProductForm({
  product,
  categories,
}: {
  product: any;
  categories: any[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // 1. INITIALIZE STATE (Handle nulls safely)
  const [imageUrl, setImageUrl] = useState(product.image_url || "");
  const [variants, setVariants] = useState<any[]>(product.variants || []);
  const [gallery, setGallery] = useState<string[]>(product.gallery_images || []);
  const [badges, setBadges] = useState<string[]>(product.badges || []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    // 2. PREPARE DATA OBJECT (Matches updateProductSchema)
    const rawData = {
      id: product.id, // Critical
      name: formData.get("name") as string,
      price: Number(formData.get("price")),
      salePrice: formData.get("salePrice") ? Number(formData.get("salePrice")) : null,
      category: formData.get("category") as string,
      description: formData.get("description") as string,
      
      // State variables
      imageUrl: imageUrl,
      variants: JSON.stringify(variants),
      galleryImages: JSON.stringify(gallery),
      badges: JSON.stringify(badges),
    };

    // 3. CALL SERVER ACTION
    const result = await updateProductAction(rawData);

    setLoading(false);

    // 4. HANDLE RESPONSE
    if (result?.serverError) {
       toast.error("Server Error: " + result.serverError);
    } else if (result?.validationErrors) {
       const firstError = Object.values(result.validationErrors)[0];
       toast.error(firstError ? String(firstError) : "Validation Failed");
    } else if (result?.data?.success) {
       toast.success("Product updated successfully!");
       router.push("/products");
       router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      
      {/* Image Section */}
      <Card className="bg-card border-border/50">
        <CardContent className="pt-6">
          <Label className="mb-4 block">Main Image</Label>
          <ImageUpload value={imageUrl} onChange={setImageUrl} />
          
          <div className="mt-6 pt-6 border-t border-border">
            <Label className="mb-4 block">Gallery Images (Optional)</Label>
            <MultiImageUpload value={gallery} onChange={setGallery} />
          </div>
        </CardContent>
      </Card>

      {/* Details Section */}
      <Card className="bg-card border-border/50">
        <CardContent className="pt-6 space-y-4">
          
          <div className="space-y-2">
            <Label>Product Name</Label>
            <Input name="name" defaultValue={product.name} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Price (₹)</Label>
              <Input
                name="price"
                type="number"
                defaultValue={product.price}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Original Price (Optional)</Label>
              <Input
                name="salePrice"
                type="number"
                defaultValue={product.sale_price || ""}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <VariantBuilder value={variants} onChange={setVariants} />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select 
              name="category" 
              defaultValue={product.category_id || undefined}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              name="description"
              defaultValue={product.description || ""}
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Promotion Labels</Label>
            <BadgeSelector value={badges} onChange={setBadges} />
          </div>

        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" className="font-bold" disabled={loading}>
          {loading ? (
            <Loader2 className="animate-spin mr-2" />
          ) : (
            "Update Product"
          )}
        </Button>
      </div>
    </form>
  );
}