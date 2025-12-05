"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, X, Loader2 } from "lucide-react";
import Image from "next/image";
import imageCompression from "browser-image-compression";
import { createClient } from "@/src/lib/supabase/client";
import { toast } from "sonner";

interface MultiImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  disabled?: boolean;
}

export function MultiImageUpload({
  value,
  onChange,
  disabled,
}: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newUrls: string[] = [];

    try {
      const supabase = createClient();

      // Loop through selected files
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // 1. Compress
        const options = {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1000,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);

        // 2. Upload
        const fileExt = file.name.split(".").pop();
        const fileName = `gallery/${Math.random()}.${fileExt}`;

        const { error } = await supabase.storage
          .from("product-images")
          .upload(fileName, compressedFile);

        if (error) throw error;

        // 3. Get URL
        const { data } = supabase.storage
          .from("product-images")
          .getPublicUrl(fileName);

        newUrls.push(data.publicUrl);
      }

      // Add new URLs to existing list
      onChange([...value, ...newUrls]);
      toast.success("Images uploaded!");
    } catch (error) {
      console.error(error);
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (urlToRemove: string) => {
    onChange(value.filter((url) => url !== urlToRemove));
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-4">
        {value.map((url) => (
          <div
            key={url}
            className="relative aspect-square rounded-md overflow-hidden border border-border group"
          >
            <div className="z-10 absolute top-1 right-1">
              <Button
                type="button"
                onClick={() => removeImage(url)}
                variant="destructive"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <Image
              fill
              className="object-cover"
              alt="Gallery Image"
              src={url}
              unoptimized // Fix for local dev issue
            />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <label className="cursor-pointer">
          <div className="flex items-center gap-2 text-sm font-medium text-primary hover:underline">
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ImagePlus className="h-4 w-4" />
            )}
            {isUploading ? "Uploading..." : "Add More Images"}
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            multiple // Allow selecting multiple files
            onChange={onUpload}
            disabled={disabled || isUploading}
          />
        </label>
      </div>
    </div>
  );
}
