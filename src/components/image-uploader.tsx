"use client";

import type React from "react";
import { useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface ImageUploaderProps {
  onSelectImage: (result: string) => void;
}

export default function ImageUploader({ onSelectImage }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadAreaRef = useRef<HTMLDivElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const processFile = useCallback(
    (file: File) => {
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
      if (file) {
        processFile(file);
      }
    },
    [processFile]
  );

  const handlePaste = useCallback(
    (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            processFile(file);
            break;
          }
        }
      }
    },
    [processFile]
  );

  useEffect(() => {
    // Add paste event listener to the document
    document.addEventListener("paste", handlePaste);

    // Cleanup on unmount
    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, [handlePaste]);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <>
      <div
        ref={uploadAreaRef}
        className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-gray-400 transition-colors"
        onClick={handleUploadClick}
        onDragOver={handleDragOver}
        onDrop={handleImageUpload}
        tabIndex={0} // Make the div focusable
      >
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Upload, Drag &amp; Drop, or Paste an Image
        </h3>
        <p className="text-gray-600 mb-4">
          Click to select an image file, drop it here, or paste (Ctrl+V) from
          clipboard
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
