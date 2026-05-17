'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Select } from '@/components/ui';
import { createLog } from '@/lib/actions/logs';
import { PILLAR_ORDER } from '@/lib/constants';
import type { Pillar } from '@/types';

const MAX_CHARS = 500;

export function LearningLogForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [pillar, setPillar] = useState<Pillar>('HACK');
  const [isWin, setIsWin] = useState(false);

  const charCount = content.length;
  const isOverLimit = charCount > MAX_CHARS;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isOverLimit || !content.trim()) return;

    setError(null);
    setLoading(true);
    try {
      await createLog({
        content: content.trim(),
        pillar,
        is_win: isWin,
      });
      setContent('');
      setIsWin(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="p-2 bg-red-500/10 border border-red-500/30 rounded-md">
          <p className="font-mono text-xs text-red-400">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
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
            className={`w-full px-3 py-2 rounded-md border text-sm font-medium transition-all duration-150 ${
              isWin
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'bg-zinc-950 border-zinc-800/80 text-zinc-500'
            }`}
          >
            {isWin ? '[+] WIN' : '[ ] Mark as Win'}
          </button>
        </div>
      </div>

      <div className="relative">
        <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider font-mono">
          Log Entry
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What did you learn today? (max 500 chars)"
          rows={3}
          className={`w-full px-3 py-2 bg-zinc-950 border rounded-md text-sm text-zinc-200 placeholder-zinc-600 resize-none focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-offset-[#050505] transition-colors duration-150 ${
            isOverLimit
              ? 'border-red-500/50 focus:ring-red-500/30'
              : 'border-zinc-800/80 focus:border-zinc-600/80 focus:ring-zinc-500/20'
          }`}
        />
        <div className="absolute bottom-2 right-2">
          <span className={`font-mono text-[10px] ${isOverLimit ? 'text-red-400' : 'text-zinc-600'}`}>
            {charCount}/{MAX_CHARS}
          </span>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading || isOverLimit || !content.trim()} loading={loading}>
          Log Entry
        </Button>
      </div>
    </form>
  );
}