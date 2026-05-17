# Architecture Audit

**Date:** 2026-05-17
**Phase:** Stabilization & Production Audit
**Score:** 84/100 — Strong

---

## Summary

Era OS has a clean, well-scoped architecture aligned with its roadmap-first philosophy. Server/client boundaries are respected. RLS policies protect all data. The main risk is over-fetching on the dashboard page.

---

## Architecture Overview

```
app/
├── page.tsx (Server Component) — Dashboard, fetches all data
├── roadmap/page.tsx (Server Component) — Roadmap view
├── auth/
│   ├── login/page.tsx (Server Component)
│   ├── callback/route.ts (API Route)
│   └── logout/route.ts (API Route)
└── api/
    └── mentor/route.ts (API Route) — AI mentor endpoint

components/ (all 'use client' only where needed)
├── dashboard/ — Task CRUD, stats
├── mentor/ — AI mentor panel
├── analytics/ — Charts (Recharts, 'use client')
├── roadmap/ — Timeline, milestones
├── ctf/ — CTF tracking
├── logs/ — Learning log
└── ui/ — Primitive components

lib/
├── supabase/ — Auth, DB types, server/client split
├── actions/ — Server Actions (tasks, ctf, logs)
├── ai/ — Gemini client, deterministic fallback, context building
├── roadmap/ — Year 1 data + helpers
├── types/ — Shared TypeScript types
├── validations/ — Zod schemas
└── constants/ — Pillars, XP, priorities
```

---

## Strengths

1. **Server-first routing** — Pages are Server Components, data fetched server-side, no client waterfalls
2. **Clear server/client split** — `lib/supabase/server.ts` vs `lib/supabase/client.ts`, explicit naming
3. **Server Actions for mutations** — `lib/actions/*.ts` use `'use server'` for all DB writes
4. **Middleware for auth** — All protected routes checked in middleware, no auth bypass possible
5. **RLS on all queries** — Every DB query includes `.eq('user_id', ...)` matching the authenticated user
6. **AI fallback chain** — Gemini API → deterministic response → always returns something usable
7. **No Redux** — State is minimal, `useState` + `useTransition` for optimistic updates
8. **Zod validation on all inputs** — Server actions validate with Zod before DB writes

---

## Issues

### 1. Dashboard fetches too much data (MEDIUM)

**File:** `src/app/page.tsx:32-57`

The dashboard runs 4 separate DB queries in parallel:
- `user_progress` (full row)
- `tasks` (limit 20, ordered by created_at desc)
- `logs` (limit 15)
- `ctf_entries` (limit 10)

Each query fetches `*` — all columns. The tasks query fetches 20 rows but page renders all filtered views from this. The ctf_entries query could use a `select()` to limit columns.

**Fix:** Not critical — parallel queries are fine. Low priority.

### 2. RoadMapTimeline has unnecessary 'use client' (LOW)

**File:** `src/components/roadmap/roadmap-timeline.tsx:1`

`YEAR1_ROADMAP` is static data. The component only renders static data with no state or effects. The `'use client'` directive adds it to the client bundle unnecessarily.

However, since it renders `<RoadmapMonthCard>` which may have interactions, this is LOW priority to change.

### 3. MonthlyProgressGrid has unnecessary 'use client' (LOW)

**File:** `src/components/analytics/monthly-progress-grid.tsx:1`

Same pattern — static data rendering with no state or effects.

### 4. No build-time type generation for database (INFO)

**File:** `src/lib/supabase/database.types.ts`

Types are manually maintained rather than generated via `supabase gen types typescript`. This works but means schema changes require manual type updates.

---

## Server/Client Boundary Check

| Path | Type | Auth Required | Boundary |
|------|------|---------------|----------|
| `app/page.tsx` | Server Component | Yes (middleware) | Server |
| `app/roadmap/page.tsx` | Server Component | Yes (middleware) | Server |
| `app/auth/login/page.tsx` | Server Component | No | Server |
| `app/auth/callback/route.ts` | API Route | Code exchange | Server |
| `app/auth/logout/route.ts` | API Route | Yes | Server |
| `app/api/mentor/route.ts` | API Route | Yes (createClientWithAuth) | Server |
| `lib/actions/*.ts` | Server Actions | Yes (createClientWithAuth) | Server |
| `components/*` | Client Components | N/A | Client |

**All boundaries correct.** No private data leaks to client.

---

## Action Items

- [ ] Consider adding `select()` columns to ctf_entries query if sensitive data added to schema (low priority)
- [ ] Monitor dashboard query performance as data grows (future concern)

---

## Audit Evidence

- All 4 Supabase queries use `.eq('user_id', user.id)` — RLS enforced
- All server actions use `createClientWithAuth()` — auth validated server-side
- All API routes use `createClientWithAuth()` — auth validated server-side
- No `SUPABASE_SERVICE_ROLE_KEY` used in client-accessible code
- Middleware matches on all non-public routes
- Login page correctly checks existing session and redirects