'use client';

import { useState, useEffect } from 'react';
import { FloatingPanel } from './floating-panel';
import { MissionConsole } from './mission-console';
import { MentorSubsystem } from './mentor-subsystem';
import { RoadmapStatus } from './roadmap-status';
import { SystemTelemetry } from './system-telemetry';
import { WorkspaceProvider, useWorkspaceState } from './workspace-state';
import { BootSequence } from './workspace-boot';
import { OperationalEvent } from './workspace-ecosystem';

interface WorkspaceData {
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

interface WorkspaceProps {
  data: WorkspaceData;
}

const defaultPositions: Record<string, { x: number; y: number }> = {
  'mission-console': { x: 40, y: 100 },
  'mentor-subsystem': { x: 40, y: 380 },
  'roadmap-status': { x: 400, y: 100 },
  'system-telemetry': { x: 400, y: 380 },
};

function EventBanner({ event, onDismiss }: { event: OperationalEvent; onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, event.duration);
    return () => clearTimeout(timer);
  }, [event.duration, onDismiss]);

  const getEventStyle = () => {
    switch (event.type) {
      case 'critical':
        return 'bg-red-950/80 border-red-600/50 text-red-300';
      case 'warning':
        return 'bg-amber-950/60 border-amber-600/40 text-amber-300';
      case 'success':
        return 'bg-emerald-950/60 border-emerald-600/40 text-emerald-300';
      default:
        return 'bg-zinc-900/80 border-zinc-600/40 text-zinc-300';
    }
  };

  return (
    <div className={`absolute top-16 left-1/2 -translate-x-1/2 z-50 px-6 py-2 border rounded font-mono text-xs uppercase tracking-wider animate-fade-in-down ${getEventStyle()}`}>
      {event.message}
    </div>
  );
}

function OperationalEventsDisplay() {
  const { events } = useWorkspaceState();
  const [visibleEvents, setVisibleEvents] = useState<OperationalEvent[]>([]);

  useEffect(() => {
    if (events.length > 0) {
      setVisibleEvents([events[0]]);
    }
  }, [events]);

  const dismissEvent = () => {
    setVisibleEvents([]);
  };

  if (visibleEvents.length === 0) return null;

  return (
    <>
      {visibleEvents.map(event => (
        <EventBanner key={event.id} event={event} onDismiss={dismissEvent} />
      ))}
    </>
  );
}

function ActiveFocusIndicator() {
  const { activeFocus, context } = useWorkspaceState();
  
  if (activeFocus.primary === 'none') return null;

  const focusLabel = {
    mission: 'MISSION FOCUS',
    mentor: 'MENTOR FOCUS',
    roadmap: 'ROADMAP FOCUS',
    telemetry: 'TELEMETRY FOCUS',
  };

  return (
    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 pointer-events-none">
      <div className={`font-mono text-[10px] uppercase tracking-widest px-4 py-1.5 border rounded ${
        context.environmentTone === 'critical'
          ? 'border-red-600/40 text-red-400/60 bg-red-950/30'
          : context.environmentTone === 'tense'
            ? 'border-amber-600/40 text-amber-400/60 bg-amber-950/20'
            : 'border-zinc-600/40 text-zinc-400/60 bg-zinc-900/30'
      }`}>
        {focusLabel[activeFocus.primary]} • {activeFocus.reason}
      </div>
    </div>
  );
}

function WorkspaceContent() {
  const { state, completeBoot, data, context, isPanelActive } = useWorkspaceState();
  const [showBoot, setShowBoot] = useState(true);

  const { environmentTone, operationalPressure, daysBehindRoadmap } = context;

  useEffect(() => {
    const hasVisited = typeof window !== 'undefined' && 
      localStorage.getItem('era-os-workspace-state');
    if (hasVisited) {
      setShowBoot(false);
      completeBoot();
    }
  }, [completeBoot]);

  if (showBoot && !state.bootComplete) {
    return <BootSequence onComplete={() => setShowBoot(false)} />;
  }

  const getEnvironmentClass = () => {
    switch (environmentTone) {
      case 'critical':
        return 'bg-gradient-to-b from-red-950/20 via-zinc-950 to-zinc-950';
      case 'tense':
        return 'bg-gradient-to-b from-amber-950/10 via-zinc-950 to-zinc-950';
      case 'calm':
        return 'bg-gradient-to-b from-emerald-950/10 via-zinc-950 to-zinc-950';
      default:
        return 'bg-gradient-to-b from-zinc-950 via-zinc-900/40 to-zinc-950';
    }
  };

  const getSyncColor = () => {
    switch (environmentTone) {
      case 'critical':
        return {
          bracket: 'border-red-700/40',
          indicator: 'bg-red-500',
          glow: 'shadow-red-500/10',
        };
      case 'tense':
        return {
          bracket: 'border-amber-700/40',
          indicator: 'bg-amber-500',
          glow: 'shadow-amber-500/10',
        };
      case 'calm':
        return {
          bracket: 'border-emerald-700/40',
          indicator: 'bg-emerald-500',
          glow: 'shadow-emerald-500/10',
        };
      default:
        return {
          bracket: 'border-zinc-700/30',
          indicator: 'bg-zinc-500',
          glow: 'shadow-zinc-500/10',
        };
    }
  };

  const syncColors = getSyncColor();

  const getPressureIndicator = () => {
    switch (operationalPressure) {
      case 'critical':
        return { text: 'CRITICAL', color: 'text-red-500' };
      case 'high':
        return { text: 'ELEVATED', color: 'text-amber-500' };
      case 'medium':
        return { text: 'MODERATE', color: 'text-zinc-400' };
      default:
        return { text: 'NOMINAL', color: 'text-emerald-600' };
    }
  };

  const pressure = getPressureIndicator();

  return (
    <div className={`workspace-environment relative w-full h-screen overflow-hidden ${getEnvironmentClass()}`}>
      {/* Adaptive Ambient Background */}
      <div className="absolute inset-0 pointer-events-none">
        {environmentTone === 'critical' && (
          <>
            <div className="absolute top-0 left-0 w-full h-0.5 bg-red-500/20 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500/10 animate-pulse" />
          </>
        )}
        <div className="absolute inset-0" />
        <div className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl ${syncColors.glow} ${
          environmentTone === 'critical' ? 'bg-red-500/10' :
          environmentTone === 'tense' ? 'bg-amber-500/8' :
          environmentTone === 'calm' ? 'bg-emerald-500/5' :
          'bg-red-500/3'
        } animate-pulse-slow`} />
        <div className={`absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl ${syncColors.glow} ${
          environmentTone === 'critical' ? 'bg-red-500/10' :
          environmentTone === 'tense' ? 'bg-amber-500/8' :
          environmentTone === 'calm' ? 'bg-emerald-500/5' :
          'bg-amber-500/3'
        } animate-pulse-slow-delay`} />
      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(zinc-500 1px, transparent 1px),
              linear-gradient(90deg, zinc-500 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Synchronized Corner Brackets */}
      <div className="absolute inset-4 pointer-events-none">
        <div className={`absolute top-0 left-0 w-12 h-12 border-l border-t ${syncColors.bracket}`} />
        <div className={`absolute top-0 right-0 w-12 h-12 border-r border-t ${syncColors.bracket}`} />
        <div className={`absolute bottom-0 left-0 w-12 h-12 border-l border-b ${syncColors.bracket}`} />
        <div className={`absolute bottom-0 right-0 w-12 h-12 border-r border-b ${syncColors.bracket}`} />
      </div>

      {/* Ambient Scanline */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.015]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-100 to-transparent animate-scanline-slow" />
      </div>

      {/* Status Indicators - Synchronized */}
      <div className="absolute top-6 left-6 flex items-center gap-4 pointer-events-none">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${syncColors.indicator} ${operationalPressure === 'critical' ? 'animate-pulse' : ''}`} />
          <span className={`font-mono text-[10px] uppercase ${pressure.color}`}>
            {pressure.text}
          </span>
        </div>
        {daysBehindRoadmap > 7 && (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500/60" />
            <span className="font-mono text-[10px] text-amber-500/60">
              {daysBehindRoadmap}d behind
            </span>
          </div>
        )}
      </div>

      {/* Time Display */}
      <div className="absolute top-6 right-6 pointer-events-none">
        <div className="font-mono text-xs text-zinc-600 uppercase tracking-widest">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'short',
            month: 'short', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Operational Events */}
      <OperationalEventsDisplay />

      {/* Workspace Panels with Active Focus */}
      <FloatingPanel
        id="mission-console"
        title="MISSION CONSOLE"
        icon="▸"
        initialPosition={defaultPositions['mission-console']}
        isActive={isPanelActive('mission-console')}
      >
        <MissionConsole 
          tasks={data.tasks || []} 
          currentMonth={data.currentMonth || 1} 
        />
      </FloatingPanel>
      
      <FloatingPanel
        id="mentor-subsystem"
        title="MENTOR SUBSYSTEM"
        icon="◆"
        initialPosition={defaultPositions['mentor-subsystem']}
        isActive={isPanelActive('mentor-subsystem')}
      >
        <MentorSubsystem 
          pillarXP={data.pillarXP || {}}
          streakCurrent={data.streakCurrent || 0}
          currentMonth={data.currentMonth || 1}
        />
      </FloatingPanel>
      
      <FloatingPanel
        id="roadmap-status"
        title="ROADMAP STATUS"
        icon="◈"
        initialPosition={defaultPositions['roadmap-status']}
        isActive={isPanelActive('roadmap-status')}
      >
        <RoadmapStatus
          currentMonth={data.currentMonth || 1}
          startDate={data.startDate}
          progress={data.progress}
          tasksCompleted={data.tasksCompleted || 0}
          totalTasks={data.tasksTotal || 0}
        />
      </FloatingPanel>
      
      <FloatingPanel
        id="system-telemetry"
        title="SYSTEM TELEMETRY"
        icon="●"
        initialPosition={defaultPositions['system-telemetry']}
        isActive={isPanelActive('system-telemetry')}
      >
        <SystemTelemetry
          streakCurrent={data.streakCurrent || 0}
          tasksTotal={data.tasksTotal || 0}
          tasksCompleted={data.tasksCompleted || 0}
          logsCount={data.logsCount || 0}
          ctfCount={data.ctfCount || 0}
        />
      </FloatingPanel>

      {/* Active Focus Indicator */}
      <ActiveFocusIndicator />

      {/* Center Info - Adaptive Opacity */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none ${
        environmentTone === 'critical' ? 'opacity-20' : 'opacity-40'
      }`}>
        <div className="font-mono text-xs text-zinc-700 uppercase tracking-[0.3em] mb-2">
          Era OS // Workspace
        </div>
        <div className={`font-mono text-4xl tracking-widest ${
          environmentTone === 'critical' ? 'text-red-900' : 'text-zinc-800'
        }`}>
          COMMAND CENTER
        </div>
      </div>

      {/* Bottom Status Bar - Synchronized */}
      <div className={`absolute bottom-0 left-0 right-0 h-8 border-t flex items-center justify-between px-6 ${
        environmentTone === 'critical'
          ? 'bg-zinc-950/80 border-red-900/20'
          : 'bg-zinc-950/60 border-zinc-800/20'
      }`}>
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] text-zinc-600">ERA-OS v0.1.0</span>
          <span className="text-zinc-800">|</span>
          <span className={`font-mono text-[10px] ${pressure.color}`}>
            {pressure.text}
          </span>
          <span className="text-zinc-800">|</span>
          <span className={`font-mono text-[10px] ${syncColors.indicator.replace('bg-', 'text-')}/60`}>● OPERATIONAL</span>
        </div>
        <div className="font-mono text-[10px] text-zinc-600">
          Drag panels • Click header to focus
        </div>
      </div>

      <style jsx global>{`
        @keyframes scanline-slow {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        .animate-scanline-slow {
          animation: scanline-slow 12s linear infinite;
        }
        .animate-pulse-slow {
          animation: pulse 6s ease-in-out infinite;
        }
        .animate-pulse-slow-delay {
          animation: pulse 6s ease-in-out infinite;
          animation-delay: 3s;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }
        @keyframes fade-in-down {
          from { 
            opacity: 0;
            transform: translateX(-50%) translateY(-10px);
          }
          to { 
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export function Workspace({ data }: WorkspaceProps) {
  return (
    <WorkspaceProvider data={data}>
      <WorkspaceContent />
    </WorkspaceProvider>
  );
}