'use client';

import { useState, useEffect, useRef, useCallback, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { COMMANDS, type CommandHandlerMap } from '@/lib/commands/registry';
import { searchCommands } from '@/lib/commands/search';
import type { Command, CommandCategory } from '@/lib/commands/types';
import { generateTodayMission } from '@/lib/actions/mission';
import { advanceMonth } from '@/lib/actions/progress';
import { useAcknowledgment } from '@/components/shared/operational-acknowledgment';

const CATEGORY_LABELS: Record<CommandCategory, string> = {
  navigation: 'Navigation',
  creation: 'Create',
  action: 'Actions',
};

const CATEGORY_ORDER: CommandCategory[] = ['navigation', 'creation', 'action'];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const router = useRouter();
  const { acknowledge } = useAcknowledgment();

  const filtered = query.trim()
    ? searchCommands(query, COMMANDS)
    : COMMANDS.map(c => ({ command: c, score: 0 }));

  const grouped = filtered.reduce<Record<CommandCategory, Command[]>>((acc, { command }) => {
    if (!acc[command.category]) acc[command.category] = [];
    acc[command.category].push(command);
    return acc;
  }, { navigation: [], creation: [], action: [] });

  const visibleItems = CATEGORY_ORDER.flatMap(cat => grouped[cat] || []);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setSelectedIndex(0);
    setLoading(null);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        close();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [close]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      const t = setTimeout(() => inputRef.current?.focus(), 30);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, visibleItems.length);
  }, [visibleItems.length]);

  useEffect(() => {
    if (open && itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex, open]);

  const handleExecute = useCallback(async (cmd: Command) => {
    const handlers: CommandHandlerMap = {
      'nav-dashboard': () => router.push('/'),
      'nav-roadmap': () => router.push('/roadmap'),
      'nav-import': () => router.push('/import'),
      'create-task': () => router.push('/'),
      'create-log': () => router.push('/'),
      'create-ctf': () => router.push('/'),
      'generate-tasking': async () => {
        setLoading(cmd.id);
        const result = await generateTodayMission();
        if (result.success) {
          acknowledge(`Generated ${result.tasks.length} tasks`, 'standard');
        } else {
          acknowledge(result.error || 'Generation failed', 'standard');
        }
        close();
      },
      'advance-phase': async () => {
        setLoading(cmd.id);
        const result = await advanceMonth();
        if (result.success) {
          acknowledge(`Advanced to ${result.monthTitle} (${result.tasksGenerated} tasks)`, 'weighty');
        } else {
          acknowledge(result.error || 'Advancement failed', 'standard');
        }
        close();
      },
    };

    const handler = handlers[cmd.id];
    if (!handler) return;

    close();
    await handler();
  }, [router, acknowledge, close]);

  const onInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => (i + 1) % visibleItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => (i - 1 + visibleItems.length) % visibleItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const cmd = visibleItems[selectedIndex];
      if (cmd && !loading) handleExecute(cmd);
    }
  };

  if (!open) return null;

  let globalIndex = 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] animate-palette-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div
        ref={listRef}
        className="relative w-full max-w-lg bg-[#0c0c0e] border border-zinc-800/50 rounded-xl shadow-2xl shadow-black/60 overflow-hidden animate-palette-panel"
      >
        <div className="flex items-center gap-3 px-4 h-12 border-b border-zinc-800/50">
          <span className="text-zinc-500 text-xs font-mono">&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            onKeyDown={onInputKeyDown}
            placeholder="Search commands..."
            className="flex-1 bg-transparent text-sm text-zinc-200 placeholder-zinc-600 outline-none font-mono"
            autoComplete="off"
            spellCheck={false}
          />
          <span className="text-[10px] text-zinc-700 font-mono tracking-wider border border-zinc-800/60 px-1.5 py-0.5 rounded">ESC</span>
        </div>

        <div className="max-h-80 overflow-y-auto py-2 scroll-smooth">
          {visibleItems.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <p className="font-mono text-sm text-zinc-600">No matching commands</p>
              <p className="font-mono text-[11px] text-zinc-700 mt-1">Try a different search term</p>
            </div>
          ) : (
            CATEGORY_ORDER.map(category => {
              const cmds = grouped[category];
              if (cmds.length === 0) return null;

              return (
                <div key={category}>
                  <div className="px-4 py-1.5">
                    <span className="font-mono text-[10px] text-zinc-700 uppercase tracking-[0.15em]">
                      {CATEGORY_LABELS[category]}
                    </span>
                  </div>
                  {cmds.map((cmd) => {
                    const currentIndex = globalIndex++;
                    const isAsync = cmd.id === 'generate-tasking' || cmd.id === 'advance-phase';
                    const isBusy = loading === cmd.id;

                    return (
                      <button
                        key={cmd.id}
                        ref={el => { itemRefs.current[currentIndex] = el; }}
                        className={`w-full text-left px-4 py-2.5 flex items-center gap-3 transition-colors duration-75 ${
                          currentIndex === selectedIndex
                            ? 'bg-zinc-800/50 text-zinc-200'
                            : 'text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/20'
                        } ${isBusy ? 'opacity-50 pointer-events-none' : ''}`}
                        onClick={() => handleExecute(cmd)}
                        onMouseEnter={() => !isBusy && setSelectedIndex(currentIndex)}
                        disabled={!!loading}
                      >
                        <span className="font-mono text-sm flex-1 truncate flex items-center gap-2">
                          {cmd.title}
                          {isAsync && (
                            <span className="inline-flex items-center gap-1 text-[9px] text-zinc-700 font-mono tracking-wider">
                              {isBusy ? (
                                <span className="inline-block w-3 h-3 border border-zinc-600 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <span className="w-1 h-1 rounded-full bg-zinc-700" />
                              )}
                            </span>
                          )}
                        </span>
                        <span className="text-[11px] text-zinc-600 truncate max-w-[180px] hidden sm:block">
                          {cmd.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>

        <div className="flex items-center gap-4 px-4 h-8 border-t border-zinc-800/50">
          <span className="text-[10px] text-zinc-700 font-mono">
            <kbd className="text-zinc-600">↑↓</kbd> Navigate
          </span>
          <span className="text-[10px] text-zinc-700 font-mono">
            <kbd className="text-zinc-600">↵</kbd> Select
          </span>
          <span className="text-[10px] text-zinc-700 font-mono">
            <kbd className="text-zinc-600">⌘K</kbd> Toggle
          </span>
          {loading && (
            <span className="text-[10px] text-zinc-700 font-mono ml-auto animate-pulse">
              Executing...
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
