'use client';

import type { AIMentorResponse, DailyTasksResponse, MentorAnswerResponse, MotivationalNudgeResponse } from '@/lib/ai/response-types';

interface MentorCardProps {
  response: AIMentorResponse;
  fallbackUsed?: boolean;
}

export function MentorCard({ response, fallbackUsed }: MentorCardProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-zinc-400 uppercase tracking-wider">
          {response.type.replace('_', ' ')}
        </span>
        {fallbackUsed && (
          <span className="font-mono text-xs px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded">
            quick response
          </span>
        )}
      </div>
      <MentorResponseContent response={response} />
    </div>
  );
}

function MentorResponseContent({ response }: { response: AIMentorResponse }) {
  switch (response.type) {
    case 'daily_tasks':
      return <DailyTasksDisplay response={response} />;
    case 'mentor_answer':
      return <MentorAnswerDisplay response={response} />;
    case 'motivational_nudge':
      return <MotivationalNudgeDisplay response={response} />;
    default:
      return <DefaultDisplay response={response} />;
  }
}

function DailyTasksDisplay({ response }: { response: DailyTasksResponse }) {
  return (
    <div className="space-y-2">
      <div className="space-y-1.5">
        {response.tasks.map((task, i) => (
          <div
            key={i}
            className="p-3 bg-zinc-900/60 border border-zinc-800/50 rounded-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-mono text-sm text-zinc-200 truncate">{task.title}</p>
                <p className="font-mono text-xs text-zinc-400 mt-1">{task.reason}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`font-mono text-xs px-2 py-0.5 rounded ${
                  task.priority === 'high' ? 'bg-red-500/10 text-red-400 border border-red-500/30' :
                  task.priority === 'medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                  'bg-zinc-800/60 text-zinc-500 border border-zinc-700/40'
                }`}>
                  {task.priority}
                </span>
                <span className="font-mono text-xs text-zinc-400">{task.pillar}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MentorAnswerDisplay({ response }: { response: MentorAnswerResponse }) {
  return (
    <div className="space-y-2">
      <div className="p-3 bg-zinc-900/60 border border-zinc-800/40 rounded-md">
        <p className="font-mono text-xs text-zinc-200 whitespace-pre-wrap leading-relaxed">
          {response.answer}
        </p>
      </div>
      {response.resources && response.resources.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {response.resources.slice(0, 3).map((resource, i) => (
            <span key={i} className="font-mono text-[10px] px-2 py-1 bg-zinc-800/60 text-zinc-500 border border-zinc-700/40 rounded">
              {resource}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function MotivationalNudgeDisplay({ response }: { response: MotivationalNudgeResponse }) {
  return (
    <div className="space-y-2">
      <div className="p-3 bg-zinc-900/60 border border-zinc-800/40 rounded-md">
        <p className="font-mono text-xs text-zinc-200 whitespace-pre-wrap leading-relaxed">
          {response.message}
        </p>
      </div>
      {response.action_item && (
        <p className="font-mono text-[10px] text-zinc-500">
          <span className="text-amber-400">→</span> {response.action_item}
        </p>
      )}
      {response.roadmap_reminder && (
        <p className="font-mono text-[10px] text-zinc-700 italic">{response.roadmap_reminder}</p>
      )}
    </div>
  );
}

function DefaultDisplay({ response }: { response: AIMentorResponse }) {
  return (
    <pre className="font-mono text-[10px] text-zinc-600 overflow-x-auto p-2 bg-zinc-900/60 border border-zinc-800/40 rounded">
      {JSON.stringify(response, null, 2)}
    </pre>
  );
}