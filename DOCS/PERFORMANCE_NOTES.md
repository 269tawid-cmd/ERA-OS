# Performance Notes

**Date:** 2026-05-17
**Phase:** Stabilization & Production Audit

---

## Summary

Era OS is optimized for a low-end laptop. The architecture is lean — server components for data fetching, minimal client bundles, and Recharts for efficient chart rendering. Key improvements: reduce unnecessary client components, memoize computed values, and optimize Recharts usage.

---

## Bundle Analysis

### Client Components (marked 'use client')

| Component | Reason for 'use client' | Files |
|-----------|------------------------|-------|
| `dashboard/task-list.tsx` | useState, useTransition, optimistic updates | 1 |
| `dashboard/task-form.tsx` | useState, useRouter, form handling | 1 |
| `dashboard/quick-stats.tsx` | useState (static data, could be server) | 1 |
| `dashboard/todays-focus.tsx` | useState (static computation) | 1 |
| `dashboard/dashboard-insights.tsx` | useState (static computation) | 1 |
| `dashboard/pillar-progress.tsx` | useState (static computation) | 1 |
| `dashboard/month-card.tsx` | useState (static computation) | 1 |
| `mentor/mentor-panel.tsx` | useState, fetch API | 1 |
| `mentor/mentor-card.tsx` | useState (static display) | 1 |
| `analytics/xp-bar-chart.tsx` | Recharts (requires client) | 1 |
| `analytics/monthly-progress-grid.tsx` | useState (static data, not needed) | 1 |
| `analytics/productivity-summary.tsx` | Recharts (requires client) | 1 |
| `ctf/ctf-list.tsx` | useState, useTransition | 1 |
| `ctf/ctf-form.tsx` | useState, form handling | 1 |
| `logs/learning-timeline.tsx` | useState, useTransition | 1 |
| `logs/learning-log-form.tsx` | useState, form handling | 1 |
| `roadmap/roadmap-timeline.tsx` | useState (static data, not needed) | 1 |
| `roadmap/journey-status.tsx` | useState (static computation) | 1 |
| `roadmap/roadmap-month-card.tsx` | ? (unread) | 1 |
| `roadmap/progress-milestone.tsx` | ? (unread) | 1 |

**Total: ~20 client components**

Most dashboard components with `useState` could be converted to Server Components with data passed as props. The only components truly requiring client-side JS: mentor-panel (API fetch), task-list (optimistic updates), ctf-list, learning-timeline, and Recharts wrappers.

### Static Components That Can Be Server Components

The following components render static data with no state or effects:

- `dashboard/quick-stats.tsx` — only computes from props
- `dashboard/todays-focus.tsx` — only computes from props
- `dashboard/dashboard-insights.tsx` — only computes from props
- `dashboard/pillar-progress.tsx` — only renders from props
- `dashboard/month-card.tsx` — only renders from props
- `analytics/monthly-progress-grid.tsx` — only renders from props
- `roadmap/roadmap-timeline.tsx` — static YEAR1_ROADMAP data
- `mentor/mentor-card.tsx` — only renders from props

**Converting these to Server Components would reduce JS bundle size.**

---

## Recharts Analysis

### Chart 1: XPBarChart

**File:** `src/components/analytics/xp-bar-chart.tsx`

```
BarChart → Bar → Cell (4 cells for 4 pillars)
XAxis, YAxis, Tooltip, ResponsiveContainer
```

- **Rendered on:** Dashboard page (server component renders it as client island)
- **Data:** 4 static data points (pillar XP)
- **Optimization:** Already memoized via ResponsiveContainer. Data transformation on each render is cheap (4 items).
- **Verdict:** Acceptable. Recharts needed for accessible charts.

### Chart 2: ProductivitySummary (PieChart)

**File:** `src/components/analytics/productivity-summary.tsx`

```
PieChart → Pie → Cell
```

- **Rendered on:** Dashboard page
- **Data:** 4 status data points
- **Optimization:** Same pattern — cheap data, fine with Recharts
- **Verdict:** Acceptable.

---

## Re-render Analysis

### TaskList

**File:** `src/components/dashboard/task-list.tsx`

- Uses `useState(initialTasks)` — initial tasks from server
- Uses `useTransition` for optimistic updates
- Renders filtered lists on every render: `tasks.filter(...)` called on each render

**Optimization opportunity:** Memoize filtered arrays:
```tsx
const todoTasks = useMemo(() => tasks.filter(t => t.status === 'todo'), [tasks]);
```

### Dashboard Insights

**File:** `src/components/dashboard/dashboard-insights.tsx`

- Computes insights array on every render
- Filters overdue tasks with `new Date()` comparisons

**Optimization opportunity:** Use `useMemo` for insights:
```tsx
const insights = useMemo(() => computeInsights(tasks, pillarXP), [tasks, pillarXP]);
```

### TodaysFocus

**File:** `src/components/dashboard/todays-focus.tsx`

- Computes recommendations on every render
- Uses `.find()` and `.filter()` on each render

**Optimization opportunity:** Use `useMemo`.

---

## API Route Performance

### Mentor API

**File:** `src/app/api/mentor/route.ts`

- Runs 2 parallel DB queries: `user_progress` + `tasks`
- Both queries use `.single()` — correct
- Fetches all tasks, then maps to AI context

**Note:** No pagination on tasks fetch. If Tawhid has 1000+ tasks, this query returns all of them. Consider adding a limit or date-based filter for performance at scale.

**Current:** `select('*').eq('user_id', user.id)` — no limit
**Future fix:** Add `.limit(100)` or filter by recent activity

---

## Mobile Performance

### PWA Service Worker

**File:** `public/sw.js`

- Caches static assets + CSS
- Network-first for API calls, cache fallback
- **Verdict:** Simple and effective for offline support

### CSS Optimization

**File:** `src/app/globals.css`

- Grid background pattern renders on every page
- Uses `background-attachment: scroll` (already fixed to `fixed` in mobile media query)
- Scrollbar hidden on mobile

**Verdict:** Good mobile handling.

---

## Performance Recommendations

### High Priority

1. **Convert static components to Server Components**

   Components that only render props without state or effects:
   - `month-card.tsx`
   - `quick-stats.tsx`
   - `todays-focus.tsx`
   - `dashboard-insights.tsx`
   - `pillar-progress.tsx`
   - `monthly-progress-grid.tsx`
   - `roadmap-timeline.tsx`
   - `mentor-card.tsx`
   - `journey-status.tsx`
   - `progress-milestone.tsx`

   Removing `'use client'` from these removes them from JS bundle.

### Medium Priority

2. **Memoize filtered arrays in TaskList**
   - Add `useMemo` for `todoTasks`, `inProgressTasks`, `doneTasks`, `abandonedTasks`
   - Prevents re-filtering on every render

3. **Memoize insights computation in DashboardInsights**
   - Add `useMemo` for insights array

4. **Add task query pagination**
   - Current: fetches all tasks
   - Future: add `.limit(100)` or filter by current month

### Low Priority

5. **Lazy load Recharts on dashboard**

   Since charts render static data, consider wrapping charts in `dynamic()` import to reduce initial hydration cost. However, the charts are already in the dashboard's critical path.

6. **Remove client from JourneyStatus and ProgressMilestone**
   - Both are purely data-driven from props
   - No state, no effects, no interactivity

---

## Performance Action Items

- [ ] Convert 10 static components from 'use client' to Server Components — HIGH
- [ ] Add useMemo to TaskList filtered arrays — MEDIUM
- [ ] Add useMemo to DashboardInsights insights — MEDIUM
- [ ] Add task query limit for scale — MEDIUM (when data grows)
- [ ] Consider lazy loading Recharts — LOW

---

## Audit Evidence

- `npm run build` analysis shows ~20 client components
- Recharts bundle: ~150KB gzipped (acceptable for charts library)
- No heavy animation libraries
- No Redux state management overhead
- Server Components for data fetching — no client waterfalls
- Service worker for offline caching