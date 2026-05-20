'use client';

import { useMemo } from 'react';
import { useWorkspaceState } from './workspace-state';

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
  const { intelligence } = useWorkspaceState();
  const { environmentTone, daysBehindRoadmap, completionRatio, backlogPressure } = intelligence;
  
  const { percentage, daysRemaining, daysElapsed } = progress || {
    percentage: 0,
    daysRemaining: 365,
    daysElapsed: 0,
  };
  
  const monthProgress = useMemo(() => {
    const dayInMonth = daysElapsed % 30;
    return Math.round((dayInMonth / 30) * 100);
  }, [daysElapsed]);

  const getRoadmapStatus = () => {
    if (daysBehindRoadmap > 30) return { text: 'BEHIND', color: 'text-red-400' };
    if (daysBehindRoadmap > 7) return { text: 'SLIGHTLY BEHIND', color: 'text-amber-400' };
    if (completionRatio > 0.7) return { text: 'AHEAD', color: 'text-emerald-400' };
    return { text: 'ON TRACK', color: 'text-zinc-400' };
  };

  const status = getRoadmapStatus();

  return (
    <div className="space-y-4">
      {/* Roadmap Status */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-mono text-[10px] text-zinc-600 uppercase">Roadmap</span>
        <span className={`font-mono text-[10px] ${status.color}`}>{status.text}</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className={`p-3 border rounded ${
          environmentTone === 'critical' ? 'border-red-900/30 bg-red-950/10' :
          'border-zinc-800/30 bg-zinc-900/40'
        }`}>
          <p className="font-mono text-[10px] text-zinc-600 uppercase mb-1">Year</p>
          <p className={`font-mono text-2xl ${
            environmentTone === 'critical' ? 'text-red-400' : 'text-zinc-200'
          }`}>{percentage}%</p>
          <div className="mt-2 h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                environmentTone === 'critical' ? 'bg-red-500/60' : 'bg-red-500/60'
              }`}
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
          <span className={`font-mono ${
            daysBehindRoadmap > 7 ? 'text-amber-400' : 'text-zinc-400'
          }`}>{daysRemaining}d</span>
        </div>
        {daysBehindRoadmap > 0 && (
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-zinc-600">BEHIND</span>
            <span className="font-mono text-red-400">{daysBehindRoadmap}d</span>
          </div>
        )}
      </div>
      
      <div className="pt-2 border-t border-zinc-800/30">
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono text-zinc-600">TASKS COMPLETED</span>
          <span className={`font-mono ${
            environmentTone === 'critical' ? 'text-red-400' : 'text-zinc-400'
          }`}>{tasksCompleted}/{totalTasks}</span>
        </div>
        {totalTasks > 0 && (
          <div className="mt-2 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                environmentTone === 'critical' ? 'bg-red-500/60' : 'bg-emerald-500/60'
              }`}
              style={{ width: `${completionRatio * 100}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}