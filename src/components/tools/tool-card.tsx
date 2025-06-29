import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

import { type Tool } from "@/lib/tools-data";

export default function ToolCard({ tool }: { tool: Tool }) {
  const Icon = tool.icon;

  return (
    <Card>
      <CardContent className="p-8 text-center">
        <div className="mb-6">
          <div className="inline-flex p-4 bg-muted rounded-lg mb-4">
            <Icon className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-semibold mb-2">{tool.name}</h3>
          <p className="text-sm leading-relaxed">{tool.description}</p>
        </div>

        {tool.status === "available" ? (
          <Button asChild className="w-full">
            <Link href={tool.href}>Use Tool</Link>
          </Button>
        ) : (
          <div className="space-y-2">
            <Badge variant="secondary">Coming Soon</Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
