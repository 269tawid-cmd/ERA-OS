import { redirect } from 'next/navigation';
import { createClient } from './server';

export async function bootstrapUserProgress(userId: string): Promise<void> {
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from('user_progress')
    .select('id')
    .eq('user_id', userId)
    .single();

if (existing) return;

  await (supabase as unknown as { from: (t: string) => { insert: (d: Record<string, unknown>) => Promise<unknown> } }).from('user_progress').insert({
    user_id: userId,
    current_month: 1,
    start_date: new Date().toISOString().split('T')[0],
    streak_current: 0,
    streak_best: 0,
    pillar_xp: { HACK: 0, BUILD: 0, AI: 0, PRESENCE: 0 },
    monthly_completion: {},
    badges: [],
  });
}

export async function signInWithGoogle() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_REDIRECT_URL || process.env.SITE_URL}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  if (data.url) {
    redirect(data.url);
  }
}

export async function signOut() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }

  redirect('/auth/login');
}

export async function getUser() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  return user;
}