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
      <Card className="bg-zinc-900/60 border border-zinc-800/60 backdrop-blur-sm overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/20 via-transparent to-transparent" />
        <CardContent className="relative py-3">
          <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest mb-1">Current</p>
          <p className="font-mono text-xs font-semibold text-zinc-100 truncate">
            M{currentMonth.toString().padStart(2, '0')}: {monthTitle}
          </p>
          <div className="mt-2 h-[2px] bg-zinc-800/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-zinc-500/60"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
          <p className="font-mono text-[10px] text-zinc-600 mt-1">{progress.percentage}% year</p>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900/60 border border-zinc-800/60 backdrop-blur-sm overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent" />
        <CardContent className="relative py-3">
          <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest mb-1">Streak</p>
          <p className="font-mono text-lg font-bold text-zinc-100">
            {streakCurrent}
            <span className="text-xs font-normal text-zinc-500 ml-1">days</span>
          </p>
          <p className={`font-mono text-[10px] mt-1 ${
            streakCurrent === 0 ? 'text-zinc-600' :
            streakCurrent >= 7 ? 'text-amber-400' : 'text-zinc-500'
          }`}>
            {streakCurrent === 0 ? 'Start today' :
             streakCurrent >= 7 ? 'On fire' : 'Building'}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900/60 border border-zinc-800/60 backdrop-blur-sm overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent" />
        <CardContent className="relative py-3">
          <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest mb-1">Tasks</p>
          <p className="font-mono text-lg font-bold text-zinc-100">
            {completedTasks}
            <span className="text-xs font-normal text-zinc-500">/{totalTasks}</span>
          </p>
          <div className="mt-2 h-[2px] bg-zinc-800/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500/60"
              style={{ width: `${taskCompletionRate}%` }}
            />
          </div>
          <p className="font-mono text-[10px] text-zinc-600 mt-1">{taskCompletionRate}% done</p>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900/60 border border-zinc-800/60 backdrop-blur-sm overflow-hidden">
        <CardContent className="relative py-3">
          <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest mb-2">Pillar XP</p>
          <div className="space-y-1.5">
            {PILLAR_ORDER.map((key) => {
              const pillar = PILLARS[key];
              return (
                <div key={key} className="flex items-center justify-between">
                  <span
                    className="font-mono text-[10px] font-semibold"
                    style={{ color: pillar.color }}
                  >
                    {key}
                  </span>
                  <span className="font-mono text-[10px] text-zinc-500">
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