'use client';

import { useState, useTransition } from 'react';

import { deleteCTF } from '@/lib/actions/ctf';
import type { CtfEntryRow } from '@/lib/supabase/database.types';
import type { CTFCategory, CTFDifficulty } from '@/types';

interface CTFListProps {
  entries: CtfEntryRow[];
}

const difficultyColors: Record<CTFDifficulty, string> = {
  Easy: 'text-emerald-400',
  Medium: 'text-amber-400',
  Hard: 'text-red-400',
};

const categoryColors: Record<CTFCategory, string> = {
  Web: 'text-red-400',
  Crypto: 'text-purple-400',
  Forensics: 'text-blue-400',
  Pwn: 'text-orange-400',
  Misc: 'text-zinc-400',
};

export function CTFList({ entries: initialEntries }: CTFListProps) {
  const [entries, setEntries] = useState(initialEntries);
  const [, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    if (!confirm('Delete this CTF entry?')) return;
    startTransition(async () => {
      try {
        await deleteCTF(id);
        setEntries(entries.filter((e) => e.id !== id));
      } catch (err) {
        console.error('Error deleting CTF:', err);
      }
    });
  };

  const solvedCount = entries.filter((e) => e.solved).length;
  const totalXP = entries.reduce((sum, e) => sum + e.xp_earned, 0);

  if (entries.length === 0) {
    return (
      <div className="text-center py-8">
        <span className="font-mono text-xs text-zinc-500">No security events recorded</span>
        <p className="font-mono text-[10px] text-zinc-600 mt-1.5">Log your first CTF capture above</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-zinc-400">Solved:</span>
          <span className="font-mono text-sm text-emerald-400">{solvedCount}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-zinc-400">HACK Value:</span>
          <span className="font-mono text-sm text-red-400">+{totalXP}</span>
        </div>
      </div>

      {entries.map((entry) => {
        const date = new Date(entry.created_at);
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        return (
          <div
            key={entry.id}
            className="group flex items-center justify-between gap-3 p-3 bg-zinc-900/50 border border-zinc-800/50 rounded-md"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                {entry.solved && (
                  <span className="text-emerald-400 font-mono text-sm">✓</span>
                )}
                <span className="font-mono text-sm text-zinc-200 truncate">{entry.name}</span>
                <span className="font-mono text-xs text-zinc-500">{entry.platform}</span>
                <span className={`font-mono text-xs ${categoryColors[entry.category]}`}>
                  {entry.category}
                </span>
                <span className={`font-mono text-xs ${difficultyColors[entry.difficulty]}`}>
                  {entry.difficulty}
                </span>
                <span className="font-mono text-xs text-zinc-500">{dateStr}</span>
              </div>
              {entry.flag_notes && (
                <p className="font-mono text-xs text-zinc-500 mt-1.5 truncate">
                  {entry.flag_notes}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              {entry.solved && entry.xp_earned > 0 && (
                <span className="font-mono text-sm text-red-400">+{entry.xp_earned} XP</span>
              )}
              <button
                onClick={() => handleDelete(entry.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500 hover:text-red-400 text-xs font-mono"
              >
                del
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}