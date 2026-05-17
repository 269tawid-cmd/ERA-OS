'use client';


import { YEAR1_ROADMAP } from '@/lib/roadmap';
import { RoadmapMonthCard } from './roadmap-month-card';
import type { Task } from '@/types';

interface RoadmapTimelineProps {
  currentMonth: number;
  tasks: Task[];
}

export function RoadmapTimeline({ currentMonth, tasks }: RoadmapTimelineProps) {
  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-red-500/50 via-zinc-700/30 to-zinc-800/20" />

        <div className="space-y-4">
          {YEAR1_ROADMAP.map((monthData) => (
            <div key={monthData.month} className="relative pl-10">
              <div
                className={`absolute left-2.5 top-5 w-3 h-3 -translate-x-[5px] rounded-full border-2 transition-all duration-200 ${
                  monthData.month === currentMonth
                    ? 'bg-red-500 border-red-400 shadow-[0_0_12px_rgba(239,68,68,0.4)]'
                    : monthData.month < currentMonth
                    ? 'bg-emerald-500/60 border-emerald-400/60'
                    : 'bg-zinc-800 border-zinc-700'
                }`}
              />

              <RoadmapMonthCard
                monthData={monthData}
                currentMonth={currentMonth}
                tasks={tasks}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="pl-10">
        <div className="relative">
          <div className="absolute left-2.5 top-0 w-3 h-3 -translate-x-[5px] rounded-full bg-zinc-700 border-2 border-zinc-600" />
          <div className="ml-6 p-4 bg-zinc-900/40 border border-zinc-800/40 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-lg font-bold text-zinc-700">13</span>
              <span className="font-mono text-xs text-zinc-600">—</span>
              <span className="font-mono text-xs text-zinc-600 uppercase tracking-wider">
                Year 2 Ahead
              </span>
            </div>
            <p className="font-mono text-[10px] text-zinc-700">
              Complete Year 1 to unlock the next phase of your journey
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}