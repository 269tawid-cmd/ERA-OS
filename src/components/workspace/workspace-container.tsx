'use client';

import { FloatingPanel } from './floating-panel';
import { MissionConsole } from './mission-console';
import { MentorSubsystem } from './mentor-subsystem';
import { RoadmapStatus } from './roadmap-status';
import { SystemTelemetry } from './system-telemetry';

interface WorkspaceContainerProps {
  children?: React.ReactNode;
}

export function WorkspaceContainer({ children }: WorkspaceContainerProps) {
  return (
    <div className="workspace-container relative w-full h-screen overflow-hidden">
      {children}
    </div>
  );
}

export interface WorkspaceModuleProps {
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
  data: WorkspaceModuleProps;
}

export function Workspace({ data }: WorkspaceProps) {
  const {
    tasks = [],
    pillarXP = {},
    streakCurrent = 0,
    currentMonth = 1,
    startDate,
    progress,
    logsCount = 0,
    ctfCount = 0,
    tasksTotal = 0,
    tasksCompleted = 0,
  } = data;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-zinc-950">
      {/* Atmospheric Layers */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-900/50 to-zinc-950" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
      </div>
      
      {/* Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(zinc-500 1px, transparent 1px),
              linear-gradient(90deg, zinc-500 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      </div>
      
      {/* Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-100 to-transparent animate-scanline" />
      </div>
      
      {/* Corner Brackets */}
      <div className="absolute inset-4 pointer-events-none">
        <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-zinc-700/40" />
        <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-zinc-700/40" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-zinc-700/40" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-zinc-700/40" />
      </div>
      
      {/* Floating Modules */}
      <FloatingPanel
        id="mission-console"
        title="MISSION CONSOLE"
        icon="▸"
        initialPosition={{ x: 40, y: 80 }}
      >
        <MissionConsole tasks={tasks} currentMonth={currentMonth} />
      </FloatingPanel>
      
      <FloatingPanel
        id="mentor-subsystem"
        title="MENTOR SUBSYSTEM"
        icon="◆"
        initialPosition={{ x: 40, y: 380 }}
      >
        <MentorSubsystem 
          pillarXP={pillarXP}
          streakCurrent={streakCurrent}
          currentMonth={currentMonth}
        />
      </FloatingPanel>
      
      <FloatingPanel
        id="roadmap-status"
        title="ROADMAP STATUS"
        icon="◈"
        initialPosition={{ x: 400, y: 80 }}
      >
        <RoadmapStatus
          currentMonth={currentMonth}
          startDate={startDate}
          progress={progress}
          tasksCompleted={tasksCompleted}
          totalTasks={tasksTotal}
        />
      </FloatingPanel>
      
      <FloatingPanel
        id="system-telemetry"
        title="SYSTEM TELEMETRY"
        icon="●"
        initialPosition={{ x: 400, y: 380 }}
      >
        <SystemTelemetry
          streakCurrent={streakCurrent}
          tasksTotal={tasksTotal}
          tasksCompleted={tasksCompleted}
          logsCount={logsCount}
          ctfCount={ctfCount}
        />
      </FloatingPanel>
      
      {/* Center Info */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
        <div className="font-mono text-xs text-zinc-700 uppercase tracking-[0.3em] mb-2">
          Era OS // Workspace
        </div>
        <div className="font-mono text-4xl text-zinc-800 tracking-widest">
          COMMAND CENTER
        </div>
        <div className="font-mono text-[10px] text-zinc-700 mt-2">
          Drag modules to rearrange • Click header to focus
        </div>
      </div>
      
      {/* Bottom Status Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-zinc-950/80 border-t border-zinc-800/40 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] text-zinc-600">ERA-OS v0.1.0</span>
          <span className="font-mono text-[10px] text-zinc-700">•</span>
          <span className="font-mono text-[10px] text-zinc-600">SECURE</span>
          <span className="font-mono text-[10px] text-zinc-700">•</span>
          <span className="font-mono text-[10px] text-emerald-600">SYSTEM ACTIVE</span>
        </div>
        <div className="font-mono text-[10px] text-zinc-600">
          Drag panels to customize workspace
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        .animate-scanline {
          animation: scanline 8s linear infinite;
        }
        .floating-panel:hover {
          border-color: rgba(63, 63, 70, 0.8);
        }
        .panel-header:active {
          cursor: grabbing;
        }
      `}</style>
    </div>
  );
}