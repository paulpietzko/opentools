"use client";

import type React from "react";

import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Download,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  RotateCcw,
  RefreshCw,
} from "lucide-react";
import ImageUploader from "@/components/image-uploader";

interface ImageState {
  rotation: number;
  scaleX: number;
  scaleY: number;
  flipX: boolean;
  flipY: boolean;
  borderRadius: number;
  brightness: number;
  contrast: number;
  saturation: number;
  width: number;
  height: number;
}

const initialState: ImageState = {
  rotation: 0,
  scaleX: 1,
  scaleY: 1,
  flipX: false,
  flipY: false,
  borderRadius: 0,
  brightness: 100,
  contrast: 100,
  saturation: 100,
  width: 0,
  height: 0,
};

export default function ImageEditorPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(
    null
  );
  const [imageState, setImageState] = useState<ImageState>(initialState);
  const [aspectRatioLocked, setAspectRatioLocked] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageSelect = useCallback((imageData: string) => {
    setSelectedImage(imageData);
    const img = new Image();
    img.onload = () => {
      setOriginalImage(img);
      setImageState({
        ...initialState,
        width: img.width,
        height: img.height,
      });
    };
    img.src = imageData;
  }, []);

  const applyImageEffects = useCallback(() => {
    const canvas = canvasRef.current;
    const img = originalImage;
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = imageState.width;
    canvas.height = imageState.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Save context
    ctx.save();

    // Apply border radius by clipping
    if (imageState.borderRadius > 0) {
      const radius = Math.min(
        imageState.borderRadius,
        canvas.width / 2,
        canvas.height / 2
      );
      ctx.beginPath();
      ctx.roundRect(0, 0, canvas.width, canvas.height, radius);
      ctx.clip();
    }

    // Move to center for transformations
    ctx.translate(canvas.width / 2, canvas.height / 2);

    // Apply rotation
    ctx.rotate((imageState.rotation * Math.PI) / 180);

    // Apply flips
    ctx.scale(imageState.flipX ? -1 : 1, imageState.flipY ? -1 : 1);

    // Apply filters
    ctx.filter = `brightness(${imageState.brightness}%) contrast(${imageState.contrast}%) saturate(${imageState.saturation}%)`;

    // Draw image
    ctx.drawImage(
      img,
      -canvas.width / 2,
      -canvas.height / 2,
      canvas.width,
      canvas.height
    );

    // Restore context
    ctx.restore();
  }, [originalImage, imageState]);

  useEffect(() => {
    applyImageEffects();
  }, [applyImageEffects]);

  const handleRotate = (degrees: number) => {
    setImageState((prev) => ({
      ...prev,
      rotation: (prev.rotation + degrees) % 360,
    }));
  };

  const handleFlip = (direction: "horizontal" | "vertical") => {
    setImageState((prev) => ({
      ...prev,
      [direction === "horizontal" ? "flipX" : "flipY"]:
        !prev[direction === "horizontal" ? "flipX" : "flipY"],
    }));
  };

  const handleSizeChange = (dimension: "width" | "height", value: number) => {
    if (!originalImage) return;

    const aspectRatio = originalImage.width / originalImage.height;

    if (aspectRatioLocked) {
      if (dimension === "width") {
        setImageState((prev) => ({
          ...prev,
          width: value,
          height: Math.round(value / aspectRatio),
        }));
      } else {
        setImageState((prev) => ({
          ...prev,
          height: value,
          width: Math.round(value * aspectRatio),
        }));
      }
    } else {
      setImageState((prev) => ({
        ...prev,
        [dimension]: value,
      }));
    }
  };

  const handleSliderChange = (property: keyof ImageState, value: number[]) => {
    setImageState((prev) => ({
      ...prev,
      [property]: value[0],
    }));
  };

  const handleReset = () => {
    if (originalImage) {
      setImageState({
        ...initialState,
        width: originalImage.width,
        height: originalImage.height,
      });
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = "edited-image.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleNewImage = () => {
    setSelectedImage(null);
    setOriginalImage(null);
    setImageState(initialState);
  };

  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Image Editor
          </h1>
          <p className="text-xl text-gray-600">
            Upload an image and edit it with various tools
          </p>
        </div>

        {!selectedImage ? (
          <ImageUploader onSelectImage={handleImageSelect} />
        ) : (
          /* Image Editor Interface */
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Side - Image Preview */}
            <div className="xl:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
                <div className="flex space-x-2">
                  <Button onClick={handleReset} variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                  <Button
                    onClick={handleDownload}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm p-4">
                <div className="flex justify-center">
                  <canvas
                    ref={canvasRef}
                    className="max-w-full max-h-[500px] border border-gray-100 rounded"
                    style={{ objectFit: "contain" }}
                  />
                </div>
              </div>
            </div>

            {/* Right Side - Controls */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Edit Tools
              </h3>

              {/* Transform Controls */}
              <Card className="border-gray-200">
                <CardContent className="p-4">
                  <h4 className="font-medium text-gray-900 mb-4">Transform</h4>

                  {/* Rotation */}
                  <div className="space-y-3 mb-4">
                    <Label className="text-sm font-medium">Rotation</Label>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleRotate(-90)}
                        variant="outline"
                        size="sm"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleRotate(90)}
                        variant="outline"
                        size="sm"
                      >
                        <RotateCw className="h-4 w-4" />
                      </Button>
                    </div>
                    <Slider
                      value={[imageState.rotation]}
                      onValueChange={(value) =>
                        handleSliderChange("rotation", value)
                      }
                      max={360}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                    <div className="text-xs text-gray-500">
                      {imageState.rotation}°
                    </div>
                  </div>

                  {/* Flip */}
                  <div className="space-y-3 mb-4">
                    <Label className="text-sm font-medium">Flip</Label>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleFlip("horizontal")}
                        variant={imageState.flipX ? "default" : "outline"}
                        size="sm"
                      >
                        <FlipHorizontal className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleFlip("vertical")}
                        variant={imageState.flipY ? "default" : "outline"}
                        size="sm"
                      >
                        <FlipVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Border Radius */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Border Radius</Label>
                    <Slider
                      value={[imageState.borderRadius]}
                      onValueChange={(value) =>
                        handleSliderChange("borderRadius", value)
                      }
                      max={100}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                    <div className="text-xs text-gray-500">
                      {imageState.borderRadius}px
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Size Controls */}
              <Card className="border-gray-200">
                <CardContent className="p-4">
                  <h4 className="font-medium text-gray-900 mb-4">Size</h4>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="aspectRatio"
                        checked={aspectRatioLocked}
                        onChange={(e) => setAspectRatioLocked(e.target.checked)}
                        className="rounded"
                      />
                      <Label htmlFor="aspectRatio" className="text-sm">
                        Lock aspect ratio
                      </Label>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-gray-500">Width</Label>
                        <Input
                          type="number"
                          value={imageState.width}
                          onChange={(e) =>
                            handleSizeChange(
                              "width",
                              Number.parseInt(e.target.value) || 0
                            )
                          }
                          className="h-8"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Height</Label>
                        <Input
                          type="number"
                          value={imageState.height}
                          onChange={(e) =>
                            handleSizeChange(
                              "height",
                              Number.parseInt(e.target.value) || 0
                            )
                          }
                          className="h-8"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Adjustments */}
              <Card className="border-gray-200">
                <CardContent className="p-4">
                  <h4 className="font-medium text-gray-900 mb-4">
                    Adjustments
                  </h4>

                  {/* Brightness */}
                  <div className="space-y-3 mb-4">
                    <Label className="text-sm font-medium">Brightness</Label>
                    <Slider
                      value={[imageState.brightness]}
                      onValueChange={(value) =>
                        handleSliderChange("brightness", value)
                      }
                      max={200}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                    <div className="text-xs text-gray-500">
                      {imageState.brightness}%
                    </div>
                  </div>

                  {/* Contrast */}
                  <div className="space-y-3 mb-4">
                    <Label className="text-sm font-medium">Contrast</Label>
                    <Slider
                      value={[imageState.contrast]}
                      onValueChange={(value) =>
                        handleSliderChange("contrast", value)
                      }
                      max={200}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                    <div className="text-xs text-gray-500">
                      {imageState.contrast}%
                    </div>
                  </div>

                  {/* Saturation */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Saturation</Label>
                    <Slider
                      value={[imageState.saturation]}
                      onValueChange={(value) =>
                        handleSliderChange("saturation", value)
                      }
                      max={200}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                    <div className="text-xs text-gray-500">
                      {imageState.saturation}%
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="pt-4">
                <Button
                  onClick={handleNewImage}
                  variant="outline"
                  className="w-full"
                >
                  Upload New Image
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
