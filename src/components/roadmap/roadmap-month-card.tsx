'use client';

import { useState } from 'react';

import { YEAR1_MILESTONES } from '@/lib/roadmap';
import type { MonthlyRoadmap, Task } from '@/types';

interface RoadmapMonthCardProps {
  monthData: MonthlyRoadmap;
  currentMonth: number;
  tasks: Task[];
}

export function RoadmapMonthCard({ monthData, currentMonth, tasks }: RoadmapMonthCardProps) {
  const [expanded, setExpanded] = useState(false);
  const isCurrent = monthData.month === currentMonth;
  const isPast = monthData.month < currentMonth;
  const milestone = YEAR1_MILESTONES.find((m) => m.month === monthData.month);

  const monthTasks = tasks.filter((t) => t.month === monthData.month);
  const completedTasks = monthTasks.filter((t) => t.status === 'done').length;
  const totalTasks = monthTasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div
      className={`relative group transition-all duration-200 ${
        isCurrent ? 'ring-1 ring-red-500/30 rounded-lg' : ''
      }`}
    >
      <div
        className={`p-4 rounded-lg border cursor-pointer transition-colors duration-150 ${
          isCurrent
            ? 'bg-zinc-900/80 border-red-500/30'
            : isPast
            ? 'bg-zinc-900/60 border-zinc-800/60'
            : 'bg-zinc-900/40 border-zinc-800/40 hover:border-zinc-700/60'
        }`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
<span
              className={`font-mono text-xs ${
                isCurrent ? 'text-red-400' : isPast ? 'text-zinc-400' : 'text-zinc-500'
              }`}
            >
              {monthData.month.toString().padStart(2, '0')}
            </span>
            {isCurrent && (
              <span className="font-mono text-xs px-2 py-0.5 bg-red-500/10 text-red-400 border border-red-500/30 rounded uppercase tracking-wider">
                Current
              </span>
            )}
            {milestone && isPast && (
              <span className="font-mono text-xs text-amber-400">★ Milestone</span>
            )}
          </div>
          <span className="font-mono text-xs text-zinc-400">
            {completedTasks}/{totalTasks}
          </span>
        </div>

        <h3
          className={`font-mono text-base font-semibold mb-2 ${
            isCurrent ? 'text-zinc-100' : isPast ? 'text-zinc-300' : 'text-zinc-500'
          }`}
        >
          {monthData.title}
        </h3>

        <div className="h-1.5 bg-zinc-800/60 rounded-full overflow-hidden mt-2 mb-2">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isCurrent ? 'bg-red-500/60' : isPast ? 'bg-emerald-500/40' : 'bg-zinc-700/40'
            }`}
            style={{ width: `${completionRate}%` }}
          />
        </div>

        <p className="font-mono text-xs text-zinc-500">
          {totalTasks > 0 ? `${completionRate}% complete` : 'No tasks assigned'}
        </p>
      </div>

      {expanded && (
        <div className="mt-2 p-3 bg-zinc-900/60 border border-zinc-800/40 rounded-lg space-y-3">
          <div>
            <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest mb-2">
              Focus Areas
            </p>
            <div className="flex flex-wrap gap-1.5">
              {monthData.focus.slice(0, 4).map((f, i) => (
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
            <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest mb-2">
              Key Deliverables
            </p>
            <ul className="space-y-1">
              {monthData.deliverables.slice(0, 3).map((d, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-zinc-500 mt-0.5">›</span>
                  <span className="font-mono text-xs text-zinc-400">{d}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest mb-2">
              Suggested Tasks
            </p>
            <div className="space-y-1">
              {monthData.suggested_tasks.slice(0, 3).map((t, i) => (
                <p key={i} className="font-mono text-[10px] text-zinc-500">
                  › {t}
                </p>
              ))}
            </div>
          </div>

          {milestone && (
            <div className="pt-2 border-t border-zinc-800/40">
              <p className="font-mono text-[10px] text-amber-400">
                ★ Milestone: {milestone.name}
              </p>
              <p className="font-mono text-[10px] text-zinc-600 mt-0.5">
                {milestone.description}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}