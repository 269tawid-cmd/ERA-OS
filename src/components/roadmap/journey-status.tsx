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
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-sm text-zinc-400 uppercase tracking-wider">
            Journey
          </span>
          <span className="font-mono text-sm text-zinc-500">
            {achievedCount}/{totalMilestones}
          </span>
        </div>
        <div className="h-2 bg-zinc-800/80 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500/70 to-amber-400/50 rounded-full transition-all duration-300"
            style={{ width: `${completionRate}%` }}
          />
        </div>
        <p className="font-mono text-sm text-zinc-500">
          {roadmapProgress.percentage}% of Year 1 · {stats.currentMonth}/12 months
        </p>
      </div>
    );
  }

  return (
    <Card className="bg-zinc-900/60 border border-zinc-800/60 backdrop-blur-md overflow-hidden">
      <CardHeader className="pb-3 border-b border-zinc-800/60">
        <div className="flex items-center justify-between">
          <span className="font-mono text-sm text-zinc-400 uppercase tracking-wider">
            Journey Status
          </span>
          <span className="font-mono text-sm text-zinc-500">
            {achievedCount}/{totalMilestones} milestones
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-zinc-800/50 border border-zinc-700/50 rounded-lg">
            <p className="font-mono text-sm text-zinc-500 mb-2">Year Progress</p>
            <p className="font-mono text-3xl font-bold text-zinc-100">
              {roadmapProgress.percentage}%
            </p>
            <p className="font-mono text-sm text-zinc-500 mt-2">
              M{stats.currentMonth}/12 · {roadmapProgress.remaining} months left
            </p>
          </div>
          <div className="p-4 bg-zinc-800/50 border border-zinc-700/50 rounded-lg">
            <p className="font-mono text-sm text-zinc-500 mb-2">HACK XP</p>
            <p className="font-mono text-3xl font-bold text-red-400">{stats.hackXP}</p>
            <p className="font-mono text-sm text-zinc-500 mt-2">
              {stats.ctfSolvedCount} CTFs solved
            </p>
          </div>
        </div>

        <div>
          <p className="font-mono text-sm text-zinc-400 uppercase tracking-wider mb-3">
            Milestones
          </p>
          <div className="space-y-2.5">
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