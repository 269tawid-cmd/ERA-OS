'use client';

import { Component, useState, useEffect, useRef, type ReactNode } from 'react';
import { FloatingPanel } from './floating-panel';
import type { DepthLevel } from './floating-panel';
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

const WORLD_WIDTH = 3400;
const MAX_CAMERA_X = WORLD_WIDTH - 1200;

/* ─── Fixed world positions — panels never move ─── */
interface WorldPanel {
  id: string;
  x: number;
  y: number;
  depth: DepthLevel;
  title: string;
  glyph: string;
}
const WORLD_PANELS: WorldPanel[] = [
  { id: 'mission-console',  x: 140,  y: 100,  depth: 0, title: '◇ M-SYS-01 · Mission Console', glyph: '◇' },
  { id: 'mentor-subsystem', x: 140,  y: 430,  depth: 1, title: '○ MN-SYS-02 · Mentor',        glyph: '○' },
  { id: 'roadmap-status',   x: 1480, y: 100,  depth: 1, title: '◈ RM-SYS-03 · Roadmap',       glyph: '◈' },
  { id: 'system-telemetry', x: 1880, y: 380,  depth: 2, title: '● TL-SYS-04 · Telemetry',      glyph: '●' },
  { id: 'ops-evidence',     x: 140,  y: 680,  depth: 2, title: '◈ OP-SYS-05 · Ops Evidence',   glyph: '◈' },
];

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
  } = context;

  useEffect(() => {
    const hasVisited = typeof window !== 'undefined' && 
      localStorage.getItem('era-os-workspace-state');
    if (hasVisited) {
      setShowBoot(false);
      completeBoot();
    }
  }, [completeBoot]);

  const [dateStr, setDateStr] = useState('');
  useEffect(() => {
    setDateStr(new Date().toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric'
    }));
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

  /* ─── Scene tone ─── */
  const getSceneTone = () => {
    if (rhythmState === 'momentum') {
      return { ground: 'rgba(5,20,15,0.12)', beam: 'rgba(50,180,120,0.04)', tint: 'rgba(15,30,20,0.08)' };
    }
    if (rhythmState === 'overload' || rhythmState === 'fatigue') {
      return { ground: 'rgba(25,15,5,0.15)', beam: 'rgba(200,100,30,0.05)', tint: 'rgba(30,20,10,0.10)' };
    }
    switch (environmentTone) {
      case 'critical':
        return { ground: 'rgba(30,5,5,0.18)', beam: 'rgba(220,40,40,0.06)', tint: 'rgba(35,10,10,0.12)' };
      case 'tense':
        return { ground: 'rgba(25,15,5,0.12)', beam: 'rgba(200,100,30,0.04)', tint: 'rgba(30,20,10,0.08)' };
      case 'calm':
        return { ground: 'rgba(5,20,15,0.08)', beam: 'rgba(50,180,120,0.03)', tint: 'rgba(15,30,20,0.05)' };
      default:
        return { ground: 'rgba(10,12,18,0.08)', beam: 'rgba(60,80,120,0.03)', tint: 'rgba(10,12,18,0.05)' };
    }
  };
  const sceneTone = getSceneTone();

  /* ─── Tone-consistent bracket / dot colors ─── */
  const bracketColor = (() => {
    if (rhythmState === 'momentum') return 'border-emerald-700/40';
    if (rhythmState === 'overload' || rhythmState === 'fatigue') return 'border-amber-700/40';
    switch (environmentTone) {
      case 'critical': return 'border-red-700/40';
      case 'tense': return 'border-amber-700/40';
      case 'calm': return 'border-emerald-700/40';
      default: return 'border-zinc-700/30';
    }
  })();

  const dotColor = environmentTone === 'critical' ? 'bg-red-500/80' :
    environmentTone === 'tense' ? 'bg-amber-500/80' :
    environmentTone === 'calm' ? 'bg-emerald-500/80' :
    'bg-zinc-500/80';

  const pressure = (() => {
    switch (operationalPressure) {
      case 'critical': return { text: 'CRITICAL', color: 'text-red-500' };
      case 'high':     return { text: 'ELEVATED',  color: 'text-amber-500' };
      case 'medium':   return { text: 'MODERATE',  color: 'text-zinc-400' };
      default:         return { text: 'NOMINAL',   color: 'text-emerald-600' };
    }
  })();

  /* ─── Camera refs ─── */
  const sceneRootRef = useRef<HTMLDivElement>(null);
  const starRef = useRef<HTMLDivElement>(null);
  const farRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const nearRef = useRef<HTMLDivElement>(null);
  const hazeRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);

  /* ─── Camera state (inertial right-click pan) ─── */
  const cameraX = useRef(0);
  const cameraVel = useRef(0);
  const isPanning = useRef(false);
  const panAnchor = useRef({ x: 0, camX: 0 });
  const prevDragX = useRef(0);
  const dragDelta = useRef(0);

  /* ─── Perspective rotation (mouse-lens, not UI) ─── */
  const mouseNX = useRef(0);
  const mouseNY = useRef(0);
  const rotVelX = useRef(0);
  const rotVelY = useRef(0);
  const rotX = useRef(0);
  const rotY = useRef(0);
  const rafId = useRef(0);
  const mountedRef = useRef(false);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    reducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lowEndDevice = typeof navigator !== 'undefined' && navigator.hardwareConcurrency <= 4;
    const skipEffects = reducedMotionRef.current || lowEndDevice;

    const layerSpeeds = [0.02, 0.08, 0.15, 0.25, 0.05];
    const layerRefs = [starRef, farRef, midRef, nearRef, hazeRef];

    let paused = false;

    const onMouseMove = (e: MouseEvent) => {
      mouseNX.current = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseNY.current = (e.clientY / window.innerHeight - 0.5) * 2;

      if (isPanning.current) {
        const rawDelta = panAnchor.current.x - e.clientX;
        dragDelta.current = rawDelta - (panAnchor.current.x - prevDragX.current);
        prevDragX.current = e.clientX;
        cameraX.current = Math.max(0, Math.min(MAX_CAMERA_X, panAnchor.current.camX + rawDelta));
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 2) return;
      e.preventDefault();
      isPanning.current = true;
      panAnchor.current = { x: e.clientX, camX: cameraX.current };
      prevDragX.current = e.clientX;
      dragDelta.current = 0;
      cameraVel.current = 0;
      document.body.style.cursor = 'grabbing';
    };

    const onMouseUp = (e: MouseEvent) => {
      if (e.button !== 2) return;
      isPanning.current = false;
      document.body.style.cursor = '';
      cameraVel.current = dragDelta.current * 1.5;
    };

    const onContextMenu = (e: Event) => { e.preventDefault(); };
    const onVisibilityChange = () => { paused = document.hidden; };

    document.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('contextmenu', onContextMenu);
    document.addEventListener('visibilitychange', onVisibilityChange);

    const animate = () => {
      if (!mountedRef.current) { rafId.current = requestAnimationFrame(animate); return; }

      if (!paused) {
        /* ── Camera coast (inertia) ── */
        if (!isPanning.current) {
          cameraVel.current *= 0.90;
          cameraX.current += cameraVel.current;
          cameraX.current = Math.max(0, Math.min(MAX_CAMERA_X, cameraX.current));
          if (Math.abs(cameraVel.current) < 0.15) cameraVel.current = 0;
        }

        /* ── Perspective lens rotation (always active) ── */
        if (!skipEffects) {
          const pullX = (mouseNX.current - rotX.current) * 0.04;
          const pullY = (mouseNY.current - rotY.current) * 0.04;
          rotVelX.current += (pullX - rotVelX.current) * 0.06;
          rotVelY.current += (pullY - rotVelY.current) * 0.06;
          rotVelX.current *= 0.88;
          rotVelY.current *= 0.88;
          rotX.current += rotVelX.current;
          rotY.current += rotVelY.current;

          const rx = Math.max(-0.6, Math.min(0.6, isFinite(rotX.current) ? rotX.current : 0));
          const ry = Math.max(-0.4, Math.min(0.4, isFinite(rotY.current) ? rotY.current : 0));

          /* ── Scene root — camera pan + lens rotation ── */
          if (sceneRootRef.current) {
            sceneRootRef.current.style.transform = `
              translateX(${-cameraX.current}px)
              rotateX(${ry * 0.25}deg)
              rotateY(${rx * -0.4}deg)
            `;
          }

          /* ── Parallax layers — move at fraction of camera ── */
          const cx = cameraX.current;
          for (let i = 0; i < layerRefs.length; i++) {
            const ref = layerRefs[i];
            if (!ref.current) continue;
            ref.current.style.transform = `translateX(${cx * (1 - layerSpeeds[i])}px)`;
          }
        } else {
          if (sceneRootRef.current) {
            sceneRootRef.current.style.transform = `translateX(${-cameraX.current}px)`;
          }
        }
      }

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
      mountedRef.current = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('contextmenu', onContextMenu);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div className="workspace-environment relative w-full h-screen overflow-hidden bg-[#020208] select-none">

      {/* ─── Cinematic Scene Root — moves with camera ─── */}
      <CinematicErrorBoundary>
      <div
        ref={sceneRootRef}
        className="absolute inset-0"
        style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
      >
        {/* Layer 0 — Deep space / stars (parallax 0.02) */}
        <div
          ref={starRef}
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{
            width: '400vw',
            willChange: 'transform',
            background: `
              linear-gradient(to bottom, #010105 0%, #03030a 35%, #050510 60%, #080816 100%),
              radial-gradient(ellipse 100% 8% at 50% 85%, ${sceneTone.ground} 0%, transparent 100%)
            `,
            backgroundBlendMode: 'normal, screen',
          }}
        >
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(0.5px 0.5px at 10% 15%, rgba(255,255,255,0.4), transparent),
              radial-gradient(0.5px 0.5px at 25% 8%, rgba(255,255,255,0.3), transparent),
              radial-gradient(1px 1px at 40% 22%, rgba(255,255,255,0.2), transparent),
              radial-gradient(0.5px 0.5px at 55% 12%, rgba(255,255,255,0.35), transparent),
              radial-gradient(0.5px 0.5px at 70% 5%, rgba(255,255,255,0.25), transparent),
              radial-gradient(1px 1px at 85% 18%, rgba(255,255,255,0.2), transparent),
              radial-gradient(0.5px 0.5px at 15% 35%, rgba(255,255,255,0.15), transparent),
              radial-gradient(1px 1px at 60% 28%, rgba(255,255,255,0.2), transparent),
              radial-gradient(0.5px 0.5px at 90% 32%, rgba(255,255,255,0.2), transparent),
              radial-gradient(0.5px 0.5px at 35% 40%, rgba(255,255,255,0.15), transparent),
              radial-gradient(1px 1px at 50% 10%, rgba(255,220,180,0.15), transparent),
              radial-gradient(0.5px 0.5px at 75% 20%, rgba(255,200,150,0.1), transparent),
              radial-gradient(1px 1px at 20% 25%, rgba(200,220,255,0.12), transparent),
              radial-gradient(0.5px 0.5px at 45% 30%, rgba(180,200,255,0.1), transparent),
              radial-gradient(0.5px 0.5px at 80% 40%, rgba(255,220,180,0.08), transparent)
            `,
          }} />
        </div>

        {/* Layer 1 — Far skyline (parallax 0.08) */}
        <div
          ref={farRef}
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{
            width: '400vw',
            willChange: 'transform',
            filter: 'blur(5px)',
            opacity: 0.3,
            backgroundImage: `
              linear-gradient(180deg, transparent 62%, rgba(5,8,18,0.4) 65%, rgba(4,6,14,0.3) 70%, transparent 72%),
              repeating-linear-gradient(90deg,
                transparent 0, transparent 18px,
                rgba(6,10,22,0.5) 18px, rgba(6,10,22,0.5) 22px,
                transparent 22px, transparent 28px,
                rgba(7,11,24,0.4) 28px, rgba(7,11,24,0.4) 31px,
                transparent 31px, transparent 40px,
                rgba(5,9,20,0.45) 40px, rgba(5,9,20,0.45) 42px,
                transparent 42px, transparent 48px,
                rgba(8,12,25,0.35) 48px, rgba(8,12,25,0.35) 50px,
                transparent 50px, transparent 58px,
                rgba(6,10,22,0.4) 58px, rgba(6,10,22,0.4) 60px,
                transparent 60px, transparent 68px,
                rgba(7,11,24,0.35) 68px, rgba(7,11,24,0.35) 70px,
                transparent 70px, transparent 78px,
                rgba(5,9,20,0.5) 78px, rgba(5,9,20,0.5) 80px,
                transparent 80px, transparent 88px,
                rgba(8,12,25,0.3) 88px, rgba(8,12,25,0.3) 90px,
                transparent 90px, transparent 100px
              ),
              repeating-linear-gradient(90deg,
                transparent 0, transparent 30px,
                rgba(180,200,230,0.02) 30px, rgba(180,200,230,0.02) 30.5px,
                transparent 30.5px, transparent 60px,
                rgba(200,220,240,0.015) 60px, rgba(200,220,240,0.015) 60.5px,
                transparent 60.5px, transparent 90px,
                rgba(160,190,220,0.025) 90px, rgba(160,190,220,0.025) 90.5px,
                transparent 90.5px, transparent 120px
              )
            `,
            backgroundRepeat: 'repeat-x',
            backgroundSize: 'auto 100%',
          }}
        />

        {/* Layer 2 — Mid skyline (parallax 0.15) */}
        <div
          ref={midRef}
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{
            width: '400vw',
            willChange: 'transform',
            filter: 'blur(2.5px)',
            opacity: 0.45,
            backgroundImage: `
              linear-gradient(180deg, transparent 65%, rgba(6,10,20,0.5) 68%, rgba(5,8,16,0.35) 73%, transparent 76%),
              repeating-linear-gradient(90deg,
                transparent 0, transparent 12px,
                rgba(8,12,26,0.6) 12px, rgba(8,12,26,0.6) 16px,
                transparent 16px, transparent 22px,
                rgba(10,14,28,0.5) 22px, rgba(10,14,28,0.5) 28px,
                transparent 28px, transparent 34px,
                rgba(7,11,24,0.55) 34px, rgba(7,11,24,0.55) 36px,
                transparent 36px, transparent 42px,
                rgba(9,13,27,0.4) 42px, rgba(9,13,27,0.4) 45px,
                transparent 45px, transparent 52px,
                rgba(8,12,26,0.5) 52px, rgba(8,12,26,0.5) 54px,
                transparent 54px, transparent 60px,
                rgba(11,15,30,0.45) 60px, rgba(11,15,30,0.45) 64px,
                transparent 64px, transparent 72px,
                rgba(7,11,24,0.55) 72px, rgba(7,11,24,0.55) 74px,
                transparent 74px, transparent 82px,
                rgba(10,14,28,0.4) 82px, rgba(10,14,28,0.4) 84px,
                transparent 84px, transparent 92px,
                rgba(8,12,26,0.5) 92px, rgba(8,12,26,0.5) 95px,
                transparent 95px, transparent 104px
              ),
              repeating-linear-gradient(90deg,
                transparent 0, transparent 16px,
                rgba(255,200,120,0.04) 16px, rgba(255,200,120,0.04) 16.3px,
                transparent 16.3px, transparent 32px,
                rgba(255,210,140,0.03) 32px, rgba(255,210,140,0.03) 32.3px,
                transparent 32.3px, transparent 48px,
                rgba(200,220,255,0.035) 48px, rgba(200,220,255,0.035) 48.3px,
                transparent 48.3px, transparent 64px,
                rgba(255,190,100,0.05) 64px, rgba(255,190,100,0.05) 64.3px,
                transparent 64.3px, transparent 80px,
                rgba(255,220,160,0.03) 80px, rgba(255,220,160,0.03) 80.3px,
                transparent 80.3px, transparent 96px,
                rgba(180,210,255,0.04) 96px, rgba(180,210,255,0.04) 96.3px,
                transparent 96.3px, transparent 112px
              )
            `,
            backgroundRepeat: 'repeat-x',
            backgroundSize: 'auto 100%',
          }}
        />

        {/* Layer 3 — Near skyline (parallax 0.25) */}
        <div
          ref={nearRef}
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{
            width: '400vw',
            willChange: 'transform',
            filter: 'blur(1px)',
            opacity: 0.6,
            backgroundImage: `
              linear-gradient(180deg, transparent 70%, rgba(5,8,18,0.6) 73%, rgba(4,6,14,0.4) 78%, transparent 82%),
              repeating-linear-gradient(90deg,
                transparent 0, transparent 8px,
                rgba(8,12,26,0.7) 8px, rgba(8,12,26,0.7) 13px,
                transparent 13px, transparent 18px,
                rgba(10,15,30,0.6) 18px, rgba(10,15,30,0.6) 24px,
                transparent 24px, transparent 30px,
                rgba(7,11,24,0.65) 30px, rgba(7,11,24,0.65) 33px,
                transparent 33px, transparent 38px,
                rgba(9,14,28,0.55) 38px, rgba(9,14,28,0.55) 42px,
                transparent 42px, transparent 48px,
                rgba(8,12,26,0.7) 48px, rgba(8,12,26,0.7) 50px,
                transparent 50px, transparent 56px,
                rgba(11,16,32,0.5) 56px, rgba(11,16,32,0.5) 58px,
                transparent 58px, transparent 64px,
                rgba(8,12,26,0.6) 64px, rgba(8,12,26,0.6) 67px,
                transparent 67px, transparent 74px,
                rgba(10,15,30,0.55) 74px, rgba(10,15,30,0.55) 76px,
                transparent 76px, transparent 84px,
                rgba(7,11,24,0.65) 84px, rgba(7,11,24,0.65) 86px,
                transparent 86px, transparent 94px,
                rgba(9,14,28,0.6) 94px, rgba(9,14,28,0.6) 97px,
                transparent 97px, transparent 106px
              ),
              repeating-linear-gradient(90deg,
                transparent 0, transparent 10px,
                rgba(255,200,120,0.06) 10px, rgba(255,200,120,0.06) 10.3px,
                transparent 10.3px, transparent 20px,
                rgba(255,180,100,0.04) 20px, rgba(255,180,100,0.04) 20.3px,
                transparent 20.3px, transparent 30px,
                rgba(200,220,255,0.05) 30px, rgba(200,220,255,0.05) 30.3px,
                transparent 30.3px, transparent 40px,
                rgba(255,210,140,0.07) 40px, rgba(255,210,140,0.07) 40.3px,
                transparent 40.3px, transparent 50px,
                rgba(255,190,110,0.04) 50px, rgba(255,190,110,0.04) 50.3px,
                transparent 50.3px, transparent 60px,
                rgba(180,210,255,0.06) 60px, rgba(180,210,255,0.06) 60.3px,
                transparent 60.3px, transparent 70px,
                rgba(255,220,150,0.05) 70px, rgba(255,220,150,0.05) 70.3px,
                transparent 70.3px, transparent 80px,
                rgba(255,200,130,0.06) 80px, rgba(255,200,130,0.06) 80.3px,
                transparent 80.3px, transparent 90px,
                rgba(220,240,255,0.04) 90px, rgba(220,240,255,0.04) 90.3px,
                transparent 90.3px, transparent 100px,
                rgba(255,180,100,0.05) 100px, rgba(255,180,100,0.05) 100.3px,
                transparent 100.3px, transparent 110px
              )
            `,
            backgroundRepeat: 'repeat-x',
            backgroundSize: 'auto 100%',
          }}
        />

        {/* Layer 4 — Atmospheric haze (parallax 0.05) */}
        <div
          ref={hazeRef}
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{
            width: '300vw',
            willChange: 'transform',
            background: `
              linear-gradient(to bottom, transparent 45%, ${sceneTone.tint} 65%, ${sceneTone.ground} 100%),
              linear-gradient(135deg, rgba(80,120,200,0.008) 0%, transparent 45%, transparent 100%),
              radial-gradient(ellipse 80% 10% at 50% 82%, rgba(15,25,50,0.04) 0%, transparent 100%),
              radial-gradient(ellipse 60% 5% at 30% 78%, rgba(60,100,180,0.02) 0%, transparent 100%),
              radial-gradient(ellipse 40% 4% at 70% 80%, rgba(30,60,120,0.015) 0%, transparent 100%)
            `,
          }}
        />

        {/* Layer 5 — Volumetric beams (world-fixed, parallax 1.0) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{
          width: `${WORLD_WIDTH}px`,
          background: `
            conic-gradient(from 148deg at 30% 65%, ${sceneTone.beam} 0%, transparent 35%, transparent 65%, ${sceneTone.beam} 85%, transparent 100%),
            radial-gradient(ellipse 50% 3% at 25% 70%, rgba(60,120,220,0.015) 0%, transparent 100%),
            radial-gradient(ellipse 40% 2.5% at 75% 60%, rgba(50,100,200,0.01) 0%, transparent 100%)
          `,
        }} />

        {/* ─── World Container — fixed spatial zones ─── */}
        <div
          ref={worldRef}
          className="absolute top-0 left-0"
          style={{ width: `${WORLD_WIDTH}px`, height: '100vh' }}
        >
          {WORLD_PANELS.map((wp) => (
            <div
              key={wp.id}
              className="absolute"
              style={{ left: wp.x, top: wp.y }}
            >
              <FloatingPanel
                id={wp.id}
                title={wp.title}
                icon={wp.glyph}
                isActive={isPanelActive(wp.id)}
                depth={wp.depth}
              >
                {wp.id === 'mission-console' && (
                  <MissionConsole
                    tasks={data.tasks || []}
                    currentMonth={data.currentMonth || 1}
                  />
                )}
                {wp.id === 'mentor-subsystem' && (
                  <MentorSubsystem
                    pillarXP={data.pillarXP || {}}
                    streakCurrent={data.streakCurrent || 0}
                    currentMonth={data.currentMonth || 1}
                  />
                )}
                {wp.id === 'roadmap-status' && (
                  <RoadmapStatus
                    currentMonth={data.currentMonth || 1}
                    startDate={data.startDate}
                    progress={data.progress}
                    tasksCompleted={data.tasksCompleted || 0}
                    totalTasks={data.tasksTotal || 0}
                  />
                )}
                {wp.id === 'system-telemetry' && (
                  <SystemTelemetry
                    streakCurrent={data.streakCurrent || 0}
                    tasksTotal={data.tasksTotal || 0}
                    tasksCompleted={data.tasksCompleted || 0}
                    logsCount={data.logsCount || 0}
                    ctfCount={data.ctfCount || 0}
                  />
                )}
                {wp.id === 'ops-evidence' && <OpsEvidence />}
              </FloatingPanel>
            </div>
          ))}
        </div>
      </div>
      </CinematicErrorBoundary>

      {/* ─── Viewport-fixed HUD ─── */}
      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{
        zIndex: 10,
        background: `
          radial-gradient(ellipse 130% 100% at 50% 50%, transparent 40%, rgba(0,0,0,0.4) 100%),
          linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 10%, transparent 88%, rgba(0,0,0,0.08) 100%),
          linear-gradient(to right, rgba(0,0,0,0.06) 0%, transparent 5%, transparent 95%, rgba(0,0,0,0.06) 100%)
        `,
      }} />

      {/* Corner brackets — cinematic framing */}
      <div className="absolute inset-3 pointer-events-none" style={{ zIndex: 11 }}>
        <div className={`absolute top-0 left-0 w-6 h-6 border-l border-t ${bracketColor}`} />
        <div className={`absolute top-0 right-0 w-6 h-6 border-r border-t ${bracketColor}`} />
        <div className={`absolute bottom-0 left-0 w-6 h-6 border-l border-b ${bracketColor}`} />
        <div className={`absolute bottom-0 right-0 w-6 h-6 border-r border-b ${bracketColor}`} />
      </div>

      {/* Status indicators — HUD */}
      <div className="absolute top-6 left-6 flex items-center gap-4 pointer-events-none" style={{ zIndex: 11 }}>
        <div className="flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-sm ${dotColor}`} />
          <span className={`font-mono text-[10px] uppercase ${pressure.color}`}>
            {pressure.text}
          </span>
        </div>
        {daysBehindRoadmap > 7 && (
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-sm bg-amber-500/60" />
            <span className="font-mono text-[10px] text-amber-500/60">
              {daysBehindRoadmap}d behind
            </span>
          </div>
        )}
      </div>

      {/* Time display — HUD */}
      <div className="absolute top-6 right-6 pointer-events-none" style={{ zIndex: 11 }}>
        <div className="font-mono text-xs text-zinc-600 uppercase tracking-widest">
          {dateStr}
        </div>
      </div>

      {/* Operational Lifecycle — HUD */}
      {lifecycle && (
        <div className="absolute bottom-28 right-6 pointer-events-none" style={{ zIndex: 11 }}>
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-sm ${
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

      {/* Bottom Status Bar */}
      <div className={`absolute bottom-0 left-0 right-0 h-7 border-t flex items-center justify-between px-4 ${
        environmentTone === 'critical'
          ? 'bg-zinc-950/80 border-red-900/20'
          : 'bg-zinc-950/60 border-zinc-800/20'
      }`} style={{ zIndex: 12 }}>
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
          <span className={`${dotColor.replace('bg-', 'text-')}`}>●</span>
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
            Right-click · Pan
          </span>
        </div>
      </div>

      <style>{`
        .workspace-environment {
          perspective: 900px;
          perspective-origin: 50% 50%;
          overflow: hidden;
          cursor: default;
        }
        .floating-panel {
          backface-visibility: hidden;
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
