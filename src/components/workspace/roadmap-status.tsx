'use client';

import { useMemo } from 'react';

interface RoadmapStatusProps {
  currentMonth: number;
  startDate?: string | null;
  progress?: {
    percentage: number;
    daysRemaining: number;
    daysElapsed: number;
  };
  tasksCompleted?: number;
  totalTasks?: number;
}

export function RoadmapStatus({ 
  currentMonth, 
  startDate,
  progress,
  tasksCompleted = 0,
  totalTasks = 0
}: RoadmapStatusProps) {
  
  const { percentage, daysRemaining, daysElapsed } = progress || {
    percentage: 0,
    daysRemaining: 365,
    daysElapsed: 0,
  };
  
  const monthProgress = useMemo(() => {
    const dayInMonth = daysElapsed % 30;
    return Math.round((dayInMonth / 30) * 100);
  }, [daysElapsed]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-zinc-900/40 border border-zinc-800/30 rounded">
          <p className="font-mono text-[10px] text-zinc-600 uppercase mb-1">Year</p>
          <p className="font-mono text-2xl text-zinc-200">{percentage}%</p>
          <div className="mt-2 h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-red-500/60 transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
        
        <div className="p-3 bg-zinc-900/40 border border-zinc-800/30 rounded">
          <p className="font-mono text-[10px] text-zinc-600 uppercase mb-1">Phase</p>
          <p className="font-mono text-2xl text-zinc-200">M{currentMonth}</p>
          <div className="mt-2 h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-amber-500/60 transition-all duration-500"
              style={{ width: `${monthProgress}%` }}
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono text-zinc-600">DAYS ELAPSED</span>
          <span className="font-mono text-zinc-400">{daysElapsed}d</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono text-zinc-600">DAYS REMAINING</span>
          <span className="font-mono text-zinc-400">{daysRemaining}d</span>
        </div>
      </div>
      
      <div className="pt-2 border-t border-zinc-800/30">
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono text-zinc-600">TASKS COMPLETED</span>
          <span className="font-mono text-zinc-400">{tasksCompleted}/{totalTasks}</span>
        </div>
        {totalTasks > 0 && (
          <div className="mt-2 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500/60 transition-all duration-500"
              style={{ width: `${(tasksCompleted / totalTasks) * 100}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}