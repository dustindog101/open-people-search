import { NextRequest, NextResponse } from "next/server";
import { truePeopleSearch, fastPeopleSearch, familyTreeNow } from "@/lib/scrapers";
import { createSearch, getSearch } from "@/lib/store";
import type { SearchResult, SourceId } from "@/lib/sources";

// Simple in-memory rate limiter (replace with Upstash Redis in production)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const RATE_LIMIT_MAX = 10; // 10 searches per minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

// Merge results from multiple sources, deduplicating by name + city + state
function mergeResults(allResults: { people: Omit<SearchResult, "id" | "score">[]; source: SourceId }[]): SearchResult[] {
  const merged = new Map<string, SearchResult>();

  for (const { people, source } of allResults) {
    for (const person of people) {
      const key = `${person.fullName}|${person.city || ""}|${person.state || ""}`.toLowerCase();
      const existing = merged.get(key);

      if (existing) {
        // Merge facts, deduplicate by type + value
        for (const fact of person.facts) {
          const isDuplicate = existing.facts.some(
            (f) => f.type === fact.type && f.value === fact.value && f.source === fact.source
          );
          if (!isDuplicate) {
            existing.facts.push(fact);
          }
        }
        // Add source if not already present
        if (!existing.sources.includes(source)) {
          existing.sources.push(source);
        }
        // Increase score for multi-source matches
        existing.score += 1;
      } else {
        merged.set(key, {
          ...person,
          id: `person-${key.replace(/[^a-z0-9]/g, "-")}`,
          score: 1,
        });
      }
    }
  }

  // Sort by score (descending), then by age ascending
  return Array.from(merged.values()).sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return (a.age || 999) - (b.age || 999);
  });
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait a moment before trying again." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { firstName, lastName, city, state } = body;

    // Validate required fields
    if (!firstName || !lastName || firstName.trim().length === 0 || lastName.trim().length === 0) {
      return NextResponse.json(
        { error: "First name and last name are required." },
        { status: 400 }
      );
    }

    const cleanFirst = firstName.trim();
    const cleanLast = lastName.trim();
    const cleanCity = city?.trim() || undefined;
    const cleanState = state?.trim() || undefined;

    // Run all scrapers in parallel
    const [tpsResult, fpsResult, ftnResult] = await Promise.allSettled([
      truePeopleSearch(cleanFirst, cleanLast, cleanCity, cleanState),
      fastPeopleSearch(cleanFirst, cleanLast, cleanCity, cleanState),
      familyTreeNow(cleanFirst, cleanLast, cleanCity, cleanState),
    ]);

    const allResults: { people: Omit<SearchResult, "id" | "score">[]; source: SourceId }[] = [];

    if (tpsResult.status === "fulfilled") allResults.push(tpsResult.value);
    if (fpsResult.status === "fulfilled") allResults.push(fpsResult.value);
    if (ftnResult.status === "fulfilled") allResults.push(ftnResult.value);

    // Merge and deduplicate results
    const mergedResults = mergeResults(allResults);

    // Store in memory
    const search = createSearch({
      query: `${cleanFirst} ${cleanLast}`,
      city: cleanCity,
      state: cleanState,
      results: mergedResults,
    });

    return NextResponse.json({
      searchId: search.id,
      status: "completed",
      results: mergedResults,
      totalResults: mergedResults.length,
      query: `${cleanFirst} ${cleanLast}`,
      city: cleanCity,
      state: cleanState,
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const searchId = searchParams.get("id");

    if (!searchId) {
      return NextResponse.json({ error: "Search ID is required." }, { status: 400 });
    }

    const search = getSearch(searchId);

    if (!search) {
      return NextResponse.json({ error: "Search not found. Serverless functions may have recycled — please search again." }, { status: 404 });
    }

    return NextResponse.json({
      searchId: search.id,
      status: search.status,
      results: search.results,
      totalResults: search.resultCount,
      query: search.query,
      city: search.city,
      state: search.state,
    });
  } catch (error) {
    console.error("Get search error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}