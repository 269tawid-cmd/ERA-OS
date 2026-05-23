'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui';
import { PILLAR_ORDER } from '@/lib/constants';
import type { Task } from '@/types';

interface DashboardInsightsProps {
  tasks: Task[];
  pillarXP: Record<string, number>;
}

interface Insight {
  type: 'strength' | 'weakness' | 'warning' | 'info';
  message: string;
  pillar?: string;
}

export function DashboardInsights({ tasks, pillarXP }: DashboardInsightsProps) {
  const insights = useMemo(() => {
    const computed: Insight[] = [];

    const totalXP = PILLAR_ORDER.reduce((sum, p) => sum + (pillarXP[p] || 0), 0);
    const pillarPercentages = PILLAR_ORDER.map(p => ({
      pillar: p,
      xp: pillarXP[p] || 0,
      percentage: totalXP > 0 ? ((pillarXP[p] || 0) / totalXP) * 100 : 0
    }));

    const sorted = [...pillarPercentages].sort((a, b) => a.percentage - b.percentage);
    const weakest = sorted[0];
    const strongest = sorted[sorted.length - 1];

    if (weakest.percentage > 0 && weakest.percentage < 20) {
      computed.push({
        type: 'weakness',
        message: `${weakest.pillar} needs attention — ${Math.round(weakest.percentage)}% of XP`,
        pillar: weakest.pillar
      });
    }

    if (strongest.percentage > 50) {
      computed.push({
        type: 'strength',
        message: `${strongest.pillar} dominates — ${Math.round(strongest.percentage)}% of XP`,
        pillar: strongest.pillar
      });
    }

    const now = new Date();
    const overdueTasks = tasks.filter(t => {
      if (t.status === 'done' || t.status === 'abandoned') return false;
      if (!t.due_date) return false;
      return new Date(t.due_date) < now;
    });

    if (overdueTasks.length > 0) {
      computed.push({
        type: 'warning',
        message: `${overdueTasks.length} overdue task${overdueTasks.length > 1 ? 's' : ''}`
      });
    }

    const inProgressCount = tasks.filter(t => t.status === 'in_progress').length;
    const doneCount = tasks.filter(t => t.status === 'done').length;

    if (tasks.length > 0 && doneCount / tasks.length > 0.7) {
      computed.push({
        type: 'info',
        message: `${Math.round((doneCount / tasks.length) * 100)}% completion — solid momentum`
      });
    }

    if (inProgressCount > 3) {
      computed.push({
        type: 'warning',
        message: `${inProgressCount} tasks in progress — finish some first`
      });
    }

    if (tasks.length === 0) {
      computed.push({
        type: 'info',
        message: 'Create tasks for your current roadmap phase'
      });
    }

    return computed;
  }, [tasks, pillarXP]);

  const typeStyles = {
    strength: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
    weakness: 'text-amber-400 border-amber-500/20 bg-amber-500/5',
    warning: 'text-orange-400 border-orange-500/20 bg-orange-500/5',
    info: 'text-blue-400 border-blue-500/20 bg-blue-500/5',
  };

  const typeIcons: Record<string, string> = {
    strength: '↑',
    weakness: '↓',
    warning: '!',
    info: '→',
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <h3 className="font-mono text-xs text-zinc-400 uppercase tracking-widest">Operational Intel</h3>
      </CardHeader>
      <CardContent className="space-y-2">
        {insights.length === 0 ? (
          <p className="font-mono text-sm text-zinc-500">Complete tasks to generate insights</p>
        ) : (
          insights.map((insight, i) => (
            <div
              key={i}
              className={`font-mono text-sm p-3 rounded border ${typeStyles[insight.type]}`}
            >
              <span className="mr-2 opacity-70">{typeIcons[insight.type]}</span>
              {insight.message}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}