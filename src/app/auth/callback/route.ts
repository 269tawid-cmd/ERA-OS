import { createClient } from '@/lib/supabase/server';
import { bootstrapUserProgress } from '@/lib/supabase/auth';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createClient();
    const { data: sessionData, error } = await supabase.auth.exchangeCodeForSession(code);

    console.log('AUTH CALLBACK SESSION:', {
      hasUser: !!sessionData?.user,
      userId: sessionData?.user?.id,
      error: error?.message,
    });

    if (!error && sessionData?.user) {
      await bootstrapUserProgress(sessionData.user.id);
      return NextResponse.redirect(new URL(next, origin));
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=auth_failed`);
}