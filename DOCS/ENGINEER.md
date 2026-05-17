# Era OS — Engineering Reference

**Version:** 0.1.0
**Last Updated:** 2026-05-17
**Purpose:** Long-term engineering memory and guardrail system for AI-assisted development sessions.

---

## 1. Project Identity

Era OS is not a todo app. It is a **roadmap-aware, AI-assisted cybersecurity progression operating system** for Tawhid — an 18-year-old learner from Bangladesh targeting internationally recognized web app pentesting mastery over 4 years.

### Core Identity

- **Name:** Era OS (Hacker Era King Operating System)
- **Primary User:** Tawhid, single-user, low-end laptop, Bangladesh
- **Target:** Web application pentesting mastery
- **Duration:** 48-month structured journey
- **Stack:** Next.js 14 App Router, Supabase PostgreSQL, Gemini AI, Recharts

### Roadmap-First Philosophy

The roadmap is the **source of truth**. All features, tasks, XP, streaks, and AI responses reference current roadmap phase. Never build features that exist outside of roadmap context.

```
roadmap → phase → recommended actions → tasks → xp/progress → streaks → insights
```

Not: tasks → everything.

### Architecture Intent

- **Single-user only** — no multi-tenant, no teams, no collaboration
- **Roadmap-aware** — AI mentor references current month, pillar balance, streak
- **Lightweight** — optimized for low-end hardware, fast loading, minimal resource usage
- **Deterministic** — AI fallback always exists, no broken states

---

## 2. Core Architecture Rules

### App Router Conventions

- Server Components by default
- Client Components only when state, effects, or browser APIs are required
- Route Handlers for API endpoints
- Server-side auth validation always

**Rule:** If a component doesn't use `useState`, `useEffect`, browser APIs, or event handlers, make it a Server Component.

### Client Component Minimization

Current client components (~20) are too many. When adding new features:

1. Can this be a Server Component with props passed from parent?
2. Does this truly need client-side interactivity?
3. If yes to interactivity, can it be a leaf component (small island)?

**Target:** Reduce client components to only those requiring browser APIs or user interaction state.

### Supabase SSR Patterns

Always use `@supabase/ssr` for Next.js integration:

```typescript
// Server Component
import { createClient } from '@/lib/supabase/server';

// Client Component
import { createClient } from '@/lib/supabase/client';
```

Server client uses `cookies()` from `next/headers`. Browser client is a singleton via module-level cache.

Auth flow: `signInWithOAuth` → `exchangeCodeForSession` → `bootstrapUserProgress` → redirect.

### RLS-First Database Philosophy

Every Supabase query **must** include `.eq('user_id', user.id)`. This is non-negotiable, even if RLS policies are configured — defense in depth.

```typescript
// Always
client.from('tasks').select('*').eq('user_id', user.id)

// Never
client.from('tasks').select('*')
```

Server actions and API routes use `createClientWithAuth()` which validates session before any query.

### Deterministic Fallback Philosophy for AI

AI responses follow a strict hierarchy:

```
1. Gemini API (if key configured)
2. Deterministic fallback (rule-based)
3. Never: empty response or error state
```

The `generateDeterministicResponse` function in `src/lib/ai/deterministic-focus.ts` produces usable responses based on roadmap context without any AI call.

---

## 3. Engineering Guardrails

### Minimal Blast Radius Changes

- Change one file/feature at a time
- Prefer additive changes over rewrites
- Always explain WHY changes are needed
- Never rewrite unrelated files
- Preserve existing naming conventions and patterns

### No Large Refactors Without Reason

- Avoid "cleanup" refactors unless they fix a real bug or enable a required feature
- Architecture is sound — the stabilization audit (2026-05-17) confirmed 84+/100 scores across security, architecture, and type safety
- Adding abstractions early is worse than leaving duplication

### Preserve Existing Architecture

- Match existing file patterns and naming
- Follow the established folder structure
- Use existing component patterns (Card, Button, Input from `src/components/ui/`)
- Keep files small and understandable

### Maintain Strict TypeScript

- No `any` types unless absolutely necessary
- Use explicit interfaces and types
- Never disable TypeScript checks
- Prefer `unknown` over `any` when type is uncertain

### Avoid Dependency Bloat

Current dependencies are minimal and intentional:
- `next`, `react`, `react-dom` — framework
- `@supabase/ssr`, `@supabase/supabase-js` — database
- `recharts` — charts (only for analytics)
- `zod` — validation
- `zustand` — state (minimal use)
- `clsx`, `tailwind-merge` — class utilities

**Rule:** Do not add dependencies unless the feature cannot exist without them.

### Preserve Lightweight Performance

- Monitor bundle size when adding client components
- Use `useMemo` for expensive computations in client components
- Lazy load non-critical client components where possible
- Recharts is acceptable for analytics — do not replace with heavier alternatives

---

## 4. UI/UX Identity Rules

### Hacker Command-Center Aesthetic

The UI should feel like a terminal-based command center, not a consumer SaaS product.

**Colors:**
- Background: `#050505` (near black)
- Cards: `bg-zinc-900/60 border border-zinc-800/60`
- Text: `text-zinc-200` primary, `text-zinc-500` secondary, `text-zinc-700` muted
- Pillar colors: HACK `#ef4444`, BUILD `#a855f7`, AI `#2dd4bf`, PRESENCE `#f59e0b`

**Typography:**
- Font: `ui-monospace` for all UI text
- Sizes: `text-xs` for labels, `text-sm` for body, `text-base` for headings
- Letter spacing: `tracking-widest` for section labels

**Patterns:**
- Grid background on body: `32px × 32px` subtle lines
- Subtle gradients on card backgrounds (near-transparent)
- Glow effects on active/current elements
- No rounded-full cards — use `rounded-lg` or `rounded-md`

### Dark Cyber Interface

- Dark mode first and only — no light theme
- Minimal color usage — accent colors only for semantic meaning (pillars, status, alerts)
- Backdrop blur on overlays and cards: `backdrop-blur-sm`
- Consistent border treatment: `border-zinc-800/60` on all cards

### Low Animation Philosophy

- Minimal transitions: `duration-150` to `duration-200`
- No heavy animations, no scroll-triggered effects
- Hover states use opacity and color changes, not transforms
- `active:scale-[0.98]` on buttons for tactile feedback only

### Roadmap-Aware UX

Every view should show the user where they are in their journey:
- Current month prominently displayed
- Pillar XP distribution visible
- Streak always visible
- Milestone progress tracked

### Serious Cybersecurity Atmosphere

- No playful elements, no emoji, no casual language
- Terminal-style labels: `// roadmap`, `// mentor`, `// tasks`
- Monospace fonts throughout
- Minimal padding and spacing — dense but readable
- Professional tone in all UI copy

---

## 5. AI Integration Rules

### Gemini as Enhancement, Not Dependency

AI is a mentor enhancement, not the core functionality. The app works 100% without Gemini API.

- Always check `process.env.GEMINI_API_KEY` before calling
- Never let AI failure break user-facing features
- AI responses enhance task recommendations and motivation, not core CRUD

### Deterministic Fallback Always Required

Every AI call path must have a deterministic fallback:

```typescript
if (!process.env.GEMINI_API_KEY) {
  fallbackUsed = true;
  response = fallbackGenerator();
} else {
  try {
    response = await callGeminiAPI(...);
  } catch {
    fallbackUsed = true;
    response = fallbackGenerator();
  }
}
```

Fallbacks use roadmap context (current month, pillar XP, streak, pending tasks) to generate meaningful responses without AI.

### Token-Conscious Prompts

- Estimate token count before sending
- Truncate task lists to prevent blowup
- Use `compactPillarXP`, `summarizePendingTasks`, `truncateText` utilities
- Target ~1000-2000 tokens for typical requests

### Typed AI Contracts Only

All AI responses use strict TypeScript interfaces:

```typescript
export interface DailyTasksResponse extends AIBaseResponse {
  type: 'daily_tasks';
  tasks: { title: string; reason: string; priority: Pillar; ... }[];
}

export type AIMentorResponse =
  | DailyTasksResponse
  | MotivationalNudgeResponse
  | MentorAnswerResponse
  | ...;
```

Use `isValidAIResponse()` to validate before rendering.

---

## 6. Database Rules

### Never Bypass RLS

- All queries include `.eq('user_id', ...)`
- Service role key never exposed to client bundle
- Middleware enforces auth before any server component renders
- Server actions use `createClientWithAuth()` — throws on auth failure

### Preserve Typed Schema

Database types in `src/lib/supabase/database.types.ts` mirror actual Supabase schema. When schema changes:

1. Update Supabase dashboard
2. Run `supabase gen types typescript` or manually update types
3. Never let TypeScript infer from Supabase client — use explicit types

### Avoid Hidden Trigger Complexity

- App-level initialization preferred over database triggers
- `bootstrapUserProgress` runs on first login to create user_progress row
- No cron jobs, no scheduled functions
- All business logic in TypeScript (roadmap progression, XP calculation, streak tracking)

### Prefer App-Level Initialization Over DB Magic

```typescript
// Good: App-level
if (existing) return;
await supabase.from('user_progress').insert({ ... });

// Avoid: Trigger-dependent
// Don't rely on DB triggers to create user records
```

---

## 7. Performance Philosophy

### Mobile-First

- Bottom navigation on mobile, hidden on desktop
- Safe area insets for notched devices
- Touch targets minimum 44px
- Scrollbar hidden on mobile
- Background-attachment fixed on mobile to prevent scroll jank

### Low-End Laptop Friendly

- Minimal JS bundle — convert static components to Server Components
- No heavy animation libraries
- Recharts is acceptable — lightweight enough for charts
- Service worker for offline caching

### Lightweight Rendering

- Server Components for data fetching — no client waterfalls
- `useMemo` for filtered/computed arrays in client components
- Lazy load non-critical client components
- Minimal state management — Zustand only for truly global state

### Selective Client Hydration

Only hydrate client components that need it:
- Forms (TaskForm, CTFForm, LearningLogForm)
- Interactive lists (TaskList, CTFList, LearningTimeline) — for optimistic updates
- AI Mentor panel — for API calls
- Recharts wrappers — require browser

**Do not hydrate:** static display components, cards with no interactivity.

---

## 8. Current Architecture Snapshot

### Major Systems Implemented

| System | Location | Status |
|--------|----------|--------|
| Auth | `src/lib/supabase/auth.ts`, `middleware.ts` | ✅ Complete |
| Tasks CRUD | `src/lib/actions/tasks.ts`, `components/dashboard/task-list.tsx` | ✅ Complete |
| CTF Tracking | `src/lib/actions/ctf.ts`, `components/ctf/` | ✅ Complete |
| Learning Logs | `src/lib/actions/logs.ts`, `components/logs/` | ✅ Complete |
| Roadmap Engine | `src/lib/roadmap/`, `src/types/` | ✅ Complete |
| Pillar XP System | `src/lib/constants/`, `components/dashboard/pillar-progress.tsx` | ✅ Complete |
| Streak Tracking | `src/lib/actions/tasks.ts` (streak calculation) | ✅ Complete |
| Milestones | `src/lib/constants/milestones.ts`, `components/roadmap/progress-milestone.tsx` | ✅ Complete |
| AI Mentor | `src/app/api/mentor/route.ts`, `src/lib/ai/` | ✅ Complete |
| Deterministic Fallback | `src/lib/ai/deterministic-focus.ts` | ✅ Complete |
| Analytics Charts | `src/components/analytics/` (Recharts) | ✅ Complete |
| PWA Support | `public/manifest.json`, `public/sw.js`, `public/icons/` | ✅ Complete |
| Mobile Navigation | `src/components/shared/mobile-nav.tsx` | ✅ Complete |
| Offline Indicator | `src/components/shared/offline-indicator.tsx` | ✅ Complete |
| Skeleton Loaders | `src/components/shared/skeleton.tsx` | ✅ Complete |

### Key Files Reference

```
src/
├── app/
│   ├── page.tsx (Server Component — Dashboard)
│   ├── roadmap/page.tsx (Server Component — Roadmap)
│   ├── auth/
│   │   ├── login/page.tsx
│   │   ├── callback/route.ts
│   │   └── logout/route.ts
│   └── api/
│       └── mentor/route.ts (AI Mentor API)
├── components/
│   ├── ui/ (Card, Button, Input, Select, Badge)
│   ├── dashboard/ (TaskList, TaskForm, QuickStats, etc.)
│   ├── mentor/ (MentorPanel, MentorCard)
│   ├── analytics/ (XPBarChart, ProductivitySummary, MonthlyProgressGrid)
│   ├── roadmap/ (RoadmapTimeline, JourneyStatus, ProgressMilestone)
│   ├── ctf/ (CTFForm, CTFList)
│   ├── logs/ (LearningLogForm, LearningTimeline)
│   └── shared/ (MobileNav, Skeleton, OfflineIndicator, ClientLayout)
├── lib/
│   ├── supabase/ (server.ts, client.ts, auth.ts, middleware.ts, database.types.ts)
│   ├── actions/ (tasks.ts, ctf.ts, logs.ts)
│   ├── ai/ (gemini-client.ts, deterministic-focus.ts, mentor-context.ts, response-types.ts, etc.)
│   ├── roadmap/ (index.ts, year1.ts)
│   ├── constants/ (index.ts, milestones.ts)
│   ├── types/ (index.ts)
│   ├── validations/ (task.ts)
│   └── env.ts (Zod schema validation)
└── hooks/ (service-worker.ts)
```

---

## 9. Future Roadmap

### What SHOULD Be Built Later

These are intentional future additions based on user needs:

1. **XP Level System** — milestones unlock XP bonuses, level-up celebrations
2. **CTF Platform Integration** — auto-track TryHackMe/HackTheBox progress via API
3. **Blog/Portfolio Generator** — PRESENCE pillar content export
4. **Progress Photos** — screenshots of completed labs and achievements
5. **Better Mobile Task Input** — quick-add floating button
6. **Streak Recovery** — grace period options for missed days
7. **Resource Bookmarking** — save links to AI recommendations
8. **Daily Summary Email** — optional digest of progress

### What SHOULD NOT Be Added

- Multi-user / team features
- Social sharing or public profiles
- Freemium / paid tiers
- Collaborative task management
- Real-time collaboration or comments
- Heavy integrations (Slack, Notion, Linear)
- Mobile apps (native)
- Desktop apps
- AI-generated learning content (beyond mentor recommendations)
- Complex gamification beyond current streak/XP/milestone system

### Anti-Feature Philosophy

Every new feature must pass these questions:

1. Does this reinforce roadmap progression?
2. Does this help Tawhid become a better pentester?
3. Does this add meaningful value without complexity?
4. Will this work on a low-end laptop?
5. Does this preserve the hacker aesthetic?

If no to any question, don't build it.

---

## 10. Audit & Quality Reference

### Latest Audit Results (2026-05-17)

| Area | Score | Key Findings |
|------|-------|-------------|
| Security | 91/100 | RLS enforced, auth server-side, rate limit on mentor API |
| Architecture | 84/100 | Clean boundaries, server-first, over-fetch noted (low priority) |
| Type Safety | — | All TS errors resolved, no `any` types |
| Performance | — | Memoization added, static components identified for conversion |

### Verification Commands

```bash
npm run lint     # ESLint check
npx tsc --noEmit # TypeScript check
npm run build    # Production build
```

### Key Constants

```typescript
PILLARS = { HACK, BUILD, AI, PRESENCE }
XP_VALUES = { high: 50, medium: 25, low: 10 }
PRIORITIES = { high, medium, low }
ROADMAP_TOTAL_MONTHS = 48
YEAR_MONTHS = 12
STREAK_MILESTONE_THRESHOLDS = [7, 14, 30, 60, 90, 180, 365]
```

---

## Quick Reference for AI Agents

### DO

- Use Server Components by default
- Add `useMemo` for computed arrays in client components
- Include `.eq('user_id', user.id)` on all queries
- Provide deterministic fallback for AI calls
- Match existing code patterns and conventions
- Keep files small and focused
- Explain why changes are needed

### DON'T

- Add `any` types
- Add dependencies without clear justification
- Rewrite existing working code
- Create client components for static data
- Bypass RLS or auth checks
- Add features outside roadmap philosophy
- Use heavy animations or transitions
- Build multi-user or collaborative features

### File Patterns to Match

- Components: `src/components/ui/` for primitives, feature folders for domains
- Server Actions: `src/lib/actions/` with `'use server'` directive
- API Routes: `src/app/api/{name}/route.ts`
- Types: `src/lib/types/` or `src/lib/supabase/database.types.ts`
- Constants: `src/lib/constants/` with named exports
- AI utilities: `src/lib/ai/` with typed contracts

---

*This document is the source of truth for all Era OS engineering decisions. Update this file when architectural decisions change.*