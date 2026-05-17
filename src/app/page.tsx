import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/supabase/auth';
import { redirect } from 'next/navigation';
import { getMonthData, getRoadmapProgress } from '@/lib/roadmap';
import {
  QuickStats,
  TaskList,
  TaskForm,
  MonthCard,
  PillarProgress,
  DashboardInsights,
  TodaysFocus,
} from '@/components/dashboard';
import { MentorPanel } from '@/components/mentor';
import { XPBarChart, MonthlyProgressGrid, ProductivitySummary } from '@/components/analytics';
import { LearningLogForm, LearningTimeline } from '@/components/logs';
import { CTFForm, CTFList } from '@/components/ctf';
import { JourneyStatus } from '@/components/roadmap';
import { Card, CardHeader, CardContent } from '@/components/ui';
import type { TaskRow, UserProgressRow, LogRow, CtfEntryRow } from '@/lib/supabase/database.types';

export default async function Dashboard() {
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
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(15) as { data: LogRow[] | null };

  const { data: ctfEntries } = await supabase
    .from('ctf_entries')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10) as { data: CtfEntryRow[] | null };

  const currentMonth = progress?.current_month || 1;
  const monthData = getMonthData(currentMonth);
  const roadmapProgress = getRoadmapProgress(currentMonth);
  const pillarXP = progress?.pillar_xp as Record<string, number> || { HACK: 0, BUILD: 0, AI: 0, PRESENCE: 0 };

  const taskList = (tasks || []).map(t => ({
    ...t,
    description: t.description ?? undefined,
    due_date: t.due_date ?? undefined,
    completed_at: t.completed_at ?? undefined,
    recurrence: t.recurrence ?? undefined,
    origin: (t as { origin?: 'generated' | 'manual' }).origin ?? 'manual',
    category: (t as { category?: 'practice' | 'learning' | 'project' | 'review' | 'ctf' | 'documentation' | 'automation' }).category ?? 'practice',
    source_template: (t as { source_template?: string }).source_template ?? undefined,
    generation_date: (t as { generation_date?: string }).generation_date ?? undefined,
  }));

  const doneTasks = taskList.filter((t) => t.status === 'done');
  const monthsWithCompletedTasks = [...new Set(doneTasks.map((t) => t.month))];
  const monthsCompleted = monthsWithCompletedTasks.length;

  const journeyStats = {
    streakCurrent: progress?.streak_current || 0,
    hackXP: pillarXP.HACK || 0,
    ctfSolvedCount: (ctfEntries || []).filter((e) => e.solved).length,
    tasksCompletedCount: doneTasks.length,
    logsCount: (logs || []).length,
    winsCount: (logs || []).filter((l) => l.is_win).length,
    monthsCompleted,
    currentMonth,
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-200">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <header className="mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="font-mono text-xs text-zinc-600">era-os</span>
              <span className="font-mono text-[10px] text-zinc-700">v0.1.0</span>
            </div>
            <h1 className="font-mono text-2xl font-bold text-zinc-100 tracking-tight">
              Command Center
            </h1>
            <p className="font-mono text-xs text-zinc-600 mt-0.5">
              Your roadmap-aware operating system
            </p>
          </div>
          <Link
            href="/roadmap"
            className="font-mono text-[10px] text-zinc-600 hover:text-zinc-400 border border-zinc-800/60 px-3 py-2 rounded-md hover:bg-zinc-900/40 transition-colors duration-150 flex items-center gap-2"
          >
            <span className="text-zinc-500">{'→'}</span>
            View Roadmap
          </Link>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          <div className="lg:col-span-2">
            <MonthCard
              month={currentMonth}
              monthData={monthData}
              progress={roadmapProgress}
            />
          </div>
          <div>
            <MentorPanel />
          </div>
        </div>

        <div className="mb-4">
          <QuickStats
            currentMonth={currentMonth}
            monthTitle={monthData?.title || 'Unknown'}
            progress={roadmapProgress}
            streakCurrent={progress?.streak_current || 0}
            pillarXP={pillarXP}
            totalTasks={taskList.length}
            completedTasks={doneTasks.length}
          />
        </div>

        <div className="mb-4 p-3 bg-zinc-900/60 border border-zinc-800/60 backdrop-blur-sm rounded-lg">
          <JourneyStatus stats={journeyStats} compact />
        </div>

        <div className="mb-4">
          <MonthlyProgressGrid currentMonth={currentMonth} tasks={taskList} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <XPBarChart pillarXP={pillarXP} />
          <ProductivitySummary
            tasks={taskList}
            streakCurrent={progress?.streak_current || 0}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <TodaysFocus
            tasks={taskList}
            monthData={monthData}
            currentMonth={currentMonth}
            pillarXP={pillarXP}
          />
          <DashboardInsights
            tasks={taskList}
            pillarXP={pillarXP}
          />
        </div>

        <div className="mb-4">
          <PillarProgress pillarXP={pillarXP} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <Card className="bg-zinc-900/60 border border-zinc-800/60 backdrop-blur-sm overflow-hidden">
            <CardHeader className="pb-2">
              <h2 className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">
                Learning Log
              </h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <LearningLogForm />
              <div className="pt-3 border-t border-zinc-800/40">
                <LearningTimeline logs={(logs || []) as LogRow[]} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/60 border border-zinc-800/60 backdrop-blur-sm overflow-hidden">
            <CardHeader className="pb-2">
              <h2 className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">
                CTF Tracker
              </h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <CTFForm />
              <div className="pt-3 border-t border-zinc-800/40">
                <CTFList entries={(ctfEntries || []) as CtfEntryRow[]} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-4">
          <Card className="bg-zinc-900/60 border border-zinc-800/60 backdrop-blur-sm overflow-hidden">
            <CardHeader className="pb-2">
              <h2 className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">
                New Task
              </h2>
            </CardHeader>
            <CardContent>
              <TaskForm userId={user.id} defaultMonth={currentMonth} />
            </CardContent>
          </Card>
        </div>

        <TaskList tasks={taskList} />
      </main>
    </div>
  );
}