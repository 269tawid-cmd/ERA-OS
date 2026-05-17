'use client';

import { Card, CardContent } from '@/components/ui';
import type { MonthlyRoadmap } from '@/types';

interface MonthCardProps {
  month: number;
  monthData: MonthlyRoadmap | undefined;
  progress: { completed: number; remaining: number; percentage: number };
}

export function MonthCard({ month, monthData, progress }: MonthCardProps) {
  const daysRemaining = Math.round(progress.remaining * 30);

  return (
    <Card className="bg-zinc-900/80 border border-zinc-700/60 backdrop-blur-sm overflow-hidden">
      <CardContent className="py-5 px-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-xs text-zinc-500 uppercase tracking-wider">Phase</span>
              <span className="font-mono text-sm px-2 py-1 bg-zinc-800 text-zinc-300 rounded">
                {month.toString().padStart(2, '0')}
              </span>
            </div>
            <h3 className="font-mono text-lg font-semibold text-zinc-100 tracking-tight">
              {monthData?.title || 'Unknown'}
            </h3>
          </div>
          <div className="text-right">
            <p className="font-mono text-3xl font-bold text-zinc-100">{progress.percentage}%</p>
            <p className="font-mono text-xs text-zinc-500 uppercase tracking-wider">year progress</p>
          </div>
        </div>

        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden mb-5">
          <div
            className="h-full bg-gradient-to-r from-red-500 to-red-400/80 rounded-full"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>

        {monthData && (
          <>
            <div className="mb-5">
              <p className="font-mono text-xs text-zinc-500 uppercase tracking-wider mb-3">Focus Areas</p>
              <div className="flex flex-wrap gap-2">
                {monthData.focus.slice(0, 3).map((focus, i) => (
                  <span
                    key={i}
                    className="font-mono text-sm px-3 py-1.5 bg-zinc-800/80 text-zinc-300 rounded border border-zinc-700/50"
                  >
                    {focus}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <p className="font-mono text-xs text-zinc-500 uppercase tracking-wider mb-3">Key Deliverables</p>
              <ul className="space-y-2">
                {monthData.deliverables.slice(0, 2).map((deliverable, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-zinc-400">
                    <span className="text-red-500/70 mt-0.5 font-mono">›</span>
                    <span>{deliverable}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
          <span className="font-mono text-sm text-zinc-500">
            ~{daysRemaining} days remaining
          </span>
          <span className="font-mono text-sm text-zinc-500">
            month {month.toString().padStart(2, '0')} / 12
          </span>
        </div>
      </CardContent>
    </Card>
  );
}