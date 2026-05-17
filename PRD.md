# Era OS — Product Requirements Document
**AI-Powered Roadmap Todo App for "Hacker Era King" Journey**

Version: 1.0 | Author: Tawhid | Date: May 2026

---

## 1. Vision

Era OS is a personal command center for Tawhid's 4-year "Hacker Era King" cybersecurity journey. It is not a generic todo app — it is a **roadmap-aware AI system** that knows exactly which phase you are in, what you should be doing this month, and holds you accountable with an AI mentor that thinks like a senior pentester-coach.

> **One-line pitch:** "The app that knows your roadmap better than you do, and pushes you toward becoming Bangladesh's most recognized cybersecurity figure."

---

## 2. Target User

Single user: Tawhid (18, Bangladesh). Runs a business, learning web dev and cybersecurity in parallel. Low-end laptop. Needs focused, distraction-free tool that integrates his roadmap without overwhelm.

---

## 3. Goals

| # | Goal |
|---|------|
| G1 | Track daily/weekly tasks mapped to specific roadmap months and pillars |
| G2 | Get AI-powered guidance based on current phase (not generic advice) |
| G3 | Visualize progress across 4 pillars: HACK, BUILD, AI, PRESENCE |
| G4 | Maintain streaks and accountability |
| G5 | Log wins, CTF completions, learning notes |
| G6 | Have a single source of truth for the entire 4-year journey |

---

## 4. The 4 Pillars (Core Data Model Basis)

| Pillar | Color | What it tracks |
|--------|-------|----------------|
| HACK | Red/Coral | Offensive skills, CTFs, TryHackMe, tools, certs (eJPT, OSCP) |
| BUILD | Purple | Projects built, scripts written, tools created, GitHub commits |
| AI | Teal | AI/LLM leverage skills, automation, AI-assisted hacking tools |
| PRESENCE | Amber | Blog posts, Twitter/X activity, YouTube, bug bounty reports, GitHub README |

---

## 5. Year 1 Monthly Roadmap (Preloaded Data)

| Month | Focus | Key Deliverables |
|-------|-------|-----------------|
| M1 | Linux Fundamentals | CLI fluency, file system mastery |
| M2 | Networking + Python Basics | TCP/IP, OSI model, Python scripts |
| M3 | Linux Deep Dive | Permissions, processes, bash scripting |
| M4 | OWASP Top 10 + DVWA | Complete all DVWA modules |
| M5 | Burp Suite | Intercept, repeat, intruder basics |
| M6 | Project Security | Secure MMS-Ar-Rashid, write security report |
| M7 | Python Security Tools | Build recon/scanner tools |
| M8 | CTF Season | 5+ CTF challenges on PicoCTF / HTB |
| M9 | TryHackMe Jr Pentester | Complete learning path |
| M10 | Nmap + Enumeration | Full network scanning workflow |
| M11 | Metasploit + Privesc | Lab environments, guided walkthroughs |
| M12 | Consolidation | Review all, write English blog post, prep eJPT |

---

## 6. Features

### 6.1 Core Features (MVP)

#### F1 — Dashboard
- Current month card: shows active month (e.g. "Month 4: OWASP + DVWA"), days left, completion %
- 4 pillar progress bars (HACK, BUILD, AI, PRESENCE) with weekly XP
- Today's tasks (3–5 suggested by AI)
- Current streak counter
- Recent wins log

#### F2 — Task Manager
- Create tasks with: title, pillar tag, month tag, priority (High/Medium/Low), due date, notes
- Task states: Todo → In Progress → Done → Abandoned
- Filter by pillar, month, status
- Bulk complete
- Recurring tasks (e.g. "30 min TryHackMe daily")

#### F3 — AI Mentor (Core Feature)
Chat interface with a context-aware AI that knows:
- Your current roadmap month and phase
- Your completed tasks (last 7 days)
- Your pillar progress scores
- Your pending tasks

**AI Mentor can:**
- Suggest today's 3 most important tasks based on current phase
- Answer technical questions about current month topics (e.g. "explain DVWA SQLi lab step by step")
- Give weekly review: "This week you did X, missed Y, focus on Z next week"
- Generate study plans for specific topics
- Translate/explain English security content in Bangla-English mix
- Motivate with roadmap context ("You are in M4 of 48 — tumi already ahead of 90% of people who start")

#### F4 — Progress Tracker
- Per-pillar XP system (earn XP by completing tasks)
- Monthly completion % (tasks done vs total planned)
- Year overview: 12-month grid, colored by completion level
- Streak tracker with flame animation
- "Milestone unlocked" system (e.g., complete M4 → unlock "OWASP Warrior" badge)

#### F5 — Learning Log
- Quick daily journal: "What did I learn today?" (max 200 chars, low friction)
- CTF tracker: log CTF name, date, solved/unsolved, notes
- Win archive: memorable achievements, flagged for portfolio

#### F6 — Roadmap View
- Full 4-year roadmap displayed as visual timeline
- Current position highlighted
- Phase details expandable
- Year-by-year milestones (eJPT, OSCP, Hall of Fame, DEF CON, etc.)

---

### 6.2 Nice-to-Have Features (Post-MVP)

| Feature | Description |
|---------|-------------|
| F7 — Daily Briefing | AI sends a morning briefing: "Today is Day 87. You are in M8 (CTF). Your task: finish PicoCTF Web challenge #3." |
| F8 — English Tracker | Separate sub-tracker for English improvement parallel to security (consume content log, writing log) |
| F9 — Resource Library | Curated links per month (LiveOverflow videos, IppSec walkthroughs, TryHackMe paths) |
| F10 — Export Report | Weekly PDF summary of progress to share/review |
| F11 — Offline Mode | Full offline support (PWA) since Bangladesh connectivity varies |
| F12 — Dark Mode | Default dark, for late-night hacking sessions |

---

## 7. User Stories

```
US-01: As Tawhid, I want to see today's 3 most important tasks on opening the app,
       so I know exactly what to do without thinking.

US-02: As Tawhid, I want to ask the AI "what should I do this week in M4?"
       and get a specific, roadmap-aware answer, not generic advice.

US-03: As Tawhid, I want to log a CTF completion with flag notes,
       so I can track my progress in the HACK pillar.

US-04: As Tawhid, I want to see my 4 pillars as progress bars,
       so I can notice if I'm neglecting one (e.g. PRESENCE always low).

US-05: As Tawhid, I want a streak counter,
       so missing a day feels meaningful and I stay consistent.

US-06: As Tawhid, I want to see the full 4-year roadmap anytime,
       so I stay motivated by the bigger picture.

US-07: As Tawhid, I want to ask the AI a technical question in Bangla-English,
       and get an explanation relevant to my current learning phase.
```

---

## 8. AI System Design

### System Prompt Architecture (sent with every AI chat message)

```
You are Tawhid's personal cybersecurity mentor. 
Tawhid is an 18-year-old from Bangladesh pursuing the "Hacker Era King" framework
— a 4-year journey to become internationally recognized in web app pentesting.

Current Status:
- Month: [CURRENT_MONTH] of 48
- Month Focus: [MONTH_FOCUS]  
- Completed tasks this week: [COMPLETED_TASKS]
- Pillar scores: HACK [X]%, BUILD [Y]%, AI [Z]%, PRESENCE [W]%
- Current streak: [N] days

Roadmap context: [ROADMAP_SUMMARY]

Rules:
- Always give practical, actionable advice
- Reference his specific roadmap phase
- Mix Bangla and English naturally when explaining
- Be motivating but honest — don't sugarcoat gaps
- Suggest resources he can actually access (TryHackMe, HackTheBox, DVWA, OWASP)
- His specialty: web app pentesting (leverages his web dev background)
```

### AI Feature Triggers

| Trigger | AI Action |
|---------|-----------|
| App open (first time today) | Auto-generate "Today's 3 tasks" |
| Weekly (Monday) | Generate weekly review + upcoming week plan |
| Complete a month | Congratulate + preview next month |
| 2 days no activity | Send motivational nudge with specific action |
| User types question | Mentor chat with full context |

---

## 9. Data Models

### Task
```typescript
interface Task {
  id: string
  title: string
  description?: string
  pillar: 'HACK' | 'BUILD' | 'AI' | 'PRESENCE'
  month: number // 1–48
  priority: 'high' | 'medium' | 'low'
  status: 'todo' | 'in_progress' | 'done' | 'abandoned'
  xp_value: number // 10–100 based on complexity
  due_date?: string
  completed_at?: string
  is_recurring: boolean
  recurrence?: 'daily' | 'weekly'
  created_at: string
}
```

### CTF Entry
```typescript
interface CTFEntry {
  id: string
  name: string
  platform: 'PicoCTF' | 'HackTheBox' | 'TryHackMe' | 'CTFtime' | 'Other'
  date: string
  category: 'Web' | 'Crypto' | 'Forensics' | 'Pwn' | 'Misc'
  solved: boolean
  flag_notes?: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  xp_earned: number
}
```

### Learning Log
```typescript
interface LogEntry {
  id: string
  date: string
  content: string // max 500 chars
  pillar: 'HACK' | 'BUILD' | 'AI' | 'PRESENCE'
  is_win: boolean
}
```

### User Progress
```typescript
interface UserProgress {
  current_month: number // 1–48
  start_date: string
  streak_current: number
  streak_best: number
  pillar_xp: {
    HACK: number
    BUILD: number
    AI: number
    PRESENCE: number
  }
  monthly_completion: Record<number, number> // month -> % complete
  badges: string[]
}
```

---

## 10. Tech Stack Recommendation

| Layer | Technology | Reason |
|-------|-----------|--------|
| Frontend | Next.js 14 (App Router) | Already learning, familiar codebase (MMS-Ar-Rashid) |
| Styling | Tailwind CSS | Fast, low resource usage |
| Database | Supabase (PostgreSQL) | Already using it, free tier, auth included |
| AI | Anthropic Claude API (claude-sonnet-4-6) | Best for contextual mentoring |
| Auth | Supabase Auth | Single user, simple email/password |
| Hosting | Vercel | Free tier, instant deploy |
| State | Zustand | Lightweight, low-end laptop friendly |
| Charts | Recharts | Simple, performant |

---

## 11. Screen List

| Screen | Route | Description |
|--------|-------|-------------|
| Dashboard | `/` | Main hub: today's tasks, pillars, streak, AI brief |
| Tasks | `/tasks` | Full task list with filters |
| AI Mentor | `/mentor` | Chat interface |
| Progress | `/progress` | Pillar XP, monthly grid, badges |
| Roadmap | `/roadmap` | Full 4-year visual timeline |
| Learning Log | `/log` | Journal + CTF tracker |
| Settings | `/settings` | Current month setting, roadmap adjustments |

---

## 12. Milestones & Build Order

### Phase 1 — Core MVP (2–3 weeks)
- [ ] Project setup: Next.js + Supabase + Tailwind
- [ ] Database schema + migrations
- [ ] Task CRUD (create, complete, delete)
- [ ] Dashboard with today's tasks + 4 pillar bars
- [ ] Basic streak counter

### Phase 2 — AI Integration (1–2 weeks)
- [ ] Claude API integration
- [ ] AI Mentor chat screen
- [ ] Auto-generate today's tasks on load
- [ ] Roadmap context injected into every AI call

### Phase 3 — Progress & Log (1 week)
- [ ] Monthly grid view
- [ ] XP system
- [ ] CTF tracker
- [ ] Learning log

### Phase 4 — Polish (ongoing)
- [ ] Badges/milestones
- [ ] Weekly AI review
- [ ] Dark mode
- [ ] PWA offline support

---

## 13. Success Metrics

| Metric | Target |
|--------|--------|
| Daily active use | Open app every day (streak > 30) |
| Task completion rate | >70% of planned tasks done per month |
| HACK pillar XP | Fastest-growing (it's the core) |
| PRESENCE pillar | Not zero — at least 1 output/week |
| AI chat usage | 3+ meaningful questions per week |

---

## 14. Design Principles

1. **Low friction first** — open app, see tasks, start. No setup required each day.
2. **Roadmap always visible** — you should never forget the bigger picture.
3. **AI knows your context** — generic advice is useless. Every AI response should feel personalized.
4. **Dark by default** — hackers work at night.
5. **Mobile-friendly** — sometimes you check progress on phone.
6. **Bengali-English mix** — UI in English, AI mentor speaks in mixed Bangla-English.

---

*This document is a living spec. Update as roadmap evolves.*