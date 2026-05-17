import type { Pillar, Task, MonthlyRoadmap } from '@/types';
import type { UserProgressRow } from '@/lib/supabase/database.types';

export interface MentorContext {
  currentMonth: number;
  monthTitle: string;
  monthFocus: string[];
  monthDeliverables: string[];
  currentStreak: number;
  bestStreak: number;
  pillarXP: Record<Pillar, number>;
  totalXP: number;
  tasksCompleted: number;
  tasksTotal: number;
  tasksPending: Task[];
  tasksOverdue: Task[];
  weakPillars: Pillar[];
  strongPillars: Pillar[];
  recentCompletedTasks: Task[];
  daysSinceActivity: number;
}

export interface ContextOptions {
  includeRecentTasks?: number;
  includePendingTasks?: boolean;
  includeWeakPillars?: boolean;
}

export function buildMentorContext(
  currentMonth: number,
  monthData: MonthlyRoadmap | undefined,
  progress: UserProgressRow | null,
  allTasks: Task[],
  options: ContextOptions = {}
): MentorContext {
  const {
    includeRecentTasks = 5,
    includePendingTasks = true,
    includeWeakPillars = true,
  } = options;

  const pillarXPData = progress?.pillar_xp as Record<string, number> || { HACK: 0, BUILD: 0, AI: 0, PRESENCE: 0 };
  const pillarXP: Record<Pillar, number> = {
    HACK: pillarXPData.HACK || 0,
    BUILD: pillarXPData.BUILD || 0,
    AI: pillarXPData.AI || 0,
    PRESENCE: pillarXPData.PRESENCE || 0,
  };
  const totalXP = Object.values(pillarXP).reduce((sum, xp) => sum + xp, 0);

  const completedTasks = allTasks.filter(t => t.status === 'done');
  const pendingTasks = allTasks.filter(t => t.status === 'todo' || t.status === 'in_progress');
  const overdueTasks = allTasks.filter(t => {
    if (t.status === 'done' || t.status === 'abandoned') return false;
    if (!t.due_date) return false;
    return new Date(t.due_date) < new Date();
  });

  const pillarPercentages = (Object.keys(pillarXP) as Pillar[]).map(p => ({
    pillar: p,
    xp: pillarXP[p] || 0,
    percentage: totalXP > 0 ? ((pillarXP[p] || 0) / totalXP) * 100 : 0,
  }));

  const sortedPillars = [...pillarPercentages].sort((a, b) => a.percentage - b.percentage);

  const weakPillars = includeWeakPillars
    ? sortedPillars.slice(0, 2).map(s => s.pillar as Pillar)
    : [];

  const strongPillars = sortedPillars.slice(-1).map(s => s.pillar as Pillar);

  const recentCompletedTasks = completedTasks
    .sort((a, b) => new Date(b.completed_at || 0).getTime() - new Date(a.completed_at || 0).getTime())
    .slice(0, includeRecentTasks);

  const lastUpdate = progress?.updated_at || progress?.created_at;
  const daysSinceActivity = lastUpdate
    ? Math.floor((Date.now() - new Date(lastUpdate).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return {
    currentMonth,
    monthTitle: monthData?.title || 'Unknown',
    monthFocus: monthData?.focus || [],
    monthDeliverables: monthData?.deliverables || [],
    currentStreak: progress?.streak_current || 0,
    bestStreak: progress?.streak_best || 0,
    pillarXP,
    totalXP,
    tasksCompleted: completedTasks.length,
    tasksTotal: allTasks.length,
    tasksPending: includePendingTasks ? pendingTasks : [],
    tasksOverdue: overdueTasks,
    weakPillars,
    strongPillars,
    recentCompletedTasks,
    daysSinceActivity,
  };
}

export function getWeakestPillar(context: MentorContext): Pillar {
  const pillars = ['HACK', 'BUILD', 'AI', 'PRESENCE'] as Pillar[];
  return pillars.reduce((weakest, p) =>
    (context.pillarXP[p] || 0) < (context.pillarXP[weakest] || 0) ? p : weakest
  , pillars[0]);
}

export function getStrongestPillar(context: MentorContext): Pillar {
  const pillars = ['HACK', 'BUILD', 'AI', 'PRESENCE'] as Pillar[];
  return pillars.reduce((strongest, p) =>
    (context.pillarXP[p] || 0) > (context.pillarXP[strongest] || 0) ? p : strongest
  , pillars[0]);
}