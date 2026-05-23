'use client';

import { Badge } from '@/components/ui';
import { PILLARS } from '@/lib/constants';
import type { Task } from '@/types';

interface OperationCardProps {
  task: Task;
  onStatusChange: (id: string, status: Task['status']) => void;
  onDelete: (id: string) => void;
  isProcessing: boolean;
}

const STATUS_CONFIG = {
  todo: { icon: '○', color: 'text-zinc-500', dot: 'bg-zinc-500' },
  in_progress: { icon: '●', color: 'text-blue-400', dot: 'bg-blue-400' },
  done: { icon: '✓', color: 'text-emerald-400', dot: 'bg-emerald-400' },
  abandoned: { icon: '×', color: 'text-zinc-600', dot: 'bg-zinc-600' },
} as const;

const PRIORITY_CONFIG = {
  high: { label: 'HIGH', color: 'text-red-400', badge: 'error' as const },
  medium: { label: 'MED', color: 'text-amber-400', badge: 'warning' as const },
  low: { label: 'LOW', color: 'text-zinc-500', badge: 'default' as const },
} as const;

const NEXT_STATUS: Record<Task['status'], Task['status'] | null> = {
  todo: 'in_progress',
  in_progress: 'done',
  done: null,
  abandoned: null,
};

const NEXT_LABEL: Record<Task['status'], string | null> = {
  todo: 'Engage',
  in_progress: 'Resolve',
  done: null,
  abandoned: null,
};

export function OperationCard({ task, onStatusChange, onDelete, isProcessing }: OperationCardProps) {
  const sc = STATUS_CONFIG[task.status];
  const pc = PRIORITY_CONFIG[task.priority];
  const pillar = PILLARS[task.pillar];

  const canAdvance = NEXT_STATUS[task.status] !== null;
  const nextLabel = NEXT_LABEL[task.status];

  const createdDate = task.created_at
    ? new Date(task.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : null;

  return (
    <div
      className={`group relative flex items-start gap-3 px-4 py-3.5 border rounded-lg transition-all duration-150 ${
        task.status === 'in_progress'
          ? 'border-blue-900/40 bg-blue-950/10'
          : task.status === 'done'
          ? 'border-zinc-800/40 bg-zinc-900/20'
          : task.status === 'abandoned'
          ? 'border-zinc-800/30 bg-zinc-900/10'
          : 'border-zinc-800/50 bg-zinc-900/30'
      } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className={`text-sm shrink-0 ${sc.color} mt-0.5`}>{sc.icon}</span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-sm text-zinc-200 truncate">{task.title}</span>
            <Badge variant={task.pillar.toLowerCase() as 'hack' | 'build' | 'ai' | 'presence'}>
              {task.pillar}
            </Badge>
            <Badge variant={pc.badge}>{pc.label}</Badge>
            <span className="font-mono text-xs text-zinc-600">
              +{task.xp_value}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="font-mono text-xs text-zinc-600">
              M{task.month.toString().padStart(2, '0')}
            </span>
            {task.description && (
              <span className="font-mono text-xs text-zinc-600 truncate max-w-[300px] hidden sm:block">
                {task.description}
              </span>
            )}
            {task.origin === 'generated' && (
              <span className="font-mono text-[10px] text-zinc-700 uppercase tracking-wider">
                auto
              </span>
            )}
            {createdDate && (
              <span className="font-mono text-[10px] text-zinc-700 hidden md:block">
                {createdDate}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {canAdvance && nextLabel && (
          <button
            onClick={() => onStatusChange(task.id, NEXT_STATUS[task.status]!)}
            disabled={isProcessing}
            className="font-mono text-[11px] px-2.5 py-1.5 rounded-md bg-zinc-800/60 text-zinc-400 hover:bg-zinc-700/60 hover:text-zinc-200 transition-all duration-100 disabled:opacity-50"
          >
            {nextLabel}
          </button>
        )}
        <button
          onClick={() => { if (confirm('Delete this task?')) onDelete(task.id); }}
          disabled={isProcessing}
          className="font-mono text-[11px] px-2 py-1.5 rounded-md text-zinc-700 hover:text-zinc-500 hover:bg-zinc-800/40 transition-all duration-100 opacity-0 group-hover:opacity-100 disabled:opacity-50"
          title="Delete task"
        >
          ×
        </button>
      </div>
    </div>
  );
}
