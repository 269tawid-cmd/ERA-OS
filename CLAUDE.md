# ERA OS — AI Engineering Rules

Project: Era OS
Purpose: AI-powered roadmap operating system for the "Hacker Era King" cybersecurity journey.

---

# CORE PRODUCT PHILOSOPHY

Era OS is NOT a generic todo app.

It is a:
- roadmap-aware
- AI-assisted
- cybersecurity progression operating system

The roadmap is the source of truth.

Tasks exist to support the roadmap phase.

All architecture and feature decisions must reinforce:
- roadmap progression
- consistency
- accountability
- low-friction execution

---

# PRIMARY USER

Single user only:
- Tawhid
- 18 years old
- Bangladesh
- low-end laptop
- learning cybersecurity + web development
- wants structured progression toward web app pentesting mastery

Do NOT optimize for:
- enterprise teams
- collaboration
- multi-tenant SaaS
- organizations

---

# TECH STACK (STRICT)

Frontend:
- Next.js 14 App Router
- TypeScript strict mode
- Tailwind CSS

Backend:
- Supabase PostgreSQL
- Supabase Auth
- Route Handlers only

State:
- Zustand only

Charts:
- Recharts

Hosting:
- Vercel

AI:
- Gemini API (free tier)

Do NOT introduce:
- Redux
- Prisma
- tRPC
- GraphQL
- heavy UI libraries
- unnecessary dependencies

---

# ENGINEERING PRIORITIES

Priority order:

1. Stability
2. Clarity
3. Simplicity
4. Performance
5. UX polish
6. Feature expansion

Avoid overengineering.

---

# DEVELOPMENT STYLE

Always:
- build incrementally
- use low blast-radius changes
- preserve architecture consistency
- explain WHY changes are needed
- keep files small and understandable

Never:
- rewrite unrelated files
- restructure folders unnecessarily
- introduce abstractions early
- generate huge code dumps without reason
- add features outside PRD scope

---

# TYPESCRIPT RULES

Always:
- use strict typing
- avoid any
- create reusable types
- prefer explicit interfaces

Never:
- disable TypeScript checks
- use @ts-ignore unless absolutely necessary

---

# APP ROUTER RULES

Use:
- Server Components by default
- Client Components only when necessary
- Route Handlers for API endpoints
- server-side auth validation

Avoid unnecessary:
- client-side fetching
- useEffect-heavy architecture

---

# SUPABASE RULES

All database access must:
- use RLS
- be scoped by user_id
- validate auth server-side

Never:
- bypass RLS
- trust frontend auth state alone
- expose service role key to client

---

# DATABASE PHILOSOPHY

Database should remain:
- simple
- normalized where practical
- easy to reason about

Prefer:
- explicit columns
- predictable relations

Avoid:
- premature optimization
- deeply abstracted repositories
- overly dynamic schemas

---

# ROADMAP-FIRST ARCHITECTURE

The roadmap is the core engine.

Hierarchy:

roadmap
→ phase
→ recommended actions
→ tasks
→ xp/progress
→ streaks
→ insights

NOT:
tasks → everything

All AI logic must reference roadmap context.

---

# AI MENTOR RULES

AI responses must:
- reference current roadmap month
- reference current strengths/weaknesses
- be practical and actionable
- use mixed Bangla-English naturally
- avoid generic productivity advice

The AI mentor should feel like:
- a senior pentester coach
- realistic
- honest
- roadmap-aware

Never:
- hallucinate progress
- overpraise low effort
- recommend paid resources unnecessarily

Prefer:
- OWASP
- DVWA
- PicoCTF
- TryHackMe
- HackTheBox free tier
- LiveOverflow
- IppSec

---

# UI/UX RULES

Design philosophy:
- dark mode first
- clean
- minimal
- focused
- hacker aesthetic without clutter

Optimize for:
- fast loading
- low-end devices
- readability
- focus

Avoid:
- heavy animations
- excessive gradients
- glassmorphism overload
- dashboard chaos

---

# COMPONENT RULES

Components should:
- be reusable where practical
- remain understandable
- avoid deep prop chains

Prefer:
- composition
- small focused components

Avoid:
- giant monolithic components
- premature design systems

---

# STATE MANAGEMENT RULES

Use Zustand minimally.

Global state only for:
- auth/session cache
- UI state
- filters
- lightweight shared state

Avoid:
- storing everything globally
- unnecessary client state

---

# API RULES

API routes must:
- validate input
- validate auth
- return typed responses
- fail safely

Use:
- zod validation

Never:
- trust client payloads blindly

---

# PERFORMANCE RULES

Optimize for:
- low memory usage
- fast hydration
- minimal rerenders

Avoid:
- huge client bundles
- unnecessary libraries
- heavy animations
- expensive polling

---

# SECURITY RULES

Security is critical because this is a cybersecurity-focused project.

Always:
- validate inputs
- sanitize outputs
- protect secrets
- use environment variables properly

Never:
- expose API keys
- store secrets client-side
- bypass auth checks

---

# FILE EDITING RULES

When modifying files:
- preserve existing architecture
- preserve naming consistency
- avoid broad refactors

Always explain:
- what changed
- why it changed
- what could break

---

# IMPLEMENTATION STRATEGY

Build in phases only.

Phase 1:
- setup
- auth
- task CRUD
- dashboard
- streaks

Phase 2:
- AI mentor
- Gemini integration
- roadmap context injection

Phase 3:
- XP system
- progress tracking
- CTF logs
- journal

Phase 4:
- badges
- roadmap visualization
- PWA
- polish

Never skip phases.

---

# RESPONSE STYLE FOR AI ASSISTANT

When generating code:
- provide full file contents
- explain implementation decisions
- mention risks before risky changes
- keep responses structured

Do not:
- overwhelm with unnecessary theory
- generate speculative architecture
- invent features outside scope

---

# LONG-TERM GOAL

Era OS should eventually become:
- Tawhid's cybersecurity operating system
- a roadmap-aware mentor platform
- a portfolio-quality AI-native application

The project must remain:
- maintainable
- stable
- understandable







