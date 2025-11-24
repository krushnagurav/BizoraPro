"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createProductAction } from "@/src/actions/product-actions"; // The logic we already wrote
import { ImageUpload } from "@/src/components/dashboard/image-upload"; // The uploader we built
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    if (imageUrl) {
      formData.append("imageUrl", imageUrl); 
    }

    // Call Server Action
    // If successful, the server action will Redirect immediately.
    // We only reach the next line if there is an error returned (because redirect throws a special error caught by Next.js)
    const result = await createProductAction(formData);

    if (result?.error) {
      toast.error(result.error);
      setLoading(false);
    } 
    // No 'else' block needed for success redirect, 
    // but you might want to toast before the server action redirects.
    // Note: Toasts often get lost during server redirects unless you use a cookie-based toast system.
    // For MVP, just letting it redirect is fine.
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      {/* Back Button */}
      <Link href="/products" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-2 mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Products
      </Link>

      <h1 className="text-3xl font-bold text-primary mb-8">Add New Product</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Section 1: Image */}
        <Card className="bg-card border-border/50">
          <CardContent className="pt-6">
            <Label className="mb-4 block">Product Image</Label>
            {/* Reusing our ImageUpload Component */}
            <ImageUpload value={imageUrl} onChange={setImageUrl} />
          </CardContent>
        </Card>

        {/* Section 2: Product Details */}
        <Card className="bg-card border-border/50">
          <CardContent className="pt-6 space-y-4">
            
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input name="name" id="name" placeholder="e.g. Red Cotton Saree" required />
            </div>

            {/* Pricing Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹)</Label>
                <Input name="price" id="price" type="number" placeholder="999" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salePrice">Original Price (Optional)</Label>
                <Input name="salePrice" id="salePrice" type="number" placeholder="1299" />
                <p className="text-[10px] text-muted-foreground">Shows as strikethrough</p>
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>Category</Label>
              <Select name="category">
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fashion">Clothing</SelectItem>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Food">Food</SelectItem>
                  <SelectItem value="Beauty">Beauty</SelectItem>
                  {/* In Phase 2, we will fetch dynamic categories here */}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                name="description" 
                id="description" 
                placeholder="Enter product details..." 
                rows={4} 
              />
            </div>

          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" className="font-bold" disabled={loading}>
            {loading ? <Loader2 className="animate-spin mr-2" /> : "Save Product"}
          </Button>
        </div>

      </form>
    </div>
  );
}