# TechPick

A Turkish laptop recommendation site for non-technical buyers: answer a few questions about your needs and budget, get three recommended laptops with a clear explanation and current prices.

🚧 Work in progress. MVP planned for late November 2026.

## Planned stack

Next.js (App Router) + TypeScript + Tailwind + shadcn/ui, Supabase PostgreSQL, Drizzle ORM, Python data ingestion with GitHub Actions, Vercel.

## Repository layout

```
apps/web         Next.js site (@techpick/web)
packages/engine  Recommendation engine (TypeScript) + unit tests
packages/db      Drizzle schema and migrations (@techpick/db)
ingest/          Python data and price collectors (outside the pnpm workspace)
docs/            Product card and decision log
```
