'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Select, Input } from '@/components/ui';
import { createCTF } from '@/lib/actions/ctf';
import { CTF_PLATFORMS, CTF_CATEGORIES, CTF_DIFFICULTIES } from '@/lib/constants';
import { useAcknowledgment } from '@/components/shared/operational-acknowledgment';
import { ACTION_ACKNOWLEDGMENTS } from '@/lib/constants/operational-rituals';
import type { CTFPlatform, CTFCategory, CTFDifficulty } from '@/types';

export function CTFForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState<CTFPlatform>('PicoCTF');
  const [category, setCategory] = useState<CTFCategory>('Web');
  const [difficulty, setDifficulty] = useState<CTFDifficulty>('Easy');
  const [solved, setSolved] = useState(false);
  const [flagNotes, setFlagNotes] = useState('');
  const [xpEarned, setXpEarned] = useState('25');
  const { acknowledge } = useAcknowledgment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setError(null);
    setLoading(true);
    try {
      await createCTF({
        name: name.trim(),
        platform,
        category,
        difficulty,
        solved,
        flag_notes: flagNotes.trim() || undefined,
        xp_earned: solved ? parseInt(xpEarned, 10) || 0 : 0,
      });
      setName('');
      setFlagNotes('');
      setSolved(false);
      setXpEarned('25');

      const def = ACTION_ACKNOWLEDGMENTS.ctfLogged;
      if (def.message) acknowledge(def.message, def.weight);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to log CTF');
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

      <Input
        label="Challenge Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. SQL Injection Lab 1"
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Platform"
          value={platform}
          onChange={(e) => setPlatform(e.target.value as CTFPlatform)}
          options={CTF_PLATFORMS.map((p) => ({ value: p, label: p }))}
        />
        <Select
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value as CTFCategory)}
          options={CTF_CATEGORIES.map((c) => ({ value: c, label: c }))}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Difficulty"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as CTFDifficulty)}
          options={CTF_DIFFICULTIES.map((d) => ({ value: d, label: d }))}
        />
        <div className="flex items-end">
          <button
            type="button"
            onClick={() => setSolved(!solved)}
            className={`w-full px-4 py-3 rounded-lg border text-sm font-medium transition-all duration-150 ${
              solved
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40'
                : 'bg-zinc-950 border-zinc-700/80 text-zinc-400 hover:border-zinc-600'
            }`}
          >
            {solved ? '[+] SOLVED' : '[ ] Solved'}
          </button>
        </div>
      </div>

      {solved && (
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="XP Earned"
            type="number"
            value={xpEarned}
            onChange={(e) => setXpEarned(e.target.value)}
            min={0}
            max={500}
          />
        </div>
      )}

      <Input
        label="Flag / Notes (optional)"
        value={flagNotes}
        onChange={(e) => setFlagNotes(e.target.value)}
        placeholder="flag{...} or solver notes"
      />

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={loading || !name.trim()} loading={loading} size="lg">
          Log CTF
        </Button>
      </div>
    </form>
  );
}