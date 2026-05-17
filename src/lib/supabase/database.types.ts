export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Pillar = 'HACK' | 'BUILD' | 'AI' | 'PRESENCE';
export type Priority = 'high' | 'medium' | 'low';
export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'abandoned';
export type Recurrence = 'daily' | 'weekly';
export type CTFPlatform = 'PicoCTF' | 'HackTheBox' | 'TryHackMe' | 'CTFtime' | 'Other';
export type CTFCategory = 'Web' | 'Crypto' | 'Forensics' | 'Pwn' | 'Misc';
export type CTFDifficulty = 'Easy' | 'Medium' | 'Hard';

export type TaskOrigin = 'generated' | 'manual';
export type TaskCategory = 'practice' | 'learning' | 'project' | 'review' | 'ctf' | 'documentation' | 'automation';

export interface TaskRow {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  pillar: Pillar;
  month: number;
  priority: Priority;
  status: TaskStatus;
  xp_value: number;
  due_date: string | null;
  completed_at: string | null;
  is_recurring: boolean;
  recurrence: Recurrence | null;
  origin: TaskOrigin;
  category: TaskCategory;
  source_template: string | null;
  generation_date: string | null;
  generation_context: Json | null;
  created_at: string;
}

export interface UserProgressRow {
  id: string;
  user_id: string;
  current_month: number;
  start_date: string;
  streak_current: number;
  streak_best: number;
  pillar_xp: Json;
  monthly_completion: Json;
  badges: string[];
  created_at: string;
  updated_at: string;
}

export interface LogRow {
  id: string;
  user_id: string;
  date: string;
  content: string;
  pillar: Pillar;
  is_win: boolean;
  created_at: string;
}

export interface CtfEntryRow {
  id: string;
  user_id: string;
  name: string;
  platform: CTFPlatform;
  date: string;
  category: CTFCategory;
  solved: boolean;
  flag_notes: string | null;
  difficulty: CTFDifficulty;
  xp_earned: number;
  created_at: string;
}

export interface YearlyRoadmapRow {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  year: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RoadmapMonthRow {
  id: string;
  roadmap_id: string;
  month: number;
  title: string;
  description: string | null;
  focus_areas: Json;
  deliverables: Json;
  suggested_tasks: Json;
  estimated_hours: number | null;
  is_completed: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface RoadmapMilestoneRow {
  id: string;
  roadmap_id: string;
  month: number;
  name: string;
  description: string | null;
  xp_required: number;
  created_at: string;
}

export interface Tables {
  tasks: {
    Row: TaskRow;
    Insert: Omit<TaskRow, 'id' | 'created_at'>;
    Update: Partial<Omit<TaskRow, 'id' | 'created_at'>>;
  };
  user_progress: {
    Row: UserProgressRow;
    Insert: Omit<UserProgressRow, 'id' | 'created_at' | 'updated_at'>;
    Update: Partial<Omit<UserProgressRow, 'id' | 'created_at'>>;
  };
  logs: {
    Row: LogRow;
    Insert: Omit<LogRow, 'id' | 'created_at'>;
    Update: Partial<Omit<LogRow, 'id' | 'created_at'>>;
  };
  ctf_entries: {
    Row: CtfEntryRow;
    Insert: Omit<CtfEntryRow, 'id' | 'created_at'>;
    Update: Partial<Omit<CtfEntryRow, 'id' | 'created_at'>>;
  };
  yearly_roadmaps: {
    Row: YearlyRoadmapRow;
    Insert: Omit<YearlyRoadmapRow, 'id' | 'created_at' | 'updated_at'>;
    Update: Partial<Omit<YearlyRoadmapRow, 'id' | 'created_at'>>;
  };
  roadmap_months: {
    Row: RoadmapMonthRow;
    Insert: Omit<RoadmapMonthRow, 'id' | 'created_at' | 'updated_at'>;
    Update: Partial<Omit<RoadmapMonthRow, 'id' | 'created_at'>>;
  };
  roadmap_milestones: {
    Row: RoadmapMilestoneRow;
    Insert: Omit<RoadmapMilestoneRow, 'id' | 'created_at'>;
    Update: Partial<Omit<RoadmapMilestoneRow, 'id' | 'created_at'>>;
  };
}

export type TasksInsert = Tables['tasks']['Insert'];
export type UserProgressInsert = Tables['user_progress']['Insert'];
export type LogsInsert = Tables['logs']['Insert'];
export type CtfEntriesInsert = Tables['ctf_entries']['Insert'];

export type Database = {
  public: {
    Tables: Tables;
  };
};