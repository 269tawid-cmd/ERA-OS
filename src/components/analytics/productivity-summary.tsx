'use client';

import { Card, CardHeader, CardContent } from '@/components/ui';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import type { Task } from '@/types';

interface ProductivitySummaryProps {
  tasks: Task[];
  streakCurrent: number;
}

interface StatusData {
  label: string;
  value: number;
  color: string;
}

export function ProductivitySummary({ tasks, streakCurrent }: ProductivitySummaryProps) {
  const todo = tasks.filter((t) => t.status === 'todo').length;
  const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
  const done = tasks.filter((t) => t.status === 'done').length;
  const abandoned = tasks.filter((t) => t.status === 'abandoned').length;

  const total = tasks.length;
  const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;
  const overdueRatio = total > 0 ? Math.round((abandoned / total) * 100) : 0;

  const statusData: StatusData[] = [
    { label: 'Done', value: done, color: '#22c55e' },
    { label: 'In Progress', value: inProgress, color: '#3b82f6' },
    { label: 'To Do', value: todo, color: '#52525b' },
    { label: 'Abandoned', value: abandoned, color: '#ef4444' },
  ].filter((d) => d.value > 0);

  const noData = statusData.length === 0;

  return (
    <Card className="bg-zinc-900/60 border border-zinc-800/60 backdrop-blur-sm overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">
            Task Distribution
          </span>
          <span className="font-mono text-[10px] text-zinc-700">{total} total</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3">
            {noData ? (
              <div className="w-16 h-16 rounded-full bg-zinc-800/40 flex items-center justify-center">
                <span className="font-mono text-[10px] text-zinc-700">—</span>
              </div>
            ) : (
              <div className="w-16 h-16 relative flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius={20}
                      outerRadius={32}
                      paddingAngle={2}
                      strokeWidth={0}
                    >
                      {statusData.map((entry) => (
                        <Cell key={entry.label} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
            <div className="space-y-1 min-w-0">
              {statusData.map((d) => (
                <div key={d.label} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="font-mono text-[9px] text-zinc-600">{d.label}</span>
                  </div>
                  <span className="font-mono text-[9px] text-zinc-500">{d.value}</span>
                </div>
              ))}
              {noData && (
                <div className="font-mono text-[9px] text-zinc-600">No tasks yet</div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-[10px] text-zinc-600">Completion</span>
                <span className="font-mono text-[10px] text-zinc-400">{completionRate}%</span>
              </div>
              <div className="h-[3px] bg-zinc-800/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500/60 rounded-full"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-[10px] text-zinc-600">Streak</span>
                <span className="font-mono text-[10px] text-zinc-400">{streakCurrent}d</span>
              </div>
              <div className="h-[3px] bg-zinc-800/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500/60 rounded-full"
                  style={{ width: `${Math.min(streakCurrent / 30 * 100, 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-[10px] text-zinc-600">Abandoned</span>
                <span className="font-mono text-[10px] text-zinc-400">{overdueRatio}%</span>
              </div>
              <div className="h-[3px] bg-zinc-800/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500/40 rounded-full"
                  style={{ width: `${overdueRatio}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}