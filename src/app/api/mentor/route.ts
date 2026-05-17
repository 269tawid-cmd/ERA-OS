import { createClientWithAuth } from '@/lib/supabase/server';
import { getMonthData } from '@/lib/roadmap';
import { buildMentorContext, getWeakestPillar } from '@/lib/ai/mentor-context';
import { buildSystemPrompt, generateDeterministicResponse } from '@/lib/ai';
import { callGeminiAPI, createGeminiError } from '@/lib/ai/gemini-client';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import type { Task } from '@/types';
import type { UserProgressRow, TaskRow } from '@/lib/supabase/database.types';

const mentorRequestSchema = z.object({
  type: z.enum(['daily_tasks', 'weekly_review', 'mentor_answer', 'motivational_nudge', 'study_plan']),
  question: z.string().optional(),
  topic: z.string().optional(),
  duration_days: z.number().min(1).max(30).optional(),
});

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(userId: string): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(userId);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(userId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1, resetIn: RATE_LIMIT_WINDOW_MS };
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0, resetIn: entry.resetAt - now };
  }

  entry.count += 1;
  return { allowed: true, remaining: RATE_LIMIT_MAX - entry.count, resetIn: entry.resetAt - now };
}

export async function POST(request: Request) {
  const requestStartTime = Date.now();

  try {
    const { client, user } = await createClientWithAuth();

    const rateLimit = checkRateLimit(user.id);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded', retry_after_seconds: Math.ceil(rateLimit.resetIn / 1000) },
        { status: 429, headers: { 'Retry-After': String(Math.ceil(rateLimit.resetIn / 1000)) } }
      );
    }

    const body = await request.json();
    const parsed = mentorRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { type, question } = parsed.data;

    const { data: progress } = await client
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .single() as { data: UserProgressRow | null };

    const { data: tasks } = await client
      .from('tasks')
      .select('*')
      .eq('user_id', user.id) as { data: TaskRow[] | null };

    const taskList: Task[] = (tasks || []).map(t => ({
      id: t.id,
      title: t.title,
      description: t.description || undefined,
      pillar: t.pillar as Task['pillar'],
      month: t.month,
      priority: t.priority as Task['priority'],
      status: t.status as Task['status'],
      xp_value: t.xp_value,
      is_recurring: t.is_recurring,
      due_date: t.due_date || undefined,
      completed_at: t.completed_at || undefined,
      recurrence: t.recurrence || undefined,
      origin: (t as TaskRow & { origin: string }).origin as Task['origin'],
      category: (t as TaskRow & { category: string }).category as Task['category'],
      source_template: (t as TaskRow & { source_template: string | null }).source_template || undefined,
      generation_date: (t as TaskRow & { generation_date: string | null }).generation_date || undefined,
      created_at: t.created_at,
    }));

    const currentMonth = progress?.current_month || 1;
    const monthData = getMonthData(currentMonth);

    const context = buildMentorContext(
      currentMonth,
      monthData,
      progress,
      taskList,
      { includeRecentTasks: 5, includePendingTasks: true }
    );

    const { prompt, estimatedTokens } = buildSystemPrompt(context, {
      responseType: type,
      userQuestion: question,
    });

    const requestId = Math.random().toString(36).slice(2, 8);
    console.log(`[AI] ${requestId} - Request: ${type}, tokens: ~${estimatedTokens}`);

    const fallbackGenerator = () => {
      if (type === 'motivational_nudge') {
        return generateDeterministicResponse('motivational_nudge', context);
      }
      return generateDeterministicResponse('daily_tasks', context);
    };

    let response;
    let fallbackUsed = false;
    let errorType: string | undefined;

    if (!process.env.GEMINI_API_KEY) {
      console.log(`[AI] ${requestId} - No GEMINI_API_KEY, using deterministic fallback`);
      fallbackUsed = true;
      response = fallbackGenerator();
    } else {
      try {
        response = await callGeminiAPI(prompt, type, { timeout: 25000 });
        console.log(`[AI] ${requestId} - Gemini response received`);
      } catch (geminiError) {
        const err = createGeminiError(geminiError);
        errorType = err.type;
        console.warn(`[AI] ${requestId} - Gemini ${err.type}: ${err.message}`);

        fallbackUsed = true;
        response = fallbackGenerator();
        console.log(`[AI] ${requestId} - Using deterministic fallback`);
      }
    }

    const totalDuration = Date.now() - requestStartTime;

    console.log(`[AI] ${requestId} - Completed in ${totalDuration}ms, fallback: ${fallbackUsed}`);

    return NextResponse.json({
      success: true,
      response,
      metadata: {
        request_id: requestId,
        type,
        tokens_used: estimatedTokens,
        fallback_used: fallbackUsed,
        error_type: errorType,
        duration_ms: totalDuration,
        current_month: currentMonth,
        streak: context.currentStreak,
        weak_pillar: getWeakestPillar(context),
      },
    });
  } catch (error) {
    const totalDuration = Date.now() - requestStartTime;
    console.error(`[AI] Route error after ${totalDuration}ms:`, error);

    return NextResponse.json(
      { error: 'Internal server error', fallback_used: true },
      { status: 500 }
    );
  }
}