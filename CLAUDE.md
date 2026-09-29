# TechPick — Claude Code instructions

## About the project

TechPick recommends laptops sold in Turkey to non-technical users. A 6-7 question wizard (budget, usage, games, portability, screen size, OS, must-haves) leads to three recommendations with a plain-language explanation and current store prices.

Read these before starting any task:
- `docs/urun-karti.md` — product card: MVP scope, recommendation engine, data model, roadmap
- `docs/kararlar.md` — decision log and the current week's goal

If a request conflicts with these documents, point it out before writing code.

## How we work (most important)

I am a final-year CS student and I want to learn while building this. The output style is set to Learning in `.claude/settings.json`.

- Before writing code, explain in a few sentences what you plan to do and why, then wait for my approval.
- Take one small step at a time. Do not change several files at once unless I ask.
- Leave the key, instructive parts to me with `TODO(human)` markers; boilerplate and configuration you may write yourself.
- When you introduce a new library, pattern or command, explain in one sentence why it was chosen.
- Do not add dependencies, features or files outside the current task. If you think something is missing, suggest it instead of doing it.
- When we make an important decision, suggest a 1-2 line entry for `docs/kararlar.md`.
- Talk to me in Turkish. Code, identifiers, comments and commit messages are in English.

## Stack and layout

Next.js (App Router) + TypeScript + Tailwind + shadcn/ui, Supabase PostgreSQL, Drizzle ORM, Python ingestion (GitHub Actions cron), Vercel.

```
apps/web         Next.js site
packages/engine  Recommendation engine (TypeScript) + unit tests
ingest/          Python data and price collectors
db/              Drizzle schema and migrations
docs/            Product card and decision log
```

Tables: `model_families`, `configurations`, `cpus`, `gpus`, `stores`, `offers`, `price_history`, `click_events`.

## Rules that must not be broken

- The recommendation engine is deterministic and explainable. No LLM chooses products.
- The engine never uses store or affiliate information for ranking.
- Every recommendation states at least one weakness.
- Data scraped from Epey is only used locally to list which models exist; it never reaches production.
- Never commit secrets. Use `.env` locally and keep `.env.example` up to date.

## Commands

To be filled in as the project is set up (install, dev, test, migrate).
