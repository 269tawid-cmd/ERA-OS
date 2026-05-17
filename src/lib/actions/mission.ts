'use server';

import { createClientWithAuth } from '@/lib/supabase/server';
import type { Task, Pillar, Priority } from '@/types';
import { getDBRoadmapSchema } from './roadmap';
import { ingestYear1Roadmap } from '@/lib/roadmap/ingest';
import { getTodayMission } from '@/lib/roadmap/task-generator';
import { ROADMAP_DATA } from '@/lib/roadmap';
import type { TaskRow, UserProgressRow } from '@/lib/supabase/database.types';
import type { YearlyRoadmapSchema } from '@/lib/roadmap/schema';

type InsertTask = {
  user_id: string;
  title: string;
  description: string;
  pillar: Pillar;
  month: number;
  priority: Priority;
  status: 'todo';
  xp_value: number;
  origin: 'generated' | 'manual';
  category: string;
  source_template: string | null;
  generation_date: string | null;
  generation_context: Record<string, unknown> | null;
  is_recurring: boolean;
};

interface GenerateMissionResult {
  success: boolean;
  tasks: Task[];
  summary: string;
  error?: string;
}

export async function generateTodayMission(): Promise<GenerateMissionResult> {
  const { client, user } = await createClientWithAuth();
  
  const { data: progress } = await client
    .from('user_progress')
    .select('*')
    .eq('user_id', user.id)
    .single() as { data: UserProgressRow | null };
  
  if (!progress) {
    return { success: false, tasks: [], summary: '', error: 'No progress found' };
  }
  
  const currentMonth = progress.current_month;
  
  const { data: existingTasks } = await client
    .from('tasks')
    .select('*')
    .eq('user_id', user.id)
    .eq('month', currentMonth) as { data: TaskRow[] | null };
  
  const pillarXPData = progress.pillar_xp as Record<string, number>;
  const pillarXP = {
    HACK: pillarXPData.HACK || 0,
    BUILD: pillarXPData.BUILD || 0,
    AI: pillarXPData.AI || 0,
    PRESENCE: pillarXPData.PRESENCE || 0,
  };
  
  let yearlySchema: YearlyRoadmapSchema = ingestYear1Roadmap(ROADMAP_DATA);
  
  const { data: activeRoadmap } = await client
    .from('yearly_roadmaps')
    .select('id')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .single() as { data: { id: string } | null };
  
  if (activeRoadmap) {
    const dbSchema = await getDBRoadmapSchema(activeRoadmap.id);
    if (dbSchema) {
      yearlySchema = dbSchema;
    }
  }
  
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
  
  const { tasks: generatedTasks, summary } = getTodayMission(
    currentMonth,
    pillarXP,
    progress.streak_current,
    pendingTasks,
    pendingTasks,
    yearlySchema
  );
  
  const newTasks: Task[] = [];
  
  for (const generated of generatedTasks) {
    if (existingTaskTitles.includes(generated.title)) {
      continue;
    }
    
    const insertData: InsertTask = {
      user_id: user.id,
      title: generated.title,
      description: generated.description,
      pillar: generated.pillar,
      month: currentMonth,
      priority: generated.priority,
      status: 'todo',
      xp_value: generated.xp_value,
      origin: 'generated',
      category: generated.category,
      source_template: generated.source_template || null,
      generation_date: new Date().toISOString().split('T')[0],
      generation_context: { reason: generated.reason },
      is_recurring: false,
    };
    
    // @ts-expect-error - Supabase insert typing issue
    const { data, error } = await client.from('tasks').insert(insertData).select().single() as { data: TaskRow | null; error: { message: string } | null };
    
    if (data && !error) {
      const taskData = data as TaskRow;
      newTasks.push({
        id: taskData.id,
        title: taskData.title,
        description: taskData.description || undefined,
        pillar: taskData.pillar,
        month: taskData.month,
        priority: taskData.priority,
        status: taskData.status,
        xp_value: taskData.xp_value,
        due_date: taskData.due_date || undefined,
        completed_at: taskData.completed_at || undefined,
        is_recurring: taskData.is_recurring,
        recurrence: taskData.recurrence || undefined,
        origin: taskData.origin,
        category: taskData.category,
        source_template: taskData.source_template || undefined,
        generation_date: taskData.generation_date || undefined,
        created_at: taskData.created_at,
      });
    }
  }
  
  return {
    success: true,
    tasks: newTasks,
    summary,
  };
}

export async function createTask(data: {
  title: string;
  description?: string;
  pillar: 'HACK' | 'BUILD' | 'AI' | 'PRESENCE';
  month: number;
  priority: 'high' | 'medium' | 'low';
  xp_value: number;
}) {
  const { client, user } = await createClientWithAuth();
  
  const insertData: InsertTask = {
    user_id: user.id,
    title: data.title,
    description: data.description || '',
    pillar: data.pillar,
    month: data.month,
    priority: data.priority,
    status: 'todo',
    xp_value: data.xp_value,
    origin: 'manual',
    category: 'practice',
    source_template: null,
    generation_date: null,
    generation_context: null,
    is_recurring: false,
  };
  
  // @ts-expect-error - Supabase insert typing issue
  const { data: task, error } = await client.from('tasks').insert(insertData).select().single() as { data: TaskRow | null; error: { message: string } | null };
  
  if (error) {
    throw new Error(error.message);
  }
  
  const taskData = task as TaskRow;
  return {
    id: taskData.id,
    title: taskData.title,
    description: taskData.description,
    pillar: taskData.pillar,
    month: taskData.month,
    priority: taskData.priority,
    status: taskData.status,
    xp_value: taskData.xp_value,
    origin: taskData.origin,
    category: taskData.category,
    created_at: taskData.created_at,
  };
}

export async function getTasksByOrigin(userId: string, origin: 'generated' | 'manual' | 'all') {
  const { client } = await createClientWithAuth();
  
  let query = client.from('tasks').select('*').eq('user_id', userId);
  
  if (origin !== 'all') {
    query = query.eq('origin', origin);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false }) as {
    data: TaskRow[] | null;
    error: { message: string } | null;
  };
  
  if (error) {
    throw new Error(error.message);
  }
  
  return (data || []).map(t => ({
    id: t.id,
    title: t.title,
    description: t.description,
    pillar: t.pillar,
    month: t.month,
    priority: t.priority,
    status: t.status,
    xp_value: t.xp_value,
    due_date: t.due_date,
    completed_at: t.completed_at,
    is_recurring: t.is_recurring,
    recurrence: t.recurrence,
    origin: t.origin,
    category: t.category,
    source_template: t.source_template,
    generation_date: t.generation_date,
    created_at: t.created_at,
  })) as Task[];
}