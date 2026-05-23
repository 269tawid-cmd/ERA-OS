'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface Command {
  id: string;
  label: string;
  description: string;
  category: string;
  action: () => void;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const router = useRouter();

  const commands: Command[] = [
    { id: 'go-dashboard',      label: 'Go to Dashboard',     description: 'Return to main operational view',  category: 'Navigation',    action: () => router.push('/') },
    { id: 'open-roadmap',      label: 'Open Roadmap',        description: 'View strategic roadmap',           category: 'Navigation',    action: () => router.push('/roadmap') },
    { id: 'open-tasks',        label: 'Open Tasks',          description: 'View active operations list',      category: 'Navigation',    action: () => router.push('/') },
    { id: 'import-blueprint',  label: 'Import Blueprint',    description: 'Load a roadmap blueprint',         category: 'Navigation',    action: () => router.push('/import') },
    { id: 'create-task',       label: 'Create Task',         description: 'Initiate a new operation',         category: 'Actions',       action: () => router.push('/') },
    { id: 'new-log',           label: 'New Learning Log',    description: 'Record a session log entry',       category: 'Actions',       action: () => router.push('/') },
    { id: 'new-ctf',           label: 'New CTF Entry',       description: 'Log a security challenge solve',   category: 'Actions',       action: () => router.push('/') },
    { id: 'open-mentor',       label: 'Open Mentor',         description: 'View AI mentor insights',          category: 'Actions',       action: () => router.push('/') },
  ];

  const filtered = query.trim()
    ? commands.filter(c =>
        c.label.toLowerCase().includes(query.toLowerCase()) ||
        c.description.toLowerCase().includes(query.toLowerCase())
      )
    : commands;

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setSelectedIndex(0);
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
    itemRefs.current = itemRefs.current.slice(0, filtered.length);
  }, [filtered.length]);

  useEffect(() => {
    if (open) {
      const el = itemRefs.current[selectedIndex];
      if (el) el.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex, open]);

  const execute = useCallback((cmd: Command) => {
    close();
    cmd.action();
  }, [close]);

  const onInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => (i + 1) % Math.max(1, filtered.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => (i - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) execute(filtered[selectedIndex]);
    }
  };

  if (!open) return null;

  const grouped = filtered.reduce<Record<string, Command[]>>((acc, cmd) => {
    (acc[cmd.category] = acc[cmd.category] || []).push(cmd);
    return acc;
  }, {});

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
          {filtered.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <p className="font-mono text-sm text-zinc-600">No matching commands</p>
              <p className="font-mono text-[11px] text-zinc-700 mt-1">Try a different search term</p>
            </div>
          ) : (
            Object.entries(grouped).map(([category, cmds]) => (
              <div key={category}>
                <div className="px-4 py-1.5">
                  <span className="font-mono text-[10px] text-zinc-700 uppercase tracking-[0.15em]">
                    {category}
                  </span>
                </div>
                {cmds.map((cmd) => {
                  const currentIndex = globalIndex++;
                  return (
                    <button
                      key={cmd.id}
                      ref={el => { itemRefs.current[currentIndex] = el; }}
                      className={`w-full text-left px-4 py-2.5 flex items-center gap-3 transition-colors duration-75 ${
                        currentIndex === selectedIndex
                          ? 'bg-zinc-800/50 text-zinc-200'
                          : 'text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/20'
                      }`}
                      onClick={() => execute(cmd)}
                      onMouseEnter={() => setSelectedIndex(currentIndex)}
                    >
                      <span className="font-mono text-sm flex-1 truncate">{cmd.label}</span>
                      <span className="text-[11px] text-zinc-600 truncate max-w-[180px] hidden sm:block">
                        {cmd.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className="flex items-center gap-4 px-4 h-8 border-t border-zinc-800/50">
          <span className="text-[10px] text-zinc-700 font-mono">
            <kbd className="text-zinc-600">↑↓</kbd> Navigate
          </span>
          <span className="text-[10px] text-zinc-700 font-mono">
            <kbd className="text-zinc-600">↵</kbd> Select
          </span>
          <span className="text-[10px] text-zinc-700 font-mono ml-auto">
            <kbd className="text-zinc-600">⌘K</kbd> Toggle
          </span>
        </div>
      </div>
    </div>
  );
}
