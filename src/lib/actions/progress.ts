'use server';

import { createClientWithAuth } from '@/lib/supabase/server';
import { ingestYear1Roadmap } from '@/lib/roadmap/ingest';
import { getTodayMission } from '@/lib/roadmap/task-generator';
import { ROADMAP_DATA } from '@/lib/roadmap';
import type { TaskRow, UserProgressRow, Json } from '@/lib/supabase/database.types';
import type { YearlyRoadmapSchema } from '@/lib/roadmap/schema';
import type { Task, Pillar } from '@/types';

export async function advanceMonth(): Promise<{
  success: boolean;
  newMonth: number;
  monthTitle: string;
  tasksGenerated: number;
  summary: string;
  error?: string;
}> {
  try {
    const { client, user } = await createClientWithAuth();

    const { data: progress } = await client
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .single() as { data: UserProgressRow | null };

    if (!progress) {
      return { success: false, newMonth: 1, monthTitle: '', tasksGenerated: 0, summary: '', error: 'No progress found' };
    }

    const nextMonth = Math.min(progress.current_month + 1, 48);

    const { error: updateError } = await client
      .from('user_progress')
      .update({ current_month: nextMonth, updated_at: new Date().toISOString() } as never)
      .eq('user_id', user.id);

    if (updateError) {
      return { success: false, newMonth: progress.current_month, monthTitle: '', tasksGenerated: 0, summary: '', error: updateError.message };
    }

    const nextMonthData = ROADMAP_DATA.find(m => m.month === nextMonth);
    const monthTitle = nextMonthData?.title || `Month ${nextMonth}`;

    const pillarXPData = progress.pillar_xp as Record<string, number>;
    const pillarXP = {
      HACK: pillarXPData.HACK || 0,
      BUILD: pillarXPData.BUILD || 0,
      AI: pillarXPData.AI || 0,
      PRESENCE: pillarXPData.PRESENCE || 0,
    };

    const yearlySchema: YearlyRoadmapSchema = ingestYear1Roadmap(ROADMAP_DATA);

    const { data: existingTasks } = await client
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .eq('month', nextMonth) as { data: TaskRow[] | null };

    const existingTaskTitles = (existingTasks || []).map(t => t.title);

    const pendingTasks: Task[] = (existingTasks || []).map(t => ({
      id: t.id,
      title: t.title,
      description: t.description || undefined,
      pillar: t.pillar,
      month: t.month,
      priority: t.priority,
      status: t.status,
      xp_value: t.xp_value,
      due_date: t.due_date || undefined,
      completed_at: t.completed_at || undefined,
      is_recurring: t.is_recurring,
      recurrence: t.recurrence || undefined,
      origin: t.origin,
      category: t.category,
      source_template: t.source_template || undefined,
      generation_date: t.generation_date || undefined,
      created_at: t.created_at,
    }));

    const allTasksForMonth = (existingTasks || []).map(t => ({
      id: t.id,
      title: t.title,
      description: t.description || undefined,
      pillar: t.pillar,
      month: t.month,
      priority: t.priority,
      status: t.status,
      xp_value: t.xp_value,
      due_date: t.due_date || undefined,
      completed_at: t.completed_at || undefined,
      is_recurring: t.is_recurring,
      recurrence: t.recurrence || undefined,
      origin: t.origin,
      category: t.category,
      source_template: t.source_template || undefined,
      generation_date: t.generation_date || undefined,
      created_at: t.created_at,
    }));

    const { tasks: generatedTasks, summary } = getTodayMission(
      nextMonth,
      pillarXP,
      progress.streak_current,
      pendingTasks,
      allTasksForMonth,
      yearlySchema
    );

    let insertedCount = 0;

    for (const generated of generatedTasks) {
      if (existingTaskTitles.includes(generated.title)) continue;

      const insertData = {
        user_id: user.id,
        title: generated.title,
        description: generated.description,
        pillar: generated.pillar,
        month: nextMonth,
        priority: generated.priority,
        status: 'todo' as const,
        xp_value: generated.xp_value,
        origin: 'generated' as const,
        category: generated.category,
        source_template: generated.source_template || null,
        generation_date: new Date().toISOString().split('T')[0],
        generation_context: { reason: generated.reason, type: 'month_advancement' } as Json,
        is_recurring: false,
        due_date: null,
        completed_at: null,
        recurrence: null,
      };

      const { error } = await client.from('tasks').insert(insertData as never) as unknown as { error: { message: string } | null };
      if (!error) insertedCount++;
    }

    return {
      success: true,
      newMonth: nextMonth,
      monthTitle,
      tasksGenerated: insertedCount,
      summary,
    };
  } catch (err) {
    return {
      success: false,
      newMonth: 0,
      monthTitle: '',
      tasksGenerated: 0,
      summary: '',
      error: err instanceof Error ? err.message : 'Failed to advance month',
    };
  }
}

export async function getMonthCompletionStatus(): Promise<{
  currentMonth: number;
  totalTasks: number;
  completedTasks: number;
  percentage: number;
  monthTitle: string;
}> {
  const { client, user } = await createClientWithAuth();

  const { data: progress } = await client
    .from('user_progress')
    .select('current_month')
    .eq('user_id', user.id)
    .single() as { data: { current_month: number } | null };

  const currentMonth = progress?.current_month || 1;
  const monthData = ROADMAP_DATA.find(m => m.month === currentMonth);
  const monthTitle = monthData?.title || `Month ${currentMonth}`;

  const { data: tasks } = await client
    .from('tasks')
    .select('status')
    .eq('user_id', user.id)
    .eq('month', currentMonth) as { data: { status: string }[] | null };

  const total = tasks?.length || 0;
  const completed = tasks?.filter(t => t.status === 'done').length || 0;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { currentMonth, totalTasks: total, completedTasks: completed, percentage, monthTitle };
}
