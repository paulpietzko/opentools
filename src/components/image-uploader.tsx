"use client";

import type React from "react";
import { useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface ImageUploaderProps {
  onSelectImage: (result: string) => void;
}

export default function ImageUploader({ onSelectImage }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = useCallback(
    (
      event:
        | React.ChangeEvent<HTMLInputElement>
        | React.DragEvent<HTMLDivElement>
    ) => {
      let file: File | undefined;
      if ("dataTransfer" in event) {
        event.preventDefault();
        file = event.dataTransfer.files?.[0];
      } else {
        file = event.target.files?.[0];
      }
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onSelectImage(result);
      };
      reader.readAsDataURL(file);
    },
    [onSelectImage]
  );

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <>
      <div
        className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-gray-400 transition-colors"
        onClick={handleUploadClick}
        onDragOver={handleDragOver}
        onDrop={handleImageUpload}
      >
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Upload or Drag &amp; Drop an Image
        </h3>
        <p className="text-gray-600 mb-4">
          Click to select an image file or simply drop it here
        </p>
        <Button className="bg-blue-600 hover:bg-blue-700">Select Image</Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </>
  );
}
