const TOKEN_ESTIMATE_PER_CHAR = 0.25;

export function estimateTokens(text: string): number {
  return Math.ceil(text.length * TOKEN_ESTIMATE_PER_CHAR);
}

export function truncateText(text: string, maxTokens: number): string {
  const maxChars = maxCharsForTokens(maxTokens);
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars - 3) + '...';
}

export function maxCharsForTokens(tokens: number): number {
  return Math.floor(tokens / TOKEN_ESTIMATE_PER_CHAR);
}

export function compactTaskList(
  tasks: { title: string; status: string; pillar: string; month: number }[],
  maxTokens: number
): string {
  if (tasks.length === 0) return 'No tasks';

  const taskStrings = tasks.map(t => `${t.title} (${t.pillar}, M${t.month})`);
  const result = taskStrings.join(', ');
  
  const estimated = estimateTokens(result);
  if (estimated <= maxTokens) return result;

  const truncated: string[] = [];
  let currentLength = 0;

  for (const task of taskStrings) {
    const taskTokens = estimateTokens(task + ', ');
    if (currentLength + taskTokens > maxTokens - 20) {
      truncated.push(`+${tasks.length - truncated.length} more`);
      break;
    }
    truncated.push(task);
    currentLength += taskTokens;
  }

  return truncated.join(', ');
}

export function compactRoadmapSummary(
  month: number,
  title: string,
  focus: string[],
  maxTokens: number
): string {
  const summary = `Month ${month}: ${title}. Focus: ${focus.slice(0, 2).join(', ')}`;
  return truncateText(summary, maxTokens);
}

export function compactPillarXP(pillarXP: Record<string, number>): string {
  const entries = Object.entries(pillarXP)
    .filter(([, xp]) => xp > 0)
    .sort(([, a], [, b]) => b - a)
    .map(([pillar, xp]) => `${pillar}:${xp}`)
    .join(' | ');
  
  return entries || 'No XP yet';
}

export function truncateTaskTitles(
  tasks: { title: string; pillar: string; month: number }[],
  maxTitleLength: number = 30
): { title: string; pillar: string; month: number }[] {
  return tasks.map(t => ({
    ...t,
    title: t.title.length > maxTitleLength
      ? t.title.slice(0, maxTitleLength - 3) + '...'
      : t.title,
  }));
}

export function summarizePendingTasks(
  pending: { title: string; priority: string; pillar: string }[],
  maxTokens: number
): string {
  if (pending.length === 0) return 'No pending tasks';

  const highPriority = pending.filter(t => t.priority === 'high');
  const other = pending.filter(t => t.priority !== 'high');

  let result = '';
  
  if (highPriority.length > 0) {
    result += `High: ${highPriority.map(t => t.title).join(', ')}`;
  }

  if (other.length > 0 && estimateTokens(result) < maxTokens) {
    const otherStr = other.map(t => t.title).join(', ');
    result += result ? `. Other: ${otherStr}` : otherStr;
  }

  if (pending.length > highPriority.length + other.length) {
    result += ` +${pending.length - highPriority.length - other.length} more`;
  }

  return truncateText(result, maxTokens);
}

export function buildContextHeader(context: {
  currentMonth: number;
  monthTitle: string;
  currentStreak: number;
}): string {
  return `Era OS Context: Month ${context.currentMonth} (${context.monthTitle}) | Streak: ${context.currentStreak} days`;
}