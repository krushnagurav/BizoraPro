"use client";

import { useState } from "react";
import { createProductAction } from "@/src/actions/product-actions";
import { ImageUpload } from "@/src/components/dashboard/image-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ShoppingBag, Rocket, Loader2 } from "lucide-react";

export function Step3Form() {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    // 1. Prepare Data Object (Matching the Safe Action Schema)
    const rawData = {
      name: formData.get("name") as string,
      price: Number(formData.get("price")),
      imageUrl: imageUrl, // Pass the uploaded image URL
      // Optional fields can be null/empty for the first product
      description: "",
      category: "",
      salePrice: null,
      variants: "[]",
      galleryImages: "[]",
      badges: "[]"
    };

    // 2. Call the Server Action
    const result = await createProductAction(rawData);

    setLoading(false);

    // 3. Handle Result
    if (result?.serverError) {
       toast.error("Server Error: " + result.serverError);
    } else if (result?.validationErrors) {
       const firstError = Object.values(result.validationErrors)[0];
       toast.error(firstError ? String(firstError) : "Validation Failed");
    } else if (result?.data?.success) {
       toast.success("Shop Launched Successfully! 🚀");
       // Force a hard refresh/redirect to ensure dashboard loads fresh
       if (result.data.redirect) {
           window.location.href = result.data.redirect;
       }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)]">
           <ShoppingBag className="w-8 h-8 text-purple-500" />
        </div>
      </div>

      {/* Real Image Uploader */}
      <div className="space-y-2">
        <Label className="text-gray-300">Product Image (Optional)</Label>
        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-4">
           <ImageUpload value={imageUrl} onChange={setImageUrl} />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-gray-300">Product Name</Label>
        <Input 
          name="name" 
          placeholder="e.g. Red Cotton Saree" 
          className="bg-[#0A0A0A] border-white/10 h-12 text-white placeholder:text-gray-600 focus-visible:ring-purple-500/50"
          required 
        />
      </div>

      <div className="space-y-2">
        <Label className="text-gray-300">Price (₹)</Label>
        <Input 
          name="price" 
          type="number" 
          placeholder="999" 
          className="bg-[#0A0A0A] border-white/10 h-12 text-white focus-visible:ring-purple-500/50"
          required 
        />
      </div>

      <div className="pt-4">
        <Button 
          type="submit" 
          className="w-full h-12 font-bold text-lg bg-primary text-black hover:bg-primary/90 gap-2"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="animate-spin w-5 h-5" />
          ) : (
            <>
              <Rocket className="w-5 h-5" /> Launch Shop
            </>
          )}
        </Button>
        
        <p 
          onClick={() => {
             toast.info("Skipping product setup...");
             window.location.href = "/dashboard";
          }}
          className="text-center text-xs text-gray-500 mt-4 cursor-pointer hover:text-white hover:underline"
        >
           Skip for now
        </p>
      </div>
    </form>
  );
}