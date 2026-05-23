import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/supabase/auth';
import { redirect } from 'next/navigation';
import { getRoadmapProgress } from '@/lib/roadmap';
import { Workspace } from '@/components/workspace';
import type { TaskRow, UserProgressRow, LogRow, CtfEntryRow } from '@/lib/supabase/database.types';

export default async function WorkspacePage() {
  const user = await getUser();
  
  if (!user) {
    redirect('/auth/login');
  }
  
  const supabase = await createClient();
  
  const { data: progress } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', user.id)
    .single() as { data: UserProgressRow | null };
  
  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20) as { data: TaskRow[] | null };
  
  const { data: logs } = await supabase
    .from('logs')
    .select('*')
    .eq('user_id', user.id) as { data: LogRow[] | null };
  
  const { data: ctfEntries } = await supabase
    .from('ctf_entries')
    .select('*')
    .eq('user_id', user.id) as { data: CtfEntryRow[] | null };
  
  const currentMonth = progress?.current_month || 1;
  const pillarXP = progress?.pillar_xp as Record<string, number> || { HACK: 0, BUILD: 0, AI: 0, PRESENCE: 0 };
  const roadmapProgress = getRoadmapProgress(currentMonth, progress?.start_date);
  
  const doneTasks = (tasks || []).filter((t) => t.status === 'done');
  
  const workspaceData = {
    tasks: tasks || [],
    pillarXP,
    streakCurrent: progress?.streak_current || 0,
    currentMonth,
    startDate: progress?.start_date,
    progress: {
      percentage: roadmapProgress.percentage,
      daysRemaining: roadmapProgress.daysRemaining,
      daysElapsed: roadmapProgress.daysElapsed,
    },
    logs: logs || [],
    ctfEntries: ctfEntries || [],
    logsCount: (logs || []).length,
    ctfCount: (ctfEntries || []).filter((e) => e.solved).length,
    tasksTotal: (tasks || []).length,
    tasksCompleted: doneTasks.length,
  };
  
  return (
    <main className="w-full h-screen overflow-hidden animate-page-enter">
      <Workspace data={workspaceData} />
    </main>
  );
}