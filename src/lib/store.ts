// In-memory store for Vercel serverless environment
// In production, replace with Neon Postgres + Upstash Redis

interface StoredSearch {
  id: string;
  query: string;
  city?: string;
  state?: string;
  status: string;
  resultCount: number;
  createdAt: Date;
  results: StoredResult[];
}

interface StoredResult {
  id: string;
  fullName: string;
  city?: string;
  state?: string;
  age?: number;
  score: number;
  sources: string[];
  facts: StoredFact[];
}

interface StoredFact {
  type: string;
  value: string;
  source: string;
  sourceUrl?: string;
}

// In-memory maps (persists for the lifetime of the serverless function)
const searches = new Map<string, StoredSearch>();

let searchCounter = 0;
function generateId(): string {
  searchCounter++;
  return `srch-${Date.now()}-${searchCounter}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createSearch(data: {
  query: string;
  city?: string;
  state?: string;
  results: StoredResult[];
}): StoredSearch {
  const id = generateId();
  const search: StoredSearch = {
    id,
    query: data.query,
    city: data.city,
    state: data.state,
    status: "completed",
    resultCount: data.results.length,
    createdAt: new Date(),
    results: data.results,
  };
  searches.set(id, search);
  return search;
}

export function getSearch(id: string): StoredSearch | undefined {
  return searches.get(id);
}