# Open People Search

A free, open people-search aggregator that finds people using public information from multiple sources — with every cached fact attributed to its source.

## Features

- **Multi-source search** — Queries TruePeopleSearch, FastPeopleSearch, and FamilyTreeNow in parallel
- **Source attribution** — Every fact (phone, email, address, relatives) is tagged with its original source
- **Deduplication** — Results from multiple sources are merged and deduplicated automatically
- **Rate limiting** — Built-in rate limiting to prevent abuse
- **Opt-out / Data removal** — Compliance page for requesting data removal (CCPA-ready)
- **Free to run** — Designed for free-tier hosting (Vercel)

## Architecture

```
User → Vercel (Next.js API + UI)
         ├── SQLite (cached facts, via Prisma)
         └── Scrapers (TruePeopleSearch, FastPeopleSearch, FamilyTreeNow)
```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Database**: SQLite via Prisma ORM
- **Deployment**: Vercel

## Getting Started

```bash
# Install dependencies
pnpm install

# Set up database
cp .env.example .env
pnpm db:push

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API

### `POST /api/search`
Search for people across all sources.

**Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "city": "New York",
  "state": "NY"
}
```

### `GET /api/search?id=<searchId>`
Retrieve cached search results.

### `POST /api/opt-out`
Submit a data removal request.

## Disclaimer

Public information only. Not for FCRA/employment/credit/tenant screening.

## License

MIT