'use server';

import { createClientWithAuth } from '@/lib/supabase/server';
import { z } from 'zod';
import type { TaskRow } from '@/lib/supabase/database.types';

const updateStatusSchema = z.object({
  taskId: z.string().uuid(),
  newStatus: z.enum(['todo', 'in_progress', 'done', 'abandoned']),
});

export async function updateTaskStatus(taskId: string, newStatus: string) {
  const { client, user } = await createClientWithAuth();

  const parsed = updateStatusSchema.safeParse({
    taskId,
    newStatus,
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || 'Invalid input');
  }

  const { data: task } = await client
    .from('tasks')
    .select('*')
    .eq('id', taskId)
    .eq('user_id', user.id)
    .single() as { data: TaskRow | null };

  if (!task) {
    throw new Error('Task not found or access denied');
  }

  const updates: Record<string, unknown> = {
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

      // Get the most recently completed task to calculate streak
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
          // Already completed something today, keep streak same
        } else if (lastCompletedDate === yesterdayStr) {
          // Last completion was yesterday, increment streak
          newStreak += 1;
        } else {
          // Streak broken, start fresh
          newStreak = 1;
        }
      } else {
        // First ever completed task
        newStreak = 1;
      }

      await client
        .from('user_progress')
        // @ts-expect-error - Supabase client type inference issue
        .update({
          pillar_xp: newPillarXP,
          streak_current: newStreak,
          streak_best: Math.max(newStreak, progress.streak_best),
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);
    }
  }

  const { error } = await client
    .from('tasks')
    // @ts-expect-error - Supabase client type inference issue
    .update(updates)
    .eq('id', taskId)
    .eq('user_id', user.id);

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}

export async function deleteTask(taskId: string) {
  const { client, user } = await createClientWithAuth();

  const { error } = await client
    .from('tasks')
    .delete()
    .eq('id', taskId)
    .eq('user_id', user.id);

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}