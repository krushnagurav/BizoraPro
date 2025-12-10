// src/components/dashboard/image-upload.tsx
/*  * Image Upload Component
 * This component allows users to upload a single image,
 * compresses it for optimized storage, and uploads it
 * to Supabase Storage. It also provides functionality to
 * remove the uploaded image.
 */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, X, Loader2 } from "lucide-react";
import Image from "next/image";
import imageCompression from "browser-image-compression";
import { createClient } from "@/src/lib/supabase/client";
import { toast } from "sonner";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1080,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);

      const supabase = createClient();
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, compressedFile);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      onChange(data.publicUrl);
      toast.success("Image uploaded");
    } catch (error) {
      console.error(error);
      toast.error("Image upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  if (value) {
    return (
      <div className="relative w-[200px] h-[200px] rounded-md overflow-hidden border border-border">
        <div className="z-10 absolute top-2 right-2">
          <Button
            type="button"
            onClick={() => onChange("")}
            variant="destructive"
            size="icon"
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <Image
          fill
          className="object-cover"
          alt="Product"
          src={value}
          unoptimized
        />
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center">
      <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-lg cursor-pointer bg-card hover:bg-secondary/50 transition">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {isUploading ? (
            <Loader2 className="w-10 h-10 text-muted-foreground animate-spin" />
          ) : (
            <ImagePlus className="w-10 h-10 text-muted-foreground mb-3" />
          )}
          <p className="mb-2 text-sm text-muted-foreground">
            <span className="font-semibold">Click to upload</span> or drag and
            drop
          </p>
          <p className="text-xs text-muted-foreground">JPG, PNG (MAX. 5MB)</p>
        </div>
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={onUpload}
          disabled={disabled || isUploading}
        />
      </label>
    </div>
  );
}
