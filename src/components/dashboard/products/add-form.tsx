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
  const [price, setPrice] = useState("");
  const [variants, setVariants] = useState<any[]>([]);
  const [gallery, setGallery] = useState<string[]>([]);
  const [badges, setBadges] = useState<string[]>([]);
  const [skus, setSkus] = useState<any[]>([]);
  const [stock, setStock] = useState(0);

  return (
    <form
      action={async (formData) => {
        setLoading(true);
        // Get status from the clicked button
        // We will handle this by appending status manually in the action call below
        // ACTUALLY: Better pattern ->
        // We extract data here.

        const status = formData.get("status") as "active" | "draft"; // Gets value from clicked button

        const rawData = {
          name: formData.get("name") as string,
          price: Number(formData.get("price")),
          salePrice: formData.get("salePrice")
            ? Number(formData.get("salePrice"))
            : null,
          category: formData.get("category") as string,
          description: formData.get("description") as string,

          // NEW SEO Fields
          seoTitle: formData.get("seoTitle") as string,
          seoDescription: formData.get("seoDescription") as string,
          status: status, // Pass status

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
          toast.error(result.serverError);
        } else if (result?.validationErrors) {
          const firstError = Object.values(result.validationErrors)[0];
          toast.error(firstError ? String(firstError) : "Validation Failed");
        } else if (result?.data?.success) {
          toast.success(
            status === "draft" ? "Draft Saved!" : "Product Published!",
          );
          if (result.data.redirect) {
            router.push(result.data.redirect);
            router.refresh();
          }
        }
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: MAIN INFO */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-card border-border/50">
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label>Product Name</Label>
                <Input
                  name="name"
                  placeholder="e.g. Red Cotton Saree"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  name="description"
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
                  <div className="text-xs text-muted-foreground p-4 bg-secondary/10 rounded">
                    Upgrade to add more images.
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
                  <Input name="salePrice" type="number" />
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
          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle>Organization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select name="category">
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

          {/* 👇 ACTIONS CARD 👇 */}
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
