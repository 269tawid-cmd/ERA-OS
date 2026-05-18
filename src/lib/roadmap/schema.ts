import type { Pillar, Priority } from '@/types';

export type TaskOrigin = 'generated' | 'manual';

export type TaskCategory =
  | 'practice'
  | 'learning'
  | 'project'
  | 'review'
  | 'ctf'
  | 'documentation'
  | 'automation';

export interface RoadmapTaskTemplate {
  id: string;
  title: string;
  description: string;
  pillar: Pillar;
  category: TaskCategory;
  priority: Priority;
  xp_value: number;
  estimated_minutes: number;
  resources: string[];
}

export interface RoadmapFocusArea {
  name: string;
  description: string;
  weight: number;
}

export interface MonthlyRoadmapSchema {
  month: number;
  year: number;
  title: string;
  description: string;
  focus_areas: RoadmapFocusArea[];
  deliverables: string[];
  task_templates: RoadmapTaskTemplate[];
  prerequisites: string[];
  success_criteria: string[];
  estimated_hours: number;
}

export interface YearlyRoadmapSchema {
  year: number;
  title: string;
  description: string;
  months: MonthlyRoadmapSchema[];
  milestones: RoadmapMilestone[];
}

export interface RoadmapMilestone {
  month: number;
  name: string;
  description: string;
  xp_required: number;
}

export interface RoadmapPhaseConfig {
  startMonth: number;
  endMonth: number;
  primaryPillar: Pillar;
  intensity: 'low' | 'medium' | 'high';
  dailyTaskTarget: number;
}

export interface TaskGenerationContext {
  currentMonth: number;
  monthData: MonthlyRoadmapSchema;
  pendingTasks: Array<{ id: string; title: string; description?: string; pillar: Pillar; status: string; priority: Priority; xp_value: number; category?: TaskCategory; source_template?: string; estimated_minutes?: number }>;
  completedTasksToday: number;
  currentStreak: number;
  pillarXP: Record<Pillar, number>;
  weakPillars: Pillar[];
  strongPillars: Pillar[];
  recentCompletedPillars: Pillar[];
  weekDay: number;
}

export interface GeneratedTask {
  title: string;
  description: string;
  pillar: Pillar;
  category: TaskCategory;
  priority: Priority;
  xp_value: number;
  estimated_minutes: number;
  reason: string;
  source_template?: string;
}

export const PILLAR_COLORS: Record<Pillar, string> = {
  HACK: '#ef4444',
  BUILD: '#3b82f6',
  AI: '#a855f7',
  PRESENCE: '#22c55e',
};

export const PILLAR_EMOJI: Record<Pillar, string> = {
  HACK: '🎯',
  BUILD: '🔧',
  AI: '🤖',
  PRESENCE: '🌐',
};

export const DEFAULT_DAILY_TASK_TARGET = 3;
export const MAX_TASKS_PER_DAY = 5;
export const MIN_TASKS_PER_DAY = 1;