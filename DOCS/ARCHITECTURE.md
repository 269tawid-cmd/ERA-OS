# Era OS — Architecture Specification

Project: Era OS
Type: AI-powered roadmap operating system
Primary User: Tawhid
Version: 1.0

---

# 1. SYSTEM PHILOSOPHY

Era OS is NOT a generic productivity app.

Era OS is:
- roadmap-aware
- AI-assisted
- progression-focused
- cybersecurity-centered

The roadmap is the primary system engine.

Tasks, XP, streaks, and AI recommendations all derive from roadmap context.

Core hierarchy:

roadmap
→ phase
→ recommended actions
→ tasks
→ progress
→ streaks
→ insights

The app should always reinforce:
- consistency
- deliberate practice
- focused execution
- long-term progression

---

# 2. ARCHITECTURE PRINCIPLES

The system must prioritize:

1. Simplicity
2. Stability
3. Low cognitive load
4. Low-end device performance
5. Incremental scalability
6. Security

Avoid:
- overengineering
- excessive abstraction
- premature optimization
- enterprise complexity

---

# 3. APPLICATION STRUCTURE

## Main Folder Structure

```txt
src/
├── app/
├── components/
├── lib/
├── store/
├── hooks/
├── types/
└── styles/
```

---

## app/

Purpose:
- routes
- layouts
- server rendering
- API handlers

Contains:
- dashboard
- tasks
- mentor
- roadmap
- progress
- logs
- auth routes

App Router is mandatory.

---

## components/

Purpose:
- reusable UI
- feature modules

Structure:

```txt
components/
├── ui/
├── dashboard/
├── tasks/
├── mentor/
├── progress/
└── roadmap/
```

Rules:
- components should remain small
- avoid giant monolithic files
- prefer composition

---

## lib/

Purpose:
- business logic
- integrations
- utilities
- constants

Structure:

```txt
lib/
├── supabase/
├── ai/
├── roadmap/
├── validations/
└── utils/
```

---

## store/

Purpose:
- lightweight global state

Technology:
- Zustand only

Avoid:
- large global state trees

---

## hooks/

Purpose:
- reusable client logic

Examples:
- use-user
- use-streak
- use-mobile

---

## types/

Purpose:
- centralized TypeScript types

Rules:
- avoid duplicate interfaces
- prefer shared reusable types

---

# 4. RENDERING STRATEGY

Use:
- Server Components by default

Use Client Components only for:
- forms
- chat UI
- Zustand consumers
- charts
- highly interactive widgets

Avoid:
- unnecessary useEffect usage
- excessive client-side fetching

Preferred flow:

Server Component
→ fetch server data
→ pass typed props
→ interactive child component if needed

---

# 5. STATE MANAGEMENT STRATEGY

## Global State

Use Zustand ONLY for:

| State | Reason |
|---|---|
| UI state | sidebar, modals |
| lightweight filters | task filtering |
| temporary client cache | small UI optimizations |

Do NOT store:
- full database state globally
- heavy server data
- duplicated backend truth

---

## Server State

Source of truth:
- Supabase PostgreSQL

Includes:
- tasks
- logs
- streaks
- XP
- progress

---

## Static State

Stored in:
- constants
- roadmap files

Includes:
- roadmap structure
- milestone metadata
- pillar definitions

---

# 6. DATABASE ARCHITECTURE

Database:
- Supabase PostgreSQL

All tables must include:

```sql
id
user_id
created_at
```

Use:
- explicit schemas
- predictable relations

Avoid:
- generic metadata blobs
- dynamic schema systems

---

## Core Tables

### tasks
Tracks roadmap-linked execution.

### user_progress
Tracks:
- XP
- streaks
- monthly completion

### logs
Tracks:
- learning journal
- wins

### ctf_entries
Tracks:
- CTF progress
- challenge history

---

# 7. ROADMAP ENGINE

The roadmap is the system intelligence layer.

Roadmap data should remain:
- static
- structured
- versionable

Stored in:

```txt
lib/roadmap/
```

Structure example:

```ts
{
  month: 4,
  title: "OWASP Top 10 + DVWA",
  focus: [...],
  deliverables: [...],
  suggested_tasks: [...]
}
```

The roadmap drives:
- AI recommendations
- dashboard focus
- task suggestions
- progress context

---

# 8. AI SYSTEM ARCHITECTURE

AI is NOT a standalone chatbot.

AI operates from:
- roadmap context
- recent activity
- streak state
- XP distribution
- incomplete tasks

---

## AI Context Packet

Every AI request must assemble:

```ts
{
  currentMonth,
  roadmapFocus,
  recentTasks,
  completedTasks,
  pendingTasks,
  streak,
  pillarXP,
  weakAreas
}
```

This context packet is injected into:
- mentor chat
- daily tasks
- weekly review
- motivational nudges

---

## AI Response Rules

AI must:
- reference roadmap phase
- provide actionable guidance
- avoid generic advice
- mix Bangla-English naturally
- stay practical

AI should feel:
- realistic
- honest
- mentorship-oriented

---

# 9. AUTHENTICATION ARCHITECTURE

Authentication:
- Supabase Auth

Provider:
- Google OAuth

Rules:
- single-user optimized
- protected routes
- server-side session validation

Never trust:
- client-only auth state

---

# 10. SECURITY ARCHITECTURE

Security rules are mandatory.

---

## RLS

All tables:
- RLS enabled
- scoped by user_id

---

## API Security

Never expose:
- service role keys
- AI API keys

All AI calls must flow through:
- Route Handlers

---

## Validation

All API inputs must use:
- zod validation

Never trust raw client payloads.

---

# 11. UI/UX ARCHITECTURE

Design philosophy:
- minimal
- focused
- distraction-free
- dark mode first

Optimize for:
- low-end devices
- readability
- fast interaction

Avoid:
- excessive animations
- dashboard clutter
- heavy UI systems

---

## Pillar Color System

| Pillar | Color |
|---|---|
| HACK | red |
| BUILD | purple |
| AI | teal |
| PRESENCE | amber |

These colors must remain consistent across:
- charts
- badges
- progress bars
- labels

---

# 12. PERFORMANCE STRATEGY

Priority:
- responsiveness
- lightweight bundles
- low memory usage

Avoid:
- unnecessary dependencies
- huge chart libraries
- animation-heavy frameworks

Use:
- lazy loading where appropriate
- server rendering first

---

# 13. COMPONENT PHILOSOPHY

Components should:
- have single responsibility
- remain understandable
- avoid deep nesting

Prefer:
- composition
- reusable primitives

Avoid:
- giant smart components
- unnecessary abstraction layers

---

# 14. API DESIGN RULES

API handlers must:
- validate auth
- validate input
- return typed responses
- fail safely

Use:
- route handlers only

Avoid:
- untyped responses
- hidden side effects

---

# 15. BUILD STRATEGY

Development must follow:
- vertical slice architecture

Meaning:
build complete workflows incrementally.

Preferred order:

1. Auth
2. Dashboard skeleton
3. Task CRUD
4. XP updates
5. Streak updates
6. AI integration
7. Logs
8. Roadmap view

Avoid:
- building every backend feature first
- building all screens before functionality

---

# 16. MVP DEFINITION

MVP includes ONLY:

- authentication
- dashboard
- task CRUD
- roadmap awareness
- streak system
- XP tracking
- AI mentor basics

Everything else is secondary.

---

# 17. LONG-TERM SYSTEM GOAL

Era OS should eventually become:
- a cybersecurity operating system
- an AI-guided learning platform
- a portfolio-quality AI-native application

The system must remain:
- maintainable
- understandable
- stable
- extensible

Avoid architecture decisions that reduce long-term clarity.