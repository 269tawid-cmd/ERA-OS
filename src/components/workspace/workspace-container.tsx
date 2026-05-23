'use client';

import { Component, useState, useEffect, useRef, type ReactNode } from 'react';
import { FloatingPanel } from './floating-panel';
import { MissionConsole } from './mission-console';
import { MentorSubsystem } from './mentor-subsystem';
import { RoadmapStatus } from './roadmap-status';
import { SystemTelemetry } from './system-telemetry';
import { OpsEvidence } from './ops-evidence';
import { WorkspaceProvider, useWorkspaceState } from './workspace-state';
import { BootSequence } from './workspace-boot';

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
  logs?: any[];
  ctfEntries?: any[];
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
  'ops-evidence': { x: 40, y: 660 },
};



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

  /* ─── Hydration-safe clock — never in render path ─── */
  const [dateStr, setDateStr] = useState('');
  useEffect(() => {
    setDateStr(new Date().toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric'
    }));
  }, []);

  /* ─── Cinematic Parallax Camera — Inertia, Overshoot, Breathing ─── */
  const distantRef = useRef<HTMLDivElement>(null);
  const ambientRef = useRef<HTMLDivElement>(null);
  const lightBeamRef = useRef<HTMLDivElement>(null);
  const atmosphereRef = useRef<HTMLDivElement>(null);
  const cameraPos = useRef({ x: 0, y: 0 });
  const targetPos = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>(0);
  const mountedRef = useRef(false);
  const reducedMotionRef = useRef(false);

  /* ─── Environmental life modulation refs ─── */
  const toneRef = useRef(environmentTone);
  const envPhase = useRef(0);

  useEffect(() => { toneRef.current = environmentTone; }, [environmentTone]);

  useEffect(() => {
    mountedRef.current = true;
    reducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lowEndDevice = typeof navigator !== 'undefined' && navigator.hardwareConcurrency <= 4;
    const skipCamera = reducedMotionRef.current || lowEndDevice;

    const layers = [
      { ref: distantRef, speed: 0.12 },
      { ref: atmosphereRef, speed: 0.25 },
      { ref: ambientRef, speed: 0.5 },
      { ref: lightBeamRef, speed: 1.0 },
    ];

    let idlePhase = 0;
    let prevTarget = { x: 0, y: 0 };
    let paused = false;

    const onMouseMove = (e: MouseEvent) => {
      if (paused) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      targetPos.current = {
        x: w > 0 ? (e.clientX / w - 0.5) * 2 : 0,
        y: h > 0 ? (e.clientY / h - 0.5) * 2 : 0,
      };
      idlePhase = 0;
    };

    const onVisibilityChange = () => {
      paused = document.hidden;
      if (document.hidden) {
        envPhase.current = 0;
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    const animate = () => {
      if (!mountedRef.current) {
        rafId.current = requestAnimationFrame(animate);
        return;
      }

      if (!paused) {
        /* ── Cinematic atmosphere breathing ── */
        const tone = toneRef.current;
        const pace = tone === 'critical' ? 1.8 : tone === 'tense' ? 1.3 : tone === 'calm' ? 0.7 : 1.0;
        envPhase.current += 0.0005 * pace;
        const hp = envPhase.current;
        const sp = envPhase.current;

        if (atmosphereRef.current) {
          const haze = 0.65 + Math.sin(hp * 0.3) * 0.08;
          atmosphereRef.current.style.opacity = String(Math.max(0.35, Math.min(1, haze)));
        }
        if (lightBeamRef.current) {
          const shimmer = 0.7 + Math.sin(sp * 0.4) * 0.08;
          lightBeamRef.current.style.opacity = String(Math.max(0.35, Math.min(1, shimmer)));
        }

        /* ── Camera movement ── */
        if (!skipCamera) {
          prevTarget = { ...targetPos.current };

          const pullX = (targetPos.current.x - cameraPos.current.x) * 0.06;
          const pullY = (targetPos.current.y - cameraPos.current.y) * 0.06;
          velocity.current.x += (pullX - velocity.current.x) * 0.07;
          velocity.current.y += (pullY - velocity.current.y) * 0.07;
          velocity.current.x *= 0.92;
          velocity.current.y *= 0.92;
          cameraPos.current.x += velocity.current.x;
          cameraPos.current.y += velocity.current.y;

          const mx = Math.max(-1, Math.min(1, isFinite(cameraPos.current.x) ? cameraPos.current.x : 0));
          const my = Math.max(-1, Math.min(1, isFinite(cameraPos.current.y) ? cameraPos.current.y : 0));

          idlePhase += 0.002;
          const breathX = Math.sin(idlePhase * 0.5) * 0.08;
          const breathY = Math.cos(idlePhase * 0.35) * 0.06;
          const totalX = mx + breathX;
          const totalY = my + breathY;

          for (let i = 0; i < layers.length; i++) {
            const layer = layers[i];
            if (!layer.ref.current) continue;
            layer.ref.current.style.transform =
              `translate3d(${totalX * layer.speed}px, ${totalY * layer.speed}px, 0)`;
          }
        }
      }

      rafId.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    rafId.current = requestAnimationFrame(animate);

    return () => {
      mountedRef.current = false;
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  const [sessionCount, setSessionCount] = useState(0);

  useEffect(() => {
    if (!state.bootComplete) return;
    const stored = parseInt(localStorage.getItem('era-os-session-count') || '0', 10);
    const newCount = stored + 1;
    localStorage.setItem('era-os-session-count', String(newCount));
    setSessionCount(newCount);
  }, [state.bootComplete]);

  if (showBoot && !state.bootComplete) {
    const hasVisitedBefore = typeof window !== 'undefined' &&
      localStorage.getItem('era-os-workspace-state') !== null;
    return <BootSequence onComplete={() => setShowBoot(false)} isReturnVisit={hasVisitedBefore} />;
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

  return (
    <div className={`workspace-environment relative w-full h-screen overflow-hidden ${getEnvironmentClass()}`}>
      {/* Cinematic Depth & Lighting System (error-isolated) */}
      <CinematicErrorBoundary>
      {/* Layer 0 — Distant atmosphere, city silhouette */}
      <div
        ref={distantRef}
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{
          willChange: 'transform',
          filter: 'blur(6px)',
          backgroundImage: `
            linear-gradient(to bottom, rgba(2,2,8,0.7) 0%, rgba(4,4,14,0.35) 40%, transparent 60%),
            radial-gradient(ellipse 60% 8% at 50% 72%, rgba(20,45,90,0.1) 0%, transparent 100%),
            repeating-linear-gradient(90deg,
              transparent 0px, transparent 3px,
              rgba(10,15,30,0.06) 3px, rgba(10,15,30,0.06) 5px,
              transparent 5px, transparent 9px,
              rgba(7,11,24,0.04) 9px, rgba(7,11,24,0.04) 13px,
              transparent 13px, transparent 17px,
              rgba(9,14,28,0.05) 17px, rgba(9,14,28,0.05) 19px,
              transparent 19px, transparent 22px,
              rgba(6,10,20,0.04) 22px, rgba(6,10,20,0.04) 24px,
              transparent 24px, transparent 29px,
              rgba(11,17,34,0.05) 29px, rgba(11,17,34,0.05) 31px,
              transparent 31px, transparent 35px
            ),
            repeating-linear-gradient(90deg,
              transparent 0px, transparent 14px,
              rgba(180,200,255,0.025) 14px, rgba(180,200,255,0.025) 15px,
              transparent 15px, transparent 28px,
              rgba(180,200,255,0.015) 28px, rgba(180,200,255,0.015) 29px,
              transparent 29px, transparent 42px,
              rgba(180,200,255,0.03) 42px, rgba(180,200,255,0.03) 43px,
              transparent 43px, transparent 56px,
              rgba(180,200,255,0.02) 56px, rgba(180,200,255,0.02) 57px,
              transparent 57px, transparent 70px
            ),
            linear-gradient(to bottom, transparent 55%, rgba(4,4,14,0.35) 80%, rgba(4,4,14,0.55) 100%)
          `,
        }}
      />

      {/* Layer 1 — Atmosphere / horizon haze */}
      <div
        ref={atmosphereRef}
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{
          willChange: 'transform',
          background: `
            radial-gradient(ellipse 90% 12% at 50% 72%, rgba(15,25,50,0.06) 0%, transparent 100%),
            radial-gradient(ellipse 60% 8% at 50% 78%, rgba(10,18,40,0.08) 0%, transparent 100%),
            linear-gradient(to bottom, transparent 50%, rgba(8,12,25,0.04) 75%, rgba(8,12,25,0.08) 100%)
          `,
        }}
      />

      {/* Layer 2 — Ambient environment (vignette, shadows) */}
      <div
        ref={ambientRef}
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{
          willChange: 'transform',
          background: `
            radial-gradient(ellipse 120% 100% at 50% 50%, transparent 45%, rgba(0,0,0,0.35) 100%),
            linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 12%, transparent 85%, rgba(0,0,0,0.1) 100%),
            linear-gradient(to right, rgba(0,0,0,0.08) 0%, transparent 6%, transparent 94%, rgba(0,0,0,0.08) 100%)
          `,
        }}
      />

      {/* Layer 3 — Volumetric lighting */}
      <div
        ref={lightBeamRef}
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{
          willChange: 'transform',
          background: `
            conic-gradient(from 145deg at 30% 60%, rgba(40,80,180,0.015) 0%, transparent 40%, rgba(60,100,200,0.008) 70%, transparent 100%),
            radial-gradient(ellipse 60% 4% at 25% 65%, rgba(60,120,230,0.02) 0%, transparent 100%),
            radial-gradient(ellipse 50% 3% at 75% 55%, rgba(50,100,210,0.015) 0%, transparent 100%),
            radial-gradient(ellipse 70% 6% at 50% 50%, rgba(25,50,120,0.01) 0%, transparent 100%)
          `,
        }}
      />
      </CinematicErrorBoundary>

      {/* Atmospheric Depth Composite */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `
          radial-gradient(ellipse 100% 15% at 50% 75%, rgba(10,18,40,0.05) 0%, transparent 100%),
          linear-gradient(to bottom, rgba(5,5,15,0.03) 0%, transparent 8%, transparent 75%, rgba(5,5,15,0.06) 100%)
        `,
      }} />

      {/* Dynamic Darkness — contrast shaping */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `
          radial-gradient(ellipse 70% 50% at 50% 50%, transparent 35%, rgba(0,0,0,0.1) 100%),
          linear-gradient(to bottom, transparent 45%, rgba(0,0,0,0.05) 100%),
          radial-gradient(ellipse 120% 25% at 50% 0%, rgba(0,0,0,0.08) 0%, transparent 100%)
        `,
      }} />

      {/* Synchronized Corner Brackets */}
      <div className="absolute inset-3 pointer-events-none">
        <div className={`absolute top-0 left-0 w-6 h-6 border-l border-t ${syncColors.bracket}`} />
        <div className={`absolute top-0 right-0 w-6 h-6 border-r border-t ${syncColors.bracket}`} />
        <div className={`absolute bottom-0 left-0 w-6 h-6 border-l border-b ${syncColors.bracket}`} />
        <div className={`absolute bottom-0 right-0 w-6 h-6 border-r border-b ${syncColors.bracket}`} />
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

      {/* Workspace Panels */}
      <FloatingPanel
        id="mission-console"
        title="◇ M-SYS-01 · Mission Console"
        icon="◇"
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
        title="○ MN-SYS-02 · Mentor"
        icon="○"
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
        title="◈ RM-SYS-03 · Roadmap"
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
        title="● TL-SYS-04 · Telemetry"
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

      <FloatingPanel
        id="ops-evidence"
        title="◈ OP-SYS-05 · Ops Evidence"
        icon="◈"
        initialPosition={defaultPositions['ops-evidence']}
        isActive={isPanelActive('ops-evidence')}
      >
        <OpsEvidence />
      </FloatingPanel>



      {/* Bottom Status Bar — operational persistence identity */}
      <div className={`absolute bottom-0 left-0 right-0 h-7 border-t flex items-center justify-between px-4 ${
        environmentTone === 'critical'
          ? 'bg-zinc-950/80 border-red-900/20'
          : 'bg-zinc-950/60 border-zinc-800/20'
      }`}>
        <div className="flex items-center gap-2 text-[9px] font-mono">
          <span className="text-zinc-700">ERA-OS</span>
          <span className="text-zinc-800">/</span>
          <span className={`${continuity.identity.totalOperationalDays > 5 ? 'text-zinc-600' : 'text-zinc-700'}`}>
            s{Math.min(sessionCount, 9999)}
          </span>
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
        <div className="flex items-center gap-3">
          <span className="font-mono text-[9px] text-zinc-800">
            SYS:{sessionCount > 0 ? sessionCount : '--'}
          </span>
          <span className="font-mono text-[9px] text-zinc-800">
            Drag · Focus
          </span>
        </div>
      </div>

      <style>{`
        .workspace-environment {
          transform: translateZ(0);
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