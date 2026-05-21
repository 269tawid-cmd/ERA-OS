'use client';

import { Component, useState, useEffect, useRef, type ReactNode } from 'react';
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

/* ─── Tone-safe color lookups (never produce invalid CSS) ─── */
const AMBIENT_COLORS: Record<string, string> = {
  critical: 'rgba(59,130,246,0.04)',
  tense: 'rgba(59,130,246,0.05)',
  calm: 'rgba(52,211,153,0.06)',
  normal: 'rgba(59,130,246,0.05)',
};

const BOUNCE_COLORS: Record<string, string> = {
  critical: 'rgba(239,68,68,0.08)',
  tense: 'rgba(245,158,11,0.06)',
  calm: 'rgba(52,211,153,0.03)',
  normal: 'rgba(239,68,68,0.02)',
};

function toneColor(map: Record<string, string>, tone: string): string {
  return map[tone] ?? map.normal ?? 'rgba(59,130,246,0.05)';
}

/* ─── Isolate cinematic render failures ─── */
class CinematicErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error) {
    console.warn('[CinematicErrorBoundary] disabled cinematic layers:', error.message);
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

function WorkspaceContent() {
  const { state, completeBoot, data, context, lifecycle, continuity, forecast, simulation, isPanelActive } = useWorkspaceState();
  const [showBoot, setShowBoot] = useState(true);

  const { 
    environmentTone, 
    operationalPressure, 
    daysBehindRoadmap,
    rhythmState,
    fatigueLevel,
    momentumScore,
    operationalConfidence,
  } = context;

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
    if (rhythmState === 'momentum') {
      return 'bg-gradient-to-b from-emerald-950/15 via-zinc-950 to-zinc-950';
    }
    if (rhythmState === 'overload' || rhythmState === 'fatigue') {
      return 'bg-gradient-to-b from-amber-950/15 via-zinc-950 to-zinc-950';
    }
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
    if (rhythmState === 'momentum') {
      return {
        bracket: 'border-emerald-700/40',
        indicator: 'bg-emerald-500',
        glow: 'shadow-emerald-500/10',
      };
    }
    if (rhythmState === 'overload' || rhythmState === 'fatigue') {
      return {
        bracket: 'border-amber-700/40',
        indicator: 'bg-amber-500',
        glow: 'shadow-amber-500/10',
      };
    }
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

  /* ─── Hydration-safe clock — never in render path ─── */
  const [dateStr, setDateStr] = useState('');
  useEffect(() => {
    setDateStr(new Date().toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric'
    }));
  }, []);

  /* ─── Cinematic Parallax Camera (hydrate-safe) ─── */
  const depthRef = useRef<HTMLDivElement>(null);
  const cameraPos = useRef({ x: 0, y: 0 });
  const targetPos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>(0);
  const mountedRef = useRef(false);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    reducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const onMouseMove = (e: MouseEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      targetPos.current = {
        x: w > 0 ? (e.clientX / w - 0.5) * 2 : 0,
        y: h > 0 ? (e.clientY / h - 0.5) * 2 : 0,
      };
    };

    const animate = () => {
      if (!mountedRef.current || reducedMotionRef.current) return;
      if (!depthRef.current) {
        rafId.current = requestAnimationFrame(animate);
        return;
      }
      cameraPos.current.x += (targetPos.current.x - cameraPos.current.x) * 0.06;
      cameraPos.current.y += (targetPos.current.y - cameraPos.current.y) * 0.06;
      const px = isFinite(cameraPos.current.x) ? cameraPos.current.x : 0;
      const py = isFinite(cameraPos.current.y) ? cameraPos.current.y : 0;
      depthRef.current.style.transform = `translate(${px * 3}px, ${py * 2}px)`;
      rafId.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    rafId.current = requestAnimationFrame(animate);

    return () => {
      mountedRef.current = false;
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div className={`workspace-environment relative w-full h-screen overflow-hidden ${getEnvironmentClass()}`}>
      {/* Cinematic Depth & Lighting System (error-isolated) */}
      <CinematicErrorBoundary>
      <div ref={depthRef} className="absolute inset-0 pointer-events-none overflow-hidden will-change-transform">
        {/* 1. Vignette - dark edges for depth framing */}
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.45) 100%)' }} />
        
        {/* 2. Bottom fog - ground plane darkness */}
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to bottom, transparent 45%, rgba(0,0,0,0.3) 100%)' }} />
        
        {/* 3. Top atmosphere - ceiling shadow */}
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, transparent 35%)' }} />
        
        {/* 4. Side shadow zones */}
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.12) 0%, transparent 15%, transparent 85%, rgba(0,0,0,0.12) 100%)' }} />
        
        {/* 5. Cinematic Cool Ambient - soft overhead light */}
        <div className={`absolute inset-0 transition-opacity duration-[1500ms] animate-ambient-drift`} style={{ backgroundImage: `radial-gradient(ellipse at 50% 0%, ${toneColor(AMBIENT_COLORS, environmentTone)} 0%, transparent 70%)` }} />
        
        {/* 6. Tactical Low Bounce - reflected light from lower edge */}
        <div className="absolute inset-0 transition-opacity duration-1000" style={{ backgroundImage: `radial-gradient(ellipse at 50% 100%, ${toneColor(BOUNCE_COLORS, environmentTone)} 0%, transparent 60%)` }} />
        
        {/* 7. Soft center focus guide */}
        {environmentTone !== 'critical' && (
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.015) 0%, transparent 60%)' }} />
        )}

        {/* 8. Critical alert pulse bars */}
        {environmentTone === 'critical' && (
          <>
            <div className="absolute top-0 left-0 w-full h-0.5 bg-red-500/15 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500/8 animate-pulse" />
          </>
        )}

        {/* Continuity Identity Ambient Layer */}
        {continuity.identity.totalOperationalDays > 5 && (
          <div className="absolute inset-0 transition-opacity duration-1000" style={{
            opacity: continuity.identity.dominantRhythm === 'momentum' ? 0.03 :
                     continuity.identity.dominantRhythm === 'recovery' ? 0.02 :
                     continuity.identity.progressionTendency === 'declining' ? 0.02 : 0,
          }}>
            <div className={`absolute inset-0 bg-gradient-to-t ${
              continuity.identity.dominantRhythm === 'momentum' ? 'from-emerald-500/20' :
              continuity.identity.dominantRhythm === 'recovery' ? 'from-amber-500/15' :
              continuity.identity.progressionTendency === 'declining' ? 'from-red-500/15' :
              'to-transparent'
            } to-transparent`} />
          </div>
        )}
        
        {/* Forecast Trajectory Ambient Layer */}
        {forecast.temporal.confidence > 30 && (
          <div className="absolute bottom-20 left-0 right-0 h-12 transition-opacity duration-1000" style={{ opacity: 0.03 }}>
            <div className={`absolute inset-0 bg-gradient-to-t ${
              forecast.trajectory.classification === 'Operational Saturation' ? 'from-red-500/30' :
              forecast.trajectory.classification === 'Drift Accumulation' ? 'from-amber-500/20' :
              forecast.trajectory.classification === 'Recovery Momentum' ? 'from-amber-500/15' :
              forecast.trajectory.classification === 'Sustainable Expansion' ? 'from-emerald-500/25' :
              forecast.trajectory.classification === 'Strategic Consolidation' ? 'from-blue-500/15' :
              'to-transparent'
            } to-transparent`} />
          </div>
        )}

        {/* Pressure Propagation Edge Glow */}
        {simulation.pressurePropagation.confidence > 30 && simulation.pressurePropagation.currentStage >= 1 && (
          <div className={`absolute left-0 top-0 bottom-0 w-0.5 transition-all duration-1000 ${
            simulation.pressurePropagation.source === 'overload' ? 'bg-gradient-to-b from-red-500/15 via-red-500/5 to-transparent' :
            simulation.pressurePropagation.source === 'backlog' ? 'bg-gradient-to-b from-amber-500/15 via-amber-500/5 to-transparent' :
            simulation.pressurePropagation.source === 'momentum' ? 'bg-gradient-to-b from-emerald-500/15 via-emerald-500/5 to-transparent' :
            'bg-gradient-to-b from-zinc-500/10 via-zinc-500/3 to-transparent'
          } ${simulation.pressurePropagation.currentStage >= 2 ? 'animate-pulse-slow' : ''}`} />
        )}

        {/* 9. Atmospheric dust / light pools — slow ambient drift */}
        <div className="absolute inset-0 pointer-events-none animate-dust-drift opacity-[0.012]"
          style={{
            backgroundImage: `
              radial-gradient(ellipse at 15% 25%, rgba(255,255,255,0.12) 0%, transparent 50%),
              radial-gradient(ellipse at 75% 40%, rgba(255,255,255,0.06) 0%, transparent 50%),
              radial-gradient(ellipse at 40% 80%, rgba(255,255,255,0.04) 0%, transparent 50%),
              radial-gradient(ellipse at 88% 65%, rgba(255,255,255,0.05) 0%, transparent 50%)
            `,
            backgroundSize: '200% 200%',
          }}
        />
      </div>
      </CinematicErrorBoundary>

      {/* Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(#71717a 1px, transparent 1px),
              linear-gradient(90deg, #71717a 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Synchronized Corner Brackets */}
      <div className="absolute inset-3 pointer-events-none">
        <div className={`absolute top-0 left-0 w-8 h-8 border-l border-t ${syncColors.bracket}`} />
        <div className={`absolute top-0 right-0 w-8 h-8 border-r border-t ${syncColors.bracket}`} />
        <div className={`absolute bottom-0 left-0 w-8 h-8 border-l border-b ${syncColors.bracket}`} />
        <div className={`absolute bottom-0 right-0 w-8 h-8 border-r border-b ${syncColors.bracket}`} />
      </div>

      {/* Ambient Scanline */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.01]">
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

      {/* Strategic Status Indicator */}
      {context.strategic?.progressionHealth !== undefined && (
        <div className="absolute bottom-6 left-6 pointer-events-none">
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${
              context.strategic.progressionHealth > 70 ? 'bg-emerald-500' :
              context.strategic.progressionHealth > 40 ? 'bg-amber-500' :
              'bg-red-500'
            }`} />
            <span className={`font-mono text-[9px] uppercase tracking-wider ${
              context.strategic.progressionHealth > 70 ? 'text-emerald-500/40' :
              context.strategic.progressionHealth > 40 ? 'text-amber-500/40' :
              'text-red-500/40'
            }`}>
              {context.strategic.progressionHealth > 70 ? 'Strategic' :
               context.strategic.progressionHealth > 40 ? 'Transitional' : 'At Risk'}
            </span>
          </div>
        </div>
      )}

      {/* Operational Lifecycle Indicator */}
      {lifecycle && (
        <div className="absolute bottom-6 right-6 pointer-events-none">
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${
              lifecycle.phase === 'Expansion' ? 'bg-emerald-500' :
              lifecycle.phase === 'Recovery' || lifecycle.phase === 'Stabilization' ? 'bg-amber-500' :
              lifecycle.phase === 'DriftRisk' ? 'bg-red-500' :
              'bg-zinc-500'
            }`} />
            <span className={`font-mono text-[9px] uppercase tracking-wider ${
              lifecycle.confidence > 70 ? 'text-emerald-500/40' :
              lifecycle.confidence > 40 ? 'text-amber-500/40' :
              'text-zinc-500/40'
            }`}>
              {lifecycle.phase}
            </span>
          </div>
        </div>
      )}

      {/* Time Display (hydration-safe — set after mount) */}
      <div className="absolute top-6 right-6 pointer-events-none">
        <div className="font-mono text-xs text-zinc-600 uppercase tracking-widest">
          {dateStr}
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

      {/* Center Info - Subtle Background Branding */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none ${
        environmentTone === 'critical' ? 'opacity-10' : 'opacity-25'
      }`}>
        <div className="font-mono text-[9px] text-zinc-700 uppercase tracking-[0.3em] mb-1.5">
          Era OS
        </div>
        <div className={`font-mono text-xl tracking-widest ${
          environmentTone === 'critical' ? 'text-red-900' : 'text-zinc-800'
        }`}>
          COMMAND CENTER
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className={`absolute bottom-0 left-0 right-0 h-7 border-t flex items-center justify-between px-4 ${
        environmentTone === 'critical'
          ? 'bg-zinc-950/80 border-red-900/20'
          : 'bg-zinc-950/60 border-zinc-800/20'
      }`}>
        <div className="flex items-center gap-2 text-[9px] font-mono">
          <span className="text-zinc-600">ERA-OS v0.1.0</span>
          <span className="text-zinc-800">|</span>
          <span className={pressure.color}>
            {pressure.text}
          </span>
          <span className="text-zinc-800">|</span>
          <span className={`${syncColors.indicator.replace('bg-', 'text-')}/60`}>●</span>
          {continuity.identity.totalOperationalDays > 5 && forecast.temporal.confidence > 30 && (
            <>
              <span className="text-zinc-800">|</span>
              <span className={`${
                forecast.trajectory.classification === 'Stable Progression' ? 'text-emerald-600/40' :
                forecast.trajectory.classification === 'Sustainable Expansion' ? 'text-emerald-500/40' :
                forecast.trajectory.classification === 'Recovery Momentum' ? 'text-amber-500/40' :
                forecast.trajectory.classification === 'Drift Accumulation' ? 'text-amber-600/40' :
                'text-red-500/40'
              }`}>
                {forecast.trajectory.classification}
              </span>
            </>
          )}
          {simulation.roadmapCompression.compressionRisk === 'high' && (
            <>
              <span className="text-zinc-800">|</span>
              <span className="text-red-500/40">comp:{simulation.roadmapCompression.estimatedCompressionWeeks}w</span>
            </>
          )}
        </div>
        <div className="font-mono text-[9px] text-zinc-700">
          Drag · Click to focus
        </div>
      </div>

      <style>{`
        .workspace-environment {
          transform: translateZ(0);
        }
        @keyframes scanline-slow {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        .animate-scanline-slow {
          animation: scanline-slow 12s linear infinite;
          will-change: transform;
        }
        @keyframes ambient-drift {
          0%, 100% { opacity: 0.55; }
          33% { opacity: 0.7; }
          66% { opacity: 0.6; }
        }
        .animate-ambient-drift {
          animation: ambient-drift 14s ease-in-out infinite;
          will-change: opacity;
        }
        @keyframes pulse-subtle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }
        .animate-pulse-slow {
          animation: pulse-subtle 6s ease-in-out infinite;
          will-change: opacity;
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
        @keyframes dust-drift {
          0% { background-position: 0% 0%; }
          25% { background-position: 40% 30%; }
          50% { background-position: 100% 60%; }
          75% { background-position: 60% 20%; }
          100% { background-position: 0% 0%; }
        }
        .animate-dust-drift {
          animation: dust-drift 40s ease-in-out infinite;
          will-change: background-position;
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