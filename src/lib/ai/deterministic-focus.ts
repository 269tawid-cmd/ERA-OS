import type { MentorContext } from './mentor-context';
import type { AIMentorResponse, DailyTasksResponse, MotivationalNudgeResponse } from './response-types';
import { getWeakestPillar, getStrongestPillar } from './mentor-context';

export function generateDeterministicTasks(context: MentorContext): DailyTasksResponse {
  const tasks: DailyTasksResponse['tasks'] = [];

  const monthTasks = context.tasksPending.filter(t => t.month === context.currentMonth);
  if (monthTasks.length > 0) {
    tasks.push({
      title: monthTasks[0].title,
      reason: `From your current roadmap month ${context.currentMonth}`,
      priority: monthTasks[0].priority,
      pillar: monthTasks[0].pillar,
    });
  }

  if (context.tasksPending.length > tasks.length) {
    const highPriority = context.tasksPending.find(t => t.priority === 'high');
    if (highPriority && !tasks.find(t => t.title === highPriority.title)) {
      tasks.push({
        title: highPriority.title,
        reason: 'High priority task needs attention',
        priority: 'high',
        pillar: highPriority.pillar,
      });
    }
  }

  const weakestPillar = getWeakestPillar(context);
  const weakPillarTask = context.tasksPending.find(t => t.pillar === weakestPillar);
  if (weakPillarTask && !tasks.find(t => t.title === weakPillarTask.title)) {
    tasks.push({
      title: weakPillarTask.title,
      reason: `Strengthen your ${weakestPillar} pillar`,
      priority: 'medium',
      pillar: weakPillarTask.pillar,
    });
  }

  const fallbackTasks = [
    { title: `Review ${context.monthTitle} concepts`, reason: 'Reinforce current phase learning', priority: 'medium' as const, pillar: 'HACK' },
    { title: 'Practice on TryHackMe', reason: 'Hands-on skill building', priority: 'medium' as const, pillar: 'HACK' },
    { title: 'Document learning notes', reason: 'Build knowledge base', priority: 'low' as const, pillar: 'BUILD' },
  ];

  while (tasks.length < 3) {
    const fallback = fallbackTasks[tasks.length % fallbackTasks.length];
    if (!tasks.find(t => t.title === fallback.title)) {
      tasks.push(fallback);
    }
  }

  return {
    type: 'daily_tasks',
    tasks: tasks.slice(0, 3),
  };
}

export function generateDeterministicNudge(context: MentorContext): MotivationalNudgeResponse {
  let message = '';

  if (context.daysSinceActivity >= 2) {
    message = `Hey Tawhid! It's been ${context.daysSinceActivity} days since your last activity. `;
    message += `Your streak is on the line — let's get back on track! `;
    message += `You're in Month ${context.currentMonth} (${context.monthTitle}) — keep pushing!`;
  } else if (context.currentStreak > 0) {
    const strongest = getStrongestPillar(context);
    message = `You're on a ${context.currentStreak}-day streak! 🔥 `;
    message += `Your ${strongest} pillar is leading — let's maintain momentum. `;
    message += `Focus today: ${context.monthTitle}`;
  } else {
    message = `Start fresh today, Tawhid! You're at Month ${context.currentMonth} of your journey. `;
    message += `This phase (${context.monthTitle}) sets the foundation for your pentesting career.`;
  }

  const actionItem = context.tasksPending.length > 0
    ? `Complete: "${context.tasksPending[0].title}"`
    : 'Create your first task for today';

  const roadmapReminder = `You're ${Math.round((context.currentMonth / 48) * 100)}% through your 4-year journey. Every day counts!`;

  return {
    type: 'motivational_nudge',
    message,
    action_item: actionItem,
    roadmap_reminder: roadmapReminder,
  };
}

export function generateDeterministicResponse(
  type: 'daily_tasks' | 'motivational_nudge',
  context: MentorContext
): AIMentorResponse {
  switch (type) {
    case 'daily_tasks':
      return generateDeterministicTasks(context);
    case 'motivational_nudge':
      return generateDeterministicNudge(context);
    default:
      return generateDeterministicNudge(context);
  }
}

export interface FallbackOptions {
  reason: 'rate_limit' | 'invalid_response' | 'network_error' | 'api_error';
  originalError?: string;
}

export function createFallbackResponse(
  context: MentorContext,
  options: FallbackOptions
): AIMentorResponse {
  console.warn(`AI fallback triggered: ${options.reason}`, options.originalError);

  if (context.tasksPending.length > 0 || context.currentStreak > 0) {
    return generateDeterministicResponse('daily_tasks', context);
  }

  return generateDeterministicResponse('motivational_nudge', context);
}