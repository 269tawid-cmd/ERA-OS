'use client';

import { Card, CardContent } from '@/components/ui';
import { PILLARS, PILLAR_ORDER } from '@/lib/constants';

interface QuickStatsProps {
  currentMonth: number;
  monthTitle: string;
  progress: { completed: number; remaining: number; percentage: number };
  streakCurrent: number;
  pillarXP: Record<string, number>;
  totalTasks: number;
  completedTasks: number;
}

export function QuickStats({
  currentMonth,
  monthTitle,
  progress,
  streakCurrent,
  pillarXP,
  totalTasks,
  completedTasks,
}: QuickStatsProps) {
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="overflow-hidden transition-all duration-150 hover:border-zinc-700/60">
        <CardContent className="py-5 px-5">
          <p className="font-mono text-sm text-zinc-500 uppercase tracking-wider mb-2">Phase</p>
          <p className="font-mono text-base sm:text-lg font-semibold text-zinc-100 truncate">
            M{currentMonth.toString().padStart(2, '0')}: {monthTitle}
          </p>
          <div className="mt-4 h-2 bg-zinc-800/80 rounded-full overflow-hidden">
            <div
              className="h-full bg-zinc-400/80 transition-all duration-300"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
          <p className="font-mono text-sm text-zinc-400 mt-3">{progress.percentage}% cycle</p>
        </CardContent>
      </Card>

      <Card className="overflow-hidden transition-all duration-150 hover:border-zinc-700/60">
        <CardContent className="py-5 px-5">
          <p className="font-mono text-sm text-zinc-500 uppercase tracking-wider mb-2">Continuity</p>
          <p className="font-mono text-3xl font-bold text-zinc-100">
            {streakCurrent}
            <span className="text-base font-normal text-zinc-400 ml-2">days</span>
          </p>
          <p className={`font-mono text-sm mt-3 ${
            streakCurrent === 0 ? 'text-zinc-600' :
            streakCurrent >= 7 ? 'text-amber-400' : 'text-zinc-400'
          }`}>
            {streakCurrent === 0 ? 'Awaiting initiation' :
             streakCurrent >= 7 ? 'Sustained' : 'Establishing'}
          </p>
        </CardContent>
      </Card>

      <Card className="overflow-hidden transition-all duration-150 hover:border-zinc-700/60">
        <CardContent className="py-5 px-5">
          <p className="font-mono text-sm text-zinc-500 uppercase tracking-wider mb-2">Operations</p>
          <p className="font-mono text-3xl font-bold text-zinc-100">
            {completedTasks}
            <span className="text-base font-normal text-zinc-400">/{totalTasks}</span>
          </p>
          <div className="mt-4 h-2 bg-zinc-800/80 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500/80 transition-all duration-300"
              style={{ width: `${taskCompletionRate}%` }}
            />
          </div>
          <p className="font-mono text-sm text-zinc-400 mt-3">{taskCompletionRate}% resolved</p>
        </CardContent>
      </Card>

      <Card className="overflow-hidden transition-all duration-150 hover:border-zinc-700/60">
        <CardContent className="py-5 px-5">
          <p className="font-mono text-sm text-zinc-500 uppercase tracking-wider mb-3">Domain Value</p>
          <div className="space-y-2.5">
            {PILLAR_ORDER.map((key) => {
              const pillar = PILLARS[key];
              return (
                <div key={key} className="flex items-center justify-between">
                  <span
                    className="font-mono text-sm font-semibold"
                    style={{ color: pillar.color }}
                  >
                    {key}
                  </span>
                  <span className="font-mono text-base text-zinc-300">
                    {pillarXP[key] || 0}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}