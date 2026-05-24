'use client';

import { useState, useTransition, useMemo, useEffect, useRef, useCallback } from 'react';
import { Card, CardHeader, CardContent, Button } from '@/components/ui';
import { PILLAR_ORDER } from '@/lib/constants';
import { updateTaskStatus, deleteTask, updateTaskPriority } from '@/lib/actions/tasks';
import { generateTodayMission } from '@/lib/actions/mission';
import { useAcknowledgment } from '@/components/shared/operational-acknowledgment';
import { ACTION_ACKNOWLEDGMENTS } from '@/lib/constants/operational-rituals';
import { OperationCard } from './operation-card';
import { QuickCreate } from './quick-create';
import type { Task, TaskStatus, Pillar, Priority } from '@/types';

type StatusFilter = 'all' | TaskStatus;
type PriorityFilter = 'all' | Priority;
type PillarFilter = 'all' | Pillar;

interface OperationsListProps {
  tasks: Task[];
  currentMonth?: number;
  monthTitle?: string;
  onTasksGenerated?: (tasks: Task[]) => void;
}

const STATUS_SECTION_CONFIG: Record<string, { label: string; accent: string }> = {
  engaged: { label: 'Engaged', accent: 'bg-blue-400/50' },
  pending: { label: 'Pending', accent: 'bg-zinc-500/30' },
  resolved: { label: 'Resolved', accent: 'bg-emerald-400/40' },
  archived: { label: 'Archived', accent: 'bg-zinc-600/20' },
};

export function OperationsList({
  tasks: initialTasks,
  currentMonth,
  monthTitle,
  onTasksGenerated,
}: OperationsListProps) {
  const [tasks, setTasks] = useState(initialTasks);
  const [, startTransition] = useTransition();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const { acknowledge } = useAcknowledgment();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');
  const [pillarFilter, setPillarFilter] = useState<PillarFilter>('all');
  const [monthFilter, setMonthFilter] = useState<number | null>(null);

  const availableMonths = useMemo(() => {
    const months = new Set(tasks.map(t => t.month));
    return Array.from(months).sort((a, b) => a - b);
  }, [tasks]);

  const filtered = useMemo(() => {
    let result = tasks;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(t =>
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q))
      );
    }
    if (statusFilter !== 'all') result = result.filter(t => t.status === statusFilter);
    if (priorityFilter !== 'all') result = result.filter(t => t.priority === priorityFilter);
    if (pillarFilter !== 'all') result = result.filter(t => t.pillar === pillarFilter);
    if (monthFilter !== null) result = result.filter(t => t.month === monthFilter);

    return result;
  }, [tasks, search, statusFilter, priorityFilter, pillarFilter, monthFilter]);

  /* Keyboard shortcuts */
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === '/' && e.target !== searchRef.current) {
      const active = document.activeElement;
      if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.tagName === 'SELECT')) return;
      e.preventDefault();
      searchRef.current?.focus();
    }
    if (e.key === 'Escape') {
      if (search) {
        setSearch('');
      } else if (document.activeElement === searchRef.current) {
        searchRef.current?.blur();
      }
    }
  }, [search]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown as EventListener);
    return () => document.removeEventListener('keydown', handleKeyDown as EventListener);
  }, [handleKeyDown]);

  const handleGenerateMission = () => {
    setGenerating(true);
    startTransition(async () => {
      try {
        const result = await generateTodayMission();
        if (result.success && result.tasks.length > 0) {
          setTasks(prev => [...result.tasks, ...prev]);
          onTasksGenerated?.(result.tasks);
          const def = ACTION_ACKNOWLEDGMENTS.tasksGenerated;
          if (def.message) acknowledge(def.message, def.weight);
        }
      } catch (err) {
        console.error('Error generating mission:', err);
        const def = ACTION_ACKNOWLEDGMENTS.error;
        if (def.message) acknowledge(def.message, def.weight);
      } finally {
        setGenerating(false);
      }
    });
  };

  const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
    setProcessingId(taskId);
    const prevTasks = tasks;
    setTasks(prev => prev.map(t =>
      t.id === taskId
        ? { ...t, status: newStatus, completed_at: newStatus === 'done' ? new Date().toISOString() : t.completed_at }
        : t
    ));

    startTransition(async () => {
      const result = await updateTaskStatus(taskId, newStatus);
      if (!result.success) {
        setTasks(prevTasks);
        const def = ACTION_ACKNOWLEDGMENTS.error;
        if (def.message) acknowledge(def.message, def.weight);
      } else {
        const actionKey = newStatus === 'in_progress' ? 'taskEngaged' : newStatus === 'done' ? 'taskResolved' : null;
        if (actionKey) {
          const def = ACTION_ACKNOWLEDGMENTS[actionKey];
          if (def.message) acknowledge(def.message, def.weight);
        }
      }
      setProcessingId(null);
    });
  };

  const handlePriorityChange = (taskId: string, newPriority: Priority) => {
    setProcessingId(taskId);
    const prevTasks = tasks;
    setTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, priority: newPriority } : t
    ));

    startTransition(async () => {
      const result = await updateTaskPriority(taskId, newPriority);
      if (!result.success) {
        setTasks(prevTasks);
        const def = ACTION_ACKNOWLEDGMENTS.error;
        if (def.message) acknowledge(def.message, def.weight);
      }
      setProcessingId(null);
    });
  };

  const handleDelete = (taskId: string) => {
    setProcessingId(taskId);
    const prevTasks = tasks;
    setTasks(prev => prev.filter(t => t.id !== taskId));

    startTransition(async () => {
      const result = await deleteTask(taskId);
      if (!result.success) {
        setTasks(prevTasks);
        const def = ACTION_ACKNOWLEDGMENTS.error;
        if (def.message) acknowledge(def.message, def.weight);
      }
      setProcessingId(null);
    });
  };

  const inProgress = filtered.filter(t => t.status === 'in_progress');
  const pending = filtered.filter(t => t.status === 'todo');
  const completed = filtered.filter(t => t.status === 'done');
  const archived = filtered.filter(t => t.status === 'abandoned');

  const totalCount = tasks.length;
  const doneCount = tasks.filter(t => t.status === 'done').length;
  const activeCount = tasks.filter(t => t.status === 'todo' || t.status === 'in_progress').length;
  const overdueCount = tasks.filter(t =>
    t.due_date && new Date(t.due_date) < new Date() && t.status !== 'done'
  ).length;
  const completionRate = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  const hasActiveFilters = search.trim() || statusFilter !== 'all' || priorityFilter !== 'all' ||
    pillarFilter !== 'all' || monthFilter !== null;

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setPillarFilter('all');
    setMonthFilter(null);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        {/* Header with phase context */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <h2 className="font-mono text-base font-semibold text-zinc-200 uppercase tracking-wider">
              Operations
            </h2>
            {currentMonth && monthTitle && (
              <span className="font-mono text-[11px] text-zinc-600 tracking-wide hidden sm:block">
                {monthTitle}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 font-mono text-[11px]">
              <span className="text-zinc-500">{activeCount} active</span>
              <span className="text-zinc-700">·</span>
              <span className="text-emerald-500/70">{doneCount} resolved</span>
              <span className="text-zinc-700">·</span>
              <span className="text-zinc-500">{completionRate}%</span>
              {overdueCount > 0 && (
                <>
                  <span className="text-zinc-700">·</span>
                  <span className="text-red-400/70">{overdueCount} overdue</span>
                </>
              )}
            </div>
            <Button
              size="sm"
              variant="secondary"
              onClick={handleGenerateMission}
              loading={generating}
            >
              {generating ? 'Tasking...' : 'Generate'}
            </Button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row gap-2 mt-3">
          <div className="flex-1 relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-600 text-xs font-mono pointer-events-none">&gt;</span>
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search — press / to focus"
              className="w-full bg-zinc-950 border border-zinc-700/80 rounded-lg pl-7 pr-3 py-1.5 text-sm font-mono text-zinc-300 placeholder-zinc-600 outline-none transition-all duration-150 hover:border-zinc-600 focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20"
              autoComplete="off"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="bg-zinc-950 border border-zinc-700/80 rounded-lg px-2.5 py-1.5 text-xs font-mono text-zinc-400 outline-none transition-colors duration-150 hover:border-zinc-600 focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20"
            >
              <option value="all">All Status</option>
              <option value="todo">Pending</option>
              <option value="in_progress">Engaged</option>
              <option value="done">Resolved</option>
              <option value="abandoned">Archived</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as PriorityFilter)}
              className="bg-zinc-950 border border-zinc-700/80 rounded-lg px-2.5 py-1.5 text-xs font-mono text-zinc-400 outline-none transition-colors duration-150 hover:border-zinc-600 focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20"
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select
              value={pillarFilter}
              onChange={(e) => setPillarFilter(e.target.value as PillarFilter)}
              className="bg-zinc-950 border border-zinc-700/80 rounded-lg px-2.5 py-1.5 text-xs font-mono text-zinc-400 outline-none transition-colors duration-150 hover:border-zinc-600 focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20"
            >
              <option value="all">All Pillar</option>
              {PILLAR_ORDER.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <select
              value={monthFilter ?? ''}
              onChange={(e) => setMonthFilter(e.target.value ? parseInt(e.target.value) : null)}
              className="bg-zinc-950 border border-zinc-700/80 rounded-lg px-2.5 py-1.5 text-xs font-mono text-zinc-400 outline-none transition-colors duration-150 hover:border-zinc-600 focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20"
            >
              <option value="">All Month</option>
              {availableMonths.map((m) => (
                <option key={m} value={m}>M{m.toString().padStart(2, '0')}</option>
              ))}
            </select>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs font-mono text-zinc-600 hover:text-zinc-400 px-2 py-1.5 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </CardHeader>

      <QuickCreate
        defaultMonth={availableMonths[0] || currentMonth || 1}
        onCreated={() => {}}
      />

      <CardContent className="px-0 py-0">
        {filtered.length === 0 ? (
          <div className="py-12 px-5 text-center">
            <p className="font-mono text-sm text-zinc-500 mb-1">
              {hasActiveFilters ? 'No matching operations' :
               totalCount === 0 ? 'No operations yet' :
               'All tasks resolved or archived'}
            </p>
            <p className="font-mono text-xs text-zinc-600">
              {hasActiveFilters ? 'Adjust filters or press Escape to clear' :
               totalCount === 0 ? (
                 <>Use <kbd className="text-zinc-500 bg-zinc-800/60 px-1 rounded">Quick add</kbd> to create tasks, or <kbd className="text-zinc-500 bg-zinc-800/60 px-1 rounded">Generate Tasking</kbd> from the roadmap</>
               ) : currentMonth && monthTitle
                 ? 'Advance to the next phase when ready, or add new operations'
                 : 'Generate tasking or add operations manually'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/30">
            {inProgress.length > 0 && (
              <Section
                label={STATUS_SECTION_CONFIG.engaged.label}
                count={inProgress.length}
                accent={STATUS_SECTION_CONFIG.engaged.accent}
              >
                {inProgress.map(task => (
                  <OperationCard
                    key={task.id}
                    task={task}
                    onStatusChange={handleStatusChange}
                    onPriorityChange={handlePriorityChange}
                    onDelete={handleDelete}
                    isProcessing={processingId === task.id}
                  />
                ))}
              </Section>
            )}

            {pending.length > 0 && (
              <Section
                label={STATUS_SECTION_CONFIG.pending.label}
                count={pending.length}
                accent={STATUS_SECTION_CONFIG.pending.accent}
              >
                {pending.map(task => (
                  <OperationCard
                    key={task.id}
                    task={task}
                    onStatusChange={handleStatusChange}
                    onPriorityChange={handlePriorityChange}
                    onDelete={handleDelete}
                    isProcessing={processingId === task.id}
                  />
                ))}
              </Section>
            )}

            {(completed.length > 0 || archived.length > 0) && (
              <details className="group" open={inProgress.length === 0 && pending.length === 0}>
                <summary className="flex items-center gap-2 px-5 py-2 border-b border-zinc-800/30 bg-zinc-900/40 cursor-pointer hover:bg-zinc-900/60 transition-colors list-none select-none">
                  <span className="text-xs text-zinc-700 font-mono transition-transform duration-100 group-open:rotate-90">&gt;</span>
                  <span className="font-mono text-xs text-zinc-600 uppercase tracking-wider">
                    History
                  </span>
                  <span className="font-mono text-xs text-zinc-700">
                    ({completed.length + archived.length})
                  </span>
                </summary>
                <div>
                  {completed.length > 0 && (
                    <Section
                      label={STATUS_SECTION_CONFIG.resolved.label}
                      count={completed.length}
                      accent={STATUS_SECTION_CONFIG.resolved.accent}
                    >
                      {completed.map(task => (
                        <OperationCard
                          key={task.id}
                          task={task}
                          onStatusChange={handleStatusChange}
                          onPriorityChange={handlePriorityChange}
                          onDelete={handleDelete}
                          isProcessing={processingId === task.id}
                        />
                      ))}
                    </Section>
                  )}
                  {archived.length > 0 && (
                    <Section
                      label={STATUS_SECTION_CONFIG.archived.label}
                      count={archived.length}
                      accent={STATUS_SECTION_CONFIG.archived.accent}
                    >
                      {archived.map(task => (
                        <OperationCard
                          key={task.id}
                          task={task}
                          onStatusChange={handleStatusChange}
                          onPriorityChange={handlePriorityChange}
                          onDelete={handleDelete}
                          isProcessing={processingId === task.id}
                        />
                      ))}
                    </Section>
                  )}
                </div>
              </details>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Section({ label, count, accent, children }: { label: string; count: number; accent: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 px-5 py-2 border-b border-zinc-800/30 bg-zinc-900/40">
        <div className={`w-1 h-3 rounded ${accent}`} />
        <span className="font-mono text-xs uppercase tracking-wider text-zinc-500">
          {label}
        </span>
        <span className="font-mono text-xs text-zinc-700">
          {count}
        </span>
      </div>
      <div className="divide-y divide-zinc-800/15">
        {children}
      </div>
    </div>
  );
}
