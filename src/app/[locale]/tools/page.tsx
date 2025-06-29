"use client";

import ToolCard from "@/components/tools/tool-card";
import { tools } from "@/lib/tools-data";

export default function ToolsPage() {
  return (
    <div className="min-h-screen">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">All Tools</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Simple, focused utilities for your everyday tasks
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-12">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </main>
    </div>
  );
}
