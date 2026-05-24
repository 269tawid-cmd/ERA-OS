'use server';

import { createClientWithAuth } from '@/lib/supabase/server';
import { z } from 'zod';
import type { LogRow } from '@/lib/supabase/database.types';
import type { Pillar } from '@/types';

const createLogSchema = z.object({
  content: z.string().min(1, 'Content is required').max(500, 'Content exceeds 500 characters'),
  pillar: z.enum(['HACK', 'BUILD', 'AI', 'PRESENCE']),
  is_win: z.boolean().default(false),
});

export async function createLog(data: { content: string; pillar: Pillar; is_win: boolean }) {
  try {
    const { client, user } = await createClientWithAuth();

    const parsed = createLogSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || 'Invalid input' };
    }

    const insertResult = await (client as unknown as { from: (t: string) => { insert: (d: Record<string, unknown>) => Promise<{ error: { message: string } | null }> } }).from('logs').insert({
      user_id: user.id,
      content: parsed.data.content,
      pillar: parsed.data.pillar,
      is_win: parsed.data.is_win,
      date: new Date().toISOString().split('T')[0],
    });

    if (insertResult.error) {
      return { success: false, error: insertResult.error.message };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to save log' };
  }
}

export async function deleteLog(logId: string) {
  try {
    const { client, user } = await createClientWithAuth();

    const { error } = await client
      .from('logs')
      .delete()
      .eq('id', logId)
      .eq('user_id', user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to delete log' };
  }
}

export async function getRecentLogs(limit = 10): Promise<LogRow[]> {
  const { client } = await createClientWithAuth();

  const { data, error } = await client
    .from('logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return (data || []) as LogRow[];
}

export async function getRecentWins(limit = 5): Promise<LogRow[]> {
  const { client } = await createClientWithAuth();

  const { data, error } = await client
    .from('logs')
    .select('*')
    .eq('is_win', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return (data || []) as LogRow[];
}
