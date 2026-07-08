# Open People Search

A free, open people-search aggregator that finds friends using public information from multiple sources — with every cached fact attributed to its source.

> **Status:** Phase 0 (spec handoff). Application code starts in Phase 1.

## Goals

- Truly free people search (no paywalls on our side)
- Query multiple public sources in parallel
- Build our own database from search hits (append-only, source-attributed)
- Run on free tiers: Vercel + Neon + Upstash + Railway

## For implementers

Read **[AGENTS.md](AGENTS.md)** first.

## Architecture (summary)

```
User → Vercel (Next.js API + UI)
         ├── Neon Postgres (cached facts)
         ├── Upstash Redis (rate limits, job state)
         └── Railway (Patchright scraper worker)
                ├── TruePeopleSearch
                ├── FastPeopleSearch
                └── FamilyTreeNow
```

## Docs

| Doc | Description |
|-----|-------------|
| [docs/PLAN.md](docs/PLAN.md) | Full implementation plan |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | System design |
| [docs/DATABASE.md](docs/DATABASE.md) | Schema and upsert rules |
| [docs/SOURCES.md](docs/SOURCES.md) | Per-source parsing notes |
| [docs/API.md](docs/API.md) | REST API contracts |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Deploy guide |
| [docs/COMPLIANCE.md](docs/COMPLIANCE.md) | Privacy/CCPA hooks |

## Disclaimer

Public information only. Not for FCRA/employment/credit/tenant screening. Legal review required before public launch.

## License

TBD — add before public launch.
