'use client';

import { useState, useEffect } from 'react';
import { FloatingPanel } from './floating-panel';
import { MissionConsole } from './mission-console';
import { MentorSubsystem } from './mentor-subsystem';
import { RoadmapStatus } from './roadmap-status';
import { SystemTelemetry } from './system-telemetry';
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

function WorkspaceContent() {
  const { state, completeBoot, data } = useWorkspaceState();
  const [showBoot, setShowBoot] = useState(true);

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

  return (
    <div className="workspace-environment relative w-full h-screen overflow-hidden bg-zinc-950">
      {/* Ambient Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-900/40 to-zinc-950" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/3 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/3 rounded-full blur-3xl animate-pulse-slow-delay" />
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

      {/* Corner Brackets */}
      <div className="absolute inset-4 pointer-events-none">
        <div className="absolute top-0 left-0 w-12 h-12 border-l border-t border-zinc-700/30" />
        <div className="absolute top-0 right-0 w-12 h-12 border-r border-t border-zinc-700/30" />
        <div className="absolute bottom-0 left-0 w-12 h-12 border-l border-b border-zinc-700/30" />
        <div className="absolute bottom-0 right-0 w-12 h-12 border-r border-b border-zinc-700/30" />
      </div>

      {/* Ambient Scanline */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.015]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-100 to-transparent animate-scanline-slow" />
      </div>

      {/* Status Indicators */}
      <div className="absolute top-6 left-6 flex items-center gap-3 pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500/60 animate-pulse" />
          <span className="font-mono text-[10px] text-zinc-600 uppercase">Online</span>
        </div>
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

      {/* Workspace Panels */}
      <FloatingPanel
        id="mission-console"
        title="MISSION CONSOLE"
        icon="▸"
        initialPosition={defaultPositions['mission-console']}
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
      >
        <SystemTelemetry
          streakCurrent={data.streakCurrent || 0}
          tasksTotal={data.tasksTotal || 0}
          tasksCompleted={data.tasksCompleted || 0}
          logsCount={data.logsCount || 0}
          ctfCount={data.ctfCount || 0}
        />
      </FloatingPanel>

      {/* Center Info */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none opacity-40">
        <div className="font-mono text-xs text-zinc-700 uppercase tracking-[0.3em] mb-2">
          Era OS // Workspace
        </div>
        <div className="font-mono text-4xl text-zinc-800 tracking-widest">
          COMMAND CENTER
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-zinc-950/60 border-t border-zinc-800/20 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] text-zinc-600">ERA-OS v0.1.0</span>
          <span className="text-zinc-800">|</span>
          <span className="font-mono text-[10px] text-zinc-600">SECURE</span>
          <span className="text-zinc-800">|</span>
          <span className="font-mono text-[10px] text-emerald-600/60">● OPERATIONAL</span>
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