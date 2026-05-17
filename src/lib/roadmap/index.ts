import type { MonthlyRoadmap, Pillar } from '@/types';
import { YEAR1_ROADMAP, YEAR1_MILESTONES } from './year1';

export { YEAR1_ROADMAP, YEAR1_MILESTONES };

export const ROADMAP_DATA: MonthlyRoadmap[] = YEAR1_ROADMAP;

export function getMonthData(month: number): MonthlyRoadmap | undefined {
  return ROADMAP_DATA.find((m) => m.month === month);
}

export function getCurrentMonthFocus(currentMonth: number): string {
  const monthData = getMonthData(currentMonth);
  return monthData?.title || 'Unknown Phase';
}

export function getMonthDeliverables(month: number): string[] {
  const monthData = getMonthData(month);
  return monthData?.deliverables || [];
}

export function getMonthSuggestedTasks(month: number): string[] {
  const monthData = getMonthData(month);
  return monthData?.suggested_tasks || [];
}

export function getMonthsForPillar(_pillar: Pillar): number[] {
  return ROADMAP_DATA.filter((m) => {
    const taskLower = m.suggested_tasks.join(' ').toLowerCase();
    const focusLower = m.focus.join(' ').toLowerCase();

    switch (_pillar) {
      case 'HACK':
        return (
          taskLower.includes('ctf') ||
          taskLower.includes('hack') ||
          taskLower.includes('penetration') ||
          taskLower.includes('vulnerability') ||
          focusLower.includes('dvwa') ||
          focusLower.includes('owasp') ||
          focusLower.includes('metasploit')
        );
      case 'BUILD':
        return (
          taskLower.includes('build') ||
          taskLower.includes('script') ||
          taskLower.includes('tool') ||
          taskLower.includes('project') ||
          focusLower.includes('python') ||
          focusLower.includes('automation')
        );
      case 'AI':
        return taskLower.includes('ai') || taskLower.includes('llm') || taskLower.includes('automation');
      case 'PRESENCE':
        return (
          taskLower.includes('blog') ||
          taskLower.includes('write') ||
          taskLower.includes('document') ||
          taskLower.includes('report')
        );
      default:
        return false;
    }
  }).map((m) => m.month);
}

export function getMilestoneForMonth(month: number) {
  return YEAR1_MILESTONES.find((m) => m.month === month);
}

export function getRoadmapProgress(currentMonth: number): { completed: number; remaining: number; percentage: number } {
  const totalMonths = 12;
  const completed = Math.min(currentMonth, totalMonths);
  const remaining = totalMonths - completed;
  const percentage = Math.round((completed / totalMonths) * 100);

  return { completed, remaining, percentage };
}

export function formatRoadmapSummary(currentMonth: number): string {
  const monthData = getMonthData(currentMonth);
  if (!monthData) return '';

  return `You are in Month ${currentMonth}: ${monthData.title}. Focus: ${monthData.focus.slice(0, 2).join(', ')}`;
}