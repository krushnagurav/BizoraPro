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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Save, FileText } from "lucide-react";
import { VariantBuilder } from "./variant-builder";
import { MultiImageUpload } from "../multi-image-upload";
import { BadgeSelector } from "./badge-selector";
import { SkuManager } from "./sku-manager";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function EditProductForm({
  product,
  categories,
  plan,
}: {
  product: any;
  categories: any[];
  plan: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Local state with safe defaults
  const [imageUrl, setImageUrl] = useState<string>(product.image_url || "");
  const [variants, setVariants] = useState<any[]>(product.variants || []);
  const [gallery, setGallery] = useState<string[]>(
    product.gallery_images || []
  );
  const [badges, setBadges] = useState<string[]>(product.badges || []);
  const [price, setPrice] = useState<string>(
    product.price !== undefined && product.price !== null
      ? String(product.price)
      : ""
  );
  const [skus, setSkus] = useState<any[]>(product.skus || []);
  const [stock, setStock] = useState<number>(product.stock_count ?? 0);

  return (
    <form
      action={async (formData: FormData) => {
        setLoading(true);

        const status = formData.get("status") as "active" | "draft" | null;

        const rawData = {
          id: product.id,
          name: formData.get("name") as string,
          price: Number(formData.get("price")),
          salePrice: formData.get("salePrice")
            ? Number(formData.get("salePrice"))
            : null,
          category: formData.get("category") as string,
          description: formData.get("description") as string,

          // SEO fields (use existing if left blank)
          seoTitle:
            (formData.get("seoTitle") as string) ?? (product.seo_title || ""),
          seoDescription:
            (formData.get("seoDescription") as string) ??
            (product.seo_description || ""),

          status:
            status ??
            (product.status as "active" | "draft" | undefined) ??
            "draft",

          imageUrl,
          variants: JSON.stringify(variants),
          productSkus: JSON.stringify(skus),
          galleryImages: JSON.stringify(gallery),
          badges: JSON.stringify(badges),
          stock: stock.toString(),
        };

        const result = await updateProductAction(rawData);
        setLoading(false);

        if (result?.serverError) {
          toast.error(result.serverError);
        } else if (result?.validationErrors) {
          const firstError = Object.values(result.validationErrors)[0];
          toast.error(firstError ? String(firstError) : "Validation Failed");
        } else if (result?.data?.success) {
          toast.success(
            rawData.status === "draft"
              ? "Draft updated successfully!"
              : "Product updated successfully!"
          );

          if (result.data.redirect) {
            router.push(result.data.redirect);
          } else {
            router.push("/products");
          }
          router.refresh();
        }
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: MAIN INFO */}
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Info */}
          <Card className="bg-card border-border/50">
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label>Product Name</Label>
                <Input
                  name="name"
                  defaultValue={product.name}
                  placeholder="e.g. Red Cotton Saree"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  name="description"
                  defaultValue={product.description || ""}
                  placeholder="Product details..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Media */}
          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle>Media</CardTitle>
            </CardHeader>
            <CardContent>
              <Label className="mb-4 block">Main Image</Label>
              <ImageUpload value={imageUrl} onChange={setImageUrl} />

              <div className="mt-6 pt-6 border-t border-border">
                <Label className="mb-4 block">Gallery Images (Pro)</Label>
                {plan === "pro" ? (
                  <MultiImageUpload value={gallery} onChange={setGallery} />
                ) : (
                  <div className="bg-secondary/10 border border-border rounded-lg p-4 text-xs text-muted-foreground">
                    Gallery images are available on the{" "}
                    <strong>Pro Plan</strong>. Upgrade to add more images.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Inventory & Variants */}
          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle>Inventory & Variants</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Price (₹)</Label>
                  <Input
                    name="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Original Price</Label>
                  <Input
                    name="salePrice"
                    type="number"
                    defaultValue={product.sale_price || ""}
                  />
                </div>
              </div>

              <VariantBuilder value={variants} onChange={setVariants} />

              <div className="mt-4">
                <SkuManager
                  variants={variants}
                  value={skus}
                  onChange={setSkus}
                  defaultPrice={Number(price) || 0}
                />
              </div>

              {variants.length === 0 && (
                <div className="space-y-2">
                  <Label>Stock Quantity</Label>
                  <Input
                    name="stock"
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* SEO Section */}
          <Card className="bg-card border-border/50 overflow-hidden">
            <Accordion type="single" collapsible>
              <AccordionItem value="seo" className="border-0">
                <AccordionTrigger className="px-6 hover:no-underline py-4">
                  <span className="font-bold text-lg">
                    Search Engine Optimization (SEO)
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-0 space-y-4">
                  <div className="space-y-2">
                    <Label>SEO Title</Label>
                    <Input
                      name="seoTitle"
                      placeholder="Product Name - Shop Name"
                    />
                    <p className="text-xs text-muted-foreground">
                      Leave blank to use default.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>SEO Description</Label>
                    <Textarea
                      name="seoDescription"
                      placeholder="Short description..."
                      rows={2}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>
        </div>

        {/* RIGHT COLUMN: SIDEBAR */}
        <div className="space-y-6">
          {/* Organization */}
          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle>Organization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  name="category"
                  defaultValue={product.category_id || undefined}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.length > 0 ? (
                      categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        No categories
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Badges</Label>
                <BadgeSelector value={badges} onChange={setBadges} />
              </div>
            </CardContent>
          </Card>

          {/* Publish / Status Actions */}
          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle>Publish</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Button
                type="submit"
                name="status"
                value="active"
                className="w-full font-bold"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="animate-spin mr-2" />
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" /> Save & Publish
                  </>
                )}
              </Button>

              <Button
                type="submit"
                name="status"
                value="draft"
                variant="outline"
                className="w-full"
                disabled={loading}
              >
                <FileText className="w-4 h-4 mr-2" /> Save as Draft
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full mt-2"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#0A0A0A] border-t border-border/50 lg:hidden z-50 flex gap-3">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1 font-bold bg-primary text-black"
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin mr-2" /> : "Save Product"}
        </Button>
      </div>

      <div className="h-20 lg:hidden" />
    </form>
  );
}