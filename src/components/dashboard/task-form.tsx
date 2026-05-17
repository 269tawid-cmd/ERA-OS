'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Input, Select, Button } from '@/components/ui';
import { createTaskSchema } from '@/lib/validations/task';
import { PILLAR_ORDER, PRIORITIES, XP_VALUES } from '@/lib/constants';
import type { Pillar, Priority } from '@/types';
import type { UserProgressRow } from '@/lib/supabase/database.types';

interface TaskFormProps {
  userId: string;
  defaultMonth?: number;
}

export function TaskForm({ userId, defaultMonth = 1 }: TaskFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pillar, setPillar] = useState<Pillar>('HACK');
  const [month, setMonth] = useState(defaultMonth.toString());
  const [priority, setPriority] = useState<Priority>('medium');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsed = createTaskSchema.safeParse({
      title,
      description: description || undefined,
      pillar,
      month: parseInt(month, 10),
      priority,
      is_recurring: false,
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || 'Validation failed');
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();

      const { data: progress } = await supabase
        .from('user_progress')
        .select('current_month')
        .eq('user_id', userId)
        .single() as { data: UserProgressRow | null };

      const currentMonth = progress?.current_month || 1;
      const taskMonth = parseInt(month, 10) || currentMonth;

      const taskData = {
        user_id: userId,
        title: parsed.data.title,
        description: parsed.data.description || null,
        pillar: parsed.data.pillar,
        month: taskMonth,
        priority: parsed.data.priority,
        status: 'todo',
        xp_value: XP_VALUES[parsed.data.priority as Priority],
        is_recurring: false,
        due_date: null,
        completed_at: null,
        recurrence: null,
      };

      // @ts-expect-error - Supabase client type inference issue
      const { error: insertError } = await supabase.from('tasks').insert(taskData as Parameters<typeof supabase.from>[0] extends string ? Parameters<ReturnType<typeof supabase.from>['insert']>[0] : never);

      if (insertError) throw insertError;

      setTitle('');
      setDescription('');
      setPillar('HACK');
      setMonth(defaultMonth.toString());
      setPriority('medium');

      router.refresh();
    } catch (err) {
      console.error('Error creating task:', err);
      setError('Failed to create task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-md">
          <p className="font-mono text-xs text-red-400">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Input
          label="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What do you want to do?"
          required
        />

        <Input
          label="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add details..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Select
          label="Pillar"
          value={pillar}
          onChange={(e) => setPillar(e.target.value as Pillar)}
          options={PILLAR_ORDER.map(p => ({ value: p, label: p }))}
        />

        <Select
          label="Month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          options={Array.from({ length: 12 }, (_, i) => ({
            value: (i + 1).toString(),
            label: `Month ${i + 1}`,
          }))}
        />

        <Select
          label="Priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          options={Object.entries(PRIORITIES).map(([value, { label }]) => ({
            value,
            label: `${label} (+${XP_VALUES[value as Priority]} XP)`,
          }))}
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading} loading={loading}>
          Create Task
        </Button>
      </div>
    </form>
  );
}