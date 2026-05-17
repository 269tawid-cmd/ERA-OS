'use client';

import { useState, useTransition, useMemo } from 'react';
import { Card, CardHeader, CardContent, Button, Badge } from '@/components/ui';
import { PILLARS } from '@/lib/constants';
import { updateTaskStatus, deleteTask } from '@/lib/actions/tasks';
import { generateTodayMission } from '@/lib/actions/mission';
import type { Task } from '@/types';

interface TaskListProps {
  tasks: Task[];
  onTasksGenerated?: (tasks: Task[]) => void;
}

export function TaskList({ tasks: initialTasks, onTasksGenerated }: TaskListProps) {
  const [tasks, setTasks] = useState(initialTasks);
  const [, startTransition] = useTransition();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const handleGenerateMission = () => {
    setGenerating(true);
    startTransition(async () => {
      try {
        const result = await generateTodayMission();
        if (result.success && result.tasks.length > 0) {
          setTasks(prev => [...result.tasks, ...prev]);
          onTasksGenerated?.(result.tasks);
        }
      } catch (err) {
        console.error('Error generating mission:', err);
        alert(err instanceof Error ? err.message : 'Failed to generate mission');
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
      } catch (err) {
        console.error('Error updating task:', err);
        alert(err instanceof Error ? err.message : 'Failed to update task');
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
        alert(err instanceof Error ? err.message : 'Failed to update task');
      } finally {
        setProcessingId(null);
      }
    });
  };

  const todoTasks = useMemo(() => tasks.filter(t => t.status === 'todo'), [tasks]);
  const inProgressTasks = useMemo(() => tasks.filter(t => t.status === 'in_progress'), [tasks]);
  const doneTasks = useMemo(() => tasks.filter(t => t.status === 'done'), [tasks]);
  const abandonedTasks = useMemo(() => tasks.filter(t => t.status === 'abandoned'), [tasks]);

  const sections = [
    { title: 'To Do', tasks: todoTasks, key: 'todo' },
    { title: 'In Progress', tasks: inProgressTasks, key: 'in_progress' },
    { title: 'Done', tasks: doneTasks, key: 'done' },
    { title: 'Abandoned', tasks: abandonedTasks, key: 'abandoned' },
  ].filter(s => s.tasks.length > 0);

  const generatedCount = tasks.filter(t => t.origin === 'generated').length;
  const manualCount = tasks.filter(t => t.origin === 'manual').length;

  return (
    <Card className="bg-zinc-900/80 border border-zinc-700/60 backdrop-blur-sm overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between py-4 px-5">
        <div className="flex items-center gap-4">
          <h2 className="font-mono text-sm font-semibold text-zinc-200 uppercase tracking-wider">Tasks</h2>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-zinc-600">Generated: {generatedCount}</span>
            <span className="font-mono text-xs text-zinc-600">|</span>
            <span className="font-mono text-xs text-zinc-600">Manual: {manualCount}</span>
          </div>
        </div>
        <Button
          size="sm"
          variant="secondary"
          onClick={handleGenerateMission}
          loading={generating}
        >
          {generating ? 'Generating...' : "Generate Mission"}
        </Button>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        {tasks.length === 0 ? (
          <div className="text-center py-10">
            <p className="font-mono text-sm text-zinc-500 mb-2">No tasks recorded</p>
            <p className="font-mono text-sm text-zinc-600">Click &quot;Generate Mission&quot; to get started</p>
          </div>
        ) : (
          <div className="space-y-5">
            {sections.map(section => (
              <div key={section.key}>
                <h3 className="font-mono text-sm text-zinc-400 uppercase tracking-wider mb-3 pb-2 border-b border-zinc-800">
                  {section.title} ({section.tasks.length})
                </h3>
                <div className="space-y-2">
                  {section.tasks.map(task => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onStatusChange={handleStatusChange}
                      onDelete={handleDelete}
                      isProcessing={processingId === task.id}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface TaskItemProps {
  task: Task;
  onStatusChange: (id: string, status: Task['status']) => void;
  onDelete: (id: string) => void;
  isProcessing: boolean;
}

function TaskItem({ task, onStatusChange, onDelete, isProcessing }: TaskItemProps) {
  const pillar = PILLARS[task.pillar];
  const originBadgeVariant = task.origin === 'generated' ? 'ai' : 'default';

  const nextStatus: Record<Task['status'], Task['status'] | null> = {
    todo: 'in_progress',
    in_progress: 'done',
    done: null,
    abandoned: null,
  };

  const nextLabel = task.status === 'todo' ? 'Start' : task.status === 'in_progress' ? 'Complete' : null;

  return (
    <div className={`flex items-center gap-3 p-4 bg-zinc-900/60 border border-zinc-800/60 rounded-lg transition-all ${isProcessing ? 'opacity-50' : ''}`}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1.5">
          <span className="text-sm text-zinc-200 font-medium truncate">{task.title}</span>
          <Badge variant={task.pillar.toLowerCase() as 'hack' | 'build' | 'ai' | 'presence'}>
            {task.pillar}
          </Badge>
          <Badge variant={originBadgeVariant}>
            {task.origin}
          </Badge>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-sm text-zinc-500">
            M{task.month.toString().padStart(2, '0')}
          </span>
          <span className="font-mono text-sm" style={{ color: pillar.color }}>
            +{task.xp_value} XP
          </span>
          {task.description && (
            <span className="font-mono text-sm text-zinc-600 truncate max-w-[200px] hidden sm:block">
              {task.description}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {nextStatus[task.status] && nextLabel && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onStatusChange(task.id, nextStatus[task.status]!)}
            disabled={isProcessing}
            loading={isProcessing}
          >
            {nextLabel}
          </Button>
        )}
        <Button
          size="sm"
          variant="danger"
          onClick={() => {
            if (confirm('Delete this task?')) {
              onDelete(task.id);
            }
          }}
          disabled={isProcessing}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}