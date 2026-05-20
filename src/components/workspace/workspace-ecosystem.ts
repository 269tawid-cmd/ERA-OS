'use client';

export interface OperationalEvent {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'critical' | 'success';
  source: 'mission' | 'mentor' | 'roadmap' | 'telemetry' | 'system';
  timestamp: number;
  duration: number;
}

export interface OperationalFocus {
  primary: 'mission' | 'mentor' | 'roadmap' | 'telemetry' | 'none';
  reason: string;
  intensity: number;
}

export interface OperationalContext {
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
  missionLoad: number;
  readinessLevel: number;
  focusPillar: string | null;
}

export function computeOperationalContext(data: {
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
}): OperationalContext {
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

  const missionLoad = Math.min(100, Math.round(
    ((activeMissions.length + pendingMissions.length) / Math.max(tasksTotal, 1)) * 80 +
    (staleMissions.length * 5)
  ));

  const readinessLevel = Math.max(0, 100 - (backlogPressure * 0.5) - (daysBehindRoadmap * 0.3) - ((overdueTasks > 0 ? 20 : 0)));

  const focusPillar = weakPillars.length > 0 ? weakPillars[0] : null;

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
    missionLoad,
    readinessLevel,
    focusPillar,
  };
}

export function generateOperationalEvents(context: OperationalContext): OperationalEvent[] {
  const events: OperationalEvent[] = [];
  const now = Date.now();

  if (context.missionLoad > 70) {
    events.push({
      id: `mission-backlog-${now}`,
      message: 'MISSION BACKLOG DETECTED',
      type: 'warning',
      source: 'mission',
      timestamp: now,
      duration: 8000,
    });
  }

  if (context.daysBehindRoadmap > 14) {
    events.push({
      id: `roadmap-drift-${now}`,
      message: 'ROADMAP DRIFT INCREASING',
      type: 'warning',
      source: 'roadmap',
      timestamp: now,
      duration: 8000,
    });
  }

  if (context.streakStatus === 'cold') {
    events.push({
      id: `streak-cold-${now}`,
      message: 'STREAK RECOVERY NEEDED',
      type: 'critical',
      source: 'system',
      timestamp: now,
      duration: 10000,
    });
  }

  if (context.streakStatus === 'hot' && context.environmentTone === 'calm') {
    events.push({
      id: `streak-hot-${now}`,
      message: 'STREAK RECOVERY STABLE',
      type: 'success',
      source: 'system',
      timestamp: now,
      duration: 6000,
    });
  }

  if (context.focusPillar) {
    events.push({
      id: `focus-pillar-${now}`,
      message: `FOCUS PILLAR: ${context.focusPillar}`,
      type: 'info',
      source: 'mentor',
      timestamp: now,
      duration: 7000,
    });
  }

  if (context.operationalPressure === 'critical') {
    events.push({
      id: `critical-${now}`,
      message: 'OPERATIONAL PRESSURE ELEVATED',
      type: 'critical',
      source: 'system',
      timestamp: now,
      duration: 10000,
    });
  }

  return events;
}

export function computeFocus(context: OperationalContext): OperationalFocus {
  if (context.operationalPressure === 'critical' || context.missionLoad > 80) {
    return { primary: 'mission', reason: 'High mission load requires attention', intensity: 80 };
  }
  
  if (context.weakPillars.length > 0 && context.mentorUrgency > 40) {
    return { primary: 'mentor', reason: 'Weak pillars detected', intensity: 70 };
  }
  
  if (context.daysBehindRoadmap > 14) {
    return { primary: 'roadmap', reason: 'Roadmap drift requires monitoring', intensity: 65 };
  }
  
  if (context.readinessLevel < 40) {
    return { primary: 'telemetry', reason: 'Low readiness requires attention', intensity: 60 };
  }
  
  if (context.streakStatus === 'cold') {
    return { primary: 'mission', reason: 'Streak recovery mode', intensity: 75 };
  }
  
  return { primary: 'none', reason: 'System balanced', intensity: 0 };
}