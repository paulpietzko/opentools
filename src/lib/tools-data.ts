import { ChartNoAxesColumn, Edit, FileImage, GitCompare, LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  status: "available" | "coming-soon" | "beta";
  href: string;
  featured?: boolean;
}

export const categories = [
  { id: "all", name: "All Tools", count: 0 },
  { id: "image", name: "Image Tools", count: 0 },
  { id: "text", name: "Text Tools", count: 0 },
  { id: "developer", name: "Developer Tools", count: 0 },
  { id: "converter", name: "Converters", count: 0 },
  { id: "utility", name: "Utilities", count: 0 },
];

export const tools: Tool[] = [
  {
    id: "text-diff",
    name: "Text Diff Checker",
    description: "Compare two texts and highlight the differences",
    category: "text",
    icon: GitCompare,
    status: "available",
    href: "/tools/diff-checker",
    featured: false,
  },
  {
    id: "color-picker",
    name: "Color Picker",
    description: "Pick and copy colors from a palette or your screen",
    category: "utility",
    icon: FileImage,
    status: "available",
    href: "/tools/color-picker",
    featured: false,
  },
  {
    id: "analytic-metrics",
    name: "Analytic Metrics",
    description: "Analyze and visualize data with various metrics",
    category: "utility",
    icon: ChartNoAxesColumn,
    status: "available",
    href: "https://www.nanosights.dev",
    featured: true,
  },
  {
    id: "image-editor",
    name: "Image Editor",
    description: "Edit images with rotation, resizing, filters, and more",
    category: "image",
    icon: Edit,
    status: "available",
    href: "/tools/image-editor",
    featured: false,
  },
  {
    id: "image-compressor",
    name: "Image Compressor",
    description: "Compress images to reduce file size without losing quality",
    category: "image",
    icon: FileImage,
    status: "coming-soon",
    href: "/tools/image-compressor",
  },
];
