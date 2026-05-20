export interface WorkspaceIntelligence {
  operationalPressure: 'low' | 'medium' | 'high' | 'critical';
  mentorUrgency: number;
  weakPillars: string[];
  neglectedMissions: string[];
  staleMissionCount: number;
  environmentTone: 'calm' | 'normal' | 'tense' | 'critical';
  backlogPressure: number;
  streakStatus: 'cold' | 'building' | 'strong' | 'hot';
  completionRatio: number;
  daysBehindRoadmap: number;
}

export function computeWorkspaceIntelligence(data: {
  tasks?: any[];
  pillarXP?: Record<string, number>;
  streakCurrent?: number;
  currentMonth?: number;
  startDate?: string | null;
  progress?: {
    percentage: number;
    daysRemaining: number;
    daysElapsed: number;
  };
  tasksTotal?: number;
  tasksCompleted?: number;
  logsCount?: number;
  ctfCount?: number;
}): WorkspaceIntelligence {
  const {
    tasks = [],
    pillarXP = {},
    streakCurrent = 0,
    currentMonth = 1,
    progress,
    tasksTotal = 0,
    tasksCompleted = 0,
  } = data;

  const completionRatio = tasksTotal > 0 ? tasksCompleted / tasksTotal : 0;
  
  const totalXP = Object.values(pillarXP).reduce((a, b) => a + b, 0);
  const avgXP = Object.values(pillarXP).length > 0 ? totalXP / 4 : 0;
  
  const weakPillars = Object.entries(pillarXP)
    .filter(([_, xp]) => xp < avgXP * 0.5)
    .map(([pillar]) => pillar);
  
  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
  
  const staleMissions = tasks.filter(t => {
    if (t.status === 'done') return false;
    const updatedAt = new Date(t.updated_at || t.created_at).getTime();
    return now - updatedAt > 7 * 24 * 60 * 60 * 1000;
  });
  
  const activeMissions = tasks.filter(t => t.status === 'in_progress');
  const pendingMissions = tasks.filter(t => t.status === 'todo');
  
  const expectedProgress = progress 
    ? (progress.daysElapsed / (365 * 2)) * 100
    : 0;
  const actualProgress = (currentMonth / 12) * 100;
  const daysBehindRoadmap = Math.max(0, Math.round((expectedProgress - actualProgress) * 3.65));
  
  const overdueTasks = tasks.filter(t => {
    if (t.status === 'done') return false;
    if (!t.due_date) return false;
    return new Date(t.due_date).getTime() < now;
  }).length;
  
  const operationalPressure = overdueTasks > 5 || staleMissions.length > 10
    ? 'critical'
    : overdueTasks > 2 || staleMissions.length > 5 || daysBehindRoadmap > 30
      ? 'high'
      : activeMissions.length > 3 || daysBehindRoadmap > 7
        ? 'medium'
        : 'low';
  
  const mentorUrgency = Math.min(100, Math.round(
    (weakPillars.length * 15) +
    (staleMissions.length * 5) +
    (daysBehindRoadmap > 7 ? 20 : 0) +
    (streakCurrent === 0 ? 15 : streakCurrent < 3 ? 10 : 0) +
    (overdueTasks * 10)
  ));
  
  const environmentTone = operationalPressure === 'critical'
    ? 'critical'
    : operationalPressure === 'high' || daysBehindRoadmap > 30
      ? 'tense'
      : streakCurrent >= 7 && completionRatio > 0.5
        ? 'calm'
        : 'normal';
  
  const backlogPressure = Math.min(100, Math.round(
    (pendingMissions.length / Math.max(tasksTotal, 1)) * 100 +
    (daysBehindRoadmap / 365) * 50
  ));
  
  const streakStatus = streakCurrent === 0
    ? 'cold'
    : streakCurrent < 3
      ? 'building'
      : streakCurrent >= 14
        ? 'hot'
        : 'strong';

  return {
    operationalPressure,
    mentorUrgency,
    weakPillars,
    neglectedMissions: staleMissions.map(m => m.title),
    staleMissionCount: staleMissions.length,
    environmentTone,
    backlogPressure,
    streakStatus,
    completionRatio,
    daysBehindRoadmap,
  };
}