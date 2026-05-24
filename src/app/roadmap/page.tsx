import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/supabase/auth";
import { redirect } from "next/navigation";
import { getRoadmapProgress } from "@/lib/roadmap";
import { OperationalRoadmap, JourneyStatus } from "@/components/roadmap";
import { Card, CardHeader, CardContent } from "@/components/ui";
import type {
  TaskRow,
  UserProgressRow,
  LogRow,
  CtfEntryRow,
} from "@/lib/supabase/database.types";
import type { Task, TaskOrigin, TaskCategory } from "@/types";

export default async function RoadmapPage() {
  const user = await getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const supabase = await createClient();

  const { data: progress } = (await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", user.id)
    .single()) as { data: UserProgressRow | null };

  const { data: tasks } = (await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50)) as { data: TaskRow[] | null };

  const { data: logs } = (await supabase
    .from("logs")
    .select("*")
    .eq("user_id", user.id)) as { data: LogRow[] | null };

  const { data: ctfEntries } = (await supabase
    .from("ctf_entries")
    .select("*")
    .eq("user_id", user.id)) as { data: CtfEntryRow[] | null };

  const currentMonth = progress?.current_month || 1;
  const roadmapProgress = getRoadmapProgress(
    currentMonth,
    progress?.start_date,
  );
  const pillarXP = (progress?.pillar_xp as Record<string, number>) || {
    HACK: 0,
    BUILD: 0,
    AI: 0,
    PRESENCE: 0,
  };

  const taskList: Task[] = (tasks || []).map((t) => ({
    id: t.id,
    user_id: t.user_id,
    title: t.title,
    description: t.description ?? undefined,
    pillar: t.pillar,
    month: t.month,
    priority: t.priority,
    status: t.status,
    xp_value: t.xp_value,
    due_date: t.due_date ?? undefined,
    completed_at: t.completed_at ?? undefined,
    is_recurring: t.is_recurring,
    recurrence: t.recurrence ?? undefined,
    origin: (t as TaskRow & { origin: string }).origin as TaskOrigin,
    category: (t as TaskRow & { category: string }).category as TaskCategory,
    source_template:
      (t as TaskRow & { source_template: string | null }).source_template ??
      undefined,
    generation_date:
      (t as TaskRow & { generation_date: string | null }).generation_date ??
      undefined,
    created_at: t.created_at,
  }));

  const doneTasks = taskList.filter((t) => t.status === "done");
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
    <div className="min-h-screen text-zinc-200 animate-page-enter">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <span className="font-mono text-[10px] text-zinc-700 tracking-widest uppercase">era-os</span>
            <span className="font-mono text-xs text-zinc-700">
              // roadmap
            </span>
          </div>
          <h1 className="terminal-heading font-mono text-3xl font-bold text-zinc-100 tracking-tight">
            STRATEGIC ROADMAP
          </h1>
          <p className="font-mono text-sm text-zinc-500 mt-2 ml-6">
            Hacker Era King Journey · Cycle 1 of 4 · {roadmapProgress.percentage}% complete
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
            <div className="lg:col-span-2">
              <Card className="bg-zinc-900/60 border border-zinc-800/60 backdrop-blur-sm overflow-hidden">
                <CardHeader className="pb-3">
                  <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest">
                    Year 1 Progression
                  </span>
                </CardHeader>
                <CardContent className="pt-3">
                  <OperationalRoadmap
                    currentMonth={currentMonth}
                    doneMonths={monthsWithCompletedTasks}
                    tasks={taskList}
                  />
                </CardContent>
              </Card>
            </div>

          <div>
            <JourneyStatus stats={journeyStats} />
          </div>
        </div>


      </main>
    </div>
  );
}
