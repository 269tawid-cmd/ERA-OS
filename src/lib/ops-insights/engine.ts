import type { Insight, InsightInput, InsightCategory, InsightPriority, InsightTone } from './types'

function daysSince(dateStr: string): number {
  const then = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - then.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

function getDaysSinceLastCompletion(tasks: InsightInput['tasks']): number | null {
  const completed = tasks
    .filter(t => t.status === 'done' && t.completed_at)
    .sort((a, b) => new Date(b.completed_at!).getTime() - new Date(a.completed_at!).getTime())

  if (completed.length === 0) return null
  return daysSince(completed[0].completed_at!)
}

function makeInsight(
  id: string,
  category: InsightCategory,
  tone: InsightTone,
  priority: InsightPriority,
  message: string,
): Insight {
  return { id, category, tone, priority, message }
}

const PRIORITY_ORDER: Record<InsightPriority, number> = { high: 0, medium: 1, low: 2 }

function sortByPriority(insights: Insight[]): Insight[] {
  return [...insights].sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority])
}

export function computeInsights(input: InsightInput): Insight[] {
  const { tasks, pillarXP, currentMonth, streakCurrent } = input
  const result: Insight[] = []

  const totalXP = Object.values(pillarXP).reduce((s, v) => s + v, 0)
  const doneCount = tasks.filter(t => t.status === 'done').length
  const inProgressCount = tasks.filter(t => t.status === 'in_progress').length

  const currentMonthTasks = tasks.filter(t => t.month === currentMonth)
  const currentMonthDone = currentMonthTasks.filter(t => t.status === 'done').length
  const currentMonthTodo = currentMonthTasks.filter(t => t.status === 'todo').length
  const currentMonthTotal = currentMonthTasks.length

  // ── Operational ──

  const overdueCount = tasks.filter(t => {
    if (t.status === 'done' || t.status === 'abandoned') return false
    if (!t.due_date) return false
    return new Date(t.due_date) < new Date()
  }).length

  if (overdueCount > 0) {
    result.push(makeInsight(
      'overdue',
      'operational',
      'attention',
      'high',
      `${overdueCount} overdue operation${overdueCount > 1 ? 's' : ''}`,
    ))
  }

  if (tasks.length > 0 && doneCount > 0) {
    const daysIdle = getDaysSinceLastCompletion(tasks)
    if (daysIdle !== null) {
      if (daysIdle > 7) {
        result.push(makeInsight(
          'stagnant',
          'operational',
          'attention',
          'high',
          `No completions in ${daysIdle} days`,
        ))
      } else if (daysIdle > 3) {
        result.push(makeInsight(
          'low-activity',
          'operational',
          'neutral',
          'medium',
          `No completions in ${daysIdle} days`,
        ))
      }
    }
  }

  const completionRate = tasks.length > 0 ? doneCount / tasks.length : 0
  if (tasks.length > 0 && completionRate > 0.7) {
    result.push(makeInsight(
      'momentum',
      'operational',
      'positive',
      'low',
      `${Math.round(completionRate * 100)}% completion rate`,
    ))
  }

  // ── Roadmap ──

  if (currentMonthTotal === 0) {
    result.push(makeInsight(
      'no-phase-tasks',
      'roadmap',
      'attention',
      'high',
      'No tasks for current phase — generate tasking',
    ))
  } else if (currentMonthDone === currentMonthTotal) {
    result.push(makeInsight(
      'phase-ready',
      'roadmap',
      'positive',
      'medium',
      'Phase operations complete — ready to advance',
    ))
  }

  if (currentMonthTodo > 5) {
    result.push(makeInsight(
      'backlog',
      'roadmap',
      'attention',
      'medium',
      `${currentMonthTodo} unresolved operations in current phase`,
    ))
  }

  // ── Focus ──

  if (totalXP > 0) {
    const percentages = Object.entries(pillarXP).map(([key, xp]) => ({
      pillar: key,
      pct: (xp / totalXP) * 100,
      xp,
    }))

    const weakest = percentages.reduce((min, p) => (p.pct < min.pct ? p : min))
    const strongest = percentages.reduce((max, p) => (p.pct > max.pct ? p : max))

    if (weakest.pct > 0 && weakest.pct < 20) {
      result.push(makeInsight(
        `weak-${weakest.pillar}`,
        'focus',
        'attention',
        'medium',
        `${weakest.pillar} neglected — ${Math.round(weakest.pct)}% of XP`,
      ))
    }

    if (strongest.pct > 50) {
      result.push(makeInsight(
        `strong-${strongest.pillar}`,
        'focus',
        'neutral',
        'low',
        `${strongest.pillar} at ${Math.round(strongest.pct)}% — unbalanced`,
      ))
    }
  }

  if (inProgressCount > 3) {
    result.push(makeInsight(
      'too-many-active',
      'focus',
      'attention',
      'medium',
      `${inProgressCount} active operations — resolve before engaging`,
    ))
  }

  // ── Progress ──

  if (streakCurrent >= 7) {
    result.push(makeInsight(
      'streak-sustained',
      'progress',
      'positive',
      'low',
      `${streakCurrent}-day streak sustained`,
    ))
  } else if (streakCurrent >= 3) {
    result.push(makeInsight(
      'streak-building',
      'progress',
      'neutral',
      'low',
      `${streakCurrent}-day streak building`,
    ))
  }

  return sortByPriority(result)
}
