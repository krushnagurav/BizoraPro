// src/components/dashboard/products/edit-form.tsx
/*  * Edit Product Form Component
 * This component provides a form
 * for editing product details,
 * including media, variants,
 * inventory, SEO, and publishing.
 */
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
import { Loader2, Save, FileText, Sparkles } from "lucide-react";
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
  const [name, setName] = useState(product.name || "");
  const [description, setDescription] = useState(product.description || "");
  const [price, setPrice] = useState<string>(
    product.price !== undefined && product.price !== null
      ? String(product.price)
      : "",
  );
  const [imageUrl, setImageUrl] = useState<string>(product.image_url || "");
  const [variants, setVariants] = useState<any[]>(product.variants || []);
  const [gallery, setGallery] = useState<string[]>(
    product.gallery_images || [],
  );
  const [badges, setBadges] = useState<string[]>(product.badges || []);
  const [skus, setSkus] = useState<any[]>(product.product_skus || []);
  const [stock, setStock] = useState<number>(product.stock_count ?? 0);

  const [seoTitle, setSeoTitle] = useState(product.seo_title || "");
  const [seoDescription, setSeoDescription] = useState(
    product.seo_description || "",
  );

  const [isSeoTitleEdited, setIsSeoTitleEdited] = useState(!!product.seo_title);
  const [isSeoDescEdited, setIsSeoDescEdited] = useState(
    !!product.seo_description,
  );

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setName(newVal);
    if (!isSeoTitleEdited) {
      setSeoTitle(newVal);
    }
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const newVal = e.target.value;
    setDescription(newVal);
    if (!isSeoDescEdited) {
      const cleanDesc = newVal.replace(/(\r\n|\n|\r)/gm, " ").substring(0, 160);
      setSeoDescription(cleanDesc);
    }
  };

  return (
    <form
      action={async (formData: FormData) => {
        setLoading(true);

        const status = formData.get("status") as "active" | "draft" | null;

        const rawData = {
          id: product.id,
          name: name,
          price: Number(price),
          salePrice: formData.get("salePrice")
            ? Number(formData.get("salePrice"))
            : null,
          category: formData.get("category") as string,
          description: description,
          seoTitle: seoTitle,
          seoDescription: seoDescription,
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
              : "Product updated successfully!",
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
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-card border-border/50">
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label>Product Name</Label>
                <Input
                  name="name"
                  value={name}
                  onChange={handleNameChange}
                  placeholder="e.g. Red Cotton Saree"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  name="description"
                  value={description}
                  onChange={handleDescriptionChange}
                  placeholder="Product details..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

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

          <Card className="bg-card border-border/50 overflow-hidden">
            <Accordion type="single" collapsible defaultValue="seo">
              <AccordionItem value="seo" className="border-0">
                <AccordionTrigger className="px-6 hover:no-underline py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">
                      Search Engine Optimization (SEO)
                    </span>
                    <Sparkles className="w-4 h-4 text-purple-500 animate-pulse" />
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-0 space-y-4">
                  <div className="p-4 bg-secondary/10 rounded-lg border border-border/50 mb-4">
                    <p className="text-xs text-muted-foreground mb-1">
                      Preview:
                    </p>
                    <h4 className="text-blue-500 text-lg font-medium hover:underline truncate cursor-pointer">
                      {seoTitle || "Product Title"}
                    </h4>
                    <p className="text-green-700 text-xs mb-1">
                      https://bizorapro.com/shop/product-slug
                    </p>
                    <p className="text-sm text-gray-400 line-clamp-2">
                      {seoDescription ||
                        "Product description will appear here..."}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>SEO Title</Label>
                      <span className="text-xs text-muted-foreground">
                        {seoTitle.length} / 60
                      </span>
                    </div>
                    <Input
                      name="seoTitle"
                      value={seoTitle}
                      onChange={(e) => {
                        setSeoTitle(e.target.value);
                        setIsSeoTitleEdited(true);
                      }}
                      placeholder="Product Name - Shop Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>SEO Description</Label>
                      <span className="text-xs text-muted-foreground">
                        {seoDescription.length} / 160
                      </span>
                    </div>
                    <Textarea
                      name="seoDescription"
                      value={seoDescription}
                      onChange={(e) => {
                        setSeoDescription(e.target.value);
                        setIsSeoDescEdited(true);
                      }}
                      placeholder="Short description..."
                      rows={2}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>
        </div>

        <div className="space-y-6">
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
                    <Save className="w-4 h-4 mr-2" /> Save Changes
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
                <FileText className="w-4 h-4 mr-2" /> Revert to Draft
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
          {loading ? <Loader2 className="animate-spin mr-2" /> : "Save Changes"}
        </Button>
      </div>

      <div className="h-20 lg:hidden" />
    </form>
  );
}
