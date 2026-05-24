'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent } from '@/components/ui';
import { advanceMonth } from '@/lib/actions/progress';
import { getMonthData } from '@/lib/roadmap';
import { useAcknowledgment } from '@/components/shared/operational-acknowledgment';

interface MonthProgressionProps {
  currentMonth: number;
  monthTitle: string;
  totalTasks: number;
  completedTasks: number;
  onMonthAdvanced?: (month: number) => void;
}

export function MonthProgression({
  currentMonth,
  monthTitle,
  totalTasks,
  completedTasks,
  onMonthAdvanced,
}: MonthProgressionProps) {
  const [, startTransition] = useTransition();
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [result, setResult] = useState<{ month: number; title: string; generated: number } | null>(null);
  const { acknowledge } = useAcknowledgment();

  const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const isComplete = totalTasks > 0 && completedTasks === totalTasks;
  const isEmpty = totalTasks === 0;

  const nextMonthData = currentMonth < 48 ? getMonthData(currentMonth + 1) : null;
  const nextTitle = nextMonthData?.title;

  const handleAdvance = () => {
    setIsAdvancing(true);
    startTransition(async () => {
      try {
        const res = await advanceMonth();
        if (res.success) {
          setResult({ month: res.newMonth, title: res.monthTitle, generated: res.tasksGenerated });
          acknowledge(`phase transition: ${res.monthTitle}`, 'weighty');
          onMonthAdvanced?.(res.newMonth);
        } else {
          acknowledge(res.error || 'operational conflict detected', 'standard');
        }
      } catch (err) {
        console.error('Unexpected error advancing month:', err);
        acknowledge('operational conflict detected', 'standard');
      } finally {
        setIsAdvancing(false);
      }
    });
  };

  if (result) {
    return (
      <Card className="border-emerald-800/40">
        <CardContent className="py-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-1.5 h-1.5 rounded-sm bg-emerald-500" />
            <span className="font-mono text-[10px] text-emerald-500/70 uppercase tracking-widest">Phase Advanced</span>
          </div>
          <p className="font-mono text-sm text-zinc-200">
            Now operating at <span className="text-emerald-400">M{result.month.toString().padStart(2, '0')}</span> — {result.title}
          </p>
          {result.generated > 0 && (
            <p className="font-mono text-xs text-zinc-500 mt-1">
              {result.generated} task{result.generated > 1 ? 's' : ''} auto-generated for this phase
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-zinc-800/40">
      <CardContent className="py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-sm bg-zinc-500" />
            <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
              Phase Progress
            </span>
          </div>
          <span className="font-mono text-xs text-zinc-500">
            M{currentMonth.toString().padStart(2, '0')}
          </span>
        </div>

        <div className="mb-2">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-mono text-sm text-zinc-200">{monthTitle}</span>
            <span className="font-mono text-xs text-zinc-500">
              {completedTasks}/{totalTasks} ops resolved
            </span>
          </div>
          <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-zinc-500 rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <span className="font-mono text-xs text-zinc-600">
            {isEmpty
              ? 'No tasks yet — generate tasking to begin'
              : isComplete
                ? nextTitle
                  ? `All resolved — next: ${nextTitle}`
                  : 'All operations resolved'
                : percentage < 50
                  ? `${percentage}% complete — continuing operations`
                  : `${percentage}% complete — operations nominal`
            }
          </span>

          {isComplete && (
            <button
              onClick={handleAdvance}
              disabled={isAdvancing}
              className="font-mono text-xs px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-md hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
            >
              {isAdvancing ? 'Advancing...' : 'Advance Phase'}
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
