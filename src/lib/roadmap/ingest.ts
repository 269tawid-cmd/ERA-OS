import type { MonthlyRoadmap, Pillar } from '@/types';
import type {
  MonthlyRoadmapSchema,
  YearlyRoadmapSchema,
  RoadmapTaskTemplate,
  TaskCategory,
} from './schema';

const PILLAR_KEYWORDS: Record<Pillar, string[]> = {
  HACK: ['ctf', 'hack', 'pentest', 'vulnerability', 'dvwa', 'owasp', 'metasploit', 'exploit', 'burp', 'nmap', 'privesc', 'attack', 'scan'],
  BUILD: ['build', 'script', 'tool', 'python', 'project', 'automation', 'create', 'write', 'code'],
  AI: ['ai', 'llm', 'gemini', 'automation', 'gpt', 'model'],
  PRESENCE: ['blog', 'write', 'document', 'report', 'note', 'publish', 'share'],
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
  
  return maxPillar;
}

export function inferTaskCategory(title: string): TaskCategory {
  const lower = title.toLowerCase();
  
  if (lower.includes('ctf') || lower.includes('challenge') || lower.includes('pico')) return 'ctf';
  if (lower.includes('learn') || lower.includes('complete') || lower.includes('course')) return 'learning';
  if (lower.includes('build') || lower.includes('create') || lower.includes('write')) return 'project';
  if (lower.includes('review') || lower.includes('analyze')) return 'review';
  if (lower.includes('script') || lower.includes('tool') || lower.includes('scanner')) return 'automation';
  if (lower.includes('blog') || lower.includes('document') || lower.includes('note')) return 'documentation';
  
  return 'practice';
}

export function estimateTaskDuration(category: TaskCategory): number {
  switch (category) {
    case 'ctf': return 60;
    case 'learning': return 45;
    case 'project': return 90;
    case 'review': return 30;
    case 'automation': return 60;
    case 'documentation': return 30;
    case 'practice': return 45;
  }
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

export function convertToSchema(monthData: MonthlyRoadmap): MonthlyRoadmapSchema {
  const task_templates: RoadmapTaskTemplate[] = monthData.suggested_tasks.map((task, index) => {
    const pillar = inferPillar(task);
    const category = inferTaskCategory(task);
    
    return {
      id: `${monthData.month}-task-${index + 1}`,
      title: task,
      description: `Generated from ${monthData.title} roadmap`,
      pillar,
      category,
      priority: index === 0 ? 'high' : 'medium',
      xp_value: estimateXP(category, pillar),
      estimated_minutes: estimateTaskDuration(category),
      resources: [],
    };
  });
  
  return {
    month: monthData.month,
    year: 1,
    title: monthData.title,
    description: `Month ${monthData.month}: ${monthData.title}`,
    focus_areas: monthData.focus.map(f => ({
      name: f,
      description: f,
      weight: 1,
    })),
    deliverables: monthData.deliverables,
    task_templates,
    prerequisites: [],
    success_criteria: [],
    estimated_hours: task_templates.reduce((sum, t) => sum + t.estimated_minutes, 0) / 60,
  };
}

export function ingestYear1Roadmap(roadmap: MonthlyRoadmap[]): YearlyRoadmapSchema {
  return {
    year: 1,
    title: 'Year 1: Foundation',
    description: 'First year cybersecurity roadmap focusing on web application penetration testing',
    months: roadmap.map(m => convertToSchema(m)),
    milestones: [
      { month: 3, name: 'Linux Basic', description: 'Complete Linux fundamentals', xp_required: 500 },
      { month: 6, name: 'Web Security Foundation', description: 'Complete OWASP + DVWA', xp_required: 1500 },
      { month: 9, name: 'Jr Pentester Path', description: 'Complete TryHackMe Jr Pentester', xp_required: 2500 },
      { month: 12, name: 'Year 1 Complete', description: 'Finish first year of journey', xp_required: 4000 },
    ],
  };
}