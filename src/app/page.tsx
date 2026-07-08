"use client";

import { useState, useCallback } from "react";
import { SearchForm } from "@/components/search/search-form";
import { PersonCard } from "@/components/search/person-card";
import { PersonDetail } from "@/components/search/person-detail";
import { ResultsHeader } from "@/components/search/results-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Users, Github, Scale, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import type { SearchResult, SearchResponse } from "@/lib/sources";
import { SOURCES } from "@/lib/sources";

type ViewState = "home" | "results" | "opt-out";

export default function HomePage() {
  const [view, setView] = useState<ViewState>("home");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResponse, setSearchResponse] = useState<SearchResponse | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<SearchResult | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // Opt-out form
  const [optOutName, setOptOutName] = useState("");
  const [optOutEmail, setOptOutEmail] = useState("");
  const [optOutReason, setOptOutReason] = useState("");
  const [optOutSubmitting, setOptOutSubmitting] = useState(false);
  const [optOutSuccess, setOptOutSuccess] = useState(false);

  const handleSearch = useCallback(async (data: {
    firstName: string;
    lastName: string;
    city: string;
    state: string;
  }) => {
    setIsLoading(true);
    setError(null);
    setView("results");

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Search failed. Please try again.");
        return;
      }

      setSearchResponse(json);
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleExpandPerson = useCallback((result: SearchResult) => {
    setSelectedPerson(result);
    setDetailOpen(true);
  }, []);

  const handleNewSearch = useCallback(() => {
    setView("home");
    setSearchResponse(null);
    setError(null);
    setSelectedPerson(null);
  }, []);

  const handleOptOut = useCallback(async () => {
    if (!optOutName.trim() || !optOutEmail.trim()) return;
    setOptOutSubmitting(true);
    try {
      const res = await fetch("/api/opt-out", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: optOutName, email: optOutEmail, reason: optOutReason }),
      });
      const json = await res.json();
      if (res.ok) {
        setOptOutSuccess(true);
      }
    } catch {
      // Silently fail for now
    } finally {
      setOptOutSubmitting(false);
    }
  }, [optOutName, optOutEmail, optOutReason]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={handleNewSearch}
            className="flex items-center gap-2 font-bold text-lg hover:opacity-80 transition-opacity"
          >
            <Users className="h-5 w-5" />
            <span className="hidden sm:inline">Open People Search</span>
            <span className="sm:hidden">OPS</span>
          </button>
          <nav className="flex items-center gap-2">
            <a
              href="https://github.com/dustindog101/open-people-search"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-muted"
            >
              <Github className="h-4 w-4" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
            <button
              onClick={() => setView("opt-out")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-muted"
            >
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Opt Out</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {/* HOME VIEW */}
        {view === "home" && (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] px-4 py-12">
            <div className="text-center mb-10 max-w-2xl">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Users className="h-10 w-10 text-primary" />
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  Open People Search
                </h1>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Search for people across multiple public sources simultaneously.
                <br className="hidden sm:block" />
                Free, open, and every fact attributed to its source.
              </p>
            </div>

            <SearchForm onSearch={handleSearch} isLoading={isLoading} />

            {/* Source badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
              {Object.values(SOURCES).map((source) => (
                <div
                  key={source.id}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  {source.name}
                </div>
              ))}
            </div>

            {/* Disclaimer */}
            <div className="mt-8 max-w-xl">
              <Alert className="border-amber-200 bg-amber-50/50 dark:border-amber-900/30 dark:bg-amber-950/20">
                <Scale className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <AlertDescription className="text-xs text-amber-700 dark:text-amber-400">
                  This tool accesses <strong>publicly available information only</strong>. 
                  It is not intended for FCRA-regulated purposes such as employment, credit, or tenant screening. 
                  Legal review is required before any public launch.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        )}

        {/* RESULTS VIEW */}
        {view === "results" && (
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Button
              variant="ghost"
              size="sm"
              className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
              onClick={handleNewSearch}
            >
              <ArrowLeft className="h-4 w-4" />
              New Search
            </Button>

            <ResultsHeader
              query={searchResponse?.query || "..."}
              city={searchResponse?.city}
              state={searchResponse?.state}
              totalResults={searchResponse?.totalResults || 0}
              isLoading={isLoading}
              error={error}
            />

            {/* Loading skeletons */}
            {isLoading && (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="rounded-lg border p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-5/6" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Results list */}
            {!isLoading && searchResponse && searchResponse.results.length > 0 && (
              <div className="space-y-4">
                {searchResponse.results.map((result, index) => (
                  <PersonCard
                    key={result.id}
                    result={result}
                    index={index}
                    onExpand={handleExpandPerson}
                  />
                ))}
              </div>
            )}

            {/* Post-results disclaimer */}
            {!isLoading && searchResponse && searchResponse.results.length > 0 && (
              <div className="mt-8">
                <Alert className="border-muted">
                  <AlertDescription className="text-xs text-muted-foreground text-center">
                    Results are from public sources and may not be current. 
                    Every fact is attributed to its source above. 
                    Use the <button onClick={() => setView("opt-out")} className="underline hover:text-foreground">opt-out page</button> to request data removal.
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </div>
        )}

        {/* OPT-OUT VIEW */}
        {view === "opt-out" && (
          <div className="container mx-auto px-4 py-8 max-w-lg">
            <Button
              variant="ghost"
              size="sm"
              className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
              onClick={() => {
                setView("home");
                setOptOutSuccess(false);
              }}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Search
            </Button>

            <div className="text-center mb-8">
              <Shield className="h-10 w-10 text-primary mx-auto mb-3" />
              <h1 className="text-2xl font-bold">Opt Out / Data Removal</h1>
              <p className="text-muted-foreground mt-2 text-sm">
                Request removal of your information from our cached database.
              </p>
            </div>

            {optOutSuccess ? (
              <div className="text-center space-y-4 py-8">
                <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto" />
                <h2 className="text-xl font-semibold">Request Submitted</h2>
                <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                  Your opt-out request has been received. We will review and process it within 48 hours. 
                  You will receive a confirmation at your email address.
                </p>
                <Button variant="outline" onClick={handleNewSearch} className="mt-4">
                  Return to Search
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="optout-name">Full Name *</Label>
                  <Input
                    id="optout-name"
                    placeholder="Your full legal name"
                    value={optOutName}
                    onChange={(e) => setOptOutName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="optout-email">Email Address *</Label>
                  <Input
                    id="optout-email"
                    type="email"
                    placeholder="your@email.com"
                    value={optOutEmail}
                    onChange={(e) => setOptOutEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="optout-reason">Reason (optional)</Label>
                  <Textarea
                    id="optout-reason"
                    placeholder="Tell us why you'd like your data removed..."
                    value={optOutReason}
                    onChange={(e) => setOptOutReason(e.target.value)}
                    rows={4}
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={handleOptOut}
                  disabled={!optOutName.trim() || !optOutEmail.trim() || optOutSubmitting}
                >
                  {optOutSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Opt-Out Request"
                  )}
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-4">
                  Under applicable privacy laws (including CCPA), you have the right to request deletion 
                  of your personal information. Our team will verify and process your request promptly.
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>Public information only. Not for FCRA/employment/credit/tenant screening.</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setView("opt-out")} className="hover:text-foreground transition-colors">
              Opt Out
            </button>
            <a
              href="https://github.com/dustindog101/open-people-search"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors flex items-center gap-1"
            >
              <Github className="h-3 w-3" />
              Source Code
            </a>
          </div>
        </div>
      </footer>

      {/* Person Detail Dialog */}
      <PersonDetail
        result={selectedPerson}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
      />
    </div>
  );
}