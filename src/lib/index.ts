export type {
  Pillar,
  Priority,
  TaskStatus,
  Recurrence,
  Task,
  CTFPlatform,
  CTFCategory,
  CTFDifficulty,
  CTFEntry,
  LogEntry,
  PillarXP,
  UserProgress,
  MonthlyRoadmap,
  RoadmapPhase,
  MentorMessage,
  AIContext,
} from '@/types';

export {
  isPillar,
  isPriority,
  isTaskStatus,
} from '@/types';

export {
  PILLARS,
  PILLAR_ORDER,
  PRIORITIES,
  TASK_STATUSES,
  XP_VALUES,
  RECURRENCE_OPTIONS,
  CTF_PLATFORMS,
  CTF_CATEGORIES,
  CTF_DIFFICULTIES,
  MAX_LOG_LENGTH,
  STREAKMilestone_THRESHOLDS,
  ROADMAP_TOTAL_MONTHS,
  YEAR_MONTHS,
} from '@/lib/constants';

export {
  YEAR1_ROADMAP,
  YEAR1_MILESTONES,
  ROADMAP_DATA,
  getMonthData,
  getCurrentMonthFocus,
  getMonthDeliverables,
  getMonthSuggestedTasks,
  getMonthsForPillar,
  getMilestoneForMonth,
  getRoadmapProgress,
  formatRoadmapSummary,
} from '@/lib/roadmap';