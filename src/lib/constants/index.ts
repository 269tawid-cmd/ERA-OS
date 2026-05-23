import type { Pillar, Priority, TaskStatus, Recurrence } from '@/types';

export const PILLARS: Record<Pillar, { name: string; color: string; glow: string; description: string }> = {
  HACK: {
    name: 'HACK',
    color: '#ef4444',
    glow: '0 0 12px rgba(239, 68, 68, 0.4)',
    description: 'Offensive skills, CTFs, TryHackMe, tools, certs (eJPT, OSCP)',
  },
  BUILD: {
    name: 'BUILD',
    color: '#a855f7',
    glow: '0 0 12px rgba(168, 85, 247, 0.4)',
    description: 'Projects built, scripts written, tools created, GitHub commits',
  },
  AI: {
    name: 'AI',
    color: '#2dd4bf',
    glow: '0 0 12px rgba(45, 212, 191, 0.4)',
    description: 'AI/LLM leverage skills, automation, AI-assisted hacking tools',
  },
  PRESENCE: {
    name: 'PRESENCE',
    color: '#f59e0b',
    glow: '0 0 12px rgba(245, 158, 11, 0.4)',
    description: 'Blog posts, Twitter/X activity, YouTube, bug bounty reports, GitHub README',
  },
};

export const PILLAR_ORDER: Pillar[] = ['HACK', 'BUILD', 'AI', 'PRESENCE'];

export const PRIORITIES: Record<Priority, { label: string; value: number }> = {
  high: { label: 'High', value: 3 },
  medium: { label: 'Medium', value: 2 },
  low: { label: 'Low', value: 1 },
};

export const TASK_STATUSES: Record<TaskStatus, { label: string; color: string }> = {
  todo: { label: 'Pending', color: '#6b7280' },
  in_progress: { label: 'Engaged', color: '#3b82f6' },
  done: { label: 'Resolved', color: '#22c55e' },
  abandoned: { label: 'Archived', color: '#ef4444' },
};

export const XP_VALUES: Record<Priority, number> = {
  high: 50,
  medium: 25,
  low: 10,
};

export const RECURRENCE_OPTIONS: Record<Recurrence, { label: string; description: string }> = {
  daily: { label: 'Daily', description: 'Repeats every day' },
  weekly: { label: 'Weekly', description: 'Repeats every week' },
};

export const CTF_PLATFORMS = ['PicoCTF', 'HackTheBox', 'TryHackMe', 'CTFtime', 'Other'] as const;

export const CTF_CATEGORIES = ['Web', 'Crypto', 'Forensics', 'Pwn', 'Misc'] as const;

export const CTF_DIFFICULTIES = ['Easy', 'Medium', 'Hard'] as const;

export const MAX_LOG_LENGTH = 500;

export const STREAKMilestone_THRESHOLDS = [7, 14, 30, 60, 90, 180, 365];

export { MILESTONES, getMilestoneProgress, getNextMilestones, getAchievedMilestones, type Milestone } from './milestones';

export const ROADMAP_TOTAL_MONTHS = 48;

export const YEAR_MONTHS = 12;