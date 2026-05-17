'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, Button, Input } from '@/components/ui';
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
    <Card className="bg-zinc-900/60 border border-zinc-800/60 backdrop-blur-sm overflow-hidden h-full flex flex-col">
      <CardHeader className="pb-2 border-b border-zinc-800/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">Era OS</span>
            <span className="font-mono text-[10px] text-zinc-700">{'//'} mentor</span>
          </div>
          {loading && (
            <span className="font-mono text-[10px] text-zinc-500 animate-pulse">thinking...</span>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-3 p-3">
        <div className="flex gap-2 flex-wrap">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => fetchMentor('daily_tasks')}
            disabled={loading}
          >
            /tasks
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => fetchMentor('motivational_nudge')}
            disabled={loading}
          >
            /motivate
          </Button>
        </div>

        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[10px] text-zinc-600">›</span>
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask your mentor..."
            onKeyDown={(e) => {
              if (e.key === 'Enter' && question.trim()) {
                fetchMentor('mentor_answer', question);
                setQuestion('');
              }
            }}
            className="pl-6"
          />
        </div>

        {error && (
          <div className="p-2 bg-red-500/10 border border-red-500/30 rounded-md">
            <p className="font-mono text-[10px] text-red-400">{error}</p>
          </div>
        )}

        {loading && (
          <div className="flex items-center gap-2 py-4">
            <span className="font-mono text-[10px] text-zinc-600 animate-pulse">■</span>
            <span className="font-mono text-[10px] text-zinc-600">Processing request</span>
          </div>
        )}

        {!loading && response && (
          <div className="flex-1 overflow-auto">
            <MentorCard response={response} fallbackUsed={fallbackUsed} />
          </div>
        )}

        {!loading && !response && !error && (
          <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
            <span className="font-mono text-[10px] text-zinc-700 mb-2">$ mentor --ready</span>
            <p className="font-mono text-xs text-zinc-600 mb-1">Ask about your cybersecurity journey</p>
            <p className="font-mono text-[10px] text-zinc-700">
              &quot;What should I focus on this week?&quot;
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}