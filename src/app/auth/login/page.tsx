import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function LoginPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect('/');
  }

  async function handleLogin() {
    'use server';

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_REDIRECT_URL || process.env.SITE_URL}/auth/callback`,
      },
    });

    if (error) {
      console.error('OAuth error:', error);
      return;
    }

    if (data.url) {
      redirect(data.url);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden animate-page-enter">
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/40 via-transparent to-zinc-900/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />

      <div className="relative text-center px-6 max-w-md w-full">
        <div className="mb-8">
          <div className="font-mono text-[10px] text-zinc-700 uppercase tracking-widest mb-3">
            era-os // authentication
          </div>
          <h1 className="font-mono text-3xl font-bold text-zinc-100 tracking-tight mb-2">
            Era OS
          </h1>
          <p className="font-mono text-xs text-zinc-500">
            AI-powered cybersecurity roadmap operating system
          </p>
        </div>

        <div className="border border-zinc-800/60 rounded-lg bg-zinc-900/60 backdrop-blur-sm p-6">
          <p className="font-mono text-xs text-zinc-500 mb-6">
            Sign in to continue your Hacker Era King journey
          </p>
          <form action={handleLogin}>
            <button
              type="submit"
              className="w-full px-6 py-3 bg-zinc-800/80 text-zinc-200 font-mono text-sm border border-zinc-700/60 rounded-md hover:bg-zinc-700/80 hover:border-zinc-600/60 transition-all duration-150 active:scale-[0.98]"
            >
              Sign in with Google
            </button>
          </form>
        </div>

        <div className="mt-8 font-mono text-[10px] text-zinc-700 space-y-1">
          <p>{'// Hack. Build. AI. Presence.'}</p>
          <p>{'// 48 months to become a legend'}</p>
        </div>
      </div>
    </div>
  );
}