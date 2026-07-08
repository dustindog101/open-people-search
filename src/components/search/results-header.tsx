"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, SearchX, Shield, Users } from "lucide-react";

interface ResultsHeaderProps {
  query: string;
  city?: string;
  state?: string;
  totalResults: number;
  isLoading: boolean;
  error: string | null;
}

export function ResultsHeader({ query, city, state, totalResults, isLoading, error }: ResultsHeaderProps) {
  const location = [city, state].filter(Boolean).join(", ");

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Search Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="mb-6 flex items-center gap-3 text-muted-foreground">
        <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm">
          Searching for <strong>&ldquo;{query}&rdquo;</strong>
          {location && <> in <strong>{location}</strong></>} across all sources...
        </p>
      </div>
    );
  }

  return (
    <div className="mb-6 space-y-2">
      <p className="text-sm text-muted-foreground">
        Showing <strong className="text-foreground">{totalResults}</strong> result{totalResults !== 1 ? "s" : ""} for{" "}
        <strong className="text-foreground">&ldquo;{query}&rdquo;</strong>
        {location && <> in <strong className="text-foreground">{location}</strong></>}
      </p>
      {totalResults === 0 && (
        <Alert className="border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/30">
          <SearchX className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertTitle className="text-amber-800 dark:text-amber-300">No results found</AlertTitle>
          <AlertDescription className="text-amber-700 dark:text-amber-400">
            Try broadening your search by removing the city or state filter, or check the spelling of the name.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}