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
      <div className="font-mono text-xs text-zinc-600 text-center py-6">
        No CTF entries yet. Start capturing flags!
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[10px] text-zinc-600">Solved:</span>
          <span className="font-mono text-[10px] text-emerald-400">{solvedCount}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[10px] text-zinc-600">HACK XP:</span>
          <span className="font-mono text-[10px] text-red-400">+{totalXP}</span>
        </div>
      </div>

      {entries.map((entry) => {
        const date = new Date(entry.created_at);
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        return (
          <div
            key={entry.id}
            className="group flex items-center justify-between gap-3 p-2.5 bg-zinc-900/40 border border-zinc-800/40 rounded-md"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                {entry.solved && (
                  <span className="text-emerald-400 font-mono text-[10px]">✓</span>
                )}
                <span className="font-mono text-xs text-zinc-200 truncate">{entry.name}</span>
                <span className="font-mono text-[9px] text-zinc-600">{entry.platform}</span>
                <span className={`font-mono text-[9px] ${categoryColors[entry.category]}`}>
                  {entry.category}
                </span>
                <span className={`font-mono text-[9px] ${difficultyColors[entry.difficulty]}`}>
                  {entry.difficulty}
                </span>
                <span className="font-mono text-[9px] text-zinc-600">{dateStr}</span>
              </div>
              {entry.flag_notes && (
                <p className="font-mono text-[10px] text-zinc-600 mt-0.5 truncate">
                  {entry.flag_notes}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {entry.solved && entry.xp_earned > 0 && (
                <span className="font-mono text-[10px] text-red-400">+{entry.xp_earned} XP</span>
              )}
              <button
                onClick={() => handleDelete(entry.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-700 hover:text-red-400 text-[10px] font-mono"
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