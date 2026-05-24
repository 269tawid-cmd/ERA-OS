'use client';

import { Card, CardContent } from '@/components/ui';
import type { MonthlyRoadmap } from '@/types';

interface MonthCardProps {
  month: number;
  monthData: MonthlyRoadmap | undefined;
  progress: { completed: number; remaining: number; percentage: number; daysRemaining: number; daysElapsed: number; realMonth: number };
}

export function MonthCard({ month, monthData, progress }: MonthCardProps) {
  const { daysRemaining, daysElapsed, realMonth, percentage } = progress;

  return (
    <Card className="focus-panel interactive-panel border border-zinc-800/20 overflow-hidden">
      <CardContent className="py-5 px-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-red-500 text-xs">◈</span>
              <span className="font-mono text-xs text-zinc-400 uppercase tracking-wider">Active Phase</span>
            </div>
            <span className="font-mono text-lg px-3 py-1.5 bg-zinc-900/60 text-zinc-200 rounded border border-zinc-700/40 font-semibold">
              M{month.toString().padStart(2, '0')}
            </span>
          </div>
          <div className="text-right">
            <p className="font-mono text-3xl font-bold text-zinc-100">{percentage}%</p>
            <p className="font-mono text-xs text-zinc-500 uppercase tracking-wider mt-1">month completion</p>
          </div>
        </div>

        <div className="mb-2">
          <h3 className="font-mono text-lg font-bold text-zinc-200 tracking-tight">
            {monthData?.title || 'Unknown'}
          </h3>
        </div>

        <div className="h-2 bg-zinc-800/60 rounded-full overflow-hidden mb-5">
          <div
            className="h-full bg-gradient-to-r from-red-500/80 to-red-400/60 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {monthData && (
          <>
            <div className="mb-6">
              <p className="font-mono text-sm text-zinc-400 uppercase tracking-wider mb-4">Focus Areas</p>
              <div className="flex flex-wrap gap-2.5">
                {monthData.focus.slice(0, 3).map((focus, i) => (
                  <span
                    key={i}
                    className="font-mono text-sm px-3.5 py-2 bg-zinc-800/70 text-zinc-300 rounded-lg border border-zinc-700/50"
                  >
                    {focus}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <p className="font-mono text-sm text-zinc-400 uppercase tracking-wider mb-4">Key Deliverables</p>
              <ul className="space-y-3">
                {monthData.deliverables.slice(0, 2).map((deliverable, i) => (
                  <li key={i} className="flex items-start gap-3.5 text-base text-zinc-300">
                    <span className="text-red-500/80 mt-0.5 font-mono text-lg">›</span>
                    <span>{deliverable}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        <div className="pt-5 border-t border-zinc-800/60 flex items-center justify-between">
          <span className="font-mono text-sm text-zinc-400">
            {daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Year 1 complete'}
          </span>
          <span className="font-mono text-sm text-zinc-400">
            {daysElapsed > 0 ? `${daysElapsed} days in` : 'Just started'} · M{realMonth}/12
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
