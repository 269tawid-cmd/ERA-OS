'use client';

import { useState, useTransition, useMemo } from 'react';
import { Card, CardHeader, CardContent, Button, Badge } from '@/components/ui';
import { PILLARS } from '@/lib/constants';
import { updateTaskStatus, deleteTask } from '@/lib/actions/tasks';
import type { Task } from '@/types';

interface TaskListProps {
  tasks: Task[];
}

export function TaskList({ tasks: initialTasks }: TaskListProps) {
  const [tasks, setTasks] = useState(initialTasks);
  const [, startTransition] = useTransition();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
    setProcessingId(taskId);
    startTransition(async () => {
      try {
        await updateTaskStatus(taskId, newStatus);
        setTasks(tasks.map(t =>
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
        setTasks(tasks.filter(t => t.id !== taskId));
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

  return (
    <Card className="bg-zinc-900/60 border border-zinc-800/60 backdrop-blur-sm overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between">
        <h2 className="font-mono text-sm text-zinc-300 uppercase tracking-widest">Tasks</h2>
        <span className="font-mono text-[10px] text-zinc-600">{tasks.length} total</span>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="font-mono text-xs text-zinc-600 mb-1">No tasks recorded</p>
            <p className="font-mono text-[10px] text-zinc-700">Create tasks above to begin tracking</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sections.map(section => (
              <div key={section.key}>
                <h3 className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest mb-2">
                  {section.title} ({section.tasks.length})
                </h3>
                <div className="space-y-1.5">
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

  const nextStatus: Record<Task['status'], Task['status'] | null> = {
    todo: 'in_progress',
    in_progress: 'done',
    done: null,
    abandoned: null,
  };

  const nextLabel = task.status === 'todo' ? 'Start' : task.status === 'in_progress' ? 'Done' : null;

  return (
    <div className={`group flex items-center gap-3 p-3 bg-zinc-900/40 border border-zinc-800/40 rounded-md transition-opacity ${isProcessing ? 'opacity-50' : ''}`}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-zinc-200 truncate">{task.title}</span>
          <Badge variant={task.pillar.toLowerCase() as 'hack' | 'build' | 'ai' | 'presence'}>
            {task.pillar}
          </Badge>
        </div>
        <div className="flex items-center gap-3 mt-1">
          <span className="font-mono text-[10px] text-zinc-600">
            M{task.month.toString().padStart(2, '0')}
          </span>
          <span className="font-mono text-[10px]" style={{ color: pillar.color }}>
            +{task.xp_value} XP
          </span>
          {task.description && (
            <span className="font-mono text-[10px] text-zinc-600 truncate max-w-[150px]">
              {task.description}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
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
          variant="ghost"
          onClick={() => onDelete(task.id)}
          disabled={isProcessing}
        >
          Del
        </Button>
      </div>
    </div>
  );
}