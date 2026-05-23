'use client';

import { useState, useTransition, useMemo } from 'react';
import { Card, CardHeader, CardContent, Button } from '@/components/ui';
import { PILLAR_ORDER } from '@/lib/constants';
import { updateTaskStatus, deleteTask } from '@/lib/actions/tasks';
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
  onTasksGenerated?: (tasks: Task[]) => void;
}

export function OperationsList({ tasks: initialTasks, onTasksGenerated }: OperationsListProps) {
  const [tasks, setTasks] = useState(initialTasks);
  const [, startTransition] = useTransition();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
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
    startTransition(async () => {
      try {
        await updateTaskStatus(taskId, newStatus);
        setTasks(prev => prev.map(t =>
          t.id === taskId
            ? { ...t, status: newStatus, completed_at: newStatus === 'done' ? new Date().toISOString() : t.completed_at }
            : t
        ));
        const actionKey = newStatus === 'in_progress' ? 'taskEngaged' : newStatus === 'done' ? 'taskResolved' : null;
        if (actionKey) {
          const def = ACTION_ACKNOWLEDGMENTS[actionKey];
          if (def.message) acknowledge(def.message, def.weight);
        }
      } catch (err) {
        console.error('Error updating task:', err);
        const def = ACTION_ACKNOWLEDGMENTS.error;
        if (def.message) acknowledge(def.message, def.weight);
      } finally {
        setProcessingId(null);
      }
    });
  };

  const handleDelete = (taskId: string) => {
    if (!confirm('Delete this task?')) return;
    setProcessingId(taskId);
    startTransition(async () => {
      try {
        await deleteTask(taskId);
        setTasks(prev => prev.filter(t => t.id !== taskId));
      } catch (err) {
        console.error('Error deleting task:', err);
        const def = ACTION_ACKNOWLEDGMENTS.error;
        if (def.message) acknowledge(def.message, def.weight);
      } finally {
        setProcessingId(null);
      }
    });
  };

  const inProgress = filtered.filter(t => t.status === 'in_progress');
  const pending = filtered.filter(t => t.status === 'todo');
  const completed = filtered.filter(t => t.status === 'done');
  const archived = filtered.filter(t => t.status === 'abandoned');

  const totalCount = tasks.length;
  const doneCount = tasks.filter(t => t.status === 'done').length;
  const activeCount = tasks.filter(t => t.status === 'todo' || t.status === 'in_progress').length;
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <h2 className="font-mono text-base font-semibold text-zinc-200 uppercase tracking-wider">
              Operations
            </h2>
            <div className="flex items-center gap-3 font-mono text-[11px]">
              <span className="text-zinc-500">{activeCount} active</span>
              <span className="text-zinc-700">·</span>
              <span className="text-emerald-500/70">{doneCount} resolved</span>
              <span className="text-zinc-700">·</span>
              <span className="text-zinc-500">{completionRate}%</span>
            </div>
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={handleGenerateMission}
            loading={generating}
          >
            {generating ? 'Tasking...' : 'Generate Tasking'}
          </Button>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row gap-2 mt-3">
          <div className="flex-1 relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-600 text-xs font-mono">&gt;</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search operations..."
              className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-md pl-7 pr-3 py-1.5 text-sm font-mono text-zinc-300 placeholder-zinc-600 outline-none focus:border-zinc-600/60 transition-colors"
              autoComplete="off"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="bg-zinc-800/50 border border-zinc-700/50 rounded-md px-2.5 py-1.5 text-xs font-mono text-zinc-400 outline-none focus:border-zinc-600/60 transition-colors"
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
              className="bg-zinc-800/50 border border-zinc-700/50 rounded-md px-2.5 py-1.5 text-xs font-mono text-zinc-400 outline-none focus:border-zinc-600/60 transition-colors"
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select
              value={pillarFilter}
              onChange={(e) => setPillarFilter(e.target.value as PillarFilter)}
              className="bg-zinc-800/50 border border-zinc-700/50 rounded-md px-2.5 py-1.5 text-xs font-mono text-zinc-400 outline-none focus:border-zinc-600/60 transition-colors"
            >
              <option value="all">All Pillar</option>
              {PILLAR_ORDER.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <select
              value={monthFilter ?? ''}
              onChange={(e) => setMonthFilter(e.target.value ? parseInt(e.target.value) : null)}
              className="bg-zinc-800/50 border border-zinc-700/50 rounded-md px-2.5 py-1.5 text-xs font-mono text-zinc-400 outline-none focus:border-zinc-600/60 transition-colors"
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
        defaultMonth={availableMonths[0] || 1}
        onCreated={() => {}}
      />

      <CardContent className="px-0 py-0">
        {filtered.length === 0 ? (
          <div className="text-center py-12 px-5">
            <p className="font-mono text-sm text-zinc-500 mb-2">
              {hasActiveFilters ? 'No matching operations' : 'No operations yet'}
            </p>
            <p className="font-mono text-xs text-zinc-600">
              {hasActiveFilters ? 'Try adjusting your filters' : 'Use quick add above or generate tasking'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/40">
            {inProgress.length > 0 && (
              <Section label="Engaged" count={inProgress.length} color="text-blue-400">
                {inProgress.map(task => (
                  <div key={task.id} className="px-0">
                    <OperationCard
                      task={task}
                      onStatusChange={handleStatusChange}
                      onDelete={handleDelete}
                      isProcessing={processingId === task.id}
                    />
                  </div>
                ))}
              </Section>
            )}

            {pending.length > 0 && (
              <Section label="Pending" count={pending.length} color="text-zinc-400">
                {pending.map(task => (
                  <div key={task.id} className="px-0">
                    <OperationCard
                      task={task}
                      onStatusChange={handleStatusChange}
                      onDelete={handleDelete}
                      isProcessing={processingId === task.id}
                    />
                  </div>
                ))}
              </Section>
            )}

            {(completed.length > 0 || archived.length > 0) && (
              <details className="group" open={inProgress.length === 0 && pending.length === 0}>
                <summary className="sticky top-0 px-5 py-2.5 bg-zinc-900/80 backdrop-blur-sm cursor-pointer hover:bg-zinc-900/90 transition-colors list-none flex items-center gap-2 select-none">
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
                    <Section label="Resolved" count={completed.length} color="text-emerald-400">
                      {completed.map(task => (
                        <div key={task.id} className="px-0">
                          <OperationCard
                            task={task}
                            onStatusChange={handleStatusChange}
                            onDelete={handleDelete}
                            isProcessing={processingId === task.id}
                          />
                        </div>
                      ))}
                    </Section>
                  )}
                  {archived.length > 0 && (
                    <Section label="Archived" count={archived.length} color="text-zinc-600">
                      {archived.map(task => (
                        <div key={task.id} className="px-0">
                          <OperationCard
                            task={task}
                            onStatusChange={handleStatusChange}
                            onDelete={handleDelete}
                            isProcessing={processingId === task.id}
                          />
                        </div>
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

function Section({ label, count, color, children }: { label: string; count: number; color: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="px-5 py-2 flex items-center gap-2 border-b border-zinc-800/30">
        <span className={`font-mono text-xs uppercase tracking-wider ${color}`}>
          {label}
        </span>
        <span className="font-mono text-xs text-zinc-700">
          {count}
        </span>
      </div>
      <div className="divide-y divide-zinc-800/20">
        {children}
      </div>
    </div>
  );
}
