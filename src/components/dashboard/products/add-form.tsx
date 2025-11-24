"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createProductAction } from "@/src/actions/product-actions";
import { ImageUpload } from "@/src/components/dashboard/image-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// Accept categories as a Prop
export function AddProductForm({ categories }: { categories: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    if (imageUrl) formData.append("imageUrl", imageUrl);

    const result = await createProductAction(formData);

    if (result?.error) {
      toast.error(result.error);
      setLoading(false);
    } else {
      toast.success("Product created!");
      router.push("/products");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card className="bg-card border-border/50">
        <CardContent className="pt-6">
          <Label className="mb-4 block">Product Image</Label>
          <ImageUpload value={imageUrl} onChange={setImageUrl} />
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
              <Input name="price" type="number" placeholder="999" required />
            </div>
            <div className="space-y-2">
              <Label>Original Price</Label>
              <Input name="salePrice" type="number" placeholder="1299" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select name="category">
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {/* DYNAMIC CATEGORIES FROM DB */}
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
  {cat.name}
</SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>No categories created</SelectItem>
                )}
              </SelectContent>
            </Select>
            {categories.length === 0 && (
               <p className="text-xs text-red-400">
                 You haven't created any categories yet. Go to the Categories page first.
               </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea name="description" placeholder="Details..." rows={4} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        <Button type="submit" className="font-bold" disabled={loading}>
          {loading ? <Loader2 className="animate-spin mr-2" /> : "Save Product"}
        </Button>
      </div>
    </form>
  );
}