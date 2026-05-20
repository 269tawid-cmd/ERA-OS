import type { MonthlyRoadmap, Pillar } from '@/types';
import { YEAR1_ROADMAP, YEAR1_MILESTONES } from './year1';
import { ingestYear1Roadmap } from './ingest';
import type { YearlyRoadmapSchema } from './schema';

export { YEAR1_ROADMAP, YEAR1_MILESTONES, ingestYear1Roadmap };

export const ROADMAP_DATA: MonthlyRoadmap[] = YEAR1_ROADMAP;

export function getIngestedRoadmap(): YearlyRoadmapSchema {
  return ingestYear1Roadmap(ROADMAP_DATA);
}

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

export function getRoadmapProgress(currentMonth: number, startDate?: string | null): { 
  completed: number; 
  remaining: number; 
  percentage: number;
  daysRemaining: number;
  daysElapsed: number;
  realMonth: number;
} {
  const totalMonths = 12;
  const totalDays = totalMonths * 30;
  
  let daysElapsed = 0;
  let realMonth = currentMonth;
  
  if (startDate) {
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = now.getTime() - start.getTime();
    daysElapsed = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    realMonth = Math.min(Math.floor(daysElapsed / 30) + 1, totalMonths);
  }
  
  const daysRemaining = Math.max(0, totalDays - daysElapsed);
  const percentage = Math.min(100, Math.round((daysElapsed / totalDays) * 100));
  
  const completed = Math.min(realMonth, totalMonths);
  const remaining = totalMonths - completed;

  return { completed, remaining, percentage, daysRemaining, daysElapsed, realMonth };
}

export function formatRoadmapSummary(currentMonth: number): string {
  const monthData = getMonthData(currentMonth);
  if (!monthData) return '';

  return `You are in Month ${currentMonth}: ${monthData.title}. Focus: ${monthData.focus.slice(0, 2).join(', ')}`;
}