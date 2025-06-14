"use client";

import { useState, useMemo } from "react";
import { diffWords, diffChars } from "diff";
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
import Footer from "@/components/footer";

/**
 * The approach here is:
 * 1) Use diffWords to split text changes word-by-word.
 * 2) When a word is "removed" or "added," use diffChars to highlight which characters changed
 *    within that word. For the entire changed word (on left for removed, right for added),
 *    use a lighter background color, and for the specific changed characters, use a darker color.
 *
 * - Left side (old text) only shows removals in red, normal words in default color.
 * - Right side (new text) only shows additions in green, normal words in default color.
 */

interface WordDiff {
  value: string;
  added?: boolean;
  removed?: boolean;
}

function highlightWordDifferences(
  fullWord: string,
  isAdded: boolean,
  isRemoved: boolean
) {
  // Use diffChars to find changed characters in the single word chunk
  // Since we only have the "current" chunk, we can show everything as changed
  // or compare it to an empty string for a simpler highlight
  const reference = ""; // compare to empty so all characters appear as changed
  const charDiff = diffChars(reference, fullWord);

  // Outer word styling (lighter background)
  const wordBg = isRemoved
    ? "bg-red-50 text-red-700"
    : "bg-green-50 text-green-700";

  // Inner character styling (darker background)
  const charBg = isRemoved
    ? "bg-red-200 text-red-900"
    : "bg-green-200 text-green-900";

  return (
    <span className={`${wordBg} px-0.5 rounded`}>
      {charDiff.map((c, idx) => {
        // For matching characters, it's "added" from empty => highlight darker
        // For simplicity, highlight all characters as "changed"
        return (
          <span key={idx} className={charBg}>
            {c.value}
          </span>
        );
      })}
    </span>
  );
}

function DiffText({
  oldText,
  newText,
  side,
  onDiffClick,
}: {
  oldText: string;
  newText: string;
  side: "left" | "right";
  onDiffClick: (value: string, side: "left" | "right") => void;
}) {
  const wordDiffs = diffWords(oldText, newText);

  return (
    <div className="font-mono text-sm leading-relaxed whitespace-pre-wrap break-words">
      {wordDiffs.map((diff, idx) => {
        const { value, added, removed } = diff as WordDiff;

        // If it's the left side, we only show normal or removed text
        if (side === "left") {
          if (added) {
            // In the left side, we skip additions
            return null;
          } else if (removed) {
            // Removed chunk => highlight
            return (
              <TooltipProvider key={idx}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => onDiffClick(value, side)}
                    >
                      {highlightWordDifferences(value, false, true)}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top" sideOffset={6} className="text-xs">
                    <p>Removed word(s)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          } else {
            // Unchanged => print as normal
            return <span key={idx}>{value}</span>;
          }
        }

        // If it's the right side, we only show normal or added text
        if (side === "right") {
          if (removed) {
            // In the right side, we skip removals
            return null;
          } else if (added) {
            // Added chunk => highlight
            return (
              <TooltipProvider key={idx}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => onDiffClick(value, side)}
                    >
                      {highlightWordDifferences(value, true, false)}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top" sideOffset={6} className="text-xs">
                    <p>Added word(s)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          } else {
            // Unchanged => print as normal
            return <span key={idx}>{value}</span>;
          }
        }

        return null;
      })}
    </div>
  );
}

export default function TextDiffPage() {
  const [oldText, setOldText] = useState("");
  const [newText, setNewText] = useState("");
  const [showDiff, setShowDiff] = useState(false);
  const [copiedSide, setCopiedSide] = useState<"left" | "right" | null>(null);

  const handleCheckDiff = () => {
    setShowDiff(true);
  };

  const handleReset = () => {
    setShowDiff(false);
    setOldText("");
    setNewText("");
  };

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

  const onDiffClick = (value: string, side: "left" | "right") => {
    console.log("Diff clicked:", { value, side });
    // Future: Implement a merge feature or other actions
  };

  const stats = useMemo(() => {
    if (!showDiff || (!oldText && !newText)) {
      return { removals: 0, additions: 0 };
    }
    const diffs = diffWords(oldText, newText);
    const removals = diffs.filter((d) => d.removed).length;
    const additions = diffs.filter((d) => d.added).length;
    return { removals, additions };
  }, [oldText, newText, showDiff]);

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

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-1">
              {/* Left Side - old text (red) */}
              <div className="border border-gray-200 bg-white p-4 font-mono text-sm">
                <DiffText
                  oldText={oldText}
                  newText={newText}
                  side="left"
                  onDiffClick={onDiffClick}
                />
              </div>

              {/* Right Side - new text (green) */}
              <div className="border border-gray-200 bg-white p-4 font-mono text-sm">
                <DiffText
                  oldText={oldText}
                  newText={newText}
                  side="right"
                  onDiffClick={onDiffClick}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
