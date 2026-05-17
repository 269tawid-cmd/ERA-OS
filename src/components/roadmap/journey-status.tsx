'use client';

import { Card, CardHeader, CardContent } from '@/components/ui';
import { getNextMilestones, getAchievedMilestones, getMilestoneProgress, MILESTONES } from '@/lib/constants';
import { getRoadmapProgress } from '@/lib/roadmap';
import { ProgressMilestone } from './progress-milestone';

interface JourneyStats {
  streakCurrent: number;
  hackXP: number;
  ctfSolvedCount: number;
  tasksCompletedCount: number;
  logsCount: number;
  winsCount: number;
  monthsCompleted: number;
  currentMonth: number;
}

interface JourneyStatusProps {
  stats: JourneyStats;
  compact?: boolean;
}

export function JourneyStatus({ stats, compact = false }: JourneyStatusProps) {
  const roadmapProgress = getRoadmapProgress(stats.currentMonth);
  const achievedMilestones = getAchievedMilestones(stats);
  const nextMilestones = getNextMilestones(stats, compact ? 2 : 3);

  const totalMilestones = MILESTONES.length;
  const achievedCount = achievedMilestones.length;
  const completionRate = Math.round((achievedCount / totalMilestones) * 100);

  if (compact) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">
            Journey
          </span>
          <span className="font-mono text-[10px] text-zinc-500">
            {achievedCount}/{totalMilestones}
          </span>
        </div>
        <div className="h-[3px] bg-zinc-800/60 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500/60 to-amber-400/40 rounded-full"
            style={{ width: `${completionRate}%` }}
          />
        </div>
        <p className="font-mono text-[9px] text-zinc-600">
          {roadmapProgress.percentage}% of Year 1 · {stats.currentMonth}/12 months
        </p>
      </div>
    );
  }

  return (
    <Card className="bg-zinc-900/60 border border-zinc-800/60 backdrop-blur-sm overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">
            Journey Status
          </span>
          <span className="font-mono text-[10px] text-zinc-700">
            {achievedCount}/{totalMilestones} milestones
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-2.5 bg-zinc-900/40 border border-zinc-800/40 rounded-md">
            <p className="font-mono text-[10px] text-zinc-600 mb-1">Year Progress</p>
            <p className="font-mono text-lg font-bold text-zinc-100">
              {roadmapProgress.percentage}%
            </p>
            <p className="font-mono text-[9px] text-zinc-600">
              M{stats.currentMonth}/12 · {roadmapProgress.remaining} months left
            </p>
          </div>
          <div className="p-2.5 bg-zinc-900/40 border border-zinc-800/40 rounded-md">
            <p className="font-mono text-[10px] text-zinc-600 mb-1">HACK XP</p>
            <p className="font-mono text-lg font-bold text-red-400">{stats.hackXP}</p>
            <p className="font-mono text-[9px] text-zinc-600">
              {stats.ctfSolvedCount} CTFs solved
            </p>
          </div>
        </div>

        <div>
          <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest mb-2">
            Milestones
          </p>
          <div className="space-y-2">
            {achievedMilestones.length > 0 &&
              achievedMilestones.slice(0, 3).map((m) => (
                <ProgressMilestone
                  key={m.id}
                  milestone={m}
                  {...getMilestoneProgress(m, stats)}
                />
              ))}

            {nextMilestones.map((m) => (
              <ProgressMilestone
                key={m.id}
                milestone={m}
                {...getMilestoneProgress(m, stats)}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}