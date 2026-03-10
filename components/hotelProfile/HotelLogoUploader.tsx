"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Props = {
  logoUrl: string;
  onUpload: (file: File) => Promise<string | void>;
};

export function HotelLogoUploader({ logoUrl, onUpload }: Props) {
  const [uploading, setUploading] = useState(false);

  const handleChange = async (file: File | null) => {
    if (!file || uploading) return;
    try {
      setUploading(true);

      // Center‑crop and resize to 512x512 similar to previous implementation
      const imageDataUrl: string = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
      });

      const image: HTMLImageElement = await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = (e) => reject(e);
        img.src = imageDataUrl;
      });

      const size = Math.min(image.width, image.height);
      const sx = (image.width - size) / 2;
      const sy = (image.height - size) / 2;

      const canvas = document.createElement("canvas");
      const targetSize = 512;
      canvas.width = targetSize;
      canvas.height = targetSize;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Failed to get canvas context");

      ctx.drawImage(image, sx, sy, size, size, 0, 0, targetSize, targetSize);

      const croppedBlob: Blob = await new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error("Failed to crop image"));
          } else {
            resolve(blob);
          }
        }, "image/png");
      });

      const croppedFile = new File(
        [croppedBlob],
        file.name.replace(/\.[^.]+$/, "") + "-cropped.png",
        { type: "image/png" },
      );

      await onUpload(croppedFile);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="border-0 bg-gradient-to-br from-violet-500/10 via-fuchsia-500/5 to-pink-500/10 backdrop-blur">
      <div className="p-4 border-b border-violet-500/30">
        <p className="text-sm font-semibold text-violet-900 dark:text-violet-100">
          Logo & Branding
        </p>
        <p className="text-xs text-violet-900/70 dark:text-violet-100/70">
          Upload or replace your primary hotel logo.
        </p>
      </div>
      <div className="p-4 flex items-center gap-4">
        <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-violet-200 bg-white shadow-sm">
          <img
            src={logoUrl || "https://via.placeholder.com/150"}
            alt="Hotel logo"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-violet-900 dark:text-violet-100">
            Logo image
          </p>
          <p className="text-[11px] text-violet-900/70 dark:text-violet-100/70">
            Recommended 512×512px, PNG or SVG.
          </p>
          <Button asChild size="sm" variant="outline" className="text-xs mt-1">
            <label className="cursor-pointer">
              <span>{uploading ? "Uploading..." : "Upload logo"}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleChange(e.target.files?.[0] || null)}
              />
            </label>
          </Button>
        </div>
      </div>
    </Card>
  );
}

