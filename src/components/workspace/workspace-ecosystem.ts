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
  unfinishedMissionChains: string[];
  neglectedPillarHistory: Record<Pillar, number>;
  momentumPeriods: number;
  recoveryPeriods: number;
  backlogEscalation: number;
  roadmapDriftHistory: number;
  streakConsistency: number;
  operationalCycles: number;
  pacingTransitions: PacingTransition[];
  campaignCompletions: string[];
  campaignAbandonments: { campaignId: string; completionRatio: number }[];
  overloadCycleCount: number;
  effectiveRecoveryCount: number;
  sustainableExecutionDays: number;
  firstOperationTimestamp: number | null;
  lastCounterDay: number;
  pacingProfileDistribution: Record<string, number>;
  toolUsageHistory: Record<string, number>;
  techniqueHistory: Record<string, number>;
  platformActivity: Record<string, { lastActive: number; entryCount: number; lastOutcome: string }>;
  unresolvedFindings: string[];
  writeupSubjects: string[];
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
  missionChains?: MissionChain[];
  campaigns?: Campaign[];
  recoveryActions?: RecoveryAction[];
  orchestration?: OrchestrationContext;
  operationEvidence?: OperationEvidence[];
  platforms?: PlatformReference[];
  researchPatterns?: ResearchPattern[];
  investigativeMemoryContent?: InvestigativeMemoryContent;
  knowledgeCrystallization?: KnowledgeCrystallization;
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
      message: 'OPERATION QUEUE BACKLOG',
      type: 'warning',
      source: 'mission',
      timestamp: now,
      duration: 8000,
    });
  }

  if (context.daysBehindRoadmap > 14) {
    events.push({
      id: `roadmap-drift-${now}`,
      message: 'STRATEGIC DRIFT DETECTED',
      type: 'warning',
      source: 'roadmap',
      timestamp: now,
      duration: 8000,
    });
  }

  if (context.streakStatus === 'cold' && context.fatigueLevel > 30) {
    events.push({
      id: `streak-cold-${now}`,
      message: 'CONTINUITY INTERRUPTION',
      type: 'critical',
      source: 'system',
      timestamp: now,
      duration: 10000,
    });
  }

  if (context.rhythmState === 'momentum') {
    events.push({
      id: `momentum-${now}`,
      message: 'OPERATIONAL MOMENTUM',
      type: 'success',
      source: 'system',
      timestamp: now,
      duration: 6000,
    });
  }

  if (context.rhythmState === 'recovery') {
    events.push({
      id: `recovery-${now}`,
      message: 'RECOVERY CYCLE ACTIVE',
      type: 'info',
      source: 'system',
      timestamp: now,
      duration: 6000,
    });
  }

  if (context.fatigueLevel > 60) {
    events.push({
      id: `fatigue-${now}`,
      message: 'OPERATOR FATIGUE ACCUMULATING',
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
      message: 'OPERATIONAL PRESSURE SATURATION',
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
  const today = Math.floor(now / 86400000);
  
  // Initialize memory with defaults if none exists
  const memory: OperationalMemory = previousMemory || {
    unfinishedMissionChains: [],
    neglectedPillarHistory: { HACK: 0, BUILD: 0, AI: 0, PRESENCE: 0 },
    momentumPeriods: 0,
    recoveryPeriods: 0,
    backlogEscalation: 0,
    roadmapDriftHistory: 0,
    streakConsistency: 0,
    operationalCycles: 0,
    pacingTransitions: [],
    campaignCompletions: [],
    campaignAbandonments: [],
    overloadCycleCount: 0,
    effectiveRecoveryCount: 0,
    sustainableExecutionDays: 0,
    firstOperationTimestamp: null,
    lastCounterDay: 0,
    pacingProfileDistribution: {},
    toolUsageHistory: {},
    techniqueHistory: {},
    platformActivity: {},
    unresolvedFindings: [],
    writeupSubjects: [],
  };

  if (!memory.firstOperationTimestamp) {
    memory.firstOperationTimestamp = Date.now();
  }
  
  // Track unfinished mission chains (missions that appear repeatedly)
  const activeMissionTitles = tasks
    .filter(t => t.status !== 'done')
    .map(t => t.title);
    
  // Update unfinished mission chains - keep titles that appear in current session
  const unfinishedChains = [...new Set(activeMissionTitles)];
  
  // Track neglected pillar history (capped per-counter)
  const neglectedHistory = { ...memory.neglectedPillarHistory };
  context.weakPillars.forEach(pillar => {
    if (pillar === 'HACK' || pillar === 'BUILD' || pillar === 'AI' || pillar === 'PRESENCE') {
      neglectedHistory[pillar as Pillar] = Math.min(365, (neglectedHistory[pillar as Pillar] || 0) + 1);
    }
  });
  
  // Only increment per-cycle counters once per calendar day to prevent per-render inflation
  const newDay = today !== memory.lastCounterDay;
  const momentumAdded = newDay && context.rhythmState === 'momentum' ? 1 : 0;
  const recoveryAdded = newDay && context.rhythmState === 'recovery' ? 1 : 0;
  const cycleAdded = newDay && (context.streakStatus === 'hot' || context.streakStatus === 'strong') ? 1 : 0;
  const overloadAdded = newDay && context.rhythmState === 'overload' ? 1 : 0;
  const recoveryEffAdded = newDay && context.rhythmState === 'momentum' && (memory.recoveryPeriods || 0) > 0 ? 1 : 0;
  const sustainableAdded = newDay && context.fatigueLevel < 25 && context.rhythmState !== 'overload' && context.rhythmState !== 'stagnation' ? 1 : 0;
  const lastCounterDay = newDay ? today : memory.lastCounterDay;
  
  // Track backlog escalation (exponential moving average — self-limiting)
  const backlogTrend = Math.min(100, Math.round(
    (memory.backlogEscalation * 0.8) + (context.backlogPressure * 0.2)
  ));
  
  // Track roadmap drift history (cumulative, capped at 2 years)
  const driftAdded = Math.max(0, context.daysBehindRoadmap);
  const driftHistory = Math.min(365 * 2, memory.roadmapDriftHistory + driftAdded);
  
  // Track streak consistency (exponential moving average — self-limiting)
  const streakConsistency = Math.round(
    (memory.streakConsistency * 0.9) + (streakCurrent * 0.1)
  );
  
  // Track operational cycles (capped at 365)
  const operationalCycles = Math.min(365, memory.operationalCycles + cycleAdded);
  
  return {
    unfinishedMissionChains: unfinishedChains,
    neglectedPillarHistory: neglectedHistory,
    momentumPeriods: Math.min(365, memory.momentumPeriods + momentumAdded),
    recoveryPeriods: Math.min(365, memory.recoveryPeriods + recoveryAdded),
    backlogEscalation: backlogTrend,
    roadmapDriftHistory: driftHistory,
    streakConsistency: streakConsistency,
    operationalCycles: operationalCycles,
    pacingTransitions: memory.pacingTransitions || [],
    campaignCompletions: memory.campaignCompletions || [],
    campaignAbandonments: memory.campaignAbandonments || [],
    overloadCycleCount: Math.min(365, (memory.overloadCycleCount || 0) + overloadAdded),
    effectiveRecoveryCount: Math.min(365, (memory.effectiveRecoveryCount || 0) + recoveryEffAdded),
    sustainableExecutionDays: Math.min(365, (memory.sustainableExecutionDays || 0) + sustainableAdded),
    firstOperationTimestamp: memory.firstOperationTimestamp,
    lastCounterDay,
    pacingProfileDistribution: memory.pacingProfileDistribution,
    toolUsageHistory: memory.toolUsageHistory,
    techniqueHistory: memory.techniqueHistory,
    platformActivity: memory.platformActivity,
    unresolvedFindings: memory.unresolvedFindings,
    writeupSubjects: memory.writeupSubjects,
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
    logs?: any[];
    ctfEntries?: any[];
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

  const tasks = data.tasks || [];

  const chainsFromTemplate = computeMissionChains(tasks);
  const chainsFromMemory = computeChainsFromMemory(tasks, memory.unfinishedMissionChains);
  const allChains = [...chainsFromTemplate, ...chainsFromMemory.filter(
    mc => !chainsFromTemplate.some(ct => ct.taskIds[0] === mc.taskIds[0])
  )];

  context.missionChains = allChains;
  context.campaigns = deriveCampaigns(data.currentMonth || 1, tasks);
  context.recoveryActions = computeRecoveryActions(context, memory);

  const previousPacing = memory.pacingTransitions.length > 0
    ? memory.pacingTransitions[memory.pacingTransitions.length - 1].to
    : null;
  const orchestration = computeOrchestration(context, memory, allChains, context.campaigns, previousPacing);
  context.orchestration = orchestration;

  if (orchestration.pacingProfile !== previousPacing && previousPacing !== null) {
    memory.pacingTransitions = [
      ...(memory.pacingTransitions || []),
      {
        from: previousPacing,
        to: orchestration.pacingProfile,
        timestamp: Date.now(),
        reason: `Orchestration cycle: ${context.rhythmState} / fatigue ${context.fatigueLevel}`,
      },
    ];
  }

  const dist = { ...(memory.pacingProfileDistribution || {}) };
  dist[orchestration.pacingProfile] = (dist[orchestration.pacingProfile] || 0) + 1;
  memory.pacingProfileDistribution = dist;

  const evolution = computeSystemEvolution(memory, context, allChains, data.currentMonth || 1);
  context.orchestration = { ...orchestration, evolution };

  const logs = data.logs || [];
  const ctfs = data.ctfEntries || [];
  const evidence = computeOperationEvidence(tasks, ctfs, logs);
  context.operationEvidence = evidence;
  context.platforms = computePlatformReferences(ctfs, tasks);
  context.researchPatterns = computeResearchPatterns(evidence, memory);
  context.investigativeMemoryContent = computeInvestigativeMemoryContent(evidence, tasks, memory);
  const campaignStages = context.orchestration?.campaignStages || [];
  context.knowledgeCrystallization = computeKnowledgeCrystallization(evidence, context.researchPatterns, campaignStages);

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

  const elapsedDays = memory.firstOperationTimestamp
    ? Math.floor((Date.now() - memory.firstOperationTimestamp) / 86400000)
    : 0;
  const totalOperationalDays = Math.min(730, elapsedDays);

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

/* ═══════════════════════════════════════════════
   Deep Operational Workflow Systems
   Mission Chains, Campaigns, Recovery Engine
   ═══════════════════════════════════════════════ */

export interface MissionChain {
  id: string
  name: string
  pillar: string
  taskIds: string[]
  completedCount: number
  totalCount: number
  state: 'dormant' | 'active' | 'resolved' | 'abandoned'
  createdAt: number
}

export interface Campaign {
  id: string
  name: string
  description: string
  pillar: string
  months: number[]
  taskCount: number
  completedCount: number
}

export interface RecoveryAction {
  type: 'pacing' | 'focus' | 'consolidation' | 'reduction' | 'stabilization'
  suggestion: string
  priority: 'low' | 'medium' | 'high'
}

export function computeMissionChains(tasks: any[]): MissionChain[] {
  const now = Date.now()
  const chains: MissionChain[] = []
  const grouped = new Map<string, any[]>()
  const seenKeys = new Set<string>()

  for (const t of tasks) {
    const key = t.source_template
    if (!key || seenKeys.has(key)) continue
    seenKeys.add(key)
    const chainTasks = tasks.filter((ct: any) => ct.source_template === key)
    if (chainTasks.length < 2) continue
    const done = chainTasks.filter((ct: any) => ct.status === 'done')
    const active = chainTasks.filter((ct: any) => ct.status === 'in_progress')
    const todo = chainTasks.filter((ct: any) => ct.status === 'todo')

    let state: MissionChain['state'] = 'dormant'
    if (done.length === chainTasks.length) state = 'resolved'
    else if (done.length > 0 && active.length === 0 && todo.length === 0) state = 'abandoned'
    else if (active.length > 0 || done.length > 0) state = 'active'

    chains.push({
      id: `chain-${key}-${now}`,
      name: chainTasks[0].title?.substring(0, 60) || 'Untitled chain',
      pillar: chainTasks[0].pillar || 'HACK',
      taskIds: chainTasks.map((ct: any) => ct.id),
      completedCount: done.length,
      totalCount: chainTasks.length,
      state,
      createdAt: Math.min(...chainTasks.map((ct: any) => new Date(ct.created_at).getTime())),
    })
  }

  return chains.sort((a, b) => b.totalCount - a.totalCount)
}

export function deriveCampaigns(
  currentMonth: number,
  tasks: any[]
): Campaign[] {
  const campaigns: Campaign[] = [
    { id: 'linux-foundation', name: 'Linux Foundation', description: 'Core Linux and system fundamentals', pillar: 'HACK', months: [1, 2, 3], taskCount: 0, completedCount: 0 },
    { id: 'web-security', name: 'Web Security Track', description: 'OWASP, Burp Suite, DVWA', pillar: 'HACK', months: [4, 5], taskCount: 0, completedCount: 0 },
    { id: 'python-tools', name: 'Python Security Tools', description: 'Build security tooling with Python', pillar: 'BUILD', months: [6, 7], taskCount: 0, completedCount: 0 },
    { id: 'ctf-season', name: 'CTF Season', description: 'CTF challenges and competition practice', pillar: 'HACK', months: [8], taskCount: 0, completedCount: 0 },
    { id: 'pentester-path', name: 'Jr Pentester Path', description: 'TryHackMe structured pentesting', pillar: 'HACK', months: [9, 10], taskCount: 0, completedCount: 0 },
    { id: 'privilege-escalation', name: 'Privilege Escalation Arc', description: 'Metasploit and privesc techniques', pillar: 'HACK', months: [11], taskCount: 0, completedCount: 0 },
    { id: 'consolidation', name: 'Year 1 Consolidation', description: 'Review and consolidate year 1 progress', pillar: 'PRESENCE', months: [12], taskCount: 0, completedCount: 0 },
    { id: 'ai-systems', name: 'AI Systems Integration', description: 'AI-assisted security workflow automation', pillar: 'AI', months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], taskCount: 0, completedCount: 0 },
  ]

  for (const campaign of campaigns) {
    const relevantTasks = tasks.filter((t: any) => campaign.months.includes(t.month))
    campaign.taskCount = relevantTasks.length
    campaign.completedCount = relevantTasks.filter((t: any) => t.status === 'done').length
  }

  return campaigns.filter(c => c.taskCount > 0 || c.months.includes(currentMonth))
}

export function computeRecoveryActions(
  context: OperationalContext,
  memory: OperationalMemory
): RecoveryAction[] {
  const actions: RecoveryAction[] = []

  if (context.rhythmState === 'overload' || context.fatigueLevel > 50) {
    actions.push({
      type: 'reduction',
      suggestion: 'Reduce active operations. Focus on 1-2 priorities until backlog stabilizes.',
      priority: 'high',
    })
    actions.push({
      type: 'pacing',
      suggestion: 'Reduce daily task target. Prioritize completion over volume.',
      priority: 'medium',
    })
  }

  if (context.rhythmState === 'stagnation' || (context.streakStatus === 'cold' && context.momentumScore < 30)) {
    actions.push({
      type: 'stabilization',
      suggestion: 'Reestablish continuity with small, achievable operations. Streak recovery is primary.',
      priority: 'high',
    })
  }

  if (context.fatigueLevel > 30 && context.fatigueLevel <= 50) {
    actions.push({
      type: 'pacing',
      suggestion: 'Fatigue accumulating. Consider lighter operational load this session.',
      priority: 'medium',
    })
  }

  if (context.weakPillars.length > 1) {
    actions.push({
      type: 'focus',
      suggestion: `Diversify workload. Address neglected areas: ${context.weakPillars.join(', ')}`,
      priority: 'medium',
    })
  }

  if (memory.unfinishedMissionChains.length > 3) {
    actions.push({
      type: 'consolidation',
      suggestion: `${memory.unfinishedMissionChains.length} unresolved chains. Resolve pending operations before initiating new ones.`,
      priority: 'low',
    })
  }

  if (context.daysBehindRoadmap > 7 && context.rhythmState !== 'overload') {
    actions.push({
      type: 'focus',
      suggestion: 'Roadmap drift detected. Align task selection with current roadmap phase.',
      priority: 'medium',
    })
  }

  return actions.sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 }
    return order[a.priority] - order[b.priority]
  })
}

export function computeChainsFromMemory(
  tasks: any[],
  chainTitles: string[]
): MissionChain[] {
  const now = Date.now()
  const chains: MissionChain[] = []

  for (const title of chainTitles) {
    const chainTasks = tasks.filter((t: any) => t.title === title)
    if (chainTasks.length === 0) continue
    const done = chainTasks.filter((t: any) => t.status === 'done')
    const active = chainTasks.filter((t: any) => t.status === 'in_progress')
    const todo = chainTasks.filter((t: any) => t.status === 'todo')

    let state: MissionChain['state'] = 'dormant'
    if (done.length === chainTasks.length) state = 'resolved'
    else if (done.length > 0 && active.length === 0 && todo.length === 0) state = 'abandoned'
    else if (active.length > 0 || done.length > 0) state = 'active'

    chains.push({
      id: `memory-chain-${title}-${now}`,
      name: title.substring(0, 60),
      pillar: chainTasks[0].pillar || 'HACK',
      taskIds: chainTasks.map((ct: any) => ct.id),
      completedCount: done.length,
      totalCount: chainTasks.length,
      state,
      createdAt: Math.min(...chainTasks.map((ct: any) => new Date(ct.created_at).getTime())),
    })
  }

  return chains
}

/* ═══════════════════════════════════════════════
   Adaptive Operational Orchestration Layer
   Pacing, Campaign Lifecycle, Drift Correction,
   Continuity Preservation, Recovery Intelligence
   ═══════════════════════════════════════════════ */

export type PacingProfile = 'acceleration' | 'stabilization' | 'consolidation' | 'recovery' | 'maintenance';
export type CampaignStage = 'activation' | 'escalation' | 'sustained' | 'consolidation' | 'archived';

export interface CampaignWithStage extends Campaign {
  stage: CampaignStage;
  maturityScore: number;
  operationalBurden: number;
}

export interface AdaptivePressure {
  missionDensity: number;
  operationalLoad: number;
  recoverySpacing: number;
  focusIntensity: number;
  continuityPressure: number;
}

export interface OperationalCadence {
  interactionCadence: 'rapid' | 'normal' | 'slow' | 'minimal';
  acknowledgmentTiming: number;
  environmentalPacing: 'active' | 'steady' | 'quiet' | 'subdued';
  missionPressure: 'elevated' | 'normal' | 'reduced' | 'minimal';
  operationalSilence: boolean;
}

export interface DriftIndicator {
  type: 'roadmap_drift' | 'campaign_neglect' | 'pacing_instability' | 'overload_accumulation' | 'continuity_collapse';
  severity: number;
  detected: boolean;
  correction: string;
}

export interface ContinuityPreservation {
  dormantChains: { name: string; pillar: string; monthsSinceLastActivity: number; priority: number }[];
  unresolvedCampaigns: { name: string; completionRatio: number; priority: number }[];
  preservedContextCount: number;
}

export interface PacingTransition {
  from: PacingProfile;
  to: PacingProfile;
  timestamp: number;
  reason: string;
}

export interface StrategicMemory {
  pacingHistory: PacingTransition[];
  campaignCompletions: string[];
  campaignAbandonments: { campaignId: string; completionRatio: number }[];
  overloadCycleCount: number;
  effectiveRecoveryCount: number;
  sustainableExecutionDays: number;
}

export interface OrchestrationContext {
  pacingProfile: PacingProfile;
  pacingTransitions: PacingTransition[];
  campaignStages: CampaignWithStage[];
  adaptivePressure: AdaptivePressure;
  cadence: OperationalCadence;
  driftIndicators: DriftIndicator[];
  continuityPreservation: ContinuityPreservation;
  strategicMemory: StrategicMemory;
  recoveryIntelligence: RecoveryAction[];
  evolution?: SystemEvolutionContext;
}

export function computePacingProfile(
  context: OperationalContext,
  memory: OperationalMemory
): { profile: PacingProfile; reason: string } {
  const overloadFatigue = context.rhythmState === 'overload' || context.fatigueLevel > 60;
  const stagnant = context.rhythmState === 'stagnation' || (context.streakStatus === 'cold' && context.momentumScore < 30);
  const highMomentum = context.rhythmState === 'momentum' && context.backlogPressure < 30 && context.fatigueLevel < 30;
  const highPressure = context.operationalPressure === 'critical' || context.backlogPressure > 60;
  const driftAccumulated = context.daysBehindRoadmap > 7;
  const fatigueGrowing = context.fatigueLevel > 30 && context.fatigueLevel <= 60;

  if (overloadFatigue) return { profile: 'recovery', reason: 'Overload or fatigue detected — entering recovery pacing' };
  if (stagnant && driftAccumulated) return { profile: 'consolidation', reason: 'Stagnation with drift — consolidation required' };
  if (highMomentum) return { profile: 'acceleration', reason: 'Strong momentum with low friction — acceleration viable' };
  if (stagnant) return { profile: 'consolidation', reason: 'Operational stagnation — consolidating before expansion' };
  if (highPressure) return { profile: 'stabilization', reason: 'Elevated pressure — stabilizing operational load' };
  if (driftAccumulated) return { profile: 'stabilization', reason: 'Roadmap drift accumulating — stabilization needed' };
  if (fatigueGrowing) return { profile: 'maintenance', reason: 'Moderate fatigue — maintaining sustainable pace' };

  return { profile: 'maintenance', reason: 'Balanced operational state — maintaining current rhythm' };
}

export function computeCampaignStages(
  campaigns: Campaign[],
  context: OperationalContext,
  memory: OperationalMemory
): CampaignWithStage[] {
  const now = Date.now();

  return campaigns.map(c => {
    const ratio = c.taskCount > 0 ? c.completedCount / c.taskCount : 0;

    let stage: CampaignStage;
    if (ratio === 1 || c.completedCount === c.taskCount) stage = 'archived';
    else if (ratio > 0.66) stage = 'consolidation';
    else if (ratio > 0.33) stage = 'sustained';
    else if (ratio > 0) stage = 'escalation';
    else stage = 'activation';

    const maturityScore = Math.round(ratio * 100);

    const chainOverlap = context.missionChains
      ? context.missionChains.filter(ch => ch.pillar === c.pillar && ch.state !== 'resolved').length
      : 0;
    const pressureFactor = context.operationalPressure === 'critical' ? 30 : context.operationalPressure === 'high' ? 20 : 10;
    const chainBurden = chainOverlap * 15;
    const fatigueBurden = Math.round(context.fatigueLevel * 0.3);
    const backlogBurden = Math.round(context.backlogPressure * 0.2);
    const operationalBurden = Math.min(100, pressureFactor + chainBurden + fatigueBurden + backlogBurden);

    return { ...c, stage, maturityScore, operationalBurden };
  });
}

export function computeAdaptivePressure(
  context: OperationalContext,
  chains: MissionChain[],
  campaigns: CampaignWithStage[],
  pacing: PacingProfile
): AdaptivePressure {
  const activeChains = chains.filter(c => c.state === 'active').length;
  const activeCampaigns = campaigns.filter(c => c.stage !== 'archived' && c.stage !== 'activation').length;
  const chainCompletionAvg = chains.length > 0
    ? chains.reduce((s, c) => s + (c.totalCount > 0 ? c.completedCount / c.totalCount : 0), 0) / chains.length
    : 0;
  const campaignCompletionAvg = campaigns.length > 0
    ? campaigns.reduce((s, c) => s + (c.taskCount > 0 ? c.completedCount / c.taskCount : 0), 0) / campaigns.length
    : 0;

  const missionDensity = Math.min(100, Math.round(
    (context.missionLoad * 0.3) + (activeChains * 12) + (activeCampaigns * 8)
  ));

  const operationalLoad = Math.min(100, Math.round(
    context.backlogPressure * 0.4 + context.fatigueLevel * 0.3 + context.missionLoad * 0.3
  ));

  const baseRecoverySpacing = context.rhythmState === 'recovery' ? 70 : context.fatigueLevel > 50 ? 60 : context.fatigueLevel > 30 ? 45 : 30;
  const pacingRecoveryAdj = pacing === 'recovery' ? 20 : pacing === 'consolidation' ? 10 : pacing === 'acceleration' ? -10 : 0;
  const recoverySpacing = Math.max(10, Math.min(100, baseRecoverySpacing + pacingRecoveryAdj));

  const focusIntensity = Math.min(100, Math.round(
    (context.momentumScore * 0.5) + (chainCompletionAvg * 30) + (pacing === 'acceleration' ? 15 : pacing === 'recovery' ? -15 : 0)
  ));

  const continuityPressure = Math.min(100, Math.round(
    ((context.daysBehindRoadmap > 0 ? Math.min(context.daysBehindRoadmap * 5, 50) : 0) +
    (context.streakStatus === 'cold' ? 25 : context.streakStatus === 'building' ? 10 : 0) +
    (activeChains > 2 ? 15 : 0) +
    (campaignCompletionAvg < 0.3 ? 15 : 0)) *
    (pacing === 'recovery' ? 0.5 : 1)
  ));

  return { missionDensity, operationalLoad, recoverySpacing, focusIntensity, continuityPressure };
}

export function computeOperationalCadence(
  pacing: PacingProfile,
  pressure: AdaptivePressure,
  context: OperationalContext
): OperationalCadence {
  const highPressure = pressure.operationalLoad > 60 || pressure.missionDensity > 60;
  const lowPressure = pressure.operationalLoad < 25 && pressure.missionDensity < 25;
  const fatigueModerate = context.fatigueLevel > 40;
  const fatigueHigh = context.fatigueLevel > 65;

  let interactionCadence: OperationalCadence['interactionCadence'];
  let environmentalPacing: OperationalCadence['environmentalPacing'];
  let missionPressure: OperationalCadence['missionPressure'];
  let operationalSilence: boolean;
  let acknowledgmentTiming: number;

  if (pacing === 'recovery' || fatigueHigh) {
    interactionCadence = 'minimal';
    environmentalPacing = 'subdued';
    missionPressure = 'minimal';
    operationalSilence = true;
    acknowledgmentTiming = 500;
  } else if (pacing === 'consolidation' || fatigueModerate) {
    interactionCadence = 'slow';
    environmentalPacing = 'quiet';
    missionPressure = 'reduced';
    operationalSilence = true;
    acknowledgmentTiming = 2500;
  } else if (pacing === 'stabilization' || highPressure) {
    interactionCadence = 'normal';
    environmentalPacing = 'steady';
    missionPressure = 'elevated';
    operationalSilence = false;
    acknowledgmentTiming = 3500;
  } else if (pacing === 'acceleration' && !lowPressure) {
    interactionCadence = 'rapid';
    environmentalPacing = 'active';
    missionPressure = 'elevated';
    operationalSilence = false;
    acknowledgmentTiming = 1500;
  } else {
    interactionCadence = 'normal';
    environmentalPacing = 'steady';
    missionPressure = 'normal';
    operationalSilence = lowPressure && !fatigueModerate;
    acknowledgmentTiming = 2500;
  }

  return { interactionCadence, acknowledgmentTiming, environmentalPacing, missionPressure, operationalSilence };
}

export function computeDriftIndicators(
  context: OperationalContext,
  campaigns: CampaignWithStage[],
  chains: MissionChain[],
  operationalMemory: OperationalMemory
): DriftIndicator[] {
  const indicators: DriftIndicator[] = [];

  const roadmapDrift: DriftIndicator = {
    type: 'roadmap_drift',
    severity: Math.min(100, context.daysBehindRoadmap * 5 + (context.rhythmState === 'stagnation' ? 20 : 0)),
    detected: context.daysBehindRoadmap > 3,
    correction: context.daysBehindRoadmap > 7
      ? 'Align task selection with current roadmap phase. Prioritize roadmap-critical operations.'
      : 'Monitor roadmap alignment. Minor deviation detected.',
  };
  indicators.push(roadmapDrift);

  const neglectedCampaigns = campaigns.filter(c =>
    c.taskCount > 0 && c.completedCount === 0 && c.stage !== 'archived'
  );
  const campaignNeglect: DriftIndicator = {
    type: 'campaign_neglect',
    severity: Math.min(100, neglectedCampaigns.length * 20),
    detected: neglectedCampaigns.length > 0,
    correction: neglectedCampaigns.length > 0
      ? `Initiate work in neglected campaigns: ${neglectedCampaigns.slice(0, 2).map(c => c.name).join(', ')}`
      : '',
  };
  indicators.push(campaignNeglect);

  const overloadHistory = operationalMemory.backlogEscalation > 60 ? 1 : 0;
  const fatigueIndication = context.fatigueLevel > 50 ? 1 : 0;
  const driftHistory = operationalMemory.roadmapDriftHistory > 14 ? 1 : 0;
  const pacingInstabilityCount = overloadHistory + fatigueIndication + driftHistory;
  const pacingInstability: DriftIndicator = {
    type: 'pacing_instability',
    severity: Math.min(100, pacingInstabilityCount * 30),
    detected: pacingInstabilityCount >= 2,
    correction: pacingInstabilityCount >= 2
      ? 'Pacing instability detected. Reduce concurrent operations and stabilize cadence.'
      : '',
  };
  indicators.push(pacingInstability);

  const overloadAccumulation: DriftIndicator = {
    type: 'overload_accumulation',
    severity: Math.min(100, (context.backlogPressure * 0.5 + context.fatigueLevel * 0.3 + (context.operationalPressure === 'critical' ? 30 : context.operationalPressure === 'high' ? 15 : 0))),
    detected: context.backlogPressure > 50 && context.fatigueLevel > 30,
    correction: context.backlogPressure > 60
      ? 'Overload accumulating. Reduce intake. Focus on clearing backlog before new operations.'
      : 'Monitor load. Partial offloading recommended.',
  };
  indicators.push(overloadAccumulation);

  const activeChains = chains.filter(c => c.state === 'active').length;
  const chainInterruption = context.streakStatus === 'cold' && activeChains > 1;
  const continuityCollapse: DriftIndicator = {
    type: 'continuity_collapse',
    severity: chainInterruption ? 70 : context.streakStatus === 'cold' ? 40 : context.streakStatus === 'building' ? 15 : 0,
    detected: chainInterruption || context.streakStatus === 'cold',
    correction: chainInterruption
      ? 'Streak collapsed with active chains. Recover continuity before resuming chain operations.'
      : context.streakStatus === 'cold'
        ? 'Continuity cold. Prioritize streak recovery to preserve operational context.'
        : '',
  };
  indicators.push(continuityCollapse);

  return indicators;
}

export function computeContinuityPreservation(
  chains: MissionChain[],
  campaigns: CampaignWithStage[],
  context: OperationalContext
): ContinuityPreservation {
  const dormantChains = chains
    .filter(c => c.state === 'dormant' || c.state === 'abandoned')
    .map(c => {
      const monthsSinceLastActivity = Math.max(1, Math.round(
        (Date.now() - c.createdAt) / (30 * 24 * 60 * 60 * 1000)
      ));
      const completionRatio = c.totalCount > 0 ? c.completedCount / c.totalCount : 0;
      const priority = completionRatio > 0.5 ? 3 : completionRatio > 0.25 ? 2 : 1;
      return { name: c.name, pillar: c.pillar, monthsSinceLastActivity, priority };
    })
    .sort((a, b) => b.priority - a.priority);

  const unresolvedCampaigns = campaigns
    .filter(c => c.taskCount > 0 && c.completedCount < c.taskCount && c.stage !== 'archived')
    .map(c => {
      const ratio = c.taskCount > 0 ? c.completedCount / c.taskCount : 0;
      const priority = ratio > 0.5 ? 2 : ratio > 0.25 ? 3 : 1;
      return { name: c.name, completionRatio: Math.round(ratio * 100), priority };
    })
    .sort((a, b) => b.priority - a.priority);

  return {
    dormantChains,
    unresolvedCampaigns,
    preservedContextCount: dormantChains.length + unresolvedCampaigns.length,
  };
}

export function computeRecoveryIntelligence(
  context: OperationalContext,
  chains: MissionChain[],
  campaigns: CampaignWithStage[],
  pacing: PacingProfile
): RecoveryAction[] {
  const actions: RecoveryAction[] = [];

  if (pacing === 'recovery' || context.fatigueLevel > 50) {
    const activeCount = chains.filter(c => c.state === 'active').length;
    if (activeCount > 2) {
      actions.push({
        type: 'reduction',
        suggestion: `Structured recovery: reduce active chains from ${activeCount} to 1-2. Focus on completion, not initiation.`,
        priority: 'high',
      });
    }
    const nearCompleteChains = chains.filter(c => c.state === 'active' && c.totalCount > 0 && (c.completedCount / c.totalCount) > 0.6);
    if (nearCompleteChains.length > 0) {
      actions.push({
        type: 'consolidation',
        suggestion: `Close near-complete chains first: ${nearCompleteChains.slice(0, 2).map(c => c.name.substring(0, 20)).join(', ')}`,
        priority: 'high',
      });
    }
    actions.push({
      type: 'stabilization',
      suggestion: 'Low-friction phase: small achievable operations. Avoid new campaign initiations.',
      priority: 'medium',
    });
  }

  if (pacing === 'consolidation') {
    const neglectedCampaigns = campaigns.filter(c => c.maturityScore < 30 && c.taskCount > 0);
    actions.push({
      type: 'focus',
      suggestion: `Campaign consolidation: address ${neglectedCampaigns.length} underdeveloped campaign${neglectedCampaigns.length > 1 ? 's' : ''} before expanding scope.`,
      priority: 'medium',
    });
  }

  if (pacing === 'acceleration') {
    actions.push({
      type: 'pacing',
      suggestion: 'Acceleration window open. Prioritize high-XP missions to capitalize on momentum.',
      priority: 'medium',
    });
  }

  return actions;
}

export function accumulateStrategicMemory(
  previousMemory: OperationalMemory,
  pacing: PacingProfile,
  previousPacingProfile: PacingProfile | null,
  campaigns: CampaignWithStage[],
  context: OperationalContext
): StrategicMemory {
  const pacingHistory: PacingTransition[] = previousMemory.pacingTransitions
    ? [...previousMemory.pacingTransitions]
    : [];

  if (previousPacingProfile && previousPacingProfile !== pacing) {
    pacingHistory.push({
      from: previousPacingProfile,
      to: pacing,
      timestamp: Date.now(),
      reason: `Pacing shift: ${context.rhythmState} / fatigue ${context.fatigueLevel} / backlog ${context.backlogPressure}`,
    });
  }

  const campaignCompletions: string[] = previousMemory.campaignCompletions
    ? [...previousMemory.campaignCompletions]
    : [];
  for (const c of campaigns) {
    if (c.stage === 'archived' && !campaignCompletions.includes(c.id)) {
      campaignCompletions.push(c.id);
    }
  }

  const campaignAbandonments: { campaignId: string; completionRatio: number }[] =
    previousMemory.campaignAbandonments ? [...previousMemory.campaignAbandonments] : [];

  const overloadCycleCount = (previousMemory.overloadCycleCount || 0) +
    (context.rhythmState === 'overload' ? 1 : 0);

  const effectiveRecoveryCount = (previousMemory.effectiveRecoveryCount || 0) +
    (context.rhythmState === 'momentum' && previousMemory.recoveryPeriods > 0 ? 1 : 0);

  const sustainableExecutionDays = (previousMemory.sustainableExecutionDays || 0) +
    (context.fatigueLevel < 25 && context.rhythmState !== 'overload' && context.rhythmState !== 'stagnation' ? 1 : 0);

  return {
    pacingHistory,
    campaignCompletions,
    campaignAbandonments,
    overloadCycleCount,
    effectiveRecoveryCount,
    sustainableExecutionDays,
  };
}

/* ═══════════════════════════════════════════════
   Historical Persistence & System Evolution
   Temperament, Maturity, Scar Tissue, Cadence
   ═══════════════════════════════════════════════ */

export type OperationalTemperament =
  | 'momentum_oriented'
  | 'recovery_oriented'
  | 'stabilization_focused'
  | 'consolidation_oriented'
  | 'adaptive';

export type EnvironmentalMaturityLevel = 'nascent' | 'developing' | 'established' | 'mature' | 'seasoned';

export interface TemperamentProfile {
  temperament: OperationalTemperament;
  confidence: number;
}

export interface EnvironmentalMaturityProfile {
  level: EnvironmentalMaturityLevel;
  maturityIndex: number;
  atmosphericDensity: number;
  temporalCompression: number;
}

export interface ScarTissueProfile {
  overloadSensitivity: number;
  driftSensitivity: number;
  abandonmentSensitivity: number;
  continuitySensitivity: number;
  isHardened: boolean;
}

export interface CampaignHistoricalSignificance {
  campaignId: string;
  completed: boolean;
  completionRatio: number;
  significance: number;
  archivalDate: number | null;
  influenceWeight: number;
}

export interface LongTermCadenceModifiers {
  baselineAcknowledgmentShift: number;
  silenceProbability: number;
  densityCompression: number;
  pacingStability: number;
}

export interface SystemEvolutionContext {
  temperament: TemperamentProfile;
  environment: EnvironmentalMaturityProfile;
  scarTissue: ScarTissueProfile;
  campaignHistory: CampaignHistoricalSignificance[];
  cadenceModifiers: LongTermCadenceModifiers;
  operationalResidue: number;
}

export function computeOperationalTemperament(
  distribution: Record<string, number>,
  totalCycles: number,
  recentTransitions: PacingTransition[]
): TemperamentProfile {
  const entries = Object.entries(distribution);
  if (entries.length === 0) {
    return { temperament: 'adaptive', confidence: 30 };
  }

  const total = entries.reduce((s, [, v]) => s + v, 0);
  if (total === 0) return { temperament: 'adaptive', confidence: 30 };

  const sorted = entries.sort(([, a], [, b]) => b - a);
  const dominant = sorted[0][0] as PacingProfile;
  const dominantShare = sorted[0][1] / total;
  const secondShare = sorted.length > 1 ? sorted[1][1] / total : 0;
  const dominanceMargin = dominantShare - secondShare;

  const recentWindow = recentTransitions.slice(-8);
  const recentMomentum = recentWindow.filter(t => t.to === 'acceleration').length;
  const recentRecovery = recentWindow.filter(t => t.to === 'recovery').length;
  const recentStabilization = recentWindow.filter(t => t.to === 'stabilization').length;
  const recentConsolidation = recentWindow.filter(t => t.to === 'consolidation').length;

  let temperament: OperationalTemperament;
  let confidence: number;

  if (dominantShare > 0.5 && dominanceMargin > 0.2) {
    confidence = Math.min(85, 50 + Math.round(dominantShare * 50));
    temperament = dominant as OperationalTemperament;
  } else if (recentMomentum >= 4 && recentRecovery < 2) {
    temperament = 'momentum_oriented';
    confidence = 60 + Math.round(recentMomentum * 5);
  } else if (recentRecovery >= 3 && recentStabilization >= 2) {
    temperament = 'recovery_oriented';
    confidence = 55 + Math.round(recentRecovery * 8);
  } else if (recentConsolidation >= 3) {
    temperament = 'consolidation_oriented';
    confidence = 55 + Math.round(recentConsolidation * 8);
  } else if (recentStabilization >= recentMomentum) {
    temperament = 'stabilization_focused';
    confidence = 50 + Math.round(recentStabilization * 10);
  } else if (dominantShare > 0.3) {
    temperament = dominant as OperationalTemperament;
    confidence = 45 + Math.round(dominantShare * 30);
  } else {
    temperament = 'adaptive';
    confidence = 40 + Math.round(dominanceMargin * 30);
  }

  return { temperament, confidence: Math.min(95, Math.max(20, confidence)) };
}

export function computeEnvironmentalMaturity(
  firstOperationTimestamp: number | null,
  totalCycles: number,
  totalChains: number,
  resolvedChains: number,
  archivedCampaigns: number,
  operationalMemory: OperationalMemory
): EnvironmentalMaturityProfile {
  const ageDays = firstOperationTimestamp
    ? Math.floor((Date.now() - firstOperationTimestamp) / (24 * 60 * 60 * 1000))
    : 0;

  const cycleScale = Math.min(totalCycles * 5, 30);
  const chainScale = Math.min(totalChains * 3, 20);
  const resolutionScale = Math.min(resolvedChains * 5, 20);
  const campaignScale = Math.min(archivedCampaigns * 10, 30);
  const maturityIndex = Math.min(100, ageDays + cycleScale + chainScale + resolutionScale + campaignScale);

  let level: EnvironmentalMaturityLevel;
  if (maturityIndex < 15) level = 'nascent';
  else if (maturityIndex < 35) level = 'developing';
  else if (maturityIndex < 55) level = 'established';
  else if (maturityIndex < 80) level = 'mature';
  else level = 'seasoned';

  const densityDays = Math.min(ageDays * 0.3, 20);
  const densityOps = Math.min(totalCycles * 2, 15);
  const densityChains = Math.min(totalChains * 1.5, 15);
  const densityCampaigns = Math.min(archivedCampaigns * 5, 15);
  const atmosphericDensity = Math.min(100, densityDays + densityOps + densityChains + densityCampaigns);

  const temporalCompression = Math.min(100,
    (operationalMemory.backlogEscalation || 0) * 0.2 +
    (operationalMemory.roadmapDriftHistory || 0) * 0.3 +
    (operationalMemory.overloadCycleCount || 0) * 3 +
    densityOps * 0.5
  );

  return { level, maturityIndex, atmosphericDensity, temporalCompression };
}

export function computeScarTissue(
  overloadCycleCount: number,
  totalDays: number,
  driftHistory: number,
  abandonedChains: number,
  totalChains: number,
  coldStreakFrequency: number
): ScarTissueProfile {
  const normalizedAge = Math.max(1, totalDays);

  const overloadSensitivity = Math.min(100, Math.round(
    (overloadCycleCount / normalizedAge) * 200
  ));

  const driftSensitivity = Math.min(100, Math.round(
    (driftHistory / normalizedAge) * 50
  ));

  const abandonmentSensitivity = totalChains > 0
    ? Math.min(100, Math.round((abandonedChains / totalChains) * 100))
    : 0;

  const continuitySensitivity = Math.min(100, Math.round(
    coldStreakFrequency * 20
  ));

  const sensitivitySum = overloadSensitivity + driftSensitivity + abandonmentSensitivity + continuitySensitivity;
  const isHardened = sensitivitySum > 140 || overloadSensitivity > 60 || driftSensitivity > 50;

  return {
    overloadSensitivity,
    driftSensitivity,
    abandonmentSensitivity,
    continuitySensitivity,
    isHardened,
  };
}

export function computeCampaignHistoricalSignificance(
  campaigns: Campaign[],
  campaignCompletions: string[],
  campaignAbandonments: { campaignId: string; completionRatio: number }[]
): CampaignHistoricalSignificance[] {
  const history: CampaignHistoricalSignificance[] = [];
  const now = Date.now();

  for (const c of campaigns) {
    const completed = campaignCompletions.includes(c.id);
    const abandoned = campaignAbandonments.find(a => a.campaignId === c.id);
    const completionRatio = completed ? 1 : abandoned ? abandoned.completionRatio : c.taskCount > 0 ? c.completedCount / c.taskCount : 0;

    if (!completed && !abandoned && completionRatio === 0) continue;

    const completionBonus = completionRatio * 40;
    const taskWeight = Math.min(c.taskCount * 2, 20);
    const campaignAge = now - (c.months[0] * 30 * 24 * 60 * 60 * 1000);
    const archivalBonus = completed ? 15 : 0;
    const significance = Math.min(100, Math.round(completionBonus + taskWeight + archivalBonus));

    const influenceWeight = completed
      ? Math.round(completionRatio * 60 - 20)
      : Math.round(completionRatio * 30 - 10);

    history.push({
      campaignId: c.id,
      completed,
      completionRatio,
      significance,
      archivalDate: completed ? now : null,
      influenceWeight,
    });
  }

  return history.sort((a, b) => b.significance - a.significance);
}

export function computeLongTermCadenceModifiers(
  maturity: EnvironmentalMaturityProfile,
  scarTissue: ScarTissueProfile,
  temperament: TemperamentProfile
): LongTermCadenceModifiers {
  const maturitySlowing = Math.round(maturity.maturityIndex * 15);
  const scarTissueDensification = Math.round((scarTissue.overloadSensitivity + scarTissue.driftSensitivity) * 0.8);
  const densityCompression = Math.min(100, maturity.atmosphericDensity + scarTissueDensification);

  const baselineAcknowledgmentShift = Math.min(2000, maturitySlowing + (temperament.temperament === 'recovery_oriented' ? 300 : temperament.temperament === 'momentum_oriented' ? -200 : 0));

  const temperamentSilence = temperament.temperament === 'consolidation_oriented' ? 0.15 : temperament.temperament === 'adaptive' ? 0.05 : 0;
  const maturitySilence = maturity.maturityIndex * 0.002;
  const silenceProbability = Math.min(0.5, temperamentSilence + maturitySilence);

  const stabilityBase = temperament.temperament === 'stabilization_focused' ? 25 : 15;
  const stabilityMaturity = maturity.maturityIndex * 0.3;
  const stabilityScarPenalty = scarTissue.isHardened ? -10 : 0;
  const pacingStability = Math.max(10, Math.min(95, stabilityBase + stabilityMaturity + stabilityScarPenalty));

  return {
    baselineAcknowledgmentShift,
    silenceProbability,
    densityCompression,
    pacingStability,
  };
}

export function computeOperationalResidue(
  memory: OperationalMemory,
  chains: MissionChain[],
  temperament: TemperamentProfile
): number {
  const resolvedRatio = chains.length > 0
    ? chains.filter(c => c.state === 'resolved').length / chains.length
    : 0;

  const campaignCompletionRatio = memory.campaignCompletions.length > 0
    ? Math.min(1, (memory.campaignCompletions.length || 0) / Math.max(1, (memory.campaignCompletions.length || 0) + (memory.campaignAbandonments.length || 0)))
    : 0;

  const residueCompletion = Math.round(resolvedRatio * 25);
  const residueCampaign = Math.round(campaignCompletionRatio * 20);
  const residueCycles = Math.min((memory.operationalCycles || 0) * 3, 20);
  const residueSustain = Math.min((memory.sustainableExecutionDays || 0) * 0.5, 15);
  const temperamentBonus = temperament.temperament === 'momentum_oriented' || temperament.temperament === 'consolidation_oriented' ? 10 : 5;

  return Math.min(100, residueCompletion + residueCampaign + residueCycles + residueSustain + temperamentBonus);
}

export function computeSystemEvolution(
  memory: OperationalMemory,
  context: OperationalContext,
  chains: MissionChain[],
  currentMonth: number
): SystemEvolutionContext {
  const totalAgeDays = memory.firstOperationTimestamp
    ? Math.floor((Date.now() - memory.firstOperationTimestamp) / (24 * 60 * 60 * 1000))
    : 0;

  const temperament = computeOperationalTemperament(
    memory.pacingProfileDistribution || {},
    memory.operationalCycles || 0,
    memory.pacingTransitions || []
  );

  const environment = computeEnvironmentalMaturity(
    memory.firstOperationTimestamp,
    memory.operationalCycles || 0,
    chains.length,
    chains.filter(c => c.state === 'resolved').length,
    (memory.campaignCompletions || []).length,
    memory
  );

  const scarTissue = computeScarTissue(
    memory.overloadCycleCount || 0,
    totalAgeDays,
    memory.roadmapDriftHistory || 0,
    chains.filter(c => c.state === 'abandoned').length,
    chains.length,
    context.streakStatus === 'cold' ? 3 : context.streakStatus === 'building' ? 1 : 0
  );

  const campaigns = context.campaigns || [];
  const campaignHistory = computeCampaignHistoricalSignificance(
    campaigns,
    memory.campaignCompletions || [],
    memory.campaignAbandonments || []
  );

  const cadenceModifiers = computeLongTermCadenceModifiers(environment, scarTissue, temperament);

  const operationalResidue = computeOperationalResidue(memory, chains, temperament);

  return {
    temperament,
    environment,
    scarTissue,
    campaignHistory,
    cadenceModifiers,
    operationalResidue,
  };
}

/* ═══════════════════════════════════════════════
   Real-World Operational Integration
   Evidence Chains, Platform Linking, Residue
   ═══════════════════════════════════════════════ */

export type EvidenceType =
  | 'recon'
  | 'finding'
  | 'exploit_attempt'
  | 'writeup_fragment'
  | 'terminal_discovery'
  | 'observation'
  | 'research_trace';

export interface OperationEvidence {
  id: string;
  type: EvidenceType;
  title: string;
  description: string;
  source: 'task' | 'ctf' | 'log';
  sourceId: string;
  platform?: string;
  technique?: string;
  tool?: string;
  timestamp: number;
  resolved: boolean;
  xpValue: number;
}

export interface EvidenceChain {
  evidences: OperationEvidence[];
  subject: string;
  platform?: string;
  technique?: string;
  status: 'active' | 'dormant' | 'resolved';
}

export interface PlatformReference {
  platform: string;
  identifier: string;
  lastActive: number;
  entryCount: number;
  lastOutcome: string;
}

export interface ResearchPattern {
  toolOrTechnique: string;
  type: 'tool' | 'technique';
  frequency: number;
  lastUsed: number;
  contexts: string[];
  effectiveness: number;
}

export interface InvestigativeMemoryContent {
  unresolvedFindings: { subject: string; source: string; platform?: string; staleDays: number; priority: number }[];
  abandonedPaths: { subject: string; evidenceCount: number; context: string }[];
  recurringTargets: { target: string; frequency: number; lastEncountered: number }[];
  researchDrift: string[];
}

export function computeOperationEvidence(
  tasks: any[],
  ctfs: any[],
  logs: any[]
): OperationEvidence[] {
  const evidence: OperationEvidence[] = [];
  const now = Date.now();

  for (const t of tasks) {
    if (t.status === 'done') {
      evidence.push({
        id: `ev-task-${t.id}`,
        type: 'observation',
        title: t.title?.substring(0, 60) || 'Untitled',
        description: t.description || '',
        source: 'task',
        sourceId: t.id,
        platform: t.pillar,
        technique: t.category,
        timestamp: new Date(t.completed_at || t.created_at).getTime(),
        resolved: true,
        xpValue: t.xp_value || 0,
      });
    }
    if (t.status === 'in_progress') {
      evidence.push({
        id: `ev-task-${t.id}-active`,
        type: 'recon',
        title: t.title?.substring(0, 60) || 'Untitled',
        description: t.description || '',
        source: 'task',
        sourceId: t.id,
        platform: t.pillar,
        technique: t.category,
        timestamp: new Date(t.created_at).getTime(),
        resolved: false,
        xpValue: 0,
      });
    }
  }

  for (const c of ctfs) {
    evidence.push({
      id: `ev-ctf-${c.id}`,
      type: c.solved ? 'writeup_fragment' : 'exploit_attempt',
      title: c.name || 'Untitled challenge',
      description: c.flag_notes || '',
      source: 'ctf',
      sourceId: c.id,
      platform: c.platform,
      technique: c.category,
      timestamp: new Date(c.date || now).getTime(),
      resolved: c.solved,
      xpValue: c.xp_earned || 0,
    });
  }

  for (const l of logs) {
    evidence.push({
      id: `ev-log-${l.id}`,
      type: 'observation',
      title: (l.content?.substring(0, 60) || 'Untitled').trim(),
      description: l.content || '',
      source: 'log',
      sourceId: l.id,
      platform: l.pillar,
      timestamp: new Date(l.date || now).getTime(),
      resolved: l.is_win || false,
      xpValue: 0,
    });
  }

  return evidence.sort((a, b) => b.timestamp - a.timestamp);
}

export function computePlatformReferences(
  ctfs: any[],
  tasks: any[]
): PlatformReference[] {
  const platformMap = new Map<string, PlatformReference>();

  for (const c of ctfs) {
    const key = c.platform || 'Other';
    const existing = platformMap.get(key);
    const ts = new Date(c.date || Date.now()).getTime();
    if (existing) {
      existing.entryCount++;
      if (ts > existing.lastActive) {
        existing.lastActive = ts;
        existing.lastOutcome = c.solved ? 'solved' : 'attempted';
      }
    } else {
      platformMap.set(key, {
        platform: key,
        identifier: c.name || c.platform || '',
        lastActive: ts,
        entryCount: 1,
        lastOutcome: c.solved ? 'solved' : 'attempted',
      });
    }
  }

  return Array.from(platformMap.values()).sort((a, b) => b.entryCount - a.entryCount);
}

export function computeResearchPatterns(
  evidence: OperationEvidence[],
  memory: OperationalMemory
): ResearchPattern[] {
  const patternMap = new Map<string, ResearchPattern>();

  for (const ev of evidence) {
    if (ev.technique) {
      const key = `tech:${ev.technique}`;
      const existing = patternMap.get(key);
      if (existing) {
        existing.frequency++;
        if (ev.timestamp > existing.lastUsed) existing.lastUsed = ev.timestamp;
        if (!existing.contexts.includes(ev.platform || '')) existing.contexts.push(ev.platform || '');
        existing.effectiveness = Math.round(
          (existing.effectiveness * (existing.frequency - 1) + (ev.resolved ? 100 : 0)) / existing.frequency
        );
      } else {
        patternMap.set(key, {
          toolOrTechnique: ev.technique,
          type: 'technique',
          frequency: 1,
          lastUsed: ev.timestamp,
          contexts: ev.platform ? [ev.platform] : [],
          effectiveness: ev.resolved ? 100 : 0,
        });
      }
    }
  }

  for (const [tool, count] of Object.entries(memory.toolUsageHistory || {})) {
    const key = `tool:${tool}`;
    const existing = patternMap.get(key);
    if (existing) {
      existing.frequency += count;
    } else {
      patternMap.set(key, {
        toolOrTechnique: tool,
        type: 'tool',
        frequency: count,
        lastUsed: Date.now(),
        contexts: [],
        effectiveness: 50,
      });
    }
  }

  return Array.from(patternMap.values())
    .filter(p => p.frequency > 0)
    .sort((a, b) => b.frequency - a.frequency);
}

export function computeInvestigativeMemoryContent(
  evidence: OperationEvidence[],
  tasks: any[],
  memory: OperationalMemory
): InvestigativeMemoryContent {
  const now = Date.now();
  const oneWeekMs = 7 * 24 * 60 * 60 * 1000;

  const unresolved = evidence
    .filter(e => !e.resolved && e.type !== 'observation')
    .map(e => ({
      subject: e.title,
      source: e.source,
      platform: e.platform,
      staleDays: Math.floor((now - e.timestamp) / (24 * 60 * 60 * 1000)),
      priority: Math.min(5, Math.floor((now - e.timestamp) / oneWeekMs) + 1),
    }))
    .filter(u => u.staleDays > 0)
    .sort((a, b) => b.priority - a.priority);

  const abandoned = tasks
    .filter(t => t.status === 'done' && t.completed_at)
    .slice(0, 10)
    .reduce((acc, t) => {
      const existingTasks = tasks.filter(ot => ot.source_template === t.source_template && ot.status !== 'done');
      if (existingTasks.length > 0) {
        acc.push({
          subject: t.title?.substring(0, 60) || '',
          evidenceCount: existingTasks.length,
          context: t.category || 'general',
        });
      }
      return acc;
    }, [] as { subject: string; evidenceCount: number; context: string }[]);

  const targetFreq = new Map<string, number>();
  const targetLast = new Map<string, number>();
  for (const ev of evidence) {
    const key = ev.platform || 'unknown';
    targetFreq.set(key, (targetFreq.get(key) || 0) + 1);
    targetLast.set(key, Math.max(targetLast.get(key) || 0, ev.timestamp));
  }
  const recurring = Array.from(targetFreq.entries())
    .filter(([, f]) => f > 1)
    .map(([target, frequency]) => ({
      target,
      frequency,
      lastEncountered: targetLast.get(target) || 0,
    }))
    .sort((a, b) => b.frequency - a.frequency);

  const researchDrift = memory.unresolvedFindings
    ? memory.unresolvedFindings.slice(0, 3)
    : [];

  return { unresolvedFindings: unresolved.slice(0, 8), abandonedPaths: abandoned.slice(0, 5), recurringTargets: recurring.slice(0, 5), researchDrift };
}

/* ═══════════════════════════════════════════════
   Operational Knowledge Crystallization
   References, Doctrines, Specialization, Residue
   ═══════════════════════════════════════════════ */

export interface CrystallizedReference {
  id: string;
  type: 'path' | 'methodology' | 'sequence' | 'workflow' | 'pattern';
  title: string;
  description: string;
  weight: number;
  recurrence: number;
  successRate: number;
  relatedCampaigns: string[];
  relatedPlatforms: string[];
  lastRelevant: number;
  maturity: 'emerging' | 'established' | 'seasoned';
}

export interface OperationalDoctrine {
  id: string;
  approach: string;
  category: string;
  frequency: number;
  effectiveness: number;
  confidence: number;
  recentTransitions: number;
}

export interface TechniqueSpecialization {
  technique: string;
  type: 'tool' | 'technique' | 'methodology';
  mastery: number;
  usageCount: number;
  successCount: number;
  contexts: string[];
  trend: 'growing' | 'stable' | 'declining';
}

export interface KnowledgeResidue {
  heuristics: { observation: string; weight: number; source: string }[];
  methodologyResidue: { pattern: string; recurrence: number; confidence: number }[];
  exploitPathReferences: CrystallizedReference[];
  strategicReferences: CrystallizedReference[];
}

export interface KnowledgeCrystallization {
  references: CrystallizedReference[];
  doctrines: OperationalDoctrine[];
  specializations: TechniqueSpecialization[];
  residue: KnowledgeResidue;
  crystallizationIndex: number;
}

export function computeCrystallizedReferences(
  evidence: OperationEvidence[],
  patterns: ResearchPattern[],
  campaigns: CampaignWithStage[]
): CrystallizedReference[] {
  const refs: CrystallizedReference[] = [];
  const now = Date.now();

  const techniqueEvidence = new Map<string, OperationEvidence[]>();
  const platformTechnique = new Map<string, OperationEvidence[]>();

  for (const ev of evidence) {
    if (ev.technique) {
      const existing = techniqueEvidence.get(ev.technique) || [];
      existing.push(ev);
      techniqueEvidence.set(ev.technique, existing);
    }
    if (ev.platform && ev.technique) {
      const key = `${ev.platform}::${ev.technique}`;
      const existing = platformTechnique.get(key) || [];
      existing.push(ev);
      platformTechnique.set(key, existing);
    }
  }

  for (const [technique, evs] of techniqueEvidence) {
    if (evs.length < 3) continue;
    const resolved = evs.filter(e => e.resolved).length;
    const successRate = Math.round((resolved / evs.length) * 100);
    const platforms = [...new Set(evs.map(e => e.platform).filter(Boolean))] as string[];

    let maturity: CrystallizedReference['maturity'];
    if (evs.length >= 16) maturity = 'seasoned';
    else if (evs.length >= 6) maturity = 'established';
    else maturity = 'emerging';

    const weight = Math.min(100,
      (evs.length * 5) +
      (successRate * 0.3) +
      (maturity === 'seasoned' ? 20 : maturity === 'established' ? 10 : 0) +
      (platforms.length * 5)
    );

    refs.push({
      id: `ref-tech-${technique}`,
      type: 'methodology',
      title: technique,
      description: `Applied ${evs.length} times across ${platforms.length} platform${platforms.length > 1 ? 's' : ''}`,
      weight,
      recurrence: evs.length,
      successRate,
      relatedCampaigns: campaigns.filter(c => c.pillar === evs[0].platform).map(c => c.id),
      relatedPlatforms: platforms,
      lastRelevant: Math.max(...evs.map(e => e.timestamp)),
      maturity,
    });
  }

  for (const [key, evs] of platformTechnique) {
    if (evs.length < 2) continue;
    const [platform, technique] = key.split('::');
    const resolved = evs.filter(e => e.resolved).length;
    const successRate = Math.round((resolved / evs.length) * 100);

    refs.push({
      id: `ref-path-${key}`,
      type: 'path',
      title: `${platform} → ${technique}`,
      description: `Repeated ${evs.length} times, ${resolved} resolved`,
      weight: Math.min(100, (evs.length * 8) + (successRate * 0.2)),
      recurrence: evs.length,
      successRate,
      relatedCampaigns: [],
      relatedPlatforms: [platform],
      lastRelevant: Math.max(...evs.map(e => e.timestamp)),
      maturity: evs.length >= 8 ? 'seasoned' : evs.length >= 4 ? 'established' : 'emerging',
    });
  }

  for (const p of patterns) {
    if (p.frequency < 3) continue;
    const existingRef = refs.find(r => r.title === p.toolOrTechnique);
    if (existingRef) {
      existingRef.weight = Math.min(100, existingRef.weight + p.frequency * 2);
      continue;
    }
    refs.push({
      id: `ref-pattern-${p.toolOrTechnique}`,
      type: p.type === 'tool' ? 'workflow' : 'pattern',
      title: p.toolOrTechnique,
      description: `${p.type} used ${p.frequency} times`,
      weight: Math.min(100, p.frequency * 8 + p.effectiveness * 0.2),
      recurrence: p.frequency,
      successRate: p.effectiveness,
      relatedCampaigns: [],
      relatedPlatforms: p.contexts,
      lastRelevant: p.lastUsed,
      maturity: p.frequency >= 20 ? 'seasoned' : p.frequency >= 8 ? 'established' : 'emerging',
    });
  }

  return refs.sort((a, b) => b.weight - a.weight);
}

export function computeTechniqueSpecializations(
  patterns: ResearchPattern[],
  references: CrystallizedReference[]
): TechniqueSpecialization[] {
  const specializations: TechniqueSpecialization[] = [];

  for (const p of patterns) {
    if (p.frequency < 2) continue;
    const ref = references.find(r => r.title === p.toolOrTechnique);
    const recentWindow = 30 * 24 * 60 * 60 * 1000;
    const recentCount = ref?.recurrence ? Math.min(ref.recurrence, Math.round(p.frequency * 0.3)) : 0;
    const priorCount = p.frequency - recentCount;

    let trend: 'growing' | 'stable' | 'declining';
    if (recentCount > priorCount * 1.5 && priorCount > 0) trend = 'growing';
    else if (recentCount < priorCount * 0.5 && priorCount > 0) trend = 'declining';
    else trend = 'stable';

    const mastery = Math.min(100, Math.round(
      (p.frequency * 3) +
      (p.effectiveness * 0.4) +
      (p.contexts.length * 5)
    ));

    specializations.push({
      technique: p.toolOrTechnique,
      type: p.type,
      mastery,
      usageCount: p.frequency,
      successCount: Math.round(p.frequency * (p.effectiveness / 100)),
      contexts: p.contexts,
      trend,
    });
  }

  return specializations.sort((a, b) => b.mastery - a.mastery);
}

export function computeOperationalDoctrines(
  references: CrystallizedReference[],
  specializations: TechniqueSpecialization[]
): OperationalDoctrine[] {
  const doctrines: OperationalDoctrine[] = [];

  const topRefs = references.filter(r => r.weight > 30 && r.maturity !== 'emerging');
  const topSpecs = specializations.filter(s => s.mastery > 30);

  if (topSpecs.length > 0) {
    const toolCount = topSpecs.filter(s => s.type === 'tool').length;
    const techCount = topSpecs.filter(s => s.type === 'technique').length;
    const dominant = toolCount > techCount ? 'tool-centric' : techCount > toolCount ? 'technique-centric' : 'balanced';

    doctrines.push({
      id: 'doctrine-approach',
      approach: dominant,
      category: 'operational_approach',
      frequency: topSpecs.length,
      effectiveness: Math.round(topSpecs.reduce((s, sp) => s + sp.mastery, 0) / topSpecs.length),
      confidence: Math.min(85, 40 + topSpecs.length * 3),
      recentTransitions: topSpecs.filter(s => s.trend === 'growing').length,
    });
  }

  const pathRefs = references.filter(r => r.type === 'path' && r.weight > 25);
  if (pathRefs.length > 0) {
    doctrines.push({
      id: 'doctrine-path-recurrence',
      approach: pathRefs.length > 3 ? 'path-exploration' : 'focused-deep-dive',
      category: 'investigative_pattern',
      frequency: pathRefs.length,
      effectiveness: Math.round(pathRefs.reduce((s, r) => s + r.successRate, 0) / pathRefs.length),
      confidence: Math.min(80, 30 + pathRefs.length * 8),
      recentTransitions: pathRefs.filter(r => r.maturity !== 'emerging').length,
    });
  }

  const highSuccess = references.filter(r => r.successRate > 70 && r.recurrence > 2);
  if (highSuccess.length > 0) {
    doctrines.push({
      id: 'doctrine-success-patterns',
      approach: 'high-success-methodology',
      category: 'reliability',
      frequency: highSuccess.length,
      effectiveness: Math.round(highSuccess.reduce((s, r) => s + r.successRate, 0) / highSuccess.length),
      confidence: Math.min(90, 50 + highSuccess.length * 5),
      recentTransitions: highSuccess.filter(r => r.maturity === 'seasoned').length,
    });
  }

  return doctrines;
}

export function computeKnowledgeResidue(
  references: CrystallizedReference[],
  specializations: TechniqueSpecialization[],
  evidence: OperationEvidence[]
): KnowledgeResidue {
  const heuristics = references
    .filter(r => r.weight > 40 && r.maturity !== 'emerging')
    .slice(0, 5)
    .map(r => ({
      observation: `${r.title}: ${r.description}`,
      weight: r.weight,
      source: r.type,
    }));

  const methodologyResidue = specializations
    .filter(s => s.mastery > 40)
    .slice(0, 5)
    .map(s => ({
      pattern: s.technique,
      recurrence: s.usageCount,
      confidence: Math.min(90, 30 + s.mastery * 0.5),
    }));

  const exploitPathRefs = references.filter(r => r.type === 'path' && r.weight > 30);
  const strategicRefs = references.filter(r => r.type !== 'path' && r.weight > 30);

  return {
    heuristics,
    methodologyResidue,
    exploitPathReferences: exploitPathRefs,
    strategicReferences: strategicRefs,
  };
}

export function computeKnowledgeCrystallization(
  evidence: OperationEvidence[],
  patterns: ResearchPattern[],
  campaigns: CampaignWithStage[]
): KnowledgeCrystallization {
  const references = computeCrystallizedReferences(evidence, patterns, campaigns);
  const specializations = computeTechniqueSpecializations(patterns, references);
  const doctrines = computeOperationalDoctrines(references, specializations);
  const residue = computeKnowledgeResidue(references, specializations, evidence);

  const refMaturity = references.length > 0
    ? references.reduce((s, r) => s + (r.maturity === 'seasoned' ? 30 : r.maturity === 'established' ? 15 : 5), 0) / Math.max(1, references.length)
    : 0;
  const specDepth = specializations.length > 0
    ? specializations.reduce((s, sp) => s + sp.mastery, 0) / Math.max(1, specializations.length)
    : 0;
  const doctrineConfidence = doctrines.length > 0
    ? doctrines.reduce((s, d) => s + d.confidence, 0) / doctrines.length
    : 0;

  const crystallizationIndex = Math.min(100, Math.round(
    (refMaturity * 0.3) + (specDepth * 0.3) + (doctrineConfidence * 0.2) + (residue.heuristics.length * 5)
  ));

  return { references, doctrines, specializations, residue, crystallizationIndex };
}

export function computeOrchestration(
  context: OperationalContext,
  memory: OperationalMemory,
  chains: MissionChain[],
  campaigns: Campaign[],
  previousPacingProfile: PacingProfile | null
): OrchestrationContext {
  const { profile: pacingProfile, reason } = computePacingProfile(context, memory);

  const campaignStages = computeCampaignStages(campaigns, context, memory);

  const adaptivePressure = computeAdaptivePressure(context, chains, campaignStages, pacingProfile);

  const cadence = computeOperationalCadence(pacingProfile, adaptivePressure, context);

  const driftIndicators = computeDriftIndicators(context, campaignStages, chains, memory);

  const continuityPreservation = computeContinuityPreservation(chains, campaignStages, context);

  const strategicMemory = accumulateStrategicMemory(memory, pacingProfile, previousPacingProfile, campaignStages, context);

  const recoveryIntelligence = computeRecoveryIntelligence(context, chains, campaignStages, pacingProfile);

  const pacingTransitions = memory.pacingTransitions || [];

  return {
    pacingProfile,
    pacingTransitions,
    campaignStages,
    adaptivePressure,
    cadence,
    driftIndicators,
    continuityPreservation,
    strategicMemory,
    recoveryIntelligence,
  };
}