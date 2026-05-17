import type { MentorContext } from './mentor-context';
import { buildContextHeader, compactPillarXP, summarizePendingTasks, truncateText, maxCharsForTokens } from './token-utils';
import type { AIResponseType } from './response-types';

export interface SystemPromptOptions {
  responseType?: AIResponseType;
  userQuestion?: string;
  maxTokens?: number;
}

const BASE_PROMPT = `You are Tawhid's personal cybersecurity mentor for Era OS.
You are a senior pentester coach who is practical, honest, and roadmap-aware.

Your role:
- Guide Tawhid through his "Hacker Era King" 4-year journey
- Focus on web application pentesting as his specialty
- Provide actionable advice based on his current roadmap phase
- Mix Bangla and English naturally when explaining
- Be motivating but honest — don't sugarcoat gaps

Important context about Tawhid:
- 18 years old from Bangladesh
- Learning cybersecurity + web development in parallel
- Using low-end laptop, values performance and simplicity
- Target: become internationally recognized in web app pentesting

Preferred resources:
- OWASP, DVWA, PicoCTF, TryHackMe, HackTheBox (free tier)
- LiveOverflow, IppSec for learning
- Avoid recommending paid courses unnecessarily

Response style:
- Keep responses concise and actionable
- Reference his specific roadmap phase
- Use mixed Bangla-English naturally
- Prioritize practical over theoretical
- Never hallucinate progress or overpraise`;

const RESPONSE_TYPE_INSTRUCTIONS: Record<AIResponseType, string> = {
  daily_tasks: `Generate exactly 3 task recommendations for today.
Each task should include: title, reason, priority (high/medium/low), and pillar.
Base recommendations on: current roadmap month focus, weak pillars, high-priority incomplete tasks.
Format as JSON with tasks array.`,

  weekly_review: `Provide a weekly review of Tawhid's progress.
Include: completed tasks summary, missed items, what to focus on next week.
Reference his current roadmap phase and streak.
Format as JSON.`,

  mentor_answer: `Answer Tawhid's question based on his current roadmap phase.
If the question relates to topics outside his current phase, gently redirect.
Provide practical, actionable answer. Format as JSON with answer string.`,

  motivational_nudge: `Send a motivational message appropriate to his situation.
If streak is broken or he's inactive, encourage starting fresh.
If he's on a roll, celebrate progress and push forward.
Reference his roadmap journey.
Format as JSON with message string.`,

  study_plan: `Create a study plan for a specific topic he requests.
Break it down into daily milestones over the requested duration.
Each milestone should be achievable and practical.
Format as JSON with milestones array.`,
};

export function buildSystemPrompt(
  context: MentorContext,
  options: SystemPromptOptions = {}
): { prompt: string; estimatedTokens: number } {
  const {
    responseType = 'mentor_answer',
    userQuestion,
    maxTokens = 4000,
  } = options;

  const sections: string[] = [];

  sections.push(BASE_PROMPT);
  sections.push('');

  const contextHeader = buildContextHeader({
    currentMonth: context.currentMonth,
    monthTitle: context.monthTitle,
    currentStreak: context.currentStreak,
  });
  sections.push(`CURRENT STATUS:`);
  sections.push(truncateText(contextHeader, maxCharsForTokens(150)));

  sections.push(`Month ${context.currentMonth} Focus: ${context.monthTitle}`);
  if (context.monthFocus.length > 0) {
    sections.push(`Focus areas: ${context.monthFocus.slice(0, 3).join(', ')}`);
  }
  if (context.monthDeliverables.length > 0) {
    sections.push(`Key deliverables: ${context.monthDeliverables.slice(0, 2).join(', ')}`);
  }

  sections.push('');
  sections.push(`PROGRESS:`);
  sections.push(`Streak: ${context.currentStreak} days (best: ${context.bestStreak})`);
  sections.push(`Tasks: ${context.tasksCompleted}/${context.tasksTotal} completed`);
  sections.push(`XP: ${compactPillarXP(context.pillarXP)}`);

  if (context.tasksPending.length > 0) {
    sections.push('');
    sections.push(`PENDING TASKS:`);
    const pendingSummary = summarizePendingTasks(
      context.tasksPending.slice(0, 5).map(t => ({
        title: t.title,
        priority: t.priority,
        pillar: t.pillar,
      })),
      maxCharsForTokens(200)
    );
    sections.push(truncateText(pendingSummary, maxCharsForTokens(250)));
  }

  if (context.tasksOverdue.length > 0) {
    sections.push('');
    sections.push(`OVERDUE: ${context.tasksOverdue.length} task(s) need attention`);
  }

  if (context.weakPillars.length > 0) {
    sections.push('');
    sections.push(`WEAK PILLARS: ${context.weakPillars.join(', ')} - prioritize these`);
  }

  sections.push('');
  sections.push(RESPONSE_TYPE_INSTRUCTIONS[responseType]);

  if (userQuestion) {
    sections.push('');
    sections.push(`USER QUESTION: ${userQuestion}`);
  }

  sections.push('');
  sections.push(`Respond in JSON format matching the requested type. Keep response under ${maxTokens} tokens.`);

  const prompt = sections.join('\n');
  const estimatedTokens = Math.ceil(prompt.length * 0.25);

  return { prompt, estimatedTokens };
}

export function buildQuickContext(context: MentorContext): string {
  return `[Month ${context.currentMonth}: ${context.monthTitle}] ` +
    `Streak: ${context.currentStreak}d | ` +
    `XP: ${context.totalXP} | ` +
    `Tasks: ${context.tasksCompleted}/${context.tasksTotal} | ` +
    `Weak: ${context.weakPillars.join(', ')}`;
}