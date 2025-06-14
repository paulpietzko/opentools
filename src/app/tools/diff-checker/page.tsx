"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Wrench, ArrowLeft, Copy, Check } from "lucide-react";
import Link from "next/link";

interface DiffResult {
  type: "equal" | "delete" | "insert";
  value: string;
}

function computeDiff(
  oldText: string,
  newText: string
): { left: DiffResult[]; right: DiffResult[] } {
  const left: DiffResult[] = [];
  const right: DiffResult[] = [];

  let i = 0,
    j = 0;

  while (i < oldText.length || j < newText.length) {
    if (i < oldText.length && j < newText.length && oldText[i] === newText[j]) {
      // Characters match - show on both sides
      left.push({ type: "equal", value: oldText[i] });
      right.push({ type: "equal", value: newText[j] });
      i++;
      j++;
    } else {
      // Find next matching sequence
      let foundMatch = false;

      // Look ahead for matches
      for (let k = 1; k <= 10; k++) {
        if (
          i + k < oldText.length &&
          j < newText.length &&
          oldText[i + k] === newText[j]
        ) {
          // Deletion in old text
          for (let l = 0; l < k; l++) {
            left.push({ type: "delete", value: oldText[i + l] });
          }
          i += k;
          foundMatch = true;
          break;
        }
        if (
          j + k < newText.length &&
          i < oldText.length &&
          oldText[i] === newText[j + k]
        ) {
          // Insertion in new text
          for (let l = 0; l < k; l++) {
            right.push({ type: "insert", value: newText[j + l] });
          }
          j += k;
          foundMatch = true;
          break;
        }
      }

      if (!foundMatch) {
        // Handle single character diff
        if (i < oldText.length) {
          left.push({ type: "delete", value: oldText[i] });
          i++;
        }
        if (j < newText.length) {
          right.push({ type: "insert", value: newText[j] });
          j++;
        }
      }
    }
  }

  return { left, right };
}

function DiffText({
  diffs,
  side,
  onDiffClick,
}: {
  diffs: DiffResult[];
  side: "left" | "right";
  onDiffClick: (type: string, value: string, side: "left" | "right") => void;
}) {
  return (
    <div className="font-mono text-sm leading-relaxed whitespace-pre-wrap break-words">
      {diffs.map((diff, index) => {
        if (diff.type === "equal") {
          return <span key={index}>{diff.value}</span>;
        }

        const isHighlighted =
          (side === "left" && diff.type === "delete") ||
          (side === "right" && diff.type === "insert");

        if (!isHighlighted) {
          return <span key={index}>{diff.value}</span>;
        }

        const bgColor =
          diff.type === "delete"
            ? "bg-red-100 text-red-800"
            : "bg-green-100 text-green-800";
        const tooltipText =
          diff.type === "delete"
            ? "Keep this text (merge from old)"
            : "Keep this text (merge from new)";

        return (
          <TooltipProvider key={index}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span
                  className={`${bgColor} cursor-pointer hover:opacity-80 transition-opacity px-0.5 rounded`}
                  onClick={() => onDiffClick(diff.type, diff.value, side)}
                >
                  {diff.value}
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={6} className="text-xs">
                <p>{tooltipText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </div>
  );
}

export default function TextDiffPage() {
  const [oldText, setOldText] = useState("");
  const [newText, setNewText] = useState("");
  const [showDiff, setShowDiff] = useState(false);
  const [copiedSide, setCopiedSide] = useState<"left" | "right" | null>(null);

  const diffResult = useMemo(() => {
    if (!showDiff || (!oldText && !newText)) return null;
    return computeDiff(oldText, newText);
  }, [oldText, newText, showDiff]);

  const stats = useMemo(() => {
    if (!diffResult) return { removals: 0, additions: 0 };

    const removals = diffResult.left.filter((d) => d.type === "delete").length;
    const additions = diffResult.right.filter(
      (d) => d.type === "insert"
    ).length;

    return { removals, additions };
  }, [diffResult]);

  const handleCopy = async (side: "left" | "right") => {
    const textToCopy = side === "left" ? oldText : newText;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedSide(side);
      setTimeout(() => setCopiedSide(null), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const handleDiffClick = (
    type: string,
    value: string,
    side: "left" | "right"
  ) => {
    console.log("Diff clicked:", { type, value, side });
    // Future: Implement merge functionality
  };

  const handleCheckDiff = () => {
    setShowDiff(true);
  };

  const handleReset = () => {
    setShowDiff(false);
    setOldText("");
    setNewText("");
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
            Text Diff Checker
          </h1>
          <p className="text-xl text-gray-600">
            Compare two texts and see the differences highlighted
          </p>
        </div>

        {!showDiff ? (
          /* Input Mode */
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Old Text */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Old Text
                </label>
                <Textarea
                  value={oldText}
                  onChange={(e) => setOldText(e.target.value)}
                  placeholder="Paste your original text here..."
                  className="min-h-[300px] font-mono text-sm"
                />
              </div>

              {/* New Text */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  New Text
                </label>
                <Textarea
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="Paste your updated text here..."
                  className="min-h-[300px] font-mono text-sm"
                />
              </div>
            </div>

            {/* Action Button */}
            <div className="text-center">
              <Button
                onClick={handleCheckDiff}
                disabled={!oldText && !newText}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700"
              >
                Check Differences
              </Button>
            </div>
          </div>
        ) : (
          /* Diff Results */
          <div className="space-y-6">
            {/* Stats Header */}
            <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-6">
                {stats.removals > 0 && (
                  <span className="text-sm text-red-600 font-medium">
                    − {stats.removals} removal{stats.removals !== 1 ? "s" : ""}
                  </span>
                )}
                {stats.additions > 0 && (
                  <span className="text-sm text-green-600 font-medium">
                    + {stats.additions} addition
                    {stats.additions !== 1 ? "s" : ""}
                  </span>
                )}
                {stats.removals === 0 && stats.additions === 0 && (
                  <span className="text-sm text-gray-600">
                    No differences found
                  </span>
                )}
                <Button
                  onClick={() => handleCopy("left")}
                  variant="outline"
                  size="sm"
                  className="h-8"
                >
                  {copiedSide === "left" ? (
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
              <Button onClick={handleReset} variant="outline" size="sm">
                New Comparison
              </Button>
            </div>

            {/* Diff Display */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-1">
              {/* Left Side - Old Text with deletions highlighted */}
              <div className="border border-gray-200 bg-white p-4 font-mono text-sm">
                {diffResult && (
                  <DiffText
                    diffs={diffResult.left}
                    side="left"
                    onDiffClick={handleDiffClick}
                  />
                )}
              </div>

              {/* Right Side - New Text with additions highlighted */}
              <div className="border border-gray-200 bg-white p-4 font-mono text-sm">
                {diffResult && (
                  <DiffText
                    diffs={diffResult.right}
                    side="right"
                    onDiffClick={handleDiffClick}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <Wrench className="h-5 w-5 text-blue-600" />
              <span className="text-sm text-gray-600">
                © 2024 <a href="https://www.paulpietzko.com">Paul Pietzko</a>.
                Open source and free to use.
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <Link
                href="https://github.com/paulpietzko/opentools/blob/main/CONTRIBUTING.md"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Contributing Guide
              </Link>
              <Link
                href="https://github.com/paulpietzko/opentools/"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                GitHub
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
