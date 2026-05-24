'use client';

import { YEAR1_ROADMAP, YEAR1_MILESTONES, getMonthData } from '@/lib/roadmap';
import type { Task } from '@/types';

const PHASES = [
  { id: 1, title: 'System Foundation', range: [1, 3] as const },
  { id: 2, title: 'Web Security', range: [4, 6] as const },
  { id: 3, title: 'Offensive Operations', range: [7, 9] as const },
  { id: 4, title: 'Specialization', range: [10, 12] as const },
];

function getPhaseStatus(currentMonth: number, range: readonly [number, number]) {
  const [start, end] = range;
  if (currentMonth < start) return 'locked';
  if (currentMonth > end) return 'completed';
  return 'active';
}

function PhaseBlock({
  phase,
  currentMonth,
  doneMonths,
  tasks,
}: {
  phase: (typeof PHASES)[number];
  currentMonth: number;
  doneMonths: number[];
  tasks: Task[];
}) {
  const [start, end] = phase.range;
  const status = getPhaseStatus(currentMonth, phase.range);
  const months = YEAR1_ROADMAP.filter((m) => m.month >= start && m.month <= end);
  const milestone = YEAR1_MILESTONES.find((m) => m.month === end);

  const accentColor =
    status === 'active' ? 'bg-amber-500/60' :
    status === 'completed' ? 'bg-emerald-500/40' :
    'bg-zinc-700/20';

  const borderColor =
    status === 'active' ? 'border-l-amber-500/40' :
    status === 'completed' ? 'border-l-emerald-500/30' :
    'border-l-zinc-800/20';

  return (
    <div className={`rounded-lg border border-l-2 ${borderColor} transition-all duration-200 ${
      status === 'active'
        ? 'bg-zinc-900/60 border-zinc-700/60'
        : status === 'completed'
          ? 'bg-zinc-900/30 border-zinc-800/40'
          : 'bg-zinc-900/15 border-zinc-800/30'
    } ${status === 'locked' ? 'opacity-50' : ''}`}>
      {/* Phase header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="flex items-center gap-2.5">
          <span className={`font-mono text-[11px] font-semibold tracking-wider ${
            status === 'active' ? 'text-amber-400' :
            status === 'completed' ? 'text-emerald-400' :
            'text-zinc-600'
          }`}>
            P{phase.id}
          </span>
          <span className={`font-mono text-xs tracking-widest ${
            status === 'active' ? 'text-zinc-100' :
            status === 'completed' ? 'text-zinc-400' :
            'text-zinc-600'
          }`}>
            {phase.title}
          </span>
          <span className="font-mono text-[10px] text-zinc-700">
            M{String(start).padStart(2, '0')}–M{String(end).padStart(2, '0')}
          </span>
        </div>
        {status === 'active' && (
          <span className="font-mono text-[10px] px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded uppercase tracking-wider">
            Current Phase
          </span>
        )}
        {status === 'completed' && (
          <span className="font-mono text-[10px] text-emerald-500/70 uppercase tracking-wider">
            Completed
          </span>
        )}
        {status === 'locked' && (
          <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-wider">
            Locked
          </span>
        )}
      </div>

      {/* Month rows */}
      <div className="px-4 pb-2 space-y-1">
        {months.map((monthData) => {
          const isCurrent = monthData.month === currentMonth;
          const isDone = doneMonths.includes(monthData.month);
          const monthTasks = tasks.filter((t) => t.month === monthData.month);
          const totalTasks = monthTasks.length;
          const doneCount = monthTasks.filter((t) => t.status === 'done').length;
          const engagedCount = monthTasks.filter((t) => t.status === 'in_progress').length;
          const isFuture = monthData.month > currentMonth && !isDone;

          const statusColor =
            isDone ? 'text-emerald-400/80' :
            isCurrent ? 'text-zinc-100' :
            'text-zinc-600';

          return (
            <div
              key={monthData.month}
              className={`flex items-center justify-between py-1.5 group ${
                isCurrent ? 'bg-zinc-800/20 -mx-2 px-2 rounded' : ''
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {isCurrent && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 shadow-[0_0_6px_rgba(251,191,36,0.4)]" />
                )}
                {isDone && (
                  <span className="text-emerald-500/60 text-xs shrink-0">✓</span>
                )}
                {isFuture && (
                  <span className="text-zinc-700 text-xs shrink-0">—</span>
                )}
                <span className={`font-mono text-[10px] tracking-wider shrink-0 ${
                  isDone ? 'text-zinc-400' :
                  isCurrent ? 'text-amber-400/80' :
                  'text-zinc-600'
                }`}>
                  M{String(monthData.month).padStart(2, '0')}
                </span>
                <span className={`font-mono text-sm truncate ${statusColor}`}>
                  {monthData.title}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-2">
                {/* Task count */}
                {totalTasks > 0 && (
                  <span className={`font-mono text-[10px] ${
                    isDone ? 'text-emerald-500/60' :
                    isCurrent ? 'text-zinc-500' :
                    'text-zinc-700'
                  }`}>
                    {doneCount}/{totalTasks}
                    {engagedCount > 0 && isCurrent && (
                      <span className="text-blue-400/60 ml-1">· {engagedCount} active</span>
                    )}
                  </span>
                )}
                {totalTasks === 0 && !isFuture && (
                  <span className="font-mono text-[10px] text-zinc-700">
                    0/0
                  </span>
                )}
                {/* Checkpoint indicator for phase-ending month */}
                {milestone && monthData.month === milestone.month && (
                  <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded border tracking-wider ${
                    isDone
                      ? 'text-emerald-500/60 border-emerald-500/20 bg-emerald-500/5'
                      : isCurrent
                        ? 'text-zinc-600 border-zinc-700/40 bg-zinc-800/30'
                        : 'text-zinc-700 border-zinc-800/20'
                  }`}>
                    Checkpoint
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BriefSection({ currentMonth, tasks }: { currentMonth: number; tasks: Task[] }) {
  const monthData = getMonthData(currentMonth);
  if (!monthData) return null;

  const monthTasks = tasks.filter((t) => t.month === currentMonth);
  const totalTasks = monthTasks.length;
  const doneCount = monthTasks.filter((t) => t.status === 'done').length;
  const engagedCount = monthTasks.filter((t) => t.status === 'in_progress').length;
  const pendingCount = totalTasks - doneCount - engagedCount;

  return (
    <div className="p-4 bg-zinc-900/40 border border-zinc-800/40 rounded-lg space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-sm bg-amber-500" />
          <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
            Current Operational Brief
          </span>
        </div>
        <span className="font-mono text-xs text-zinc-600">
          M{String(currentMonth).padStart(2, '0')} · {monthData.title}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-wider mb-2">
            Objectives
          </p>
          <div className="flex flex-wrap gap-1.5">
            {monthData.focus.slice(0, 5).map((f, i) => (
              <span
                key={i}
                className="font-mono text-[10px] px-2 py-1 bg-zinc-800/40 text-zinc-400 rounded border border-zinc-700/30"
              >
                {f}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-wider mb-2">
            Key Deliverables
          </p>
          <div className="space-y-1">
            {monthData.deliverables.slice(0, 3).map((d, i) => (
              <p key={i} className="font-mono text-xs text-zinc-400">
                › {d}
              </p>
            ))}
          </div>
        </div>
      </div>

      {totalTasks > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-wider">
              Task Progress
            </p>
            <p className="font-mono text-[10px] text-zinc-500">
              {doneCount} done{engagedCount > 0 ? ` · ${engagedCount} active` : ''}{pendingCount > 0 ? ` · ${pendingCount} pending` : ''}
            </p>
          </div>
          <div className="h-1 bg-zinc-800/80 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-500/60 to-emerald-500/40 rounded-full transition-all duration-300"
              style={{ width: `${Math.round((doneCount / totalTasks) * 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

interface OperationalRoadmapProps {
  currentMonth: number;
  doneMonths: number[];
  tasks: Task[];
}

export function OperationalRoadmap({ currentMonth, doneMonths, tasks }: OperationalRoadmapProps) {
  const progress = Math.round((currentMonth / 12) * 100);
  const currentPhase = PHASES.find(
    (p) => currentMonth >= p.range[0] && currentMonth <= p.range[1],
  ) || PHASES[0];

  return (
    <div className="space-y-4">
      {/* Summary bar */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest">
              Year 1 · Phase {currentPhase.id} of 4
            </span>
            <span className="font-mono text-[10px] px-2 py-0.5 bg-zinc-800/60 text-zinc-500 rounded border border-zinc-700/40">
              M{currentMonth}/12
            </span>
          </div>
          <span className="font-mono text-xs tabular-nums text-zinc-400">{progress}%</span>
        </div>
        <div className="h-1.5 bg-zinc-800/80 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-red-500/50 via-amber-500/40 to-emerald-500/30 rounded-full transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Phase blocks */}
      <div className="space-y-2.5">
        {PHASES.map((phase) => (
          <PhaseBlock
            key={phase.id}
            phase={phase}
            currentMonth={currentMonth}
            doneMonths={doneMonths}
            tasks={tasks}
          />
        ))}
      </div>

      <BriefSection currentMonth={currentMonth} tasks={tasks} />
    </div>
  );
}
