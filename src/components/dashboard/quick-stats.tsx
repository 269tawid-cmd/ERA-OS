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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <Card className="bg-zinc-900/80 border border-zinc-700/60 backdrop-blur-sm overflow-hidden">
        <CardContent className="py-4 px-4">
          <p className="font-mono text-xs text-zinc-500 uppercase tracking-wider mb-2">Current</p>
          <p className="font-mono text-sm font-semibold text-zinc-100 truncate">
            M{currentMonth.toString().padStart(2, '0')}: {monthTitle}
          </p>
          <div className="mt-3 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-zinc-500/80"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
          <p className="font-mono text-xs text-zinc-500 mt-2">{progress.percentage}% year</p>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900/80 border border-zinc-700/60 backdrop-blur-sm overflow-hidden">
        <CardContent className="py-4 px-4">
          <p className="font-mono text-xs text-zinc-500 uppercase tracking-wider mb-2">Streak</p>
          <p className="font-mono text-2xl font-bold text-zinc-100">
            {streakCurrent}
            <span className="text-sm font-normal text-zinc-500 ml-2">days</span>
          </p>
          <p className={`font-mono text-sm mt-2 ${
            streakCurrent === 0 ? 'text-zinc-600' :
            streakCurrent >= 7 ? 'text-amber-400' : 'text-zinc-500'
          }`}>
            {streakCurrent === 0 ? 'Start today' :
             streakCurrent >= 7 ? 'On fire' : 'Building'}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900/80 border border-zinc-700/60 backdrop-blur-sm overflow-hidden">
        <CardContent className="py-4 px-4">
          <p className="font-mono text-xs text-zinc-500 uppercase tracking-wider mb-2">Tasks</p>
          <p className="font-mono text-2xl font-bold text-zinc-100">
            {completedTasks}
            <span className="text-sm font-normal text-zinc-500">/{totalTasks}</span>
          </p>
          <div className="mt-3 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500/80"
              style={{ width: `${taskCompletionRate}%` }}
            />
          </div>
          <p className="font-mono text-xs text-zinc-500 mt-2">{taskCompletionRate}% done</p>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900/80 border border-zinc-700/60 backdrop-blur-sm overflow-hidden">
        <CardContent className="py-4 px-4">
          <p className="font-mono text-xs text-zinc-500 uppercase tracking-wider mb-3">Pillar XP</p>
          <div className="space-y-2">
            {PILLAR_ORDER.map((key) => {
              const pillar = PILLARS[key];
              return (
                <div key={key} className="flex items-center justify-between">
                  <span
                    className="font-mono text-xs font-semibold"
                    style={{ color: pillar.color }}
                  >
                    {key}
                  </span>
                  <span className="font-mono text-sm text-zinc-400">
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