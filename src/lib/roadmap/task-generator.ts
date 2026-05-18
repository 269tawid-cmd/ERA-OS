import type { Pillar, Task } from '@/types';
import type {
  YearlyRoadmapSchema,
  TaskGenerationContext,
  GeneratedTask,
  TaskCategory,
} from './schema';
import {
  DEFAULT_DAILY_TASK_TARGET,
  MAX_TASKS_PER_DAY,
  MIN_TASKS_PER_DAY,
} from './schema';

function getDaysUntilMonthEnd(currentMonth: number): number {
  const now = new Date();
  const monthEnd = new Date(now.getFullYear(), currentMonth + 1, 0);
  const currentDay = now.getDate();
  return Math.max(0, monthEnd.getDate() - currentDay);
}

function getCompletionPressure(daysRemaining: number, pendingCount: number): number {
  if (daysRemaining === 0) return 1;
  return Math.min(1, pendingCount / daysRemaining);
}

export function generateDailyTasks(
  context: TaskGenerationContext,
  yearlySchema: YearlyRoadmapSchema,
  existingTasks: Task[]
): GeneratedTask[] {
  const monthSchema = yearlySchema.months.find(m => m.month === context.currentMonth);
  if (!monthSchema) return [];
  
  let targetCount = DEFAULT_DAILY_TASK_TARGET;

  if (context.currentStreak >= 7) {
    targetCount = Math.min(MAX_TASKS_PER_DAY, targetCount + 1);
  }

  if (context.currentStreak === 0) {
    targetCount = Math.max(MIN_TASKS_PER_DAY, targetCount - 1);
  }

  const daysRemaining = getDaysUntilMonthEnd(context.currentMonth);
  const pendingTotal = context.pendingTasks.length;
  const pressure = getCompletionPressure(daysRemaining, pendingTotal);

  if (pressure > 0.8 && context.currentStreak >= 3) {
    targetCount = Math.max(MIN_TASKS_PER_DAY, targetCount - 1);
  }

  const tasks: GeneratedTask[] = [];

  if (context.weakPillars.length > 0 && tasks.length < targetCount) {
    const weakPillar = context.weakPillars[0];
    const weakTemplates = monthSchema.task_templates
      .filter(t => t.pillar === weakPillar && !existingTasks.some(e => e.title === t.title))
      .slice(0, 2);
    
    for (const template of weakTemplates) {
      if (tasks.length >= targetCount) break;
      tasks.push({
        title: template.title,
        description: `Priority task for ${weakPillar} pillar. Focus: ${monthSchema.title}`,
        pillar: template.pillar,
        category: template.category,
        priority: 'high',
        xp_value: template.xp_value,
        estimated_minutes: template.estimated_minutes,
        reason: `Weak pillar: ${weakPillar}. Build foundation here.`,
        source_template: template.id,
      });
    }
  }

  if (tasks.length < targetCount && pendingTotal > 0) {
    const pendingToContinue = context.pendingTasks
      .filter(t => t.status === 'todo')
      .slice(0, targetCount - tasks.length);
    
    for (const pending of pendingToContinue) {
      if (tasks.length >= targetCount) break;
      const isDuplicate = existingTasks.some(e => e.title === pending.title);
      if (isDuplicate) continue;
      
      tasks.push({
        title: pending.title,
        description: pending.description || `Continue: ${pending.title}`,
        pillar: pending.pillar,
        category: ((pending as { category?: TaskCategory }).category || 'practice') as TaskCategory,
        priority: pending.priority,
        xp_value: pending.xp_value,
        estimated_minutes: (pending as { estimated_minutes?: number }).estimated_minutes || 45,
        reason: 'Continue your pending work',
        source_template: (pending as { source_template?: string }).source_template || undefined,
      });
    }
  }
  
  if (tasks.length < targetCount) {
    const untriedTemplates = monthSchema.task_templates
      .filter(t => !existingTasks.some(e => e.title === t.title))
      .slice(0, targetCount - tasks.length);
    
    for (const template of untriedTemplates) {
      if (tasks.length >= targetCount) break;
      tasks.push({
        title: template.title,
        description: `Explore new topic: ${template.title}`,
        pillar: template.pillar,
        category: template.category,
        priority: template.priority,
        xp_value: template.xp_value,
        estimated_minutes: template.estimated_minutes,
        reason: `New learning opportunity. Category: ${template.category}`,
        source_template: template.id,
      });
    }
  }
  
  if (context.weekDay === 6 || context.weekDay === 0) {
    const ctfTask = monthSchema.task_templates.find(t => t.category === 'ctf');
    if (ctfTask && !tasks.some(t => t.category === 'ctf')) {
      tasks.push({
        title: ctfTask.title,
        description: 'Weekend CTF session. Apply what you learned.',
        pillar: ctfTask.pillar,
        category: 'ctf',
        priority: 'high',
        xp_value: ctfTask.xp_value,
        estimated_minutes: 120,
        reason: 'Weekend special: CTF challenge time',
        source_template: ctfTask.id,
      });
    }
  }
  
  if (context.currentStreak === 0) {
    const easyTask = monthSchema.task_templates
      .filter(t => t.category === 'learning' || t.category === 'practice')
      .slice(0, 1);
    
    if (easyTask.length > 0 && !tasks.some(t => t.category === 'learning')) {
      tasks.unshift({
        title: easyTask[0].title,
        description: 'Easy start. Pick something simple to begin.',
        pillar: easyTask[0].pillar,
        category: 'learning',
        priority: 'medium',
        xp_value: easyTask[0].xp_value,
        estimated_minutes: 30,
        reason: 'Rebuild streak: start with an easy task',
        source_template: easyTask[0].id,
      });
    }
  }
  
  return tasks.slice(0, MAX_TASKS_PER_DAY);
}

export function getTodayMission(
  currentMonth: number,
  pillarXP: Record<Pillar, number>,
  streak: number,
  pendingTasks: Task[],
  existingTasks: Task[],
  yearlySchema: YearlyRoadmapSchema
): { tasks: GeneratedTask[]; summary: string } {
  const totalXP = Object.values(pillarXP).reduce((sum, xp) => sum + xp, 0);
  const pillarPercentages = (Object.keys(pillarXP) as Pillar[]).map(p => ({
    pillar: p,
    xp: pillarXP[p] || 0,
    percentage: totalXP > 0 ? ((pillarXP[p] || 0) / totalXP) * 100 : 25,
  }));
  
  const sortedPillars = [...pillarPercentages].sort((a, b) => a.percentage - b.percentage);
  const weakPillars = sortedPillars.slice(0, 2).map(s => s.pillar as Pillar);
  const strongPillars = sortedPillars.slice(-1).map(s => s.pillar as Pillar);
  
  const recentCompleted = pendingTasks
    .filter(t => t.status === 'done')
    .map(t => t.pillar);
  
  const now = new Date();
  const context: TaskGenerationContext = {
    currentMonth,
    monthData: yearlySchema.months.find(m => m.month === currentMonth) || {
      month: currentMonth,
      year: 1,
      title: 'Unknown',
      description: '',
      focus_areas: [],
      deliverables: [],
      task_templates: [],
      prerequisites: [],
      success_criteria: [],
      estimated_hours: 0,
    },
    pendingTasks: pendingTasks.filter(t => t.status !== 'done' && t.status !== 'abandoned'),
    completedTasksToday: pendingTasks.filter(t => {
      if (!t.completed_at) return false;
      const completed = new Date(t.completed_at);
      return completed.toDateString() === now.toDateString();
    }).length,
    currentStreak: streak,
    pillarXP,
    weakPillars,
    strongPillars,
    recentCompletedPillars: recentCompleted,
    weekDay: now.getDay(),
  };
  
  const generatedTasks = generateDailyTasks(context, yearlySchema, existingTasks);
  
  const summaryParts: string[] = [];
  
  if (streak > 0) {
    summaryParts.push(`${streak}-day streak`);
  }
  
  if (weakPillars.length > 0) {
    summaryParts.push(`Focus: ${weakPillars.join(', ')}`);
  }
  
  if (generatedTasks.length > 0) {
    const totalMinutes = generatedTasks.reduce((sum, t) => sum + t.estimated_minutes, 0);
    summaryParts.push(`${generatedTasks.length} tasks (~${totalMinutes} min)`);
  }
  
  return {
    tasks: generatedTasks,
    summary: summaryParts.join(' | '),
  };
}