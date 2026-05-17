export interface Milestone {
  id: string;
  name: string;
  description: string;
  category: 'streak' | 'xp' | 'ctf' | 'month' | 'task' | 'log';
  threshold: number;
  xpBonus: number;
  unlockedAt?: string;
}

export const MILESTONES: Milestone[] = [
  {
    id: 'first_task',
    name: 'First Move',
    description: 'Complete your first task',
    category: 'task',
    threshold: 1,
    xpBonus: 10,
  },
  {
    id: 'streak_3',
    name: 'Momentum',
    description: 'Maintain a 3-day learning streak',
    category: 'streak',
    threshold: 3,
    xpBonus: 25,
  },
  {
    id: 'streak_7',
    name: 'Week Warrior',
    description: 'Maintain a 7-day learning streak',
    category: 'streak',
    threshold: 7,
    xpBonus: 50,
  },
  {
    id: 'streak_14',
    name: 'Two-Week Grind',
    description: 'Maintain a 14-day learning streak',
    category: 'streak',
    threshold: 14,
    xpBonus: 100,
  },
  {
    id: 'streak_30',
    name: 'Monthly Dedication',
    description: 'Maintain a 30-day learning streak',
    category: 'streak',
    threshold: 30,
    xpBonus: 200,
  },
  {
    id: 'hack_50_xp',
    name: 'Hacker Basics',
    description: 'Earn 50 HACK XP',
    category: 'xp',
    threshold: 50,
    xpBonus: 25,
  },
  {
    id: 'hack_100_xp',
    name: 'Core Offensive Skills',
    description: 'Earn 100 HACK XP',
    category: 'xp',
    threshold: 100,
    xpBonus: 50,
  },
  {
    id: 'hack_250_xp',
    name: 'Offensive Progression',
    description: 'Earn 250 HACK XP',
    category: 'xp',
    threshold: 250,
    xpBonus: 100,
  },
  {
    id: 'hack_500_xp',
    name: 'Skilled Attacker',
    description: 'Earn 500 HACK XP',
    category: 'xp',
    threshold: 500,
    xpBonus: 200,
  },
  {
    id: 'first_ctf',
    name: 'Flag Captured',
    description: 'Solve your first CTF challenge',
    category: 'ctf',
    threshold: 1,
    xpBonus: 30,
  },
  {
    id: 'ctf_5',
    name: 'CTF Hunter',
    description: 'Solve 5 CTF challenges',
    category: 'ctf',
    threshold: 5,
    xpBonus: 75,
  },
  {
    id: 'ctf_10',
    name: 'CTF Veteran',
    description: 'Solve 10 CTF challenges',
    category: 'ctf',
    threshold: 10,
    xpBonus: 150,
  },
  {
    id: 'month_complete',
    name: 'Phase Complete',
    description: 'Complete all tasks for a month',
    category: 'month',
    threshold: 1,
    xpBonus: 100,
  },
  {
    id: 'three_months',
    name: 'Quarter Progress',
    description: 'Reach Month 3',
    category: 'month',
    threshold: 3,
    xpBonus: 50,
  },
  {
    id: 'first_log',
    name: 'Documented Learning',
    description: 'Write your first learning log',
    category: 'log',
    threshold: 1,
    xpBonus: 10,
  },
  {
    id: 'five_logs',
    name: 'Consistent Recorder',
    description: 'Write 5 learning logs',
    category: 'log',
    threshold: 5,
    xpBonus: 25,
  },
  {
    id: 'first_win',
    name: 'First Win',
    description: 'Mark your first learning log as a win',
    category: 'log',
    threshold: 1,
    xpBonus: 25,
  },
  {
    id: 'total_10_tasks',
    name: 'Task Initiate',
    description: 'Complete 10 tasks total',
    category: 'task',
    threshold: 10,
    xpBonus: 30,
  },
  {
    id: 'total_50_tasks',
    name: 'Task Master',
    description: 'Complete 50 tasks total',
    category: 'task',
    threshold: 50,
    xpBonus: 100,
  },
];

export function getMilestoneProgress(
  milestone: Milestone,
  stats: {
    streakCurrent: number;
    hackXP: number;
    ctfSolvedCount: number;
    tasksCompletedCount: number;
    logsCount: number;
    winsCount: number;
    monthsCompleted: number;
    currentMonth: number;
  }
): { progress: number; percentage: number; achieved: boolean } {
  let current = 0;

  switch (milestone.category) {
    case 'streak':
      current = stats.streakCurrent;
      break;
    case 'xp':
      current = stats.hackXP;
      break;
    case 'ctf':
      current = stats.ctfSolvedCount;
      break;
    case 'task':
      current = stats.tasksCompletedCount;
      break;
    case 'log':
      if (milestone.id === 'first_log' || milestone.id === 'five_logs') {
        current = stats.logsCount;
      } else if (milestone.id === 'first_win') {
        current = stats.winsCount;
      }
      break;
    case 'month':
      if (milestone.id === 'month_complete') {
        current = stats.monthsCompleted;
      } else if (milestone.id === 'three_months') {
        current = Math.min(stats.currentMonth, milestone.threshold);
      }
      break;
  }

  const progress = Math.min(current, milestone.threshold);
  const percentage = Math.round((progress / milestone.threshold) * 100);
  const achieved = progress >= milestone.threshold;

  return { progress, percentage, achieved };
}

export function getNextMilestones(
  stats: {
    streakCurrent: number;
    hackXP: number;
    ctfSolvedCount: number;
    tasksCompletedCount: number;
    logsCount: number;
    winsCount: number;
    monthsCompleted: number;
    currentMonth: number;
  },
  limit = 3
): Milestone[] {
  const unachieved = MILESTONES.filter((m) => {
    const { achieved } = getMilestoneProgress(m, stats);
    return !achieved;
  });

  return unachieved.slice(0, limit);
}

export function getAchievedMilestones(
  stats: {
    streakCurrent: number;
    hackXP: number;
    ctfSolvedCount: number;
    tasksCompletedCount: number;
    logsCount: number;
    winsCount: number;
    monthsCompleted: number;
    currentMonth: number;
  }
): Milestone[] {
  return MILESTONES.filter((m) => {
    const { achieved } = getMilestoneProgress(m, stats);
    return achieved;
  });
}