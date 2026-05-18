'use client';

import { useState, useTransition } from 'react';

import { PILLARS } from '@/lib/constants';
import { deleteLog } from '@/lib/actions/logs';
import type { LogRow } from '@/lib/supabase/database.types';
import type { Pillar } from '@/types';

interface LearningTimelineProps {
  logs: LogRow[];
}

export function LearningTimeline({ logs: initialLogs }: LearningTimelineProps) {
  const [logs, setLogs] = useState(initialLogs);
  const [, startTransition] = useTransition();

  const handleDelete = (logId: string) => {
    if (!confirm('Delete this log entry?')) return;
    startTransition(async () => {
      try {
        await deleteLog(logId);
        setLogs(logs.filter((l) => l.id !== logId));
      } catch (err) {
        console.error('Error deleting log:', err);
      }
    });
  };

  if (logs.length === 0) {
    return (
      <div className="font-mono text-xs text-zinc-600 text-center py-6">
        No entries yet. Start documenting your learning.
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {logs.map((log) => {
        const pillar = PILLARS[log.pillar as Pillar];
        const date = new Date(log.created_at);
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        return (
          <div
            key={log.id}
            className="group relative pl-6 pb-4 border-l border-zinc-800/60 last:pb-0"
          >
            <div className="absolute left-0 top-0 w-3 h-3 -translate-x-[6.5px] rounded-full border border-zinc-700/60 bg-zinc-900" />
            {log.is_win && (
              <div
                className="absolute left-0 top-0 w-3 h-3 -translate-x-[6.5px] rounded-full"
                style={{
                  backgroundColor: pillar.color,
                  boxShadow: `0 0 8px ${pillar.color}60`,
                }}
              />
            )}

            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className="font-mono text-xs font-semibold uppercase tracking-wider"
                    style={{ color: pillar.color }}
                  >
                    {log.pillar}
                  </span>
                  <span className="font-mono text-xs text-zinc-500">{dateStr}</span>
                  {log.is_win && (
                    <span className="font-mono text-xs text-amber-400">WIN</span>
                  )}
                </div>
                <p className="font-mono text-sm text-zinc-300 leading-relaxed">{log.content}</p>
              </div>
              <button
                onClick={() => handleDelete(log.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500 hover:text-red-400 text-xs font-mono flex-shrink-0 mt-1"
              >
                del
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}