'use client';

import type { Milestone } from '@/lib/constants';

interface ProgressMilestoneProps {
  milestone: Milestone;
  progress: number;
  percentage: number;
  achieved: boolean;
}

export function ProgressMilestone({ milestone, progress, percentage, achieved }: ProgressMilestoneProps) {
  return (
    <div
      className={`p-2.5 rounded-md border transition-all duration-200 ${
        achieved
          ? 'bg-emerald-500/5 border-emerald-500/20'
          : 'bg-zinc-900/40 border-zinc-800/40'
      }`}
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          {achieved ? (
            <span className="text-emerald-400 font-mono text-[10px]">★</span>
          ) : (
            <span className="text-zinc-600 font-mono text-[10px]">○</span>
          )}
          <span
            className={`font-mono text-[10px] font-semibold ${
              achieved ? 'text-emerald-300' : 'text-zinc-300'
            }`}
          >
            {milestone.name}
          </span>
        </div>
        <span
          className={`font-mono text-[10px] ${
            achieved ? 'text-emerald-400' : 'text-zinc-600'
          }`}
        >
          {progress}/{milestone.threshold}
        </span>
      </div>

      <p
        className={`font-mono text-[9px] mb-2 ${
          achieved ? 'text-emerald-400/70' : 'text-zinc-600'
        }`}
      >
        {milestone.description}
      </p>

      <div className="h-[2px] bg-zinc-800/60 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            achieved ? 'bg-emerald-500/60' : 'bg-zinc-600/60'
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      <div className="flex items-center justify-between mt-1">
        <span
          className={`font-mono text-[9px] ${
            achieved ? 'text-emerald-500' : 'text-zinc-700'
          }`}
        >
          {percentage}%
        </span>
        <span
          className={`font-mono text-[9px] ${
            achieved ? 'text-emerald-400' : 'text-zinc-700'
          }`}
        >
          +{milestone.xpBonus} XP
        </span>
      </div>
    </div>
  );
}