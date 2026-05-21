'use client';

export interface OperationalEvent {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'critical' | 'success';
  source: 'mission' | 'mentor' | 'roadmap' | 'telemetry' | 'system';
  timestamp: number;
  duration: number;
}

export interface ContinuityScores {
  missionContinuityScore: number;
  strategicCoherenceScore: number;
  operationalStabilityScore: number;
  executionContinuityScore: number;
}

export interface CarryForward {
  unresolvedBacklogTrend: 'increasing' | 'stable' | 'decreasing';
  neglectedPillarTrend: 'persistent' | 'improving' | 'none';
  momentumCarryForward: number;
  recoveryCarryForward: number;
  pacingRecommendation: 'slow' | 'maintain' | 'accelerate';
  operationalCarryNote: string;
}

export interface OperationalIdentity {
  dominantRhythm: RhythmState | 'mixed';
  recurringPressurePattern: 'low' | 'medium' | 'high' | 'critical' | 'mixed';
  strategicSignature: string;
  progressionTendency: 'improving' | 'stable' | 'declining';
  totalOperationalDays: number;
}

export interface ContinuityContext {
  scores: ContinuityScores;
  carryForward: CarryForward;
  identity: OperationalIdentity;
}

export interface TemporalForecast {
  roadmapDriftProjection: number;
  overloadProbability: number;
  sustainabilityTrend: 'sustainable' | 'unstable' | 'accelerating_safely' | 'overload_risk';
  executionStability: number;
  forecastHorizon: 'short' | 'medium';
  confidence: number;
}

export interface DriftForecast {
  driftRiskTrend: 'increasing' | 'stable' | 'decreasing';
  estimatedDriftDays: number;
  driftArrivalWeeks: number;
  keyRiskFactor: string;
  confidence: number;
}

export interface SustainabilityModel {
  status: 'sustainable' | 'unstable' | 'accelerating_safely' | 'overload_risk';
  loadCapacity: number;
  burnoutRisk: number;
  recommendedPacing: 'slow' | 'maintain' | 'accelerate';
  confidence: number;
}

export type TrajectoryClass =
  | 'Stable Progression'
  | 'Drift Accumulation'
  | 'Recovery Momentum'
  | 'Sustainable Expansion'
  | 'Operational Saturation'
  | 'Strategic Consolidation';

export interface TrajectoryState {
  classification: TrajectoryClass;
  description: string;
  transitionLikelihood: number;
  confidence: number;
}

export interface ForecastContext {
  temporal: TemporalForecast;
  drift: DriftForecast;
  sustainability: SustainabilityModel;
  trajectory: TrajectoryState;
}

export type ScenarioType =
  | 'sustained_overload'
  | 'backlog_escalation'
  | 'roadmap_compression'
  | 'recovery_pacing'
  | 'stabilization_period'
  | 'momentum_continuation';

export interface ScenarioProjection {
  scenarioType: ScenarioType;
  timeframe: 'near' | 'medium' | 'far';
  projectedState: string;
  likelihood: number;
  confidence: number;
}

export interface PressurePropagation {
  source: 'backlog' | 'overload' | 'momentum' | 'fatigue';
  propagationPath: string[];
  currentStage: number;
  propagationSpeed: 'slow' | 'moderate' | 'fast';
  confidence: number;
}

export interface TradeoffSimulation {
  accelerateWorkload: { operationalCost: number; strategicBenefit: number; sustainabilityImpact: number };
  stabilizeFirst: { operationalCost: number; strategicBenefit: number; sustainabilityImpact: number };
  deepFocus: { operationalCost: number; strategicBenefit: number; sustainabilityImpact: number };
}

export interface RoadmapCompression {
  compressionRisk: 'low' | 'medium' | 'high';
  estimatedCompressionWeeks: number;
  compressionSeverity: number;
  milestoneCollisionRisk: boolean;
  recoveryWindowShrinking: boolean;
  compressionNote: string;
}

export interface RecoveryWindow {
  requiredStabilizationDays: number;
  recoveryEffectiveness: number;
  momentumRestorationProb: number;
  windowAvailable: boolean;
  confidence: number;
}

export interface SimulationContext {
  scenarios: ScenarioProjection[];
  pressurePropagation: PressurePropagation;
  tradeoffs: TradeoffSimulation;
  roadmapCompression: RoadmapCompression;
  recoveryWindow: RecoveryWindow;
}

export interface OperationalFocus {
  primary: 'mission' | 'mentor' | 'roadmap' | 'telemetry' | 'none';
  reason: string;
  intensity: number;
}

export type RhythmState = 'stable' | 'overload' | 'stagnation' | 'recovery' | 'momentum' | 'fatigue';

export type Pillar = 'HACK' | 'BUILD' | 'AI' | 'PRESENCE';

export interface StrategicIndicator {
  type: 'focus_recommendation' | 'stabilization' | 'expansion_ready' | 'overload_warning' | 'backlog_risk';
  severity: 'low' | 'medium' | 'high';
  message: string;
  source: 'strategic' | 'pillar' | 'rhythm' | 'roadmap';
}

export interface PillarBalance {
  pillar: Pillar;
  xp: number;
  deviation: number;
  status: 'balanced' | 'over_invested' | 'neglected';
}

export interface ProgressionMapping {
  pacingSustainability: 'sustainable' | 'at_risk' | 'unsustainable';
  driftRisk: 'low' | 'medium' | 'high';
  progressionConsistency: number;
  executionReliability: number;
  strategicAdvice: string;
}

export interface OperationalMemory {
  unfinishedMissionChains: string[]; // Titles of repeatedly appearing unfinished missions
  neglectedPillarHistory: Record<Pillar, number>; // Count of times each pillar was neglected
  momentumPeriods: number; // Total days in momentum state
  recoveryPeriods: number; // Total days in recovery state
  backlogEscalation: number; // Trend of backlog over time (0-100)
  roadmapDriftHistory: number; // Cumulative days behind roadmap
  streakConsistency: number; // Average streak length over time
  operationalCycles: number; // Number of complete operational cycles observed
}

export interface OperationalLifecycle {
  phase: 'Recovery' | 'Stabilization' | 'Expansion' | 'Consolidation' | 'DriftRisk' | 'Stable';
  confidence: number; // 0-100 confidence in lifecycle assessment
  description: string;
  recommendedFocus: string;
}

export interface StrategicContext {
  strategicIndicators: StrategicIndicator[];
  pillarBalance: PillarBalance[];
  progressionMapping: ProgressionMapping;
  primaryFocusRecommendation: string;
  neglectedPillars: Pillar[];
  overloadedPillars: Pillar[];
  bottleneckAreas: string[];
  roadmapAlignment: number;
  progressionHealth: number;
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
  rhythmState: RhythmState;
  fatigueLevel: number;
  momentumScore: number;
  operationalConfidence: number;
  recentTasks?: any[];
  strategic?: StrategicContext;
}

export interface RhythmAnalysis {
  rhythmState: RhythmState;
  fatigueLevel: number;
  momentumScore: number;
  operationalConfidence: number;
  overloadDetected: boolean;
  stagnationDetected: boolean;
  recoveryMode: boolean;
  sustainablePace: boolean;
  trendDirection: 'improving' | 'stable' | 'declining';
}

export function analyzeRhythm(data: {
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
}): RhythmAnalysis {
  const {
    tasks = [],
    streakCurrent = 0,
    tasksTotal = 0,
    tasksCompleted = 0,
  } = data;

  const now = Date.now();
  const threeDaysAgo = now - 3 * 24 * 60 * 60 * 1000;
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
  const fourteenDaysAgo = now - 14 * 24 * 60 * 60 * 1000;

  const staleMissions = tasks.filter(t => {
    if (t.status === 'done') return false;
    const updatedAt = new Date(t.updated_at || t.created_at).getTime();
    return now - updatedAt > 7 * 24 * 60 * 60 * 1000;
  });

  const veryStaleMissions = tasks.filter(t => {
    if (t.status === 'done') return false;
    const updatedAt = new Date(t.updated_at || t.created_at).getTime();
    return now - updatedAt > 14 * 24 * 60 * 60 * 1000;
  });

  const overdueTasks = tasks.filter(t => {
    if (t.status === 'done') return false;
    if (!t.due_date) return false;
    return new Date(t.due_date).getTime() < now;
  });

  const recentlyCompletedTasks = tasks.filter(t => {
    if (t.status !== 'done') return false;
    if (!t.completed_at) return false;
    const completedAt = new Date(t.completed_at).getTime();
    return completedAt > sevenDaysAgo;
  });

  const completedInLastWeek = recentlyCompletedTasks.length;
  const staleRatio = tasksTotal > 0 ? staleMissions.length / tasksTotal : 0;
  const overdueRatio = tasksTotal > 0 ? overdueTasks.length / tasksTotal : 0;

  const fatigueLevel = Math.min(100, Math.round(
    (staleRatio * 40) +
    (overdueRatio * 30) +
    (veryStaleMissions.length * 10) +
    (streakCurrent === 0 ? 20 : 0)
  ));

  const momentumScore = Math.min(100, Math.round(
    (streakCurrent * 5) +
    (completedInLastWeek * 8) +
    (tasksCompleted / Math.max(tasksTotal, 1) * 30) -
    (staleRatio * 20)
  ));

  const completionRate = tasksTotal > 0 ? (tasksCompleted / tasksTotal) * 100 : 0;
  const recentCompletionRate = completedInLastWeek > 0 ? (completedInLastWeek / 7) * 100 : 0;

  const overloadDetected = staleRatio > 0.4 || overdueRatio > 0.3 || veryStaleMissions.length > 5;
  
  const stagnationDetected = completedInLastWeek === 0 && staleMissions.length > 3 && streakCurrent < 3;
  
  const recoveryMode = streakCurrent > 0 && completedInLastWeek > 2 && staleRatio < 0.2;
  
  const sustainablePace = !overloadDetected && !stagnationDetected && recoveryMode;

  let rhythmState: RhythmState = 'stable';
  if (overloadDetected) rhythmState = 'overload';
  else if (fatigueLevel > 60) rhythmState = 'fatigue';
  else if (stagnationDetected) rhythmState = 'stagnation';
  else if (recoveryMode && momentumScore > 50) rhythmState = 'momentum';
  else if (recoveryMode) rhythmState = 'recovery';

  let trendDirection: 'improving' | 'stable' | 'declining' = 'stable';
  if (momentumScore > 60 && recoveryMode) trendDirection = 'improving';
  else if (overloadDetected || stagnationDetected) trendDirection = 'declining';

  const operationalConfidence = Math.max(0, Math.min(100, Math.round(
    (momentumScore * 0.4) +
    ((100 - fatigueLevel) * 0.4) +
    (sustainablePace ? 20 : 0)
  )));

  return {
    rhythmState,
    fatigueLevel,
    momentumScore,
    operationalConfidence,
    overloadDetected,
    stagnationDetected,
    recoveryMode,
    sustainablePace,
    trendDirection,
  };
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

  const rhythm = analyzeRhythm(data);
  const strategic = computeStrategicContext(data);

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
    rhythmState: rhythm.rhythmState,
    fatigueLevel: rhythm.fatigueLevel,
    momentumScore: rhythm.momentumScore,
    operationalConfidence: rhythm.operationalConfidence,
    recentTasks: tasks,
    strategic,
  };
}

export function generateOperationalEvents(context: OperationalContext): OperationalEvent[] {
  const events: OperationalEvent[] = [];
  const now = Date.now();

  if (context.missionLoad > 70 && context.rhythmState !== 'overload') {
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

  if (context.streakStatus === 'cold' && context.fatigueLevel > 30) {
    events.push({
      id: `streak-cold-${now}`,
      message: 'STREAK RECOVERY NEEDED',
      type: 'critical',
      source: 'system',
      timestamp: now,
      duration: 10000,
    });
  }

  if (context.rhythmState === 'momentum') {
    events.push({
      id: `momentum-${now}`,
      message: 'OPERATIONAL MOMENTUM DETECTED',
      type: 'success',
      source: 'system',
      timestamp: now,
      duration: 6000,
    });
  }

  if (context.rhythmState === 'recovery') {
    events.push({
      id: `recovery-${now}`,
      message: 'RECOVERY PHASE ACTIVE',
      type: 'info',
      source: 'system',
      timestamp: now,
      duration: 6000,
    });
  }

  if (context.fatigueLevel > 60) {
    events.push({
      id: `fatigue-${now}`,
      message: 'OPERATIONAL FATIGUE DETECTED',
      type: 'warning',
      source: 'mentor',
      timestamp: now,
      duration: 8000,
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
  if (context.rhythmState === 'overload' || context.missionLoad > 80) {
    return { primary: 'mission', reason: 'High mission load requires attention', intensity: 80 };
  }
  
  if (context.fatigueLevel > 50 && context.rhythmState !== 'momentum') {
    return { primary: 'mentor', reason: 'Operational fatigue detected - guidance needed', intensity: 70 };
  }
  
  if (context.weakPillars.length > 0 && context.mentorUrgency > 40) {
    return { primary: 'mentor', reason: 'Weak pillars detected', intensity: 65 };
  }
  
  if (context.daysBehindRoadmap > 14) {
    return { primary: 'roadmap', reason: 'Roadmap drift requires monitoring', intensity: 65 };
  }
  
  if (context.readinessLevel < 40) {
    return { primary: 'telemetry', reason: 'Low readiness requires attention', intensity: 60 };
  }
  
  if (context.rhythmState === 'momentum') {
    return { primary: 'mission', reason: 'Maintain momentum with focused execution', intensity: 75 };
  }
  
  if (context.streakStatus === 'cold') {
    return { primary: 'mission', reason: 'Streak recovery mode', intensity: 75 };
  }
  
  return { primary: 'none', reason: 'System balanced', intensity: 0 };
}

export function analyzePillarBalance(
  pillarXP: Record<string, number>
): PillarBalance[] {
  const pillars: Pillar[] = ['HACK', 'BUILD', 'AI', 'PRESENCE'];
  const xpValues = pillars.map(p => pillarXP[p] || 0);
  const avgXP = xpValues.reduce((a, b) => a + b, 0) / 4;
  const maxXP = Math.max(...xpValues, 1);
  
  return pillars.map((pillar, i) => {
    const xp = xpValues[i];
    const deviation = avgXP > 0 ? ((xp - avgXP) / avgXP) * 100 : 0;
    
    let status: 'balanced' | 'over_invested' | 'neglected' = 'balanced';
    if (xp < avgXP * 0.5) status = 'neglected';
    else if (deviation > 40 && maxXP > avgXP * 1.5) status = 'over_invested';
    
    return { pillar, xp, deviation, status };
  });
}

export function computeStrategicIndicators(
  context: OperationalContext,
  pillarBalance: PillarBalance[]
): StrategicIndicator[] {
  const indicators: StrategicIndicator[] = [];
  
  const neglectedPillars = pillarBalance.filter(p => p.status === 'neglected');
  const overloadedPillars = pillarBalance.filter(p => p.status === 'over_invested');
  
  if (context.fatigueLevel > 60 || context.rhythmState === 'overload') {
    indicators.push({
      type: 'overload_warning',
      severity: 'high',
      message: 'Operational capacity exceeded. Prioritize essential work.',
      source: 'rhythm',
    });
  }
  
  if (context.backlogPressure > 70) {
    indicators.push({
      type: 'backlog_risk',
      severity: 'medium',
      message: 'Backlog accumulating. Review task completion rate.',
      source: 'strategic',
    });
  }
  
  if (context.rhythmState === 'momentum' && context.momentumScore > 70) {
    indicators.push({
      type: 'expansion_ready',
      severity: 'low',
      message: 'Strong momentum supports deeper project execution.',
      source: 'rhythm',
    });
  }
  
  if (context.rhythmState === 'recovery' || context.streakStatus === 'cold') {
    indicators.push({
      type: 'stabilization',
      severity: 'medium',
      message: 'Focus on consistency over volume during this phase.',
      source: 'strategic',
    });
  }
  
  if (neglectedPillars.length > 0) {
    indicators.push({
      type: 'focus_recommendation',
      severity: 'medium',
      message: `${neglectedPillars[0].pillar} pillar lagging behind strategic goals.`,
      source: 'pillar',
    });
  }
  
  if (overloadedPillars.length > 0 && neglectedPillars.length > 0) {
    indicators.push({
      type: 'focus_recommendation',
      severity: 'low',
      message: 'Pillar imbalance detected. Balance investment across domains.',
      source: 'strategic',
    });
  }
  
  if (context.daysBehindRoadmap > 21) {
    indicators.push({
      type: 'backlog_risk',
      severity: 'high',
      message: 'Significant roadmap drift. Focus on completion rate.',
      source: 'roadmap',
    });
  }
  
  return indicators.sort((a, b) => {
    const severityOrder = { high: 0, medium: 1, low: 2 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });
}

export function computeProgressionMapping(
  data: {
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
  },
  rhythm: RhythmAnalysis
): ProgressionMapping {
  const {
    tasks = [],
    streakCurrent = 0,
    tasksTotal = 0,
    tasksCompleted = 0,
    currentMonth = 1,
  } = data;
  
  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
  
  const recentlyCompletedTasks = tasks.filter(t => {
    if (t.status !== 'done') return false;
    if (!t.completed_at) return false;
    return new Date(t.completed_at).getTime() > sevenDaysAgo;
  });
  
  const completionRate = tasksTotal > 0 ? tasksCompleted / tasksTotal : 0;
  const weekCompletionRate = recentlyCompletedTasks.length / 7;
  
  const progressionConsistency = Math.min(100, Math.round(
    (weekCompletionRate * 20) +
    (completionRate * 50) +
    (streakCurrent * 2)
  ));
  
  const executionReliability = Math.min(100, Math.round(
    (rhythm.sustainablePace ? 60 : 30) +
    (rhythm.trendDirection === 'improving' ? 30 : rhythm.trendDirection === 'declining' ? 0 : 15)
  ));
  
  let pacingSustainability: 'sustainable' | 'at_risk' | 'unsustainable' = 'sustainable';
  if (rhythm.rhythmState === 'overload' || rhythm.rhythmState === 'fatigue') {
    pacingSustainability = 'unsustainable';
  } else if (rhythm.rhythmState === 'stagnation' || rhythm.overloadDetected) {
    pacingSustainability = 'at_risk';
  }
  
  let driftRisk: 'low' | 'medium' | 'high' = 'low';
  if (weekCompletionRate < 0.5 && tasksTotal > 5) driftRisk = 'high';
  else if (weekCompletionRate < 1 && tasksTotal > 3) driftRisk = 'medium';
  
  let strategicAdvice = 'Continue current trajectory with measured focus.';
  if (pacingSustainability === 'unsustainable') {
    strategicAdvice = 'Reduce workload. Sustainability requires priority pruning.';
  } else if (driftRisk === 'high') {
    strategicAdvice = 'Increase completion rate. Current pace may miss roadmap targets.';
  } else if (rhythm.rhythmState === 'momentum') {
    strategicAdvice = 'Maintain execution quality. Momentum supports strategic acceleration.';
  } else if (rhythm.trendDirection === 'improving') {
    strategicAdvice = 'Positive trajectory. Focus on weak pillars while maintaining strength.';
  } else if (rhythm.trendDirection === 'declining') {
    strategicAdvice = 'Execution declining. Address stale tasks and maintain streak discipline.';
  }
  
  return {
    pacingSustainability,
    driftRisk,
    progressionConsistency,
    executionReliability,
    strategicAdvice,
  };
}

export function computeStrategicContext(data: {
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
}): StrategicContext {
  const {
    tasks = [],
    pillarXP = {},
    streakCurrent = 0,
    currentMonth = 1,
    progress,
    tasksTotal = 0,
    tasksCompleted = 0,
  } = data;
  
  const pillarBalance = analyzePillarBalance(pillarXP);
  
  const neglectedPillars = pillarBalance
    .filter(p => p.status === 'neglected')
    .map(p => p.pillar);
  
  const overloadedPillars = pillarBalance
    .filter(p => p.status === 'over_invested')
    .map(p => p.pillar);
  
  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
  
  const taskByPillar = (pillar: Pillar) => tasks.filter(t => t.pillar === pillar);
  const staleByPillar = (pillar: Pillar) => taskByPillar(pillar).filter(t => {
    if (t.status === 'done') return false;
    const updatedAt = new Date(t.created_at).getTime();
    return now - updatedAt > 7 * 24 * 60 * 60 * 1000;
  });
  
  const bottleneckAreas: string[] = [];
  neglectedPillars.forEach(p => {
    const staleCount = staleByPillar(p).length;
    if (staleCount > 2) {
      bottleneckAreas.push(`${p} pillar has ${staleCount} neglected missions`);
    }
  });
  
  const expectedProgress = progress 
    ? (progress.daysElapsed / (365 * 2)) * 100
    : 0;
  const actualProgress = (currentMonth / 12) * 100;
  const roadmapAlignment = Math.max(0, Math.min(100, 100 - Math.abs(expectedProgress - actualProgress)));
  
  const rhythm = analyzeRhythm(data);
  
  const completionRate = tasksTotal > 0 ? tasksCompleted / tasksTotal : 0;
  const progressionHealth = Math.min(100, Math.round(
    (completionRate * 40) +
    (rhythm.momentumScore * 0.3) +
    (streakCurrent > 0 ? 20 : 0) +
    (roadmapAlignment * 0.1)
  ));
  
  const pillarBalanceForIndicators = analyzePillarBalance(pillarXP);
  const strategicIndicators = computeStrategicIndicators(
    { rhythmState: rhythm.rhythmState, fatigueLevel: rhythm.fatigueLevel, momentumScore: rhythm.momentumScore, backlogPressure: Math.min(100, (tasksTotal > 0 ? ((tasksTotal - tasksCompleted) / tasksTotal) * 100 : 0)), daysBehindRoadmap: Math.max(0, Math.round((expectedProgress - actualProgress) * 3.65)), streakStatus: streakCurrent === 0 ? 'cold' : streakCurrent < 3 ? 'building' : streakCurrent >= 14 ? 'hot' : 'strong' } as OperationalContext,
    pillarBalanceForIndicators
  );
  
  const progressionMapping = computeProgressionMapping(data, rhythm);
  
  const primaryFocusRecommendation = strategicIndicators.length > 0
    ? strategicIndicators[0].message
    : 'System operational. Maintain strategic discipline.';
  
  return {
    strategicIndicators,
    pillarBalance,
    progressionMapping,
    primaryFocusRecommendation,
    neglectedPillars,
    overloadedPillars,
    bottleneckAreas,
    roadmapAlignment,
    progressionHealth,
  };
}

export function computeOperationalMemory(
  data: {
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
  },
  context: OperationalContext,
  previousMemory?: OperationalMemory
): OperationalMemory {
  const {
    tasks = [],
    pillarXP = {},
    streakCurrent = 0,
    currentMonth = 1,
    progress,
    tasksTotal = 0,
    tasksCompleted = 0,
  } = data;
  
  const now = Date.now();
  
  // Initialize memory with defaults if none exists
  const memory = previousMemory || {
    unfinishedMissionChains: [],
    neglectedPillarHistory: { HACK: 0, BUILD: 0, AI: 0, PRESENCE: 0 },
    momentumPeriods: 0,
    recoveryPeriods: 0,
    backlogEscalation: 0,
    roadmapDriftHistory: 0,
    streakConsistency: 0,
    operationalCycles: 0,
  };
  
  // Track unfinished mission chains (missions that appear repeatedly)
  const activeMissionTitles = tasks
    .filter(t => t.status !== 'done')
    .map(t => t.title);
    
  // Update unfinished mission chains - keep titles that appear in current session
  const unfinishedChains = [...new Set(activeMissionTitles)];
  
  // Track neglected pillar history
  const neglectedHistory = { ...memory.neglectedPillarHistory };
  context.weakPillars.forEach(pillar => {
    if (pillar === 'HACK' || pillar === 'BUILD' || pillar === 'AI' || pillar === 'PRESENCE') {
      neglectedHistory[pillar as Pillar] = (neglectedHistory[pillar as Pillar] || 0) + 1;
    }
  });
  
  // Track momentum and recovery periods (simplified - increment if in state)
  const momentumAdded = context.rhythmState === 'momentum' ? 1 : 0;
  const recoveryAdded = context.rhythmState === 'recovery' ? 1 : 0;
  
  // Track backlog escalation (trend based on current backlog pressure)
  const backlogTrend = Math.min(100, Math.round(
    (memory.backlogEscalation * 0.8) + (context.backlogPressure * 0.2)
  ));
  
  // Track roadmap drift history (cumulative)
  const driftAdded = Math.max(0, context.daysBehindRoadmap);
  const driftHistory = Math.min(365 * 2, memory.roadmapDriftHistory + driftAdded); // Cap at 2 years
  
  // Track streak consistency (exponential moving average)
  const streakConsistency = Math.round(
    (memory.streakConsistency * 0.9) + (streakCurrent * 0.1)
  );
  
  // Track operational cycles (completed streaks of 7+ days)
  const cycleAdded = context.streakStatus === 'hot' || context.streakStatus === 'strong' ? 1 : 0;
  const operationalCycles = memory.operationalCycles + cycleAdded;
  
  return {
    unfinishedMissionChains: unfinishedChains,
    neglectedPillarHistory: neglectedHistory,
    momentumPeriods: memory.momentumPeriods + momentumAdded,
    recoveryPeriods: memory.recoveryPeriods + recoveryAdded,
    backlogEscalation: backlogTrend,
    roadmapDriftHistory: driftHistory,
    streakConsistency: streakConsistency,
    operationalCycles: operationalCycles,
  };
}

export function computeOperationalLifecycle(
  memory: OperationalMemory,
  context: OperationalContext
): OperationalLifecycle {
  const neglectedPillars = context.weakPillars.filter(
    p => p === 'HACK' || p === 'BUILD' || p === 'AI' || p === 'PRESENCE'
  );
  const strategicIndicators = context.strategic?.strategicIndicators || [];
  const completionRate = Math.round(context.completionRatio * 100);
  const executionReliability = context.readinessLevel;
  const progressionConsistency = Math.round((completionRate + executionReliability) / 2);
  const streakCurrent = context.streakStatus === 'cold' ? 0 : context.streakStatus === 'building' ? 2 : context.streakStatus === 'strong' ? 7 : 14;

  // Determine lifecycle phase based on historical patterns and current state

  // Recovery Phase: coming off fatigue/stagnation, building streak
  if (context.rhythmState === 'recovery' || 
      (context.streakStatus === 'building' && 
       context.fatigueLevel < 40 && 
       context.momentumScore > 30)) {
    return {
      phase: 'Recovery',
      confidence: Math.min(100, Math.round(
        (streakCurrent * 5) + 
        ((100 - context.fatigueLevel) * 0.3) +
        (memory.recoveryPeriods > 5 ? 20 : 0)
      )),
      description: 'Building operational consistency after recovery period',
      recommendedFocus: 'Maintain streak discipline and gradual progression'
    };
  }

  // Stabilization Window: consistent execution, moderate momentum
  if (context.streakStatus === 'strong' || 
      (context.streakStatus === 'hot' && context.rhythmState !== 'overload') ||
      (progressionConsistency > 60 && executionReliability > 50)) {
    return {
      phase: 'Stabilization',
      confidence: Math.min(100, Math.round(
        (streakCurrent * 3) + 
        (progressionConsistency * 0.4) +
        (memory.operationalCycles > 3 ? 20 : 0)
      )),
      description: 'Established operational rhythm with reliable execution',
      recommendedFocus: 'Consolidate gains and address systematic weaknesses'
    };
  }

  // Expansion Momentum: high momentum, good sustainability, low fatigue
  if (context.rhythmState === 'momentum' && 
      context.momentumScore > 70 && 
      context.fatigueLevel < 30 &&
      progressionConsistency > 50) {
    return {
      phase: 'Expansion',
      confidence: Math.min(100, Math.round(
        (context.momentumScore * 0.4) +
        ((100 - context.fatigueLevel) * 0.3) +
        (streakCurrent * 2)
      )),
      description: 'Strong operational momentum supports strategic advancement',
      recommendedFocus: 'Leverage momentum for deeper project execution and skill development'
    };
  }

  // Strategic Consolidation: addressing neglected pillars, reducing drift
  if (neglectedPillars.length > 0 || 
      context.daysBehindRoadmap > 7 ||
      strategicIndicators.some(i => i.type === 'focus_recommendation')) {
    return {
      phase: 'Consolidation',
      confidence: Math.min(100, Math.round(
        (memory.neglectedPillarHistory.HACK + 
         memory.neglectedPillarHistory.BUILD + 
         memory.neglectedPillarHistory.AI + 
         memory.neglectedPillarHistory.PRESENCE) * 2 +
        (100 - Math.min(100, context.daysBehindRoadmap * 2))
      )),
      description: 'Strategic focus needed to address progression imbalances',
      recommendedFocus: 'Prioritize neglected pillars and reduce roadmap drift'
    };
  }

  // Drift Risk Escalation: increasing backlog, missing deadlines, low consistency
  if (context.backlogPressure > 60 || 
      context.daysBehindRoadmap > 14 ||
      progressionConsistency < 30 ||
      context.rhythmState === 'stagnation') {
    return {
      phase: 'DriftRisk',
      confidence: Math.min(100, Math.round(
        (context.backlogPressure * 0.4) +
        (Math.min(100, context.daysBehindRoadmap * 2) * 0.3) +
        ((100 - progressionConsistency) * 0.3)
      )),
      description: 'Operational drift detected requiring course correction',
      recommendedFocus: 'Reduce backlog, increase completion rate, reestablish streak'
    };
  }

  // Default: Stable state
  return {
    phase: 'Stable',
    confidence: Math.min(100, Math.round(
      (streakCurrent * 2) +
      (progressionConsistency * 0.3) +
      ((100 - context.fatigueLevel) * 0.2)
    )),
    description: 'Stable operational baseline with measured progression',
    recommendedFocus: 'Continue disciplined execution and identify next strategic priority'
  };
}

export function computeStrategicContextWithMemory(
  data: {
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
  },
  previousMemory?: OperationalMemory
): {
  context: OperationalContext;
  memory: OperationalMemory;
  lifecycle: OperationalLifecycle;
  continuity: ContinuityContext;
  forecast: ForecastContext;
  simulation: SimulationContext;
} {
  const context = computeOperationalContext(data);
  const memory = computeOperationalMemory(data, context, previousMemory);
  const lifecycle = computeOperationalLifecycle(memory, context);
  const continuity = computeContinuityContext(memory, lifecycle, context);
  const forecast = computeForecastContext(memory, lifecycle, context, continuity);
  const simulation = computeSimulationContext(memory, lifecycle, context, continuity, forecast);

  return { context, memory, lifecycle, continuity, forecast, simulation };
}

export function computeContinuityScores(
  memory: OperationalMemory,
  lifecycle: OperationalLifecycle,
  context: OperationalContext
): ContinuityScores {
  const chainPenalty = Math.min(40, (memory.unfinishedMissionChains.length || 0) * 10);
  const neglectedTotal = (memory.neglectedPillarHistory.HACK || 0) +
    (memory.neglectedPillarHistory.BUILD || 0) +
    (memory.neglectedPillarHistory.AI || 0) +
    (memory.neglectedPillarHistory.PRESENCE || 0);
  const driftImpact = Math.min(30, (memory.roadmapDriftHistory || 0) / 10);
  const cycleBonus = Math.min(15, (memory.operationalCycles || 0) * 5);
  const consistencyBonus = Math.min(20, (memory.streakConsistency || 0) / 5);
  const momentumWeight = memory.momentumPeriods || 0;
  const recoveryWeight = memory.recoveryPeriods || 0;
  const backlogWeight = memory.backlogEscalation || 0;

  const missionContinuityScore = Math.max(0, Math.min(100, Math.round(
    65 - chainPenalty + cycleBonus -
    (backlogWeight > 50 ? 15 : backlogWeight > 30 ? 8 : 0) +
    (momentumWeight > recoveryWeight ? 10 : 0)
  )));

  const strategicCoherenceScore = Math.max(0, Math.min(100, Math.round(
    70 - (neglectedTotal > 20 ? 25 : neglectedTotal > 10 ? 15 : neglectedTotal > 5 ? 8 : 0) -
    driftImpact + cycleBonus +
    (lifecycle.phase === 'Stable' || lifecycle.phase === 'Expansion' ? 10 : lifecycle.phase === 'DriftRisk' ? -10 : 0) +
    (context.strategic?.roadmapAlignment || 0) * 0.1
  )));

  const operationalStabilityScore = Math.max(0, Math.min(100, Math.round(
    60 + consistencyBonus +
    (memory.streakConsistency > 50 ? 10 : memory.streakConsistency > 30 ? 5 : 0) -
    (backlogWeight > 60 ? 20 : backlogWeight > 40 ? 10 : 0) +
    (lifecycle.confidence > 60 ? 10 : lifecycle.confidence > 30 ? 5 : 0)
  )));

  const executionContinuityScore = Math.max(0, Math.min(100, Math.round(
    60 + (memory.streakConsistency || 0) * 0.2 +
    (memory.operationalCycles || 0) * 5 -
    (neglectedTotal > 15 ? 15 : neglectedTotal > 8 ? 8 : 0) +
    cycleBonus
  )));

  return {
    missionContinuityScore,
    strategicCoherenceScore,
    operationalStabilityScore,
    executionContinuityScore,
  };
}

export function computeCarryForward(
  memory: OperationalMemory,
  lifecycle: OperationalLifecycle,
  context: OperationalContext
): CarryForward {
  const negTotal = (memory.neglectedPillarHistory.HACK || 0) +
    (memory.neglectedPillarHistory.BUILD || 0) +
    (memory.neglectedPillarHistory.AI || 0) +
    (memory.neglectedPillarHistory.PRESENCE || 0);

  const unresolvedBacklogTrend: 'increasing' | 'stable' | 'decreasing' =
    memory.backlogEscalation > 60 && context.backlogPressure > 50 ? 'increasing' :
    memory.backlogEscalation < 30 && context.backlogPressure < 30 ? 'decreasing' :
    'stable';

  const neglectedPillarTrend: 'persistent' | 'improving' | 'none' =
    negTotal > 15 ? 'persistent' :
    negTotal > 0 ? 'improving' :
    'none';

  const totalPeriods = (memory.momentumPeriods || 0) + (memory.recoveryPeriods || 0);
  const momentumCarryForward = totalPeriods > 0
    ? Math.round((memory.momentumPeriods / totalPeriods) * 100)
    : 0;
  const recoveryCarryForward = totalPeriods > 0
    ? Math.round((memory.recoveryPeriods / totalPeriods) * 100)
    : 0;

  const overloadHistory = memory.backlogEscalation > 50 ? 1 : 0;
  const driftHistory = memory.roadmapDriftHistory > 30 ? 1 : 0;
  const fatigueIndication = memory.recoveryPeriods > memory.momentumPeriods * 2 ? 1 : 0;
  const expansionHistory = memory.momentumPeriods > memory.recoveryPeriods * 2 ? 1 : 0;
  const slowFactors = overloadHistory + driftHistory + fatigueIndication;
  const fastFactors = expansionHistory;

  const pacingRecommendation: 'slow' | 'maintain' | 'accelerate' =
    slowFactors >= 2 ? 'slow' :
    fastFactors >= 1 && context.fatigueLevel < 30 ? 'accelerate' :
    'maintain';

  const notes: string[] = [];
  if (neglectedPillarTrend === 'persistent') notes.push('persistent neglected pillars');
  if (unresolvedBacklogTrend === 'increasing') notes.push('backlog escalating');
  if (momentumCarryForward > 60) notes.push('strong momentum history');
  if (recoveryCarryForward > 60) notes.push('recovery-heavy history');
  const operationalCarryNote = notes.length > 0 ? notes.join(', ') : 'stable operational trajectory';

  return {
    unresolvedBacklogTrend,
    neglectedPillarTrend,
    momentumCarryForward,
    recoveryCarryForward,
    pacingRecommendation,
    operationalCarryNote,
  };
}

export function computeOperationalIdentity(
  memory: OperationalMemory,
  lifecycle: OperationalLifecycle,
  scores: ContinuityScores
): OperationalIdentity {
  const mp = memory.momentumPeriods || 0;
  const rp = memory.recoveryPeriods || 0;
  const dominantRhythm: RhythmState | 'mixed' =
    mp > rp * 3 ? 'momentum' :
    rp > mp * 3 ? 'recovery' :
    lifecycle.phase === 'Expansion' ? 'momentum' :
    lifecycle.phase === 'DriftRisk' ? 'stagnation' :
    'mixed';

  const be = memory.backlogEscalation || 0;
  const recurringPressurePattern: 'low' | 'medium' | 'high' | 'critical' | 'mixed' =
    be > 70 ? 'critical' :
    be > 50 ? 'high' :
    be > 30 ? 'medium' :
    be > 10 ? 'low' :
    'mixed';

  const avgScore = Math.round((scores.missionContinuityScore + scores.strategicCoherenceScore +
    scores.operationalStabilityScore + scores.executionContinuityScore) / 4);

  const signatureParts: string[] = [];
  signatureParts.push(dominantRhythm === 'mixed' ? 'adaptive' : dominantRhythm);
  if (recurringPressurePattern !== 'mixed' && recurringPressurePattern !== 'low') {
    signatureParts.push(`${recurringPressurePattern}-pressure`);
  }
  signatureParts.push(avgScore > 70 ? 'high-continuity' : avgScore > 45 ? 'moderate-continuity' : 'low-continuity');
  const strategicSignature = signatureParts.join('-');

  const tendencyTotal = mp + rp;
  const progressionTendency: 'improving' | 'stable' | 'declining' =
    avgScore > 65 && mp > rp ? 'improving' :
    avgScore < 35 ? 'declining' :
    'stable';

  const totalOperationalDays = Math.min(730, Math.round(
    (mp + rp) * 0.5 + (memory.roadmapDriftHistory || 0) * 0.1
  ));

  return {
    dominantRhythm,
    recurringPressurePattern,
    strategicSignature,
    progressionTendency,
    totalOperationalDays,
  };
}

export function computeContinuityContext(
  memory: OperationalMemory,
  lifecycle: OperationalLifecycle,
  context: OperationalContext
): ContinuityContext {
  const scores = computeContinuityScores(memory, lifecycle, context);
  const carryForward = computeCarryForward(memory, lifecycle, context);
  const identity = computeOperationalIdentity(memory, lifecycle, scores);
  return { scores, carryForward, identity };
}

export function computeTemporalForecast(
  memory: OperationalMemory,
  lifecycle: OperationalLifecycle,
  context: OperationalContext,
  continuity: ContinuityContext
): TemporalForecast {
  const daysBehind = context.daysBehindRoadmap || 0;
  const backlogEsc = memory.backlogEscalation || 0;
  const fatigue = context.fatigueLevel || 0;
  const momentum = context.momentumScore || 50;
  const streakCons = memory.streakConsistency || 0;
  const completionRatio = context.completionRatio || 0;

  const driftProjection = Math.max(0, Math.round(
    daysBehind +
    (backlogEsc > 50 ? backlogEsc * 0.15 : backlogEsc * 0.05) +
    (fatigue > 50 ? fatigue * 0.08 : 0) -
    (momentum > 60 ? momentum * 0.05 : 0) -
    (streakCons > 30 ? streakCons * 0.1 : 0)
  ));

  const overloadProb = Math.min(100, Math.round(
    (fatigue > 50 ? 35 : fatigue > 30 ? 20 : 5) +
    (backlogEsc > 60 ? 30 : backlogEsc > 40 ? 15 : 0) +
    (context.missionLoad > 70 ? 20 : context.missionLoad > 50 ? 10 : 0) +
    (momentum < 30 ? 15 : 0)
  ));

  const sustainabilityTrend: TemporalForecast['sustainabilityTrend'] =
    overloadProb > 60 ? 'overload_risk' :
    momentum > 70 && fatigue < 20 && overloadProb < 25 ? 'accelerating_safely' :
    overloadProb > 35 ? 'unstable' :
    'sustainable';

  const execStability = Math.max(0, Math.min(100, Math.round(
    (streakCons * 0.3) +
    (completionRatio * 100 * 0.25) +
    ((100 - fatigue) * 0.2) +
    (lifecycle.confidence * 0.15) +
    (continuity.scores.operationalStabilityScore * 0.1)
  )));

  const hasHistory = continuity.identity.totalOperationalDays > 5;
  const avgContinuity = (continuity.scores.missionContinuityScore +
    continuity.scores.strategicCoherenceScore +
    continuity.scores.operationalStabilityScore +
    continuity.scores.executionContinuityScore) / 4;

  const confidence = Math.min(100, Math.round(
    (hasHistory ? 40 : 10) +
    (avgContinuity * 0.3) +
    (streakCons > 20 ? 15 : streakCons > 5 ? 5 : 0) +
    (memory.operationalCycles > 2 ? 15 : memory.operationalCycles > 0 ? 5 : 0)
  ));

  return {
    roadmapDriftProjection: driftProjection,
    overloadProbability: overloadProb,
    sustainabilityTrend,
    executionStability: execStability,
    forecastHorizon: confidence > 40 ? 'medium' : 'short',
    confidence,
  };
}

export function computeDriftForecast(
  memory: OperationalMemory,
  context: OperationalContext,
  continuity: ContinuityContext
): DriftForecast {
  const daysBehind = context.daysBehindRoadmap || 0;
  const driftHistory = memory.roadmapDriftHistory || 0;
  const backlogEsc = memory.backlogEscalation || 0;
  const streakCons = memory.streakConsistency || 0;
  const momentum = context.momentumScore || 50;
  const fatigue = context.fatigueLevel || 0;
  const completionRatio = context.completionRatio || 0;

  const avgHistoricalDrift = driftHistory > 0 ? driftHistory / Math.max(1, (memory.operationalCycles || 1)) : 0;

  const driftRiskTrend: DriftForecast['driftRiskTrend'] =
    daysBehind > avgHistoricalDrift * 1.2 && backlogEsc > 40 ? 'increasing' :
    daysBehind < avgHistoricalDrift * 0.8 && momentum > 50 ? 'decreasing' :
    'stable';

  const driftRate = daysBehind > 0
    ? daysBehind / Math.max(1, continuity.identity.totalOperationalDays)
    : 0;
  const estimatedDriftDays = Math.round(daysBehind + (driftRate * 30));

  const weeksUntilSignificant = daysBehind >= 14
    ? 0
    : Math.max(1, Math.round((14 - daysBehind) / Math.max(0.5, driftRate * 7)));

  const riskFactors: string[] = [];
  if (backlogEsc > 50) riskFactors.push('backlog pressure');
  if (fatigue > 40) riskFactors.push('fatigue accumulation');
  if (streakCons < 20) riskFactors.push('low streak consistency');
  if (completionRatio < 0.3) riskFactors.push('low completion rate');
  const keyRiskFactor = riskFactors.length > 0 ? riskFactors.join(', ') : 'no immediate risks detected';

  const confidence = Math.min(100, Math.round(
    (continuity.identity.totalOperationalDays > 5 ? 35 : 10) +
    (driftHistory > 0 ? Math.min(25, driftHistory * 0.5) : 0) +
    (momentum > 60 ? 15 : 0) +
    (backlogEsc > 0 ? Math.min(15, backlogEsc * 0.2) : 0)
  ));

  return {
    driftRiskTrend,
    estimatedDriftDays,
    driftArrivalWeeks: weeksUntilSignificant,
    keyRiskFactor,
    confidence,
  };
}

export function computeSustainabilityModel(
  memory: OperationalMemory,
  lifecycle: OperationalLifecycle,
  context: OperationalContext,
  continuity: ContinuityContext
): SustainabilityModel {
  const fatigue = context.fatigueLevel || 0;
  const momentum = context.momentumScore || 50;
  const backlogEsc = memory.backlogEscalation || 0;
  const missionLoad = context.missionLoad || 0;
  const streakCons = memory.streakConsistency || 0;
  const completionRatio = context.completionRatio || 0;
  const overloadProb = computeTemporalForecast(memory, lifecycle, context, continuity).overloadProbability;

  const status: SustainabilityModel['status'] =
    overloadProb > 60 ? 'overload_risk' :
    momentum > 70 && fatigue < 20 && overloadProb < 25 ? 'accelerating_safely' :
    overloadProb > 35 ? 'unstable' :
    'sustainable';

  const loadCapacity = Math.max(0, Math.min(100, Math.round(
    100 -
    (missionLoad * 0.4) -
    (fatigue * 0.3) -
    (backlogEsc * 0.2) -
    ((1 - completionRatio) * 100 * 0.1)
  )));

  const burnoutRisk = Math.min(100, Math.round(
    (fatigue * 0.35) +
    (backlogEsc * 0.2) +
    Math.max(0, (100 - streakCons) * 0.2) +
    (missionLoad > 60 ? 15 : 0) +
    (lifecycle.phase === 'DriftRisk' ? 15 : 0)
  ));

  const recommendedPacing: SustainabilityModel['recommendedPacing'] =
    status === 'overload_risk' || burnoutRisk > 50 ? 'slow' :
    status === 'accelerating_safely' && fatigue < 15 ? 'accelerate' :
    'maintain';

  const confidence = Math.min(100, Math.round(
    (continuity.identity.totalOperationalDays > 3 ? 30 : 5) +
    (continuity.scores.operationalStabilityScore * 0.3) +
    (lifecycle.confidence * 0.2) +
    (streakCons > 30 ? 15 : 0)
  ));

  return {
    status,
    loadCapacity,
    burnoutRisk,
    recommendedPacing,
    confidence,
  };
}

export function computeTrajectoryState(
  memory: OperationalMemory,
  lifecycle: OperationalLifecycle,
  continuity: ContinuityContext,
  sustainability: SustainabilityModel
): TrajectoryState {
  const momentum = memory.momentumPeriods || 0;
  const recovery = memory.recoveryPeriods || 0;
  const neglectedTotal = (memory.neglectedPillarHistory.HACK || 0) +
    (memory.neglectedPillarHistory.BUILD || 0) +
    (memory.neglectedPillarHistory.AI || 0) +
    (memory.neglectedPillarHistory.PRESENCE || 0);

  const hasRecoveryMomentum = lifecycle.phase === 'Recovery' &&
    continuity.carryForward.unresolvedBacklogTrend === 'decreasing';

  const isSaturated = sustainability.status === 'overload_risk' ||
    lifecycle.phase === 'DriftRisk' && sustainability.burnoutRisk > 50;

  const isExpanding = continuity.identity.dominantRhythm === 'momentum' &&
    sustainability.status === 'accelerating_safely';

  const isConsolidating = neglectedTotal > 10 ||
    lifecycle.phase === 'Consolidation';

  const isDrifting = continuity.carryForward.unresolvedBacklogTrend === 'increasing' ||
    lifecycle.phase === 'DriftRisk';

  let classification: TrajectoryClass = 'Stable Progression';
  let description = 'Operational baseline maintained with consistent execution';

  if (isSaturated) {
    classification = 'Operational Saturation';
    description = 'Capacity limits approaching — workload reduction recommended';
  } else if (hasRecoveryMomentum) {
    classification = 'Recovery Momentum';
    description = 'Recovery trend with positive momentum building';
  } else if (isExpanding) {
    classification = 'Sustainable Expansion';
    description = 'Operational capacity supports deeper strategic execution';
  } else if (isConsolidating) {
    classification = 'Strategic Consolidation';
    description = 'Addressing pillar imbalances and reducing drift';
  } else if (isDrifting) {
    classification = 'Drift Accumulation';
    description = 'Backlog and drift pressure building — course correction may be needed';
  }

  const scoreAvg = (continuity.scores.missionContinuityScore +
    continuity.scores.strategicCoherenceScore +
    continuity.scores.operationalStabilityScore +
    continuity.scores.executionContinuityScore) / 4;

  const transitionLikelihood = Math.min(100, Math.max(0, Math.round(
    classification === 'Operational Saturation' ? 40 :
    classification === 'Drift Accumulation' ? 35 :
    classification === 'Recovery Momentum' ? 30 :
    classification === 'Sustainable Expansion' ? 25 :
    classification === 'Strategic Consolidation' ? 20 :
    15
  )));

  const confidence = Math.min(100, Math.round(
    (sustainability.confidence * 0.4) +
    (scoreAvg * 0.2) +
    (lifecycle.confidence * 0.3) +
    (continuity.identity.totalOperationalDays > 10 ? 10 : 0)
  ));

  return { classification, description, transitionLikelihood, confidence };
}

export function computeForecastContext(
  memory: OperationalMemory,
  lifecycle: OperationalLifecycle,
  context: OperationalContext,
  continuity: ContinuityContext
): ForecastContext {
  const temporal = computeTemporalForecast(memory, lifecycle, context, continuity);
  const drift = computeDriftForecast(memory, context, continuity);
  const sustainability = computeSustainabilityModel(memory, lifecycle, context, continuity);
  const trajectory = computeTrajectoryState(memory, lifecycle, continuity, sustainability);
  return { temporal, drift, sustainability, trajectory };
}

export function computeScenarioProjections(
  memory: OperationalMemory,
  lifecycle: OperationalLifecycle,
  context: OperationalContext,
  continuity: ContinuityContext,
  forecast: ForecastContext
): ScenarioProjection[] {
  const projections: ScenarioProjection[] = [];
  const now = Date.now();

  // sustained_overload: if overload probability > 50 or fatigue + backlog high
  if (forecast.temporal.overloadProbability > 50 || (context.fatigueLevel > 50 && memory.backlogEscalation > 50)) {
    const likelihood = Math.min(100, Math.round(
      40 + (forecast.temporal.overloadProbability > 70 ? 30 : 15) + (context.fatigueLevel > 60 ? 15 : 0)
    ));
    projections.push({
      scenarioType: 'sustained_overload',
      timeframe: likelihood > 70 ? 'near' : 'medium',
      projectedState: 'Execution quality degrades — backlog amplifies — recovery window narrows',
      likelihood,
      confidence: Math.round(forecast.temporal.confidence * 0.7 + continuity.scores.operationalStabilityScore * 0.3),
    });
  }

  // backlog_escalation: backlog growing + drift risk
  if (memory.backlogEscalation > 40 || context.backlogPressure > 50) {
    const likelihood = Math.min(100, Math.round(
      35 + (memory.backlogEscalation > 60 ? 25 : 10) + (context.daysBehindRoadmap > 7 ? 20 : 0)
    ));
    projections.push({
      scenarioType: 'backlog_escalation',
      timeframe: likelihood > 65 ? 'near' : 'medium',
      projectedState: 'Backlog amplifies drift pressure — reduces recovery capacity and completion rate',
      likelihood,
      confidence: Math.round(forecast.drift.confidence * 0.6 + continuity.scores.strategicCoherenceScore * 0.4),
    });
  }

  // roadmap_compression: drift + backlog building
  if (context.daysBehindRoadmap > 5 || forecast.drift.driftRiskTrend === 'increasing') {
    const severity = context.daysBehindRoadmap + memory.backlogEscalation * 0.2;
    const likelihood = Math.min(100, Math.round(
      30 + (severity > 20 ? 25 : severity > 10 ? 10 : 0) + (forecast.drift.driftRiskTrend === 'increasing' ? 20 : 0)
    ));
    projections.push({
      scenarioType: 'roadmap_compression',
      timeframe: likelihood > 60 ? 'near' : 'medium',
      projectedState: 'Continued drift compresses future roadmap pacing — milestone collision risk increases',
      likelihood,
      confidence: Math.round(forecast.drift.confidence * 0.5 + continuity.scores.missionContinuityScore * 0.3 + 20),
    });
  }

  // recovery_pacing: currently in recovery or building streak
  if (context.rhythmState === 'recovery' || lifecycle.phase === 'Recovery') {
    const effectiveness = Math.round(
      (100 - context.fatigueLevel) * 0.4 +
      (context.momentumScore) * 0.3 +
      (memory.streakConsistency > 20 ? 15 : 0)
    );
    projections.push({
      scenarioType: 'recovery_pacing',
      timeframe: effectiveness > 60 ? 'near' : 'medium',
      projectedState: effectiveness > 60
        ? 'Recovery trajectory positive — consistency restoring within projected window'
        : 'Recovery pacing moderate — fatigue reduction needed for full restoration',
      likelihood: Math.min(100, effectiveness + 10),
      confidence: Math.round(effectiveness * 0.6 + forecast.temporal.confidence * 0.4),
    });
  }

  // stabilization_period: stable rhythm with consistent execution
  if (lifecycle.phase === 'Stabilization' || (memory.streakConsistency > 30 && context.fatigueLevel < 40)) {
    const stabilityConf = Math.round(
      (memory.streakConsistency > 40 ? 40 : 25) +
      continuity.scores.operationalStabilityScore * 0.4 +
      (100 - context.fatigueLevel) * 0.2
    );
    projections.push({
      scenarioType: 'stabilization_period',
      timeframe: 'medium',
      projectedState: 'Stabilization phase supports long-term execution reliability and strategic advancement',
      likelihood: Math.min(100, stabilityConf),
      confidence: Math.round(stabilityConf * 0.5 + continuity.scores.operationalStabilityScore * 0.5),
    });
  }

  // momentum_continuation: high momentum, low fatigue
  if (context.rhythmState === 'momentum' && context.momentumScore > 60) {
    const sustainProb = Math.round(
      (context.momentumScore > 80 ? 40 : 25) +
      (100 - context.fatigueLevel) * 0.3 +
      (memory.streakConsistency > 40 ? 15 : 0) +
      (forecast.drift.driftRiskTrend !== 'increasing' ? 10 : 0)
    );
    projections.push({
      scenarioType: 'momentum_continuation',
      timeframe: sustainProb > 65 ? 'near' : 'medium',
      projectedState: 'Sustained momentum supports deeper strategic execution and pillar advancement',
      likelihood: Math.min(100, sustainProb),
      confidence: Math.round(forecast.temporal.confidence * 0.6 + continuity.scores.missionContinuityScore * 0.4),
    });
  }

  return projections.sort((a, b) => (b.likelihood + b.confidence) - (a.likelihood + a.confidence));
}

export function computePressurePropagation(
  memory: OperationalMemory,
  context: OperationalContext,
  continuity: ContinuityContext,
  forecast: ForecastContext
): PressurePropagation {
  const backlogEsc = memory.backlogEscalation || 0;
  const daysBehind = context.daysBehindRoadmap || 0;
  const fatigue = context.fatigueLevel || 0;
  const momentum = context.momentumScore || 50;

  // Determine which pressure chain is most active
  const overloadSignals = forecast.temporal.overloadProbability > 50 ? 1 : 0;
  const backlogSignals = backlogEsc > 40 ? 1 : 0;
  const driftSignals = daysBehind > 7 ? 1 : 0;
  const fatigueSignals = fatigue > 40 ? 1 : 0;
  const momentumSignals = momentum > 70 && fatigue < 25 ? 1 : 0;

  const signalSum = overloadSignals + backlogSignals + driftSignals + fatigueSignals + momentumSignals;

  // Determine the dominant source
  let source: PressurePropagation['source'] = 'backlog';
  if (overloadSignals && fatigueSignals) source = 'overload';
  else if (fatigueSignals && !backlogSignals) source = 'fatigue';
  else if (momentumSignals) source = 'momentum';
  else if (backlogSignals) source = 'backlog';

  // Build propagation path based on source
  let propagationPath: string[];
  let currentStage = 0;

  if (source === 'backlog' || source === 'overload') {
    propagationPath = ['backlog pressure', 'drift accumulation', 'fatigue buildup', 'operational instability'];
    if (backlogEsc > 40) currentStage = 1;
    if (backlogEsc > 40 && daysBehind > 7) currentStage = 2;
    if (backlogEsc > 40 && daysBehind > 7 && fatigue > 40) currentStage = 3;
    if (fatigue > 50 && forecast.temporal.executionStability < 30) currentStage = 4;
  } else if (source === 'momentum') {
    propagationPath = ['sustained momentum', 'expansion readiness', 'strategic advancement', 'pillar progression'];
    if (momentum > 70) currentStage = 1;
    if (momentum > 70 && forecast.temporal.executionStability > 60) currentStage = 2;
    if (momentum > 80 && forecast.temporal.executionStability > 70 && fatigue < 20) currentStage = 3;
    if (momentum > 85 && memory.streakConsistency > 50) currentStage = 4;
  } else {
    propagationPath = ['fatigue onset', 'execution decline', 'momentum loss', 'recovery required'];
    if (fatigue > 30) currentStage = 1;
    if (fatigue > 40 && momentum < 50) currentStage = 2;
    if (fatigue > 50 && momentum < 35) currentStage = 3;
    if (fatigue > 60 && context.streakStatus === 'cold') currentStage = 4;
  }

  const propagationSpeed: PressurePropagation['propagationSpeed'] =
    signalSum >= 3 ? 'fast' :
    signalSum === 2 ? 'moderate' :
    'slow';

  const confidence = Math.min(100, Math.round(
    (continuity.identity.totalOperationalDays > 5 ? 30 : 5) +
    (signalSum * 12) +
    (forecast.temporal.confidence * 0.3)
  ));

  return { source, propagationPath, currentStage, propagationSpeed, confidence };
}

export function computeTradeoffSimulation(
  memory: OperationalMemory,
  lifecycle: OperationalLifecycle,
  context: OperationalContext,
  continuity: ContinuityContext,
  forecast: ForecastContext
): TradeoffSimulation {
  const fatigue = context.fatigueLevel || 0;
  const momentum = context.momentumScore || 50;
  const backlogEsc = memory.backlogEscalation || 0;
  const neglectedTotal = (memory.neglectedPillarHistory.HACK || 0) +
    (memory.neglectedPillarHistory.BUILD || 0) +
    (memory.neglectedPillarHistory.AI || 0) +
    (memory.neglectedPillarHistory.PRESENCE || 0);
  const overloadProb = forecast.temporal.overloadProbability;

  // accelerateWorkload: pushing for more output
  const accelerateOperationalCost = Math.min(100, Math.round(
    (fatigue > 50 ? 60 : fatigue > 30 ? 35 : 15) +
    (backlogEsc > 50 ? 25 : 0) +
    (overloadProb > 50 ? 20 : 0)
  ));
  const accelerateStrategicBenefit = Math.min(100, Math.round(
    (momentum > 70 ? 50 : momentum > 40 ? 30 : 10) +
    (fatigue < 20 ? 25 : 0) +
    (context.completionRatio > 0.5 ? 15 : 0)
  ));
  const accelerateSustainabilityImpact = Math.min(100, Math.round(
    (overloadProb > 50 ? 20 : overloadProb > 30 ? 10 : 0) +
    (fatigue < 20 ? 30 : fatigue < 40 ? 15 : 0) +
    (memory.streakConsistency > 40 ? 20 : 0)
  ));

  // stabilizeFirst: prioritizing recovery and consistency
  const stabilizeCost = Math.min(100, Math.round(
    (context.daysBehindRoadmap > 14 ? 40 : context.daysBehindRoadmap > 7 ? 20 : 5) +
    (neglectedTotal > 10 ? 15 : 0)
  ));
  const stabilizeBenefit = Math.min(100, Math.round(
    (lifecycle.phase === 'Recovery' || lifecycle.phase === 'Stabilization' ? 50 : 25) +
    (fatigue > 40 ? 20 : 0) +
    (memory.streakConsistency < 30 ? 15 : 0)
  ));
  const stabilizeSustainabilityImpact = Math.min(100, Math.round(
    (100 - fatigue) * 0.3 +
    (lifecycle.phase === 'Recovery' ? 30 : lifecycle.phase === 'Stabilization' ? 20 : 10) +
    (memory.operationalCycles > 2 ? 15 : 0)
  ));

  // deepFocus: concentrating on neglected pillars
  const deepFocusCost = Math.min(100, Math.round(
    (context.daysBehindRoadmap > 10 ? 25 : 10) +
    (backlogEsc > 40 ? 20 : 0) +
    (momentum < 40 ? 15 : 0)
  ));
  const deepFocusBenefit = Math.min(100, Math.round(
    (neglectedTotal > 15 ? 50 : neglectedTotal > 8 ? 35 : neglectedTotal > 3 ? 20 : 5) +
    (lifecycle.phase === 'Consolidation' ? 20 : 0)
  ));
  const deepFocusSustainabilityImpact = Math.min(100, Math.round(
    (lifecycle.phase === 'Consolidation' || lifecycle.phase === 'Stable' ? 40 : 20) +
    (100 - fatigue) * 0.2 +
    (neglectedTotal > 0 ? 20 : 0)
  ));

  return {
    accelerateWorkload: { operationalCost: accelerateOperationalCost, strategicBenefit: accelerateStrategicBenefit, sustainabilityImpact: accelerateSustainabilityImpact },
    stabilizeFirst: { operationalCost: stabilizeCost, strategicBenefit: stabilizeBenefit, sustainabilityImpact: stabilizeSustainabilityImpact },
    deepFocus: { operationalCost: deepFocusCost, strategicBenefit: deepFocusBenefit, sustainabilityImpact: deepFocusSustainabilityImpact },
  };
}

export function computeRoadmapCompression(
  memory: OperationalMemory,
  context: OperationalContext,
  continuity: ContinuityContext,
  forecast: ForecastContext
): RoadmapCompression {
  const daysBehind = context.daysBehindRoadmap || 0;
  const backlogEsc = memory.backlogEscalation || 0;
  const momentum = context.momentumScore || 50;
  const completionRate = context.completionRatio || 0;
  const fatigue = context.fatigueLevel || 0;

  const driftSeverity = daysBehind * 0.4 + backlogEsc * 0.3;
  const compressionSeverity = Math.min(100, Math.round(driftSeverity + (completionRate < 0.3 ? 20 : 0) + (fatigue > 50 ? 10 : 0)));

  const compressionRisk: RoadmapCompression['compressionRisk'] =
    compressionSeverity > 50 ? 'high' :
    compressionSeverity > 25 ? 'medium' :
    'low';

  const driftRate = Math.max(0.5, daysBehind / Math.max(1, continuity.identity.totalOperationalDays || 1));
  const weeksUntilCompression = compressionRisk === 'high'
    ? Math.max(1, Math.round((50 - daysBehind) / (driftRate * 7)))
    : compressionRisk === 'medium'
      ? Math.max(2, Math.round((30 - daysBehind) / (driftRate * 7)))
      : 8;

  const milestoneCollisionRisk = backlogEsc > 50 && daysBehind > 10 && momentum < 40;
  const recoveryWindowShrinking = forecast.temporal.overloadProbability > 40 && fatigue > 40;

  let compressionNote = 'No significant roadmap compression detected';
  if (compressionRisk === 'high') {
    compressionNote = `Current pacing compresses roadmap workload in ~${weeksUntilCompression} week${weeksUntilCompression > 1 ? 's' : ''}`;
  } else if (compressionRisk === 'medium') {
    compressionNote = `Roadmap compression risk within ${weeksUntilCompression} weeks if current pace continues`;
  }

  const confidence = Math.min(100, Math.round(
    (continuity.identity.totalOperationalDays > 5 ? 25 : 5) +
    Math.min(30, daysBehind * 1.5) +
    (forecast.temporal.confidence * 0.3) +
    (backlogEsc > 0 ? Math.min(15, backlogEsc * 0.2) : 0)
  ));

  return {
    compressionRisk,
    estimatedCompressionWeeks: weeksUntilCompression,
    compressionSeverity,
    milestoneCollisionRisk,
    recoveryWindowShrinking,
    compressionNote,
  };
}

export function computeRecoveryWindow(
  memory: OperationalMemory,
  lifecycle: OperationalLifecycle,
  context: OperationalContext,
  continuity: ContinuityContext,
  forecast: ForecastContext
): RecoveryWindow {
  const fatigue = context.fatigueLevel || 0;
  const backlogEsc = memory.backlogEscalation || 0;
  const completionRate = context.completionRatio || 0;
  const momentum = context.momentumScore || 50;
  const streakCons = memory.streakConsistency || 0;
  const daysBehind = context.daysBehindRoadmap || 0;

  const requiredDays = Math.round(
    (fatigue * 0.3) +
    (backlogEsc * 0.2) +
    Math.max(0, (1 - completionRate) * 30) +
    (daysBehind * 0.2)
  );

  const recoveryEffectiveness = Math.min(100, Math.round(
    (100 - fatigue) * 0.3 +
    (momentum > 50 ? 20 : 0) +
    (streakCons > 30 ? 20 : streakCons > 15 ? 10 : 0) +
    (lifecycle.phase === 'Recovery' || lifecycle.phase === 'Stabilization' ? 20 : 10) +
    (completionRate > 0.4 ? 15 : 0)
  ));

  const momentumRestorationProb = Math.min(100, Math.round(
    (streakCons > 30 ? 30 : streakCons > 10 ? 15 : 5) +
    (momentum > 60 ? 20 : momentum > 40 ? 10 : 0) +
    (fatigue < 30 ? 25 : fatigue < 50 ? 15 : 5) +
    (lifecycle.phase === 'Recovery' ? 20 : 0)
  ));

  // power is calculated based on something - wait, I haven't defined power. I need to calculate it.
  // Let me use a different name.

  const windowAvailable = lifecycle.phase !== 'DriftRisk' &&
    forecast.temporal.overloadProbability < 70 &&
    fatigue < 70;

  const confidence = Math.min(100, Math.round(
    (continuity.identity.totalOperationalDays > 3 ? 20 : 5) +
    (recoveryEffectiveness * 0.3) +
    (forecast.temporal.confidence * 0.3) +
    (lifecycle.confidence * 0.2)
  ));

  return {
    requiredStabilizationDays: requiredDays,
    recoveryEffectiveness,
    momentumRestorationProb,
    windowAvailable,
    confidence,
  };
}

export function computeSimulationContext(
  memory: OperationalMemory,
  lifecycle: OperationalLifecycle,
  context: OperationalContext,
  continuity: ContinuityContext,
  forecast: ForecastContext
): SimulationContext {
  const scenarios = computeScenarioProjections(memory, lifecycle, context, continuity, forecast);
  const pressurePropagation = computePressurePropagation(memory, context, continuity, forecast);
  const tradeoffs = computeTradeoffSimulation(memory, lifecycle, context, continuity, forecast);
  const roadmapCompression = computeRoadmapCompression(memory, context, continuity, forecast);
  const recoveryWindow = computeRecoveryWindow(memory, lifecycle, context, continuity, forecast);
  return { scenarios, pressurePropagation, tradeoffs, roadmapCompression, recoveryWindow };
}