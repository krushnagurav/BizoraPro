"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

type ProductGalleryProps = {
  name: string;
  mainImage: string;
  gallery: string[];
};

export function ProductGallery({
  name,
  mainImage,
  gallery,
}: ProductGalleryProps) {
  const allImages = [mainImage, ...(gallery || [])].filter(Boolean);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const currentImage = allImages[activeIndex] || mainImage;

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % allImages.length);
  };

  if (!currentImage) {
    return (
      <div className="aspect-square w-full rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
        No Image
      </div>
    );
  }

  return (
    <>
      {/* Main image with hover zoom & click-to-open */}
      <div
        className="group relative aspect-square w-full bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden cursor-zoom-in"
        onClick={() => setLightboxOpen(true)}
      >
        <Image
          src={currentImage}
          alt={name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          unoptimized
        />
      </div>

      {/* Thumbnails row */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar mt-3 pb-1">
          {allImages.map((img, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative w-16 h-16 rounded-lg overflow-hidden border ${
                index === activeIndex
                  ? "border-primary ring-2 ring-primary/40"
                  : "border-slate-200 hover:border-primary/60"
              }`}
            >
              <Image
                src={img}
                alt={`${name} ${index + 1}`}
                fill
                className="object-cover"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox overlay */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center">
          <button
            type="button"
            className="absolute top-4 right-4 text-white/80 hover:text-white"
            onClick={() => setLightboxOpen(false)}
          >
            <X className="w-7 h-7" />
          </button>

          {allImages.length > 1 && (
            <>
              <button
                type="button"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
                onClick={goPrev}
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
                onClick={goNext}
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          <div className="relative w-[90vw] max-w-3xl aspect-[4/3]">
            <Image
              src={currentImage}
              alt={name}
              fill
              className="object-contain"
              unoptimized
            />
          </div>
        </div>
      )}
    </>
  );
}
