'use server';

import { createClientWithAuth } from '@/lib/supabase/server';
import { z } from 'zod';
import type { CtfEntryRow, Json, UserProgressRow } from '@/lib/supabase/database.types';
import type { CTFPlatform, CTFCategory, CTFDifficulty } from '@/types';

const createCTFSchema = z.object({
  name: z.string().min(1, 'Challenge name is required').max(200, 'Name too long'),
  platform: z.enum(['PicoCTF', 'HackTheBox', 'TryHackMe', 'CTFtime', 'Other']),
  category: z.enum(['Web', 'Crypto', 'Forensics', 'Pwn', 'Misc']),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  solved: z.boolean().default(false),
  flag_notes: z.string().max(500).optional(),
  xp_earned: z.number().min(0).max(500).default(0),
});

export async function createCTF(data: {
  name: string;
  platform: CTFPlatform;
  category: CTFCategory;
  difficulty: CTFDifficulty;
  solved: boolean;
  flag_notes?: string;
  xp_earned?: number;
}) {
  try {
    const { client, user } = await createClientWithAuth();

    const parsed = createCTFSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || 'Invalid input' };
    }

    const xpEarned = parsed.data.solved ? parsed.data.xp_earned : 0;

    const insertResult = await (client as unknown as { from: (t: string) => { insert: (d: Record<string, unknown>) => Promise<{ error: { message: string } | null }> } }).from('ctf_entries').insert({
      user_id: user.id,
      name: parsed.data.name,
      platform: parsed.data.platform,
      category: parsed.data.category,
      difficulty: parsed.data.difficulty,
      solved: parsed.data.solved,
      flag_notes: parsed.data.flag_notes || null,
      xp_earned: xpEarned,
      date: new Date().toISOString().split('T')[0],
    });

    if (insertResult.error) {
      return { success: false, error: insertResult.error.message };
    }

    if (xpEarned > 0) {
      const { data: progress } = await client
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .single() as { data: UserProgressRow | null };

      if (progress) {
        const pillarXP = progress.pillar_xp as Record<string, number>;
        const newPillarXP = {
          ...pillarXP,
          HACK: (pillarXP.HACK || 0) + xpEarned,
        };

        const { error: xpError } = await client
          .from('user_progress')
          .update({
            pillar_xp: newPillarXP as Json,
            updated_at: new Date().toISOString(),
          } as never)
          .eq('user_id', user.id);

        if (xpError) {
          console.error('Failed to update XP for CTF entry:', xpError.message);
        }
      }
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to log CTF' };
  }
}

export async function deleteCTF(ctfId: string) {
  try {
    const { client, user } = await createClientWithAuth();

    const { error } = await client
      .from('ctf_entries')
      .delete()
      .eq('id', ctfId)
      .eq('user_id', user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to delete CTF entry' };
  }
}

export async function getRecentCTFs(limit = 10): Promise<CtfEntryRow[]> {
  const { client } = await createClientWithAuth();

  const { data, error } = await client
    .from('ctf_entries')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return (data || []) as CtfEntryRow[];
}

export async function getRecentSolvedCTFs(limit = 5): Promise<CtfEntryRow[]> {
  const { client } = await createClientWithAuth();

  const { data, error } = await client
    .from('ctf_entries')
    .select('*')
    .eq('solved', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return (data || []) as CtfEntryRow[];
}
