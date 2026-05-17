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
    <Card className="bg-zinc-900/60 border border-zinc-800/60 backdrop-blur-sm overflow-hidden">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-transparent" />
        <CardContent className="relative py-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">Phase</span>
                <span className="font-mono text-[10px] px-1.5 py-0.5 bg-zinc-800/80 text-zinc-400 rounded">
                  {month.toString().padStart(2, '0')}
                </span>
              </div>
              <h3 className="font-mono text-base font-semibold text-zinc-100 tracking-tight">
                {monthData?.title || 'Unknown'}
              </h3>
            </div>
            <div className="text-right">
              <p className="font-mono text-2xl font-bold text-zinc-100">{progress.percentage}%</p>
              <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider">year progress</p>
            </div>
          </div>

          <div className="h-[3px] bg-zinc-800/60 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-red-400/60 rounded-full"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>

          {monthData && (
            <>
              <div className="mb-4">
                <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest mb-2">Focus Areas</p>
                <div className="flex flex-wrap gap-1.5">
                  {monthData.focus.slice(0, 3).map((focus, i) => (
                    <span
                      key={i}
                      className="font-mono text-[10px] px-2 py-1 bg-zinc-800/60 text-zinc-400 rounded border border-zinc-700/40"
                    >
                      {focus}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest mb-2">Key Deliverables</p>
                <ul className="space-y-1.5">
                  {monthData.deliverables.slice(0, 2).map((deliverable, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
                      <span className="text-red-500/60 mt-0.5 font-mono">›</span>
                      <span className="text-zinc-400">{deliverable}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          <div className="mt-4 pt-3 border-t border-zinc-800/40 flex items-center justify-between">
            <span className="font-mono text-[10px] text-zinc-600">
              ~{daysRemaining} days remaining
            </span>
            <span className="font-mono text-[10px] text-zinc-600">
              month {month.toString().padStart(2, '0')} / 12
            </span>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}