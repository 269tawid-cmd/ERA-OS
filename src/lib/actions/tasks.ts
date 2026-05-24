'use server';

import { createClientWithAuth } from '@/lib/supabase/server';
import { z } from 'zod';
import type { TaskRow, Json } from '@/lib/supabase/database.types';

const updateStatusSchema = z.object({
  taskId: z.string().uuid(),
  newStatus: z.enum(['todo', 'in_progress', 'done', 'abandoned']),
});

export async function updateTaskStatus(taskId: string, newStatus: string) {
  try {
    const { client, user } = await createClientWithAuth();

    const parsed = updateStatusSchema.safeParse({ taskId, newStatus });
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || 'Invalid input' };
    }

    const { data: task } = await client
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .eq('user_id', user.id)
      .single() as { data: TaskRow | null };

    if (!task) {
      return { success: false, error: 'Task not found or access denied' };
    }

    const updates: Record<string, Json> = {
      status: newStatus,
    };

    if (newStatus === 'done' && task.status !== 'done') {
      updates.completed_at = new Date().toISOString();

      const { data: progress } = await client
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .single() as { data: import('@/lib/supabase/database.types').UserProgressRow | null };

      if (progress) {
        const pillarXP = progress.pillar_xp as Record<string, number>;
        const newPillarXP = {
          ...pillarXP,
          [task.pillar]: (pillarXP[task.pillar] || 0) + task.xp_value,
        };

        const { data: lastCompletedTask } = await client
          .from('tasks')
          .select('completed_at')
          .eq('user_id', user.id)
          .eq('status', 'done')
          .not('completed_at', 'is', null)
          .order('completed_at', { ascending: false })
          .limit(1)
          .single() as { data: { completed_at: string } | null };

        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        let newStreak = progress.streak_current;

        if (lastCompletedTask) {
          const lastCompletedDate = lastCompletedTask.completed_at?.split('T')[0];
          if (lastCompletedDate === today) {
          } else if (lastCompletedDate === yesterdayStr) {
            newStreak += 1;
          } else {
            newStreak = 1;
          }
        } else {
          newStreak = 1;
        }

        const { error: progressError } = await client
          .from('user_progress')
          .update({
            pillar_xp: newPillarXP as Json,
            streak_current: newStreak,
            streak_best: Math.max(newStreak, progress.streak_best),
            updated_at: new Date().toISOString(),
          } as never)
          .eq('user_id', user.id);

        if (progressError) {
          console.error('Failed to update progress:', progressError.message);
        }
      }
    }

    const { error } = await client
      .from('tasks')
      .update(updates as never)
      .eq('id', taskId)
      .eq('user_id', user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to update task' };
  }
}

const updatePrioritySchema = z.object({
  taskId: z.string().uuid(),
  priority: z.enum(['low', 'medium', 'high']),
});

export async function updateTaskPriority(taskId: string, priority: string) {
  try {
    const { client, user } = await createClientWithAuth();

    const parsed = updatePrioritySchema.safeParse({ taskId, priority });
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || 'Invalid input' };
    }

    const { error } = await client
      .from('tasks')
      .update({ priority } as never)
      .eq('id', taskId)
      .eq('user_id', user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to update priority' };
  }
}

export async function deleteTask(taskId: string) {
  try {
    const { client, user } = await createClientWithAuth();

    const { error } = await client
      .from('tasks')
      .delete()
      .eq('id', taskId)
      .eq('user_id', user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to delete task' };
  }
}
