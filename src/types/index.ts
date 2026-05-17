export type Pillar = 'HACK' | 'BUILD' | 'AI' | 'PRESENCE';
export type Priority = 'high' | 'medium' | 'low';
export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'abandoned';
export type Recurrence = 'daily' | 'weekly';
export type TaskOrigin = 'generated' | 'manual';
export type TaskCategory = 'practice' | 'learning' | 'project' | 'review' | 'ctf' | 'documentation' | 'automation';

export interface Task {
  id: string;
  title: string;
  description?: string;
  pillar: Pillar;
  month: number;
  priority: Priority;
  status: TaskStatus;
  xp_value: number;
  due_date?: string;
  completed_at?: string;
  is_recurring: boolean;
  recurrence?: Recurrence;
  origin: TaskOrigin;
  category: TaskCategory;
  source_template?: string;
  generation_date?: string;
  created_at: string;
}

export function isPillar(value: string): value is Pillar {
  return ['HACK', 'BUILD', 'AI', 'PRESENCE'].includes(value);
}

export function isPriority(value: string): value is Priority {
  return ['high', 'medium', 'low'].includes(value);
}

export function isTaskStatus(value: string): value is TaskStatus {
  return ['todo', 'in_progress', 'done', 'abandoned'].includes(value);
}

export function isTaskOrigin(value: string): value is TaskOrigin {
  return ['generated', 'manual'].includes(value);
}

export function isTaskCategory(value: string): value is TaskCategory {
  return ['practice', 'learning', 'project', 'review', 'ctf', 'documentation', 'automation'].includes(value);
}

export type CTFPlatform = 'PicoCTF' | 'HackTheBox' | 'TryHackMe' | 'CTFtime' | 'Other';

export type CTFCategory = 'Web' | 'Crypto' | 'Forensics' | 'Pwn' | 'Misc';

export type CTFDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface CTFEntry {
  id: string;
  name: string;
  platform: CTFPlatform;
  date: string;
  category: CTFCategory;
  solved: boolean;
  flag_notes?: string;
  difficulty: CTFDifficulty;
  xp_earned: number;
}

export interface LogEntry {
  id: string;
  date: string;
  content: string;
  pillar: Pillar;
  is_win: boolean;
}

export interface PillarXP {
  HACK: number;
  BUILD: number;
  AI: number;
  PRESENCE: number;
}

export interface UserProgress {
  current_month: number;
  start_date: string;
  streak_current: number;
  streak_best: number;
  pillar_xp: PillarXP;
  monthly_completion: Record<number, number>;
  badges: string[];
}

export interface MonthlyRoadmap {
  month: number;
  title: string;
  focus: string[];
  deliverables: string[];
  suggested_tasks: string[];
}

export interface RoadmapPhase {
  year: number;
  months: MonthlyRoadmap[];
}

export interface MentorMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface AIContext {
  currentMonth: number;
  roadmapFocus: string;
  recentTasks: Task[];
  completedTasks: Task[];
  pendingTasks: Task[];
  streak: number;
  pillarXP: PillarXP;
}