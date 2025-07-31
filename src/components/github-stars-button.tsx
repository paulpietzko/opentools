"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { StarIcon } from "lucide-react";

export default function GitHubStarsButton() {
  const [stars, setStars] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStars = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/repos/paulpietzko/opentools`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch repository data");
        }
        const data = await response.json();
        setStars(data.stargazers_count);
      } catch (error) {
        console.error("Error fetching GitHub stars:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStars();
  });

  return (
    <Button
      variant="outline"
      size="sm"
      className={`flex items-center gap-1`}
      asChild
    >
      <a
        href={`https://github.com/paulpietzko/opentools`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <StarIcon className="h-4 w-4" />
        <span>{isLoading ? "..." : stars}</span>
      </a>
    </Button>
  );
}
