'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { 
  computeStrategicContextWithMemory, 
  computeFocus, 
  generateOperationalEvents,
  OperationalContext,
  OperationalFocus,
  OperationalEvent,
  OperationalMemory,
  OperationalLifecycle,
  ContinuityContext,
  ForecastContext,
  SimulationContext
} from './workspace-ecosystem';

export interface PanelState {
  id: string;
  x: number;
  y: number;
  zIndex: number;
  isOpen: boolean;
}

export interface WorkspaceData {
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
  logsCount?: number;
  ctfCount?: number;
  tasksTotal?: number;
  tasksCompleted?: number;
}

interface WorkspaceState {
  panels: PanelState[];
  focusedPanelId: string | null;
  bootComplete: boolean;
  data: WorkspaceData;
  context: OperationalContext;
  memory: OperationalMemory;
  lifecycle: OperationalLifecycle;
  continuity: ContinuityContext;
  forecast: ForecastContext;
  simulation: SimulationContext;
  activeFocus: OperationalFocus;
  events: OperationalEvent[];
}

interface WorkspaceContextType {
  state: WorkspaceState;
  updatePanelPosition: (id: string, x: number, y: number) => void;
  bringToFront: (id: string) => void;
  togglePanel: (id: string) => void;
  completeBoot: () => void;
  data: WorkspaceData;
  context: OperationalContext;
  memory: OperationalMemory;
  lifecycle: OperationalLifecycle;
  continuity: ContinuityContext;
  forecast: ForecastContext;
  simulation: SimulationContext;
  activeFocus: OperationalFocus;
  events: OperationalEvent[];
  isPanelActive: (panelId: string) => boolean;
}

const defaultPanels: PanelState[] = [
  { id: 'mission-console', x: 40, y: 80, zIndex: 1, isOpen: true },
  { id: 'mentor-subsystem', x: 40, y: 380, zIndex: 2, isOpen: true },
  { id: 'roadmap-status', x: 400, y: 80, zIndex: 3, isOpen: true },
  { id: 'system-telemetry', x: 400, y: 380, zIndex: 4, isOpen: true },
];

const STORAGE_KEY = 'era-os-workspace-state';

const defaultContext: OperationalContext = {
  operationalPressure: 'low',
  mentorUrgency: 0,
  weakPillars: [],
  neglectedMissions: [],
  staleMissionCount: 0,
  environmentTone: 'normal',
  backlogPressure: 0,
  streakStatus: 'cold',
  completionRatio: 0,
  daysBehindRoadmap: 0,
  missionLoad: 0,
  readinessLevel: 100,
  focusPillar: null,
  rhythmState: 'stable',
  fatigueLevel: 0,
  momentumScore: 50,
  operationalConfidence: 70,
};

const defaultFocus: OperationalFocus = {
  primary: 'none',
  reason: 'System balanced',
  intensity: 0,
};

const defaultMemory: OperationalMemory = {
  unfinishedMissionChains: [],
  neglectedPillarHistory: { HACK: 0, BUILD: 0, AI: 0, PRESENCE: 0 },
  momentumPeriods: 0,
  recoveryPeriods: 0,
  backlogEscalation: 0,
  roadmapDriftHistory: 0,
  streakConsistency: 0,
  operationalCycles: 0,
};

const defaultLifecycle: OperationalLifecycle = {
  phase: 'Stable',
  confidence: 0,
  description: 'Initializing operational baseline',
  recommendedFocus: 'Establish initial operational rhythm',
};

const defaultContinuity: ContinuityContext = {
  scores: {
    missionContinuityScore: 50,
    strategicCoherenceScore: 50,
    operationalStabilityScore: 50,
    executionContinuityScore: 50,
  },
  carryForward: {
    unresolvedBacklogTrend: 'stable',
    neglectedPillarTrend: 'none',
    momentumCarryForward: 0,
    recoveryCarryForward: 0,
    pacingRecommendation: 'maintain',
    operationalCarryNote: 'Initializing operational baseline',
  },
  identity: {
    dominantRhythm: 'stable',
    recurringPressurePattern: 'low',
    strategicSignature: 'initializing',
    progressionTendency: 'stable',
    totalOperationalDays: 0,
  },
};

const defaultForecast: ForecastContext = {
  temporal: {
    roadmapDriftProjection: 0,
    overloadProbability: 0,
    sustainabilityTrend: 'sustainable',
    executionStability: 50,
    forecastHorizon: 'short',
    confidence: 0,
  },
  drift: {
    driftRiskTrend: 'stable',
    estimatedDriftDays: 0,
    driftArrivalWeeks: 4,
    keyRiskFactor: 'insufficient data',
    confidence: 0,
  },
  sustainability: {
    status: 'sustainable',
    loadCapacity: 80,
    burnoutRisk: 0,
    recommendedPacing: 'maintain',
    confidence: 0,
  },
  trajectory: {
    classification: 'Stable Progression',
    description: 'Initializing operational baseline',
    transitionLikelihood: 15,
    confidence: 0,
  },
};

const defaultSimulation: SimulationContext = {
  scenarios: [],
  pressurePropagation: {
    source: 'backlog',
    propagationPath: [],
    currentStage: 0,
    propagationSpeed: 'slow',
    confidence: 0,
  },
  tradeoffs: {
    accelerateWorkload: { operationalCost: 0, strategicBenefit: 0, sustainabilityImpact: 0 },
    stabilizeFirst: { operationalCost: 0, strategicBenefit: 0, sustainabilityImpact: 0 },
    deepFocus: { operationalCost: 0, strategicBenefit: 0, sustainabilityImpact: 0 },
  },
  roadmapCompression: {
    compressionRisk: 'low',
    estimatedCompressionWeeks: 8,
    compressionSeverity: 0,
    milestoneCollisionRisk: false,
    recoveryWindowShrinking: false,
    compressionNote: 'Insufficient data for compression analysis',
  },
  recoveryWindow: {
    requiredStabilizationDays: 0,
    recoveryEffectiveness: 0,
    momentumRestorationProb: 0,
    windowAvailable: true,
    confidence: 0,
  },
};

const WorkspaceContext = createContext<WorkspaceContextType | null>(null);

export function WorkspaceProvider({ 
  children, 
  data = {} 
}: { 
  children: ReactNode;
  data?: WorkspaceData;
}) {
  const [state, setState] = useState<WorkspaceState>({
    panels: defaultPanels,
    focusedPanelId: null,
    bootComplete: false,
    data,
    context: defaultContext,
    memory: defaultMemory,
    lifecycle: defaultLifecycle,
    continuity: defaultContinuity,
    forecast: defaultForecast,
    simulation: defaultSimulation,
    activeFocus: defaultFocus,
    events: [],
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    let memory: OperationalMemory | undefined = undefined;
    
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Extract memory from storage if it exists
        if (parsed.memory) {
          memory = parsed.memory as OperationalMemory;
        }
      } catch {
        // Ignore parse errors
      }
    }
    
    const { context, memory: computedMemory, lifecycle, continuity, forecast, simulation } = computeStrategicContextWithMemory(data, memory);
    const activeFocus = computeFocus(context);
    const events = generateOperationalEvents(context);
    
    setState(prev => ({ 
      ...prev, 
      data, 
      context,
      memory: computedMemory,
      lifecycle,
      continuity,
      forecast,
      simulation,
      activeFocus,
      events,
    }));
  }, [data]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!state.bootComplete) return;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      panels: state.panels,
      memory: state.memory,
    }));
  }, [state.panels, state.bootComplete, state.memory]);

  const updatePanelPosition = useCallback((id: string, x: number, y: number) => {
    setState(prev => ({
      ...prev,
      panels: prev.panels.map(p => 
        p.id === id ? { ...p, x, y } : p
      ),
    }));
  }, []);

  const bringToFront = useCallback((id: string) => {
    setState(prev => {
      const maxZ = Math.max(...prev.panels.map(p => p.zIndex));
      return {
        ...prev,
        focusedPanelId: id,
        panels: prev.panels.map(p => 
          p.id === id ? { ...p, zIndex: maxZ + 1 } : p
        ),
      };
    });
  }, []);

  const togglePanel = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      panels: prev.panels.map(p => 
        p.id === id ? { ...p, isOpen: !p.isOpen } : p
      ),
    }));
  }, []);

  const completeBoot = useCallback(() => {
    setState(prev => ({ ...prev, bootComplete: true }));
  }, []);

  const isPanelActive = useCallback((panelId: string) => {
    const panelMap: Record<string, string> = {
      'mission-console': 'mission',
      'mentor-subsystem': 'mentor',
      'roadmap-status': 'roadmap',
      'system-telemetry': 'telemetry',
    };
    return state.activeFocus.primary === panelMap[panelId];
  }, [state.activeFocus]);

  return (
    <WorkspaceContext.Provider value={{
      state,
      updatePanelPosition,
      bringToFront,
      togglePanel,
      completeBoot,
      data: state.data,
      context: state.context,
      memory: state.memory,
      lifecycle: state.lifecycle,
      continuity: state.continuity,
      forecast: state.forecast,
      simulation: state.simulation,
      activeFocus: state.activeFocus,
      events: state.events,
      isPanelActive,
    }}>
    {children}
  </WorkspaceContext.Provider>
  );
}

export function useWorkspaceState() {
  const context = useContext(WorkspaceContext);
  if (!context) throw new Error('useWorkspaceState must be used within WorkspaceProvider');
  return context;
}