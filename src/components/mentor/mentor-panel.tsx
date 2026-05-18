'use client';

import { useState } from 'react';
import { Card, Button, Input } from '@/components/ui';
import { MentorCard } from './mentor-card';
import type { AIMentorResponse } from '@/lib/ai/response-types';

interface MentorPanelProps {
  initialResponse?: AIMentorResponse;
}

type RequestType = 'daily_tasks' | 'mentor_answer' | 'motivational_nudge';

export function MentorPanel({ initialResponse }: MentorPanelProps) {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AIMentorResponse | undefined>(initialResponse);
  const [question, setQuestion] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [fallbackUsed, setFallbackUsed] = useState(false);

  const fetchMentor = async (type: RequestType, userQuestion?: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          question: userQuestion,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || 'Something went wrong');
        return;
      }

      setResponse(data.response);
      setFallbackUsed(data.metadata?.fallback_used || false);
    } catch (err) {
      setError('Failed to connect to mentor');
      console.error('Mentor fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="focus-panel interactive-panel border border-zinc-800/20 h-full flex flex-col">
      <div className="px-4 py-3 border-b border-zinc-800/20 bg-gradient-to-r from-zinc-900/60 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-amber-500 text-xs">◈</span>
            <span className="font-mono text-xs text-zinc-400 uppercase tracking-wider">Era OS</span>
            <span className="font-mono text-xs text-zinc-700">{'//'} mentor</span>
          </div>
          {loading && (
            <span className="font-mono text-xs text-amber-500 animate-pulse">processing...</span>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-4 p-4">
        <div className="flex gap-2 flex-wrap">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => fetchMentor('daily_tasks')}
            disabled={loading}
            className="font-mono text-xs border-zinc-700/40 hover:border-zinc-600/60"
          >
            <span className="text-amber-500 mr-1.5">›</span>/tasks
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => fetchMentor('motivational_nudge')}
            disabled={loading}
            className="font-mono text-xs border-zinc-700/40 hover:border-zinc-600/60"
          >
            <span className="text-amber-500 mr-1.5">›</span>/motivate
          </Button>
        </div>

        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-amber-500 text-base">›</span>
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Query mentor..."
            className="pl-8 bg-zinc-900/40 border-zinc-800/40 font-mono text-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && question.trim()) {
                fetchMentor('mentor_answer', question);
                setQuestion('');
              }
            }}
          />
        </div>

        {error && (
          <div className="p-3 bg-red-500/15 border border-red-500/40 rounded-lg">
            <p className="font-mono text-sm text-red-400">{error}</p>
          </div>
        )}

        {loading && (
          <div className="flex items-center gap-3 py-4">
            <span className="font-mono text-sm text-zinc-600 animate-pulse">■</span>
            <span className="font-mono text-sm text-zinc-500">Processing request</span>
          </div>
        )}

        {!loading && response && (
          <div className="flex-1 overflow-auto">
            <MentorCard response={response} fallbackUsed={fallbackUsed} />
          </div>
        )}

        {!loading && !response && !error && (
          <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
            <span className="font-mono text-sm text-zinc-700 mb-3">$ mentor --ready</span>
            <p className="font-mono text-sm text-zinc-500 mb-2">Ask about your cybersecurity journey</p>
            <p className="font-mono text-sm text-zinc-600">
              &quot;What should I focus on this week?&quot;
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}