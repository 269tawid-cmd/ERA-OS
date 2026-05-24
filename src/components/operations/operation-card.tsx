'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui';
import { PRIORITIES } from '@/lib/constants';
import type { Task, Priority } from '@/types';

interface OperationCardProps {
  task: Task;
  onStatusChange: (id: string, status: Task['status']) => void;
  onPriorityChange: (id: string, priority: Priority) => void;
  onDelete: (id: string) => void;
  isProcessing: boolean;
}

const STATUS_DOT = {
  todo: { bg: 'bg-zinc-500', ring: 'ring-zinc-500/30' },
  in_progress: { bg: 'bg-blue-400', ring: 'ring-blue-400/30' },
  done: { bg: 'bg-emerald-400', ring: 'ring-emerald-400/30' },
  abandoned: { bg: 'bg-zinc-600', ring: 'ring-zinc-600/20' },
} as const;

const STATUS_BAR = {
  todo: 'bg-zinc-500/40',
  in_progress: 'bg-blue-400/60',
  done: 'bg-emerald-400/40',
  abandoned: 'bg-zinc-600/30',
} as const;

const PRIORITY_CYCLE: Record<Priority, Priority> = {
  low: 'medium',
  medium: 'high',
  high: 'low',
};

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

export function OperationCard({ task, onStatusChange, onPriorityChange, onDelete, isProcessing }: OperationCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const statusDot = STATUS_DOT[task.status];
  const statusBar = STATUS_BAR[task.status];
  const canAdvance = NEXT_STATUS[task.status] !== null;
  const nextLabel = NEXT_LABEL[task.status];

  const isOverdue = task.due_date
    ? new Date(task.due_date) < new Date() && task.status !== 'done'
    : false;

  const createdDate = task.created_at
    ? new Date(task.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : null;

  const handlePriorityCycle = () => {
    if (isProcessing) return;
    const next = PRIORITY_CYCLE[task.priority];
    onPriorityChange(task.id, next);
  };

  const handleDelete = () => {
    if (confirmDelete) {
      onDelete(task.id);
      setConfirmDelete(false);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 2500);
    }
  };

  return (
    <div
      className={`relative flex items-start gap-3 px-4 py-3 transition-colors duration-100 ${
        task.status === 'in_progress'
          ? 'bg-blue-950/[0.04]'
          : task.status === 'done' || task.status === 'abandoned'
          ? 'opacity-60 hover:opacity-80'
          : ''
      } hover:bg-zinc-800/20 ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
    >
      {/* Left status accent bar */}
      <div className={`absolute left-0 top-1 bottom-0 w-0.5 rounded-r ${statusBar}`} />

      {/* Status dot — click to cycle forward */}
      <button
        onClick={() => canAdvance && onStatusChange(task.id, NEXT_STATUS[task.status]!)}
        disabled={!canAdvance || isProcessing}
        className={`relative mt-1.5 shrink-0 w-2.5 h-2.5 rounded-full ${statusDot.bg} ring-2 ${statusDot.ring} ${
          canAdvance ? 'hover:ring-4 hover:ring-offset-1 hover:ring-offset-[#050505] cursor-pointer' : 'cursor-default'
        } transition-all duration-100`}
        title={nextLabel || undefined}
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Title row */}
        <div className="flex items-center gap-2">
          <span className={`font-mono text-sm leading-tight truncate ${
            task.status === 'done' ? 'text-zinc-500 line-through' : 'text-zinc-200'
          }`}>
            {task.title}
          </span>
          <span className={`font-mono text-[10px] uppercase tracking-widest px-1.5 py-0.5 rounded shrink-0 ${
            task.origin === 'generated'
              ? 'text-teal-600 bg-teal-500/10 border border-teal-500/20'
              : 'text-zinc-600 bg-zinc-800/40 border border-zinc-700/40'
          }`}>
            {task.origin === 'generated' ? 'ROADMAP' : 'MANUAL'}
          </span>
        </div>

        {/* Metadata row */}
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <Badge variant={task.pillar.toLowerCase() as 'hack' | 'build' | 'ai' | 'presence'}>
            {task.pillar}
          </Badge>

          <button
            onClick={handlePriorityCycle}
            disabled={isProcessing}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono border transition-colors duration-100 ${
              task.priority === 'high'
                ? 'text-red-400 border-red-500/30 bg-red-500/10 hover:bg-red-500/20'
                : task.priority === 'medium'
                ? 'text-amber-400 border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20'
                : 'text-zinc-500 border-zinc-700/50 bg-zinc-800/40 hover:bg-zinc-700/40'
            } ${isProcessing ? 'cursor-default' : 'cursor-pointer'}`}
            title={`${task.priority === 'high' ? 'HIGH' : task.priority === 'medium' ? 'MED' : 'LOW'} — click to cycle priority`}
          >
            <span className="text-[9px] opacity-70 uppercase">{PRIORITIES[task.priority].label}</span>
          </button>

          <span className="font-mono text-xs text-zinc-600">
            +{task.xp_value}
          </span>

          <span className="font-mono text-xs text-zinc-700">
            M{task.month.toString().padStart(2, '0')}
          </span>

          {isOverdue && (
            <span className="font-mono text-[10px] text-red-400/70 uppercase tracking-wider">
              Overdue
            </span>
          )}

          {createdDate && (
            <span className="font-mono text-[10px] text-zinc-700 hidden md:block">
              {createdDate}
            </span>
          )}
        </div>

        {/* Description */}
        {task.description && (
          <p className="font-mono text-xs text-zinc-600 mt-1 leading-relaxed truncate max-w-[90%]">
            {task.description}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0 mt-0.5">
        {canAdvance && nextLabel && (
          <button
            onClick={() => onStatusChange(task.id, NEXT_STATUS[task.status]!)}
            disabled={isProcessing}
            className="font-mono text-[11px] px-2.5 py-1.5 rounded-md bg-zinc-800/60 text-zinc-400 hover:bg-zinc-700/60 hover:text-zinc-200 transition-all duration-100 disabled:opacity-50"
          >
            {nextLabel}
          </button>
        )}

        {/* Defer: push in_progress back to todo */}
        {task.status === 'in_progress' && (
          <button
            onClick={() => onStatusChange(task.id, 'todo')}
            disabled={isProcessing}
            className="font-mono text-[10px] px-2 py-1.5 rounded-md text-zinc-700 hover:text-zinc-500 hover:bg-zinc-800/40 transition-all duration-100 disabled:opacity-50"
            title="Move back to pending"
          >
            ↻ Defer
          </button>
        )}

        {/* Archive: quick-abandon */}
        {task.status === 'todo' && (
          <button
            onClick={() => onStatusChange(task.id, 'abandoned')}
            disabled={isProcessing}
            className="font-mono text-[10px] px-2 py-1.5 rounded-md text-zinc-700 hover:text-zinc-500 hover:bg-zinc-800/40 transition-all duration-100 disabled:opacity-50"
            title="Archive task"
          >
            Archive
          </button>
        )}

        {/* Delete */}
        <button
          onClick={handleDelete}
          disabled={isProcessing}
          className={`font-mono text-[11px] px-2 py-1.5 rounded-md transition-all duration-100 ${
            confirmDelete
              ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
              : 'text-zinc-700 hover:text-zinc-500 hover:bg-zinc-800/40'
          } disabled:opacity-50`}
          title={confirmDelete ? 'Click again to confirm' : 'Delete task'}
        >
          {confirmDelete ? 'Confirm' : '×'}
        </button>
      </div>
    </div>
  );
}
