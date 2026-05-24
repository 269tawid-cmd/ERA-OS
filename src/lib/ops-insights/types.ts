export type InsightCategory = 'operational' | 'roadmap' | 'focus' | 'progress'

export type InsightTone = 'positive' | 'neutral' | 'attention'

export type InsightPriority = 'high' | 'medium' | 'low'

export interface Insight {
  id: string
  category: InsightCategory
  tone: InsightTone
  priority: InsightPriority
  message: string
}

export interface InsightInput {
  tasks: import('@/types').Task[]
  pillarXP: Record<string, number>
  currentMonth: number
  streakCurrent: number
}
