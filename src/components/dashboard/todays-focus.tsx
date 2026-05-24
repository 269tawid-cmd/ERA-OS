'use client';

import { Card, CardContent, CardHeader } from '@/components/ui';
import { PILLAR_ORDER } from '@/lib/constants';
import type { Task, MonthlyRoadmap, Pillar } from '@/types';

interface TodaysFocusProps {
  tasks: Task[];
  monthData: MonthlyRoadmap | undefined;
  currentMonth: number;
  pillarXP: Record<string, number>;
}

export function TodaysFocus({ tasks, monthData, currentMonth, pillarXP }: TodaysFocusProps) {
  const recommendations: { title: string; reason: string; priority: 'high' | 'medium'; origin?: string }[] = [];

  const monthTasks = tasks.filter(t => t.month === currentMonth && t.status !== 'done');
  const monthTasksByOrigin = {
    generated: monthTasks.filter(t => t.origin === 'generated'),
    manual: monthTasks.filter(t => t.origin === 'manual' || !t.origin),
  };

  const nextGeneratedTask = monthTasksByOrigin.generated[0];
  const nextManualTask = monthTasksByOrigin.manual[0];

  if (nextGeneratedTask) {
    recommendations.push({
      title: nextGeneratedTask.title,
      reason: 'From roadmap templates — current phase',
      priority: 'high',
      origin: 'ROADMAP',
    });
  }

  if (recommendations.length < 2 && nextManualTask) {
    recommendations.push({
      title: nextManualTask.title,
      reason: 'From your operations backlog',
      priority: 'medium',
    });
  }

  if (recommendations.length === 0 && monthData?.suggested_tasks) {
    const suggested = monthData.suggested_tasks.slice(0, 1).map(title => ({
      title,
      reason: 'Suggested for current phase — generate tasking to activate',
      priority: 'medium' as const,
    }));
    recommendations.push(...suggested);
  }

  const totalXP = PILLAR_ORDER.reduce((sum, p) => sum + (pillarXP[p] || 0), 0);
  const weakestPillar = PILLAR_ORDER.reduce<Pillar>((weakest, p) => {
    const current = pillarXP[p] || 0;
    const weakestXP = pillarXP[weakest] || 0;
    return current < weakestXP ? p : weakest;
  }, 'HACK');

  if (totalXP > 0 && recommendations.length < 3) {
    const pillarTask = tasks.find(t => t.pillar === weakestPillar && t.status !== 'done');
    if (pillarTask) {
      recommendations.push({
        title: pillarTask.title,
        reason: `Strengthen your ${weakestPillar} pillar`,
        priority: 'medium'
      });
    } else {
      recommendations.push({
        title: `Focus on ${weakestPillar} activities`,
        reason: `${weakestPillar} is your lowest XP pillar`,
        priority: 'medium'
      });
    }
  }

  const highPriorityIncomplete = tasks.find(t =>
    t.priority === 'high' && t.status !== 'done' && !recommendations.find(r => r.title === t.title)
  );
  if (highPriorityIncomplete && recommendations.length < 3) {
    recommendations.push({
      title: highPriorityIncomplete.title,
      reason: 'High priority task',
      priority: 'high'
    });
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <h3 className="font-mono text-xs text-zinc-400 uppercase tracking-widest">Primary Objective</h3>
          <span className="font-mono text-xs text-zinc-400">{recommendations.length} tasks</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {recommendations.length === 0 ? (
          <div className="text-center py-6">
            <p className="font-mono text-sm text-zinc-400 mb-1">No active operations</p>
            <p className="font-mono text-xs text-zinc-500">
              {monthData
                ? `Use "Generate Tasking" below to pull tasks from M${currentMonth.toString().padStart(2, '0')} roadmap`
                : 'Initiate a task or generate automated tasking'
              }
            </p>
          </div>
        ) : (
          recommendations.map((rec, i) => (
            <div
              key={i}
              className="p-3 bg-zinc-900/50 border border-zinc-800/50 rounded-md"
            >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-sm text-zinc-200 truncate">{rec.title}</p>
                    <p className="font-mono text-xs text-zinc-400 mt-1">{rec.reason}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {rec.origin && (
                      <span className="font-mono text-[10px] px-1.5 py-0.5 bg-zinc-700/40 text-zinc-400 border border-zinc-700/50 rounded">
                        {rec.origin}
                      </span>
                    )}
                    {rec.priority === 'high' && (
                      <span className="font-mono text-xs px-2 py-0.5 bg-red-500/10 text-red-400 border border-red-500/30 rounded">
                        PRIORITY
                      </span>
                    )}
                  </div>
                </div>
            </div>
          ))
        )}

        {monthData && recommendations.length > 0 && (
          <div className="pt-3 border-t border-zinc-800/40">
            <p className="font-mono text-xs text-zinc-500">
              Based on: M{currentMonth.toString().padStart(2, '0')} — {monthData.title}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}