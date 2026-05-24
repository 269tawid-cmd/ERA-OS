'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui';
import { computeInsights } from '@/lib/ops-insights';
import type { Insight } from '@/lib/ops-insights';
import type { Task } from '@/types';

interface DashboardInsightsProps {
  tasks: Task[];
  pillarXP: Record<string, number>;
  currentMonth: number;
  streakCurrent: number;
}

const CATEGORY_LABEL: Record<Insight['category'], string> = {
  operational: 'Ops',
  roadmap: 'Phase',
  focus: 'Focus',
  progress: 'Progress',
};

const CATEGORY_DOT: Record<Insight['category'], string> = {
  operational: 'bg-zinc-500',
  roadmap: 'bg-amber-500/50',
  focus: 'bg-blue-400/50',
  progress: 'bg-emerald-500/50',
};

const TONE_ICON: Record<Insight['tone'], string> = {
  positive: '↑',
  neutral: '→',
  attention: '●',
};

export function DashboardInsights({ tasks, pillarXP, currentMonth, streakCurrent }: DashboardInsightsProps) {
  const insights = useMemo(
    () => computeInsights({ tasks, pillarXP, currentMonth, streakCurrent }),
    [tasks, pillarXP, currentMonth, streakCurrent],
  );

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <h3 className="font-mono text-xs text-zinc-400 uppercase tracking-widest">
          Operational Intel
        </h3>
      </CardHeader>
      <CardContent className="space-y-0">
        {insights.length === 0 ? (
          <p className="font-mono text-sm text-zinc-600">
            Complete tasks to generate operational insights
          </p>
        ) : (
          <div className="divide-y divide-zinc-800/15">
            {insights.map((insight) => {
              const toneOpacity = insight.tone === 'attention'
                ? 'text-zinc-300'
                : insight.tone === 'positive'
                  ? 'text-zinc-400'
                  : 'text-zinc-500';

              return (
                <div
                  key={insight.id}
                  className="flex items-start gap-2.5 py-2.5 first:pt-0 last:pb-0"
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full mt-1 shrink-0 ${CATEGORY_DOT[insight.category]}`}
                  />
                  <span className={`font-mono text-xs flex-1 min-w-0 leading-relaxed ${toneOpacity}`}>
                    {insight.message}
                  </span>
                  <span className="font-mono text-[9px] text-zinc-700 uppercase tracking-wider shrink-0 mt-0.5">
                    {CATEGORY_LABEL[insight.category]}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
