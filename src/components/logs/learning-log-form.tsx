'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Select } from '@/components/ui';
import { createLog } from '@/lib/actions/logs';
import { PILLAR_ORDER } from '@/lib/constants';
import { useAcknowledgment } from '@/components/shared/operational-acknowledgment';
import { ACTION_ACKNOWLEDGMENTS } from '@/lib/constants/operational-rituals';
import type { Pillar } from '@/types';

const MAX_CHARS = 500;

export function LearningLogForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [pillar, setPillar] = useState<Pillar>('HACK');
  const [isWin, setIsWin] = useState(false);
  const { acknowledge } = useAcknowledgment();

  const charCount = content.length;
  const isOverLimit = charCount > MAX_CHARS;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || isOverLimit || !content.trim()) return;

    setError(null);
    setLoading(true);
    try {
      const result = await createLog({
        content: content.trim(),
        pillar,
        is_win: isWin,
      });

      if (!result.success) {
        setError(result.error || 'Failed to save log');
        return;
      }

      setContent('');
      setIsWin(false);

      const def = ACTION_ACKNOWLEDGMENTS.logSaved;
      if (def.message) acknowledge(def.message, def.weight);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-4 bg-red-500/15 border border-red-500/40 rounded-lg">
          <p className="font-mono text-sm text-red-400">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Pillar"
          value={pillar}
          onChange={(e) => setPillar(e.target.value as Pillar)}
          options={PILLAR_ORDER.map((p) => ({
            value: p,
            label: p,
          }))}
        />

        <div className="flex items-end">
          <button
            type="button"
            onClick={() => setIsWin(!isWin)}
            className={`w-full px-4 py-3 rounded-lg border text-sm font-medium transition-all duration-150 ${
              isWin
                ? 'bg-amber-500/15 text-amber-400 border-amber-500/40'
                : 'bg-zinc-950 border-zinc-700/80 text-zinc-400 hover:border-zinc-600'
            }`}
          >
            {isWin ? '[+] WIN' : '[ ] Mark as Win'}
          </button>
        </div>
      </div>

      <div className="relative">
        <label className="block font-mono text-xs text-zinc-400 uppercase tracking-wider mb-2">
          Log Entry
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What did you learn today? (max 500 chars)"
          rows={4}
          className={`w-full px-4 py-3 bg-zinc-950 border rounded-lg text-base text-zinc-200 placeholder-zinc-500 resize-none transition-all duration-150 command-input edge-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-offset-[#050505] ${
            isOverLimit
              ? 'border-red-500/50 focus:ring-red-500/30'
              : 'border-zinc-700/80 focus:border-amber-500/40 focus:ring-amber-500/20 hover:border-zinc-600'
          }`}
        />
        <div className="absolute bottom-3 right-3">
          <span className={`font-mono text-sm ${isOverLimit ? 'text-red-400' : 'text-zinc-500'}`}>
            {charCount}/{MAX_CHARS}
          </span>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={loading || isOverLimit || !content.trim()} loading={loading} size="lg">
          Log Entry
        </Button>
      </div>
    </form>
  );
}