import type { Pillar, TaskCategory } from '@/types';
import type { ParsedRoadmap, ParsedMonth } from './parser';
import type { YearlyRoadmapSchema, MonthlyRoadmapSchema, RoadmapTaskTemplate } from './schema';

const PILLAR_KEYWORDS: Record<Pillar, string[]> = {
  HACK: ['ctf', 'hack', 'pentest', 'pentesting', 'penetration', 'vulnerability', 'dvwa', 'owasp', 
         'metasploit', 'exploit', 'burp', 'nmap', 'privesc', 'privilege', 'attack', 'scan', 'scan',
         'recon', 'enumeration', ' foothold', 'webapp', 'xss', 'sqli', 'sql injection', 'csrf',
         'injection', 'brute', 'crack', 'forensic', 'reverse', 'binary', 'pwn', 'crypto'],
  BUILD: ['build', 'script', 'tool', 'python', 'project', 'automation', 'create', 'write', 'code',
          'develop', 'implement', 'construct', 'assemble', 'compile', 'deploy', 'configure',
          'linux', 'bash', 'shell', 'docker', 'git', 'github', 'api', 'backend', 'frontend'],
  AI: ['ai', 'llm', 'gemini', 'gpt', 'model', 'nlp', 'neural', 'machine learning', 'ml',
       'openai', 'anthropic', 'claude', 'chatgpt', 'automation', 'prompt', 'rag', 'vector'],
  PRESENCE: ['blog', 'write', 'document', 'report', 'note', 'publish', 'share', 'cv', 'resume',
             'portfolio', 'linkedin', 'twitter', 'x.com', 'social', 'present', 'speak', 'teach',
             'mentor', 'community', 'youtube', 'video', 'article', 'post'],
};

const CATEGORY_KEYWORDS: Record<TaskCategory, string[]> = {
  practice: ['practice', 'drill', 'exercise', 'hands-on', 'try', 'experiment', 'explore'],
  learning: ['learn', 'study', 'understand', 'read', 'watch', 'course', 'tutorial', 'video', 'book'],
  project: ['build', 'create', 'make', 'develop', 'implement', 'construct', 'project', 'portfolio'],
  review: ['review', 'analyze', 'examine', 'audit', 'assess', 'evaluate', 'check'],
  ctf: ['ctf', 'capture', 'flag', 'challenge', 'hackthebox', 'tryhackme', 'picoctf', 'vulnhub', 'cyberchef'],
  documentation: ['document', 'note', 'write', 'blog', 'report', 'journal', 'writeup', 'write up'],
  automation: ['script', 'automate', 'tool', 'scanner', 'scripting', 'bash', 'python script'],
};

export function inferPillar(text: string): Pillar {
  const lower = text.toLowerCase();
  const scores: Record<Pillar, number> = { HACK: 0, BUILD: 0, AI: 0, PRESENCE: 0 };
  
  for (const [pillar, keywords] of Object.entries(PILLAR_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lower.includes(keyword)) {
        scores[pillar as Pillar]++;
      }
    }
  }
  
  let maxPillar: Pillar = 'HACK';
  let maxScore = 0;
  
  for (const [pillar, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      maxPillar = pillar as Pillar;
    }
  }
  
  if (maxScore === 0) {
    return 'HACK';
  }
  
  return maxPillar;
}

export function inferCategory(text: string): TaskCategory {
  const lower = text.toLowerCase();
  const scores: Record<TaskCategory, number> = {
    practice: 0, learning: 0, project: 0, review: 0,
    ctf: 0, documentation: 0, automation: 0,
  };
  
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lower.includes(keyword)) {
        scores[category as TaskCategory]++;
      }
    }
  }
  
  let maxCategory: TaskCategory = 'practice';
  let maxScore = 0;
  
  for (const [category, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      maxCategory = category as TaskCategory;
    }
  }
  
  if (maxScore === 0) {
    return 'practice';
  }
  
  return maxCategory;
}

export function estimateTaskDuration(category: TaskCategory): number {
  const durations: Record<TaskCategory, number> = {
    ctf: 60,
    learning: 45,
    project: 90,
    review: 30,
    automation: 60,
    documentation: 30,
    practice: 45,
  };
  return durations[category];
}

export function estimateXP(category: TaskCategory, pillar: Pillar): number {
  const baseXP: Record<TaskCategory, number> = {
    ctf: 25,
    learning: 15,
    project: 30,
    review: 10,
    automation: 25,
    documentation: 15,
    practice: 15,
  };
  
  const pillarBonus: Record<Pillar, number> = {
    HACK: 5,
    BUILD: 5,
    AI: 10,
    PRESENCE: 5,
  };
  
  return baseXP[category] + pillarBonus[pillar];
}

function normalizeMonth(month: ParsedMonth): MonthlyRoadmapSchema {
  const focus_areas = month.focus_areas.map(f => ({
    name: f,
    description: f,
    weight: 1,
  }));
  
  const task_templates: RoadmapTaskTemplate[] = month.suggested_tasks.map((task, index) => {
    const pillar = inferPillar(task);
    const category = inferCategory(task);
    
    return {
      id: `${month.month}-${index + 1}`,
      title: task,
      description: `${month.title}: ${task}`,
      pillar,
      category,
      priority: index === 0 ? 'high' : 'medium',
      xp_value: estimateXP(category, pillar),
      estimated_minutes: estimateTaskDuration(category),
      resources: [],
    };
  });
  
  const totalHours = task_templates.reduce((sum, t) => sum + t.estimated_minutes, 0) / 60;
  
  return {
    month: month.month,
    year: 1,
    title: month.title,
    description: month.title,
    focus_areas,
    deliverables: month.deliverables,
    task_templates,
    prerequisites: [],
    success_criteria: [],
    estimated_hours: Math.round(totalHours),
  };
}

export function normalizeRoadmap(parsed: ParsedRoadmap): YearlyRoadmapSchema {
  return {
    year: parsed.year,
    title: parsed.title,
    description: parsed.description,
    months: parsed.months.map(normalizeMonth),
    milestones: inferMilestones(parsed.months),
  };
}

function inferMilestones(months: ParsedMonth[]) {
  const milestones = [];
  
  const quarterMonths = [3, 6, 9, 12].filter(q => q <= months.length);
  
  for (const q of quarterMonths) {
    const month = months.find(m => m.month === q);
    if (month) {
      milestones.push({
        month: q,
        name: month.title,
        description: `Complete ${month.title} phase`,
        xp_required: q * 300,
      });
    }
  }
  
  return milestones;
}

export interface NormalizedRoadmapDB {
  roadmap: {
    title: string;
    description: string;
    year: number;
  };
  months: Array<{
    month: number;
    title: string;
    description: string;
    focus_areas: string[];
    deliverables: string[];
    suggested_tasks: Array<{
      title: string;
      pillar: Pillar;
      category: TaskCategory;
      xp_value: number;
      estimated_minutes: number;
    }>;
    estimated_hours: number;
  }>;
  milestones: Array<{
    month: number;
    name: string;
    description: string;
    xp_required: number;
  }>;
}

export function normalizeForDB(parsed: ParsedRoadmap): NormalizedRoadmapDB {
  const normalized = normalizeRoadmap(parsed);
  
  return {
    roadmap: {
      title: normalized.title,
      description: normalized.description,
      year: normalized.year,
    },
    months: normalized.months.map(m => ({
      month: m.month,
      title: m.title,
      description: m.description,
      focus_areas: m.focus_areas.map(f => f.name),
      deliverables: m.deliverables,
      suggested_tasks: m.task_templates.map(t => ({
        title: t.title,
        pillar: t.pillar,
        category: t.category,
        xp_value: t.xp_value,
        estimated_minutes: t.estimated_minutes,
      })),
      estimated_hours: m.estimated_hours,
    })),
    milestones: normalized.milestones,
  };
}

export function getRoadmapStats(normalized: YearlyRoadmapSchema) {
  const totalTasks = normalized.months.reduce((sum, m) => sum + m.task_templates.length, 0);
  const totalHours = normalized.months.reduce((sum, m) => sum + m.estimated_hours, 0);
  const pillarDistribution: Record<Pillar, number> = { HACK: 0, BUILD: 0, AI: 0, PRESENCE: 0 };
  const categoryDistribution: Record<TaskCategory, number> = {
    practice: 0, learning: 0, project: 0, review: 0,
    ctf: 0, documentation: 0, automation: 0,
  };
  
  for (const month of normalized.months) {
    for (const task of month.task_templates) {
      pillarDistribution[task.pillar]++;
      categoryDistribution[task.category]++;
    }
  }
  
  return {
    totalMonths: normalized.months.length,
    totalTasks,
    totalHours,
    pillarDistribution,
    categoryDistribution,
  };
}