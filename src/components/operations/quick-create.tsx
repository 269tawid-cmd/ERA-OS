'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PILLAR_ORDER, PRIORITIES, XP_VALUES } from '@/lib/constants';
import { useAcknowledgment } from '@/components/shared/operational-acknowledgment';
import { ACTION_ACKNOWLEDGMENTS } from '@/lib/constants/operational-rituals';
import { createTask } from '@/lib/actions/mission';
import type { Pillar, Priority } from '@/types';

interface QuickCreateProps {
  defaultMonth?: number;
  onCreated?: () => void;
}

export function QuickCreate({ defaultMonth = 1, onCreated }: QuickCreateProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [pillar, setPillar] = useState<Pillar>('HACK');
  const [priority, setPriority] = useState<Priority>('medium');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { acknowledge } = useAcknowledgment();

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || loading) return;

    setLoading(true);
    try {
      await createTask({
        title: title.trim(),
        pillar,
        month: defaultMonth,
        priority,
        xp_value: XP_VALUES[priority],
      });

      setTitle('');
      setPillar('HACK');
      setPriority('medium');

      const def = ACTION_ACKNOWLEDGMENTS.taskCreated;
      if (def.message) acknowledge(def.message, def.weight);
      onCreated?.();
      router.refresh();
    } catch (err) {
      console.error('Failed to create task:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false);
      setTitle('');
    }
  };

  return (
    <div className="border-b border-zinc-800/60">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-mono text-zinc-600 hover:text-zinc-400 hover:bg-zinc-800/20 transition-all duration-100"
        >
          <span className="text-zinc-700">+</span>
          <span>Quick add operation</span>
          <span className="text-[10px] text-zinc-700 ml-auto hidden sm:block">Tab to focus · Esc to cancel</span>
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="px-4 py-3 space-y-3" onKeyDown={handleKeyDown}>
          <div className="flex items-center gap-3">
            <span className="text-zinc-500 text-xs font-mono">&gt;</span>
            <input
              ref={inputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="flex-1 bg-transparent text-sm text-zinc-200 placeholder-zinc-600 outline-none font-mono"
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={!title.trim() || loading}
              className="font-mono text-xs px-3 py-1.5 rounded-md bg-zinc-800/60 text-zinc-400 hover:bg-zinc-700/60 hover:text-zinc-200 transition-all duration-100 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding...' : 'Add'}
            </button>
            <button
              type="button"
              onClick={() => { setOpen(false); setTitle(''); }}
              className="font-mono text-xs px-2 py-1.5 rounded-md text-zinc-700 hover:text-zinc-500 transition-all duration-100"
            >
              Esc
            </button>
          </div>
          <div className="flex items-center gap-4 pl-5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-zinc-700 uppercase">Pillar</span>
              <select
                value={pillar}
                onChange={(e) => setPillar(e.target.value as Pillar)}
                className="bg-zinc-800/60 border border-zinc-700/50 rounded text-xs font-mono text-zinc-400 px-2 py-1 outline-none focus:border-zinc-600/60 transition-colors"
              >
                {PILLAR_ORDER.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-zinc-700 uppercase">Priority</span>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="bg-zinc-800/60 border border-zinc-700/50 rounded text-xs font-mono text-zinc-400 px-2 py-1 outline-none focus:border-zinc-600/60 transition-colors"
              >
                {Object.entries(PRIORITIES).map(([value, { label }]) => (
                  <option key={value} value={value}>{label} ({XP_VALUES[value as Priority]} XP)</option>
                ))}
              </select>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
