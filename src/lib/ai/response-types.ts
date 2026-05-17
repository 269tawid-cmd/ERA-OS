export type AIResponseType = 'daily_tasks' | 'weekly_review' | 'mentor_answer' | 'motivational_nudge' | 'study_plan';

export interface AIBaseResponse {
  type: AIResponseType;
  tokens_used?: number;
}

export interface DailyTasksResponse extends AIBaseResponse {
  type: 'daily_tasks';
  tasks: {
    title: string;
    reason: string;
    priority: 'high' | 'medium' | 'low';
    pillar: string;
  }[];
}

export interface WeeklyReviewResponse extends AIBaseResponse {
  type: 'weekly_review';
  completed: string[];
  missed: string[];
  focus_next: string;
  overall_assessment: string;
}

export interface MentorAnswerResponse extends AIBaseResponse {
  type: 'mentor_answer';
  answer: string;
  related_topics?: string[];
  resources?: string[];
}

export interface MotivationalNudgeResponse extends AIBaseResponse {
  type: 'motivational_nudge';
  message: string;
  action_item?: string;
  roadmap_reminder?: string;
}

export interface StudyPlanResponse extends AIBaseResponse {
  type: 'study_plan';
  topic: string;
  duration_days: number;
  milestones: {
    day: number;
    objective: string;
  }[];
}

export type AIMentorResponse =
  | DailyTasksResponse
  | WeeklyReviewResponse
  | MentorAnswerResponse
  | MotivationalNudgeResponse
  | StudyPlanResponse;

export interface ParsedAIResponse {
  success: boolean;
  data?: AIMentorResponse;
  error?: string;
  fallback_used?: boolean;
}

export function isValidAIResponse(data: unknown): data is AIMentorResponse {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;
  if (!obj.type) return false;

  switch (obj.type) {
    case 'daily_tasks':
      return Array.isArray(obj.tasks);
    case 'weekly_review':
      return typeof obj.completed === 'string' && typeof obj.overall_assessment === 'string';
    case 'mentor_answer':
      return typeof obj.answer === 'string';
    case 'motivational_nudge':
      return typeof obj.message === 'string';
    case 'study_plan':
      return Array.isArray(obj.milestones);
    default:
      return false;
  }
}