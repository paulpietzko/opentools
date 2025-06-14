"use client";

import type React from "react";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wrench, ArrowLeft, Upload, Copy, Check } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/footer";

interface ColorInfo {
  hex: string;
  rgb: string;
  rgba: string;
  hsl: string;
  hsla: string;
}

interface MousePosition {
  x: number;
  y: number;
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function getColorInfo(r: number, g: number, b: number, a = 255): ColorInfo {
  const hex = `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  const rgb = `rgb(${r}, ${g}, ${b})`;
  const rgba = `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(2)})`;
  const [h, s, l] = rgbToHsl(r, g, b);
  const hsl = `hsl(${h}, ${s}%, ${l}%)`;
  const hsla = `hsla(${h}, ${s}%, ${l}%, ${(a / 255).toFixed(2)})`;

  return { hex, rgb, rgba, hsl, hsla };
}

export default function ColorPickerPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<ColorInfo | null>(null);
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const magnifierRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        setSelectedImage(result);
        setSelectedColor(null);
      };
      reader.readAsDataURL(file);
    },
    []
  );

  const getColorAtPosition = useCallback(
    (x: number, y: number): ColorInfo | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;

      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      const imageData = ctx.getImageData(x, y, 1, 1);
      const [r, g, b, a] = imageData.data;

      return getColorInfo(r, g, b, a);
    },
    []
  );

  const updateMagnifier = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;
    const magnifier = magnifierRef.current;
    if (!canvas || !magnifier) return;

    const ctx = canvas.getContext("2d");
    const magCtx = magnifier.getContext("2d");
    if (!ctx || !magCtx) return;

    magCtx.clearRect(0, 0, magnifier.width, magnifier.height);

    const magSize = 100;
    const zoomLevel = 8;
    const sourceSize = magSize / zoomLevel;

    const sourceX = Math.max(
      0,
      Math.min(canvas.width - sourceSize, x - sourceSize / 2)
    );
    const sourceY = Math.max(
      0,
      Math.min(canvas.height - sourceSize, y - sourceSize / 2)
    );

    magCtx.imageSmoothingEnabled = false;
    magCtx.drawImage(
      canvas,
      sourceX,
      sourceY,
      sourceSize,
      sourceSize,
      0,
      0,
      magSize,
      magSize
    );

    magCtx.strokeStyle = "#fff";
    magCtx.lineWidth = 2;
    magCtx.beginPath();
    magCtx.moveTo(magSize / 2 - 10, magSize / 2);
    magCtx.lineTo(magSize / 2 + 10, magSize / 2);
    magCtx.moveTo(magSize / 2, magSize / 2 - 10);
    magCtx.lineTo(magSize / 2, magSize / 2 + 10);
    magCtx.stroke();

    magCtx.strokeStyle = "#000";
    magCtx.lineWidth = 1;
    magCtx.strokeRect(0, 0, magSize, magSize);
  }, []);

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      const x = (event.clientX - rect.left) * scaleX;
      const y = (event.clientY - rect.top) * scaleY;

      setMousePosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });

      updateMagnifier(x, y);
    },
    [updateMagnifier]
  );

  const handleMouseEnter = useCallback(() => {
    setShowMagnifier(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setShowMagnifier(false);
  }, []);

  const handleCanvasClick = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      const x = (event.clientX - rect.left) * scaleX;
      const y = (event.clientY - rect.top) * scaleY;

      const color = getColorAtPosition(x, y);
      setSelectedColor(color);
    },
    [getColorAtPosition]
  );

  const handleImageLoad = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const maxWidth = 500;
    const maxHeight = 400;
    let { width, height } = img;

    if (width > maxWidth) {
      height = (height * maxWidth) / width;
      width = maxWidth;
    }
    if (height > maxHeight) {
      width = (width * maxHeight) / height;
      height = maxHeight;
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);
  }, []);

  const handleCopy = async (format: keyof ColorInfo) => {
    if (!selectedColor) return;

    try {
      await navigator.clipboard.writeText(selectedColor[format]);
      setCopiedFormat(format);
      setTimeout(() => setCopiedFormat(null), 2000);
    } catch (err) {
      console.error("Failed to copy color:", err);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleReset = () => {
    setSelectedImage(null);
    setSelectedColor(null);
    setCopiedFormat(null);
    setShowMagnifier(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Drag & Drop handlers
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button asChild variant="ghost" size="sm">
                <Link href="/tools" className="flex items-center space-x-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Tools</span>
                </Link>
              </Button>
              <div className="flex items-center space-x-2">
                <Wrench className="h-6 w-6 text-blue-600" />
                <span className="text-xl font-semibold text-gray-900">
                  OpenTools
                </span>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="https://www.paulpietzko.com"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Creator
              </Link>
              <Link
                href="https://github.com/paulpietzko/opentools/"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                GitHub
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Color Picker
          </h1>
          <p className="text-xl text-gray-600">
            Upload an image and click to extract colors
          </p>
        </div>

        {!selectedImage ? (
          /* Upload & Dropzone Area */
          <div className="space-y-8">
            <div
              className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-gray-400 transition-colors"
              onClick={handleUploadClick}
              onDragOver={handleDragOver}
              onDrop={handleImageUpload}
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Upload or Drag & Drop an Image
              </h3>
              <p className="text-gray-600 mb-4">
                Click to select an image file or simply drop it here
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Select Image
              </Button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        ) : (
          /* Color Picker Interface */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Image */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Image</h3>
              <div className="relative">
                <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                  <canvas
                    ref={canvasRef}
                    onClick={handleCanvasClick}
                    onMouseMove={handleMouseMove}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    className="cursor-crosshair max-w-full h-auto"
                  />
                  {selectedImage && (
                    <img
                      src={selectedImage || "/placeholder.svg"}
                      alt="Uploaded"
                      className="hidden"
                      onLoad={(e) =>
                        handleImageLoad(e.target as HTMLImageElement)
                      }
                      crossOrigin="anonymous"
                    />
                  )}
                </div>

                {/* Magnifier */}
                {showMagnifier && (
                  <div
                    className="absolute pointer-events-none z-10 border-2 border-white shadow-lg rounded-lg overflow-hidden"
                    style={{
                      left: mousePosition.x + 20,
                      top: mousePosition.y - 50,
                      width: 100,
                      height: 100,
                    }}
                  >
                    <canvas
                      ref={magnifierRef}
                      width={100}
                      height={100}
                      className="block"
                    />
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600">
                Hover to see magnified view, click to select a color
              </p>

              {/* Actions */}
              <div className="pt-4">
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="w-full"
                >
                  Upload New Image
                </Button>
              </div>
            </div>

            {/* Right Side - Color Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Color Information
              </h3>

              {/* Selected Color */}
              {selectedColor ? (
                <div className="space-y-4">
                  {/* Color Preview */}
                  <Card className="border-gray-200">
                    <CardContent className="p-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-4">
                        Selected Color
                      </h4>
                      <div
                        className="w-full h-20 rounded-lg border border-gray-200 mb-4 flex items-center justify-center"
                        style={{ backgroundColor: selectedColor.hex }}
                      >
                        <span
                          className="text-3xl font-mono font-bold "
                          style={{
                            color: (() => {
                              // Use luminance to determine if background is dark
                              const hex = selectedColor.hex.replace("#", "");
                              const r = parseInt(hex.substring(0, 2), 16);
                              const g = parseInt(hex.substring(2, 4), 16);
                              const b = parseInt(hex.substring(4, 6), 16);
                              const luminance =
                                0.299 * r + 0.587 * g + 0.114 * b;
                              return luminance < 140 ? "#fff" : "#111";
                            })(),
                          }}
                        >
                          {selectedColor.hex}
                        </span>
                      </div>

                      <h4 className="text-sm font-medium text-gray-700 mt-4 mb-4">
                        All Formats
                      </h4>
                      <div className="space-y-3">
                        {Object.entries(selectedColor).map(
                          ([format, value]) => (
                            <div
                              key={format}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <div>
                                <div className="text-xs font-medium text-gray-500 uppercase">
                                  {format}
                                </div>
                                <div className="font-mono text-sm text-gray-900">
                                  {value}
                                </div>
                              </div>
                              <Button
                                onClick={() =>
                                  handleCopy(format as keyof ColorInfo)
                                }
                                variant="outline"
                                size="sm"
                                className="h-8"
                              >
                                {copiedFormat === format ? (
                                  <>
                                    <Check className="h-3 w-3 mr-1" />
                                    Copied
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-3 w-3 mr-1" />
                                    Copy
                                  </>
                                )}
                              </Button>
                            </div>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card className="border-gray-200">
                  <CardContent className="p-8 text-center">
                    <div className="text-gray-400 mb-2">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-3" />
                    </div>
                    <p className="text-gray-600">
                      Click on the image to select a color
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
