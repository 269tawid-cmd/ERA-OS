'use client';

import { Card, CardHeader, CardContent } from '@/components/ui';
import { YEAR1_ROADMAP } from '@/lib/roadmap';
import type { Task } from '@/types';

interface MonthlyProgressGridProps {
  currentMonth: number;
  tasks: Task[];
}

interface MonthStats {
  month: number;
  title: string;
  total: number;
  done: number;
  percentage: number;
}

export function MonthlyProgressGrid({ currentMonth, tasks }: MonthlyProgressGridProps) {
  const monthStats: MonthStats[] = YEAR1_ROADMAP.map((m) => {
    const monthTasks = tasks.filter((t) => t.month === m.month);
    const done = monthTasks.filter((t) => t.status === 'done').length;
    const total = monthTasks.length;
    return {
      month: m.month,
      title: m.title,
      total,
      done,
      percentage: total > 0 ? Math.round((done / total) * 100) : 0,
    };
  });

  const completedMonths = monthStats.filter((m) => m.total > 0 && m.percentage >= 100).length;
  const activeMonths = monthStats.filter((m) => m.total > 0).length;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">
            Cycle 1 Phase Progress
          </span>
          <span className="font-mono text-[10px] text-zinc-700">
            {completedMonths}/{activeMonths} completed
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-6 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-1.5">
          {monthStats.map((m) => {
            const isCurrent = m.month === currentMonth;
            const hasTasks = m.total > 0;
            const isComplete = m.percentage >= 100;

            let bgColor = 'bg-zinc-800/30';
            if (isComplete) bgColor = 'bg-emerald-500/20 border border-emerald-500/30';
            else if (hasTasks) bgColor = 'bg-zinc-800/60 border border-zinc-700/40';

            return (
              <div
                key={m.month}
                className={`relative group aspect-square rounded-sm ${bgColor} ${
                  isCurrent ? 'ring-1 ring-red-500/50' : ''
                }`}
                title={`M${m.month}: ${m.title}${hasTasks ? ` — ${m.done}/${m.total} tasks (${m.percentage}%)` : ' — no tasks'}`}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-mono text-[9px] text-zinc-500">
                    {m.month.toString().padStart(2, '0')}
                  </span>
                </div>
                {isCurrent && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-mono text-[9px] text-red-400 font-semibold">
                      {m.month.toString().padStart(2, '0')}
                    </span>
                  </div>
                )}
                {isComplete && (
                  <div className="absolute top-0.5 right-0.5">
                    <span className="text-[8px] text-emerald-400">✓</span>
                  </div>
                )}

                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10 pointer-events-none">
                  <div className="bg-zinc-900 border border-zinc-700/60 rounded-md px-2 py-1.5 whitespace-nowrap">
                    <p className="font-mono text-[10px] text-zinc-200 font-medium">M{m.month}: {m.title}</p>
                    <p className="font-mono text-[9px] text-zinc-500">
                      {hasTasks ? `${m.done}/${m.total} tasks (${m.percentage}%)` : 'no tasks'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-3 flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-sm bg-emerald-500/20 border border-emerald-500/30" />
            <span className="font-mono text-[9px] text-zinc-600">Completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-sm bg-zinc-800/60 border border-zinc-700/40" />
            <span className="font-mono text-[9px] text-zinc-600">Active</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-sm bg-zinc-800/30 border border-zinc-800/40" />
            <span className="font-mono text-[9px] text-zinc-600">No Data</span>
          </div>
          <div className="flex items-center gap-1.5 ml-auto">
            <div className="w-2 h-2 rounded-sm ring-1 ring-red-500/50 bg-zinc-800/60" />
            <span className="font-mono text-[9px] text-zinc-600">Current</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}