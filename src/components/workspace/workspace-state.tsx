'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { 
  computeOperationalContext, 
  computeFocus, 
  generateOperationalEvents,
  OperationalContext,
  OperationalFocus,
  OperationalEvent 
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
};

const defaultFocus: OperationalFocus = {
  primary: 'none',
  reason: 'System balanced',
  intensity: 0,
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
    activeFocus: defaultFocus,
    events: [],
  });

  useEffect(() => {
    const context = computeOperationalContext(data);
    const activeFocus = computeFocus(context);
    const events = generateOperationalEvents(context);
    
    setState(prev => ({ 
      ...prev, 
      data, 
      context,
      activeFocus,
      events,
    }));
  }, [data]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setState(prev => ({
          ...prev,
          panels: parsed.panels || defaultPanels,
          bootComplete: false,
        }));
      } catch {
        setState(prev => ({ ...prev, panels: defaultPanels }));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!state.bootComplete) return;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      panels: state.panels,
    }));
  }, [state.panels, state.bootComplete]);

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