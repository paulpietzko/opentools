import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

import { type Tool } from "@/lib/tools-data";

export default function ToolCard({ tool }: { tool: Tool }) {
  const Icon = tool.icon;

  return (
    <Card className="border-gray-200 hover:border-gray-300 transition-colors">
      <CardContent className="p-8 text-center">
        <div className="mb-6">
          <div className="inline-flex p-4 bg-gray-50 rounded-lg mb-4">
            <Icon className="h-8 w-8 text-gray-700" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {tool.name}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {tool.description}
          </p>
        </div>

        {tool.status === "available" ? (
          <Button asChild className="w-full">
            <Link href={tool.href}>Use Tool</Link>
          </Button>
        ) : (
          <div className="space-y-2">
            <Badge variant="secondary" className="bg-gray-100 text-gray-600">
              Coming Soon
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}