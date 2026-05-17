export type { MentorContext, ContextOptions } from './mentor-context';
export { buildMentorContext, getWeakestPillar, getStrongestPillar } from './mentor-context';

export type { AIResponseType, AIMentorResponse } from './response-types';
export type {
  DailyTasksResponse,
  WeeklyReviewResponse,
  MentorAnswerResponse,
  MotivationalNudgeResponse,
  StudyPlanResponse,
  ParsedAIResponse,
} from './response-types';
export { isValidAIResponse } from './response-types';

export { buildSystemPrompt, buildQuickContext } from './system-prompt';

export { generateDeterministicResponse, createFallbackResponse } from './deterministic-focus';
export type { FallbackOptions } from './deterministic-focus';

export {
  estimateTokens,
  truncateText,
  compactTaskList,
  compactRoadmapSummary,
  compactPillarXP,
  truncateTaskTitles,
  summarizePendingTasks,
  buildContextHeader,
} from './token-utils';