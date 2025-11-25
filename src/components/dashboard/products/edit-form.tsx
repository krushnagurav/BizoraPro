"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { updateProductAction } from "@/src/actions/product-actions";
import { VariantBuilder } from "./variant-builder";
import { MultiImageUpload } from "../multi-image-upload";

export function EditProductForm({
  product,
  categories,
}: {
  product: any;
  categories: any[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(product.image_url);
  
  const [variants, setVariants] = useState<any[]>(product.variants || []);
  const [gallery, setGallery] = useState<string[]>(product?.gallery_images || []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    formData.append("id", product.id);
    formData.append("variants", JSON.stringify(variants));
    formData.append("galleryImages", JSON.stringify(gallery));
    
    if (imageUrl !== product.image_url) {
      formData.append("imageUrl", imageUrl);
    }

    const result = await updateProductAction(formData);

    if (result?.error) {
      toast.error(result.error);
      setLoading(false);
    } else {
      toast.success("Product updated!");
      router.push("/products");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Image Upload */}
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

      {/* Details */}
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
        </CardContent>
      </Card>

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