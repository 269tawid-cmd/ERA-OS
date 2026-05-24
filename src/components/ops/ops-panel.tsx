'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface Snippet {
  id: string;
  label: string;
  command: string;
  created: string;
}

interface RecentEntry {
  command: string;
  timestamp: string;
}

interface Reference {
  id: string;
  title: string;
  content: string;
  category: string;
  created: string;
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function useLocalStorage<T>(key: string, initial: T): [T, (v: T) => void] {
  const [value, setValue] = useState<T>(initial);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    try {
      const raw = localStorage.getItem(key);
      if (raw) setValue(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, [key]);

  const setAndPersist = useCallback(
    (next: T) => {
      setValue(next);
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {
        /* ignore */
      }
    },
    [key],
  );

  return [value, setAndPersist];
}

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="font-mono text-xs text-red-400/80">$</span>
      <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest">{label}</span>
    </div>
  );
}

function Divider() {
  return <div className="border-t border-zinc-800/40 my-3" />;
}

function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      /* ignore */
    }
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="font-mono text-[10px] px-2 py-0.5 rounded border transition-all duration-150
        border-zinc-700/40 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600/60"
    >
      {copied ? 'Copied' : label}
    </button>
  );
}

function QuickNotes({ notes, onSave }: { notes: string; onSave: (v: string) => void }) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => onSave(value), 400);
    },
    [onSave],
  );

  return (
    <div>
      <SectionHeader label="Quick Notes" />
      <textarea
        key={notes}
        defaultValue={notes}
        onChange={handleChange}
        placeholder="Jot down observations, reminders, findings..."
        rows={4}
        className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800/60 rounded text-sm font-mono text-zinc-300
          placeholder:text-zinc-600 resize-y min-h-[80px] transition-colors duration-150
          focus:outline-none focus:border-zinc-700/80"
      />
      <p className="font-mono text-[9px] text-zinc-700 mt-1">Auto-saved locally</p>
    </div>
  );
}

function CommandSnippets({
  snippets,
  onAdd,
  onDelete,
}: {
  snippets: Snippet[];
  onAdd: (s: Snippet) => void;
  onDelete: (id: string) => void;
}) {
  const [label, setLabel] = useState('');
  const [command, setCommand] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleAdd = () => {
    if (!label.trim() || !command.trim()) return;
    onAdd({
      id: generateId(),
      label: label.trim(),
      command: command.trim(),
      created: new Date().toISOString(),
    });
    setLabel('');
    setCommand('');
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <SectionHeader label="Command Snippets" />
        <button
          onClick={() => setShowForm(!showForm)}
          className="font-mono text-[10px] px-2 py-0.5 rounded border transition-all duration-150
            border-zinc-700/40 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600/60"
        >
          {showForm ? 'Cancel' : '+ Add'}
        </button>
      </div>

      {showForm && (
        <div className="mb-3 p-3 bg-zinc-900/60 rounded border border-zinc-800/60 space-y-2">
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Label"
            onKeyDown={(e) => e.key === 'Enter' && command && handleAdd()}
            className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800/60 rounded text-sm font-mono text-zinc-300
              placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700/80"
          />
          <input
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="Command"
            onKeyDown={(e) => e.key === 'Enter' && label && handleAdd()}
            className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800/60 rounded text-sm font-mono text-zinc-300
              placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700/80"
          />
          <div className="flex justify-end">
            <button
              onClick={handleAdd}
              disabled={!label.trim() || !command.trim()}
              className="font-mono text-[10px] px-3 py-1 rounded border transition-all duration-150
                border-red-500/30 text-red-400 hover:bg-red-500/10 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Save Snippet
            </button>
          </div>
        </div>
      )}

      <div className="space-y-1">
        {snippets.length === 0 && !showForm && (
          <p className="font-mono text-xs text-zinc-600 italic px-1">No saved snippets</p>
        )}
        {snippets.map((s) => (
          <div
            key={s.id}
            className="flex items-center justify-between px-2.5 py-2 rounded bg-zinc-900/30 border border-zinc-800/30 group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="font-mono text-[10px] text-zinc-500 uppercase shrink-0">{s.label}</span>
              <code className="font-mono text-xs text-zinc-300 truncate">{s.command}</code>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 ml-2">
              <CopyButton text={s.command} />
              <button
                onClick={() => onDelete(s.id)}
                className="font-mono text-[10px] px-1.5 py-0.5 rounded text-zinc-600 hover:text-red-400 transition-colors duration-150"
              >
                x
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentCommands({
  entries,
  onAdd,
  onClear,
}: {
  entries: RecentEntry[];
  onAdd: (e: RecentEntry) => void;
  onClear: () => void;
}) {
  const [input, setInput] = useState('');

  const handleSave = () => {
    if (!input.trim()) return;
    onAdd({ command: input.trim(), timestamp: new Date().toISOString() });
    setInput('');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <SectionHeader label="Recent Commands" />
        {entries.length > 0 && (
          <button
            onClick={onClear}
            className="font-mono text-[10px] px-2 py-0.5 rounded border transition-all duration-150
              border-zinc-700/40 text-zinc-600 hover:text-zinc-400"
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className="font-mono text-xs text-red-400/60 shrink-0">❯</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          placeholder="Log a command..."
          className="flex-1 px-2.5 py-1.5 bg-zinc-950 border border-zinc-800/60 rounded text-sm font-mono text-zinc-300
            placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700/80"
        />
        <button
          onClick={handleSave}
          disabled={!input.trim()}
          className="font-mono text-[10px] px-2 py-1.5 rounded border transition-all duration-150
            border-zinc-700/40 text-zinc-400 hover:text-zinc-200 hover:border-zinc-600/60 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Save
        </button>
      </div>

      <div className="space-y-0.5">
        {entries.length === 0 && (
          <p className="font-mono text-xs text-zinc-600 italic px-1">No commands logged</p>
        )}
        {entries.map((e, i) => (
          <div
            key={`${e.timestamp}-${i}`}
            className="flex items-center justify-between px-2.5 py-1.5 rounded group hover:bg-zinc-900/20 transition-colors"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-mono text-xs text-red-400/40 shrink-0">❯</span>
              <code className="font-mono text-xs text-zinc-400 truncate">{e.command}</code>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-2">
              <span className="font-mono text-[9px] text-zinc-700">{formatTime(e.timestamp)}</span>
              <CopyButton text={e.command} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const REFERENCE_CATEGORIES = ['Ports', 'DNS', 'Wordlists', 'Tools', 'General'] as const;

function OperationalReferences({
  refs,
  onAdd,
  onDelete,
}: {
  refs: Reference[];
  onAdd: (r: Reference) => void;
  onDelete: (id: string) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<string>('General');

  const handleAdd = () => {
    if (!title.trim() || !content.trim()) return;
    onAdd({
      id: generateId(),
      title: title.trim(),
      content: content.trim(),
      category,
      created: new Date().toISOString(),
    });
    setTitle('');
    setContent('');
    setCategory('General');
    setShowForm(false);
  };

  const grouped = REFERENCE_CATEGORIES.map((cat) => ({
    category: cat,
    items: refs.filter((r) => r.category === cat),
  })).filter((g) => g.items.length > 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <SectionHeader label="Operational References" />
        <button
          onClick={() => setShowForm(!showForm)}
          className="font-mono text-[10px] px-2 py-0.5 rounded border transition-all duration-150
            border-zinc-700/40 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600/60"
        >
          {showForm ? 'Cancel' : '+ Add'}
        </button>
      </div>

      {showForm && (
        <div className="mb-3 p-3 bg-zinc-900/60 rounded border border-zinc-800/60 space-y-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800/60 rounded text-sm font-mono text-zinc-300
              placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700/80"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Reference content"
            rows={2}
            className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800/60 rounded text-sm font-mono text-zinc-300
              placeholder:text-zinc-600 resize-y focus:outline-none focus:border-zinc-700/80"
          />
          <div className="flex items-center justify-between">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-2 py-1 bg-zinc-950 border border-zinc-800/60 rounded text-xs font-mono text-zinc-400
                focus:outline-none focus:border-zinc-700/80"
            >
              {REFERENCE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <button
              onClick={handleAdd}
              disabled={!title.trim() || !content.trim()}
              className="font-mono text-[10px] px-3 py-1 rounded border transition-all duration-150
                border-red-500/30 text-red-400 hover:bg-red-500/10 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Save Reference
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {refs.length === 0 && !showForm && (
          <p className="font-mono text-xs text-zinc-600 italic px-1">No saved references</p>
        )}
        {grouped.map((g) => (
          <div key={g.category}>
            <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-wider mb-1 px-1">
              {g.category}
            </p>
            <div className="space-y-1">
              {g.items.map((r) => (
                <div
                  key={r.id}
                  className="flex items-start justify-between px-2.5 py-2 rounded bg-zinc-900/30 border border-zinc-800/30 group"
                >
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-zinc-300 truncate">{r.title}</p>
                    <p className="font-mono text-[10px] text-zinc-500 mt-0.5 truncate">{r.content}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 ml-2 mt-0.5">
                    <CopyButton text={`${r.title}: ${r.content}`} label="Copy" />
                    <button
                      onClick={() => onDelete(r.id)}
                      className="font-mono text-[10px] px-1.5 py-0.5 rounded text-zinc-600 hover:text-red-400 transition-colors duration-150"
                    >
                      x
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function OpsPanel() {
  const [notes, setNotes] = useLocalStorage('ops_notes', '');
  const [snippets, setSnippets] = useLocalStorage<Snippet[]>('ops_snippets', []);
  const [recent, setRecent] = useLocalStorage<RecentEntry[]>('ops_recent', []);
  const [refs, setRefs] = useLocalStorage<Reference[]>('ops_references', []);

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <QuickNotes notes={notes} onSave={setNotes} />
      <Divider />
      <CommandSnippets
        snippets={snippets}
        onAdd={(s) => setSnippets([s, ...snippets])}
        onDelete={(id) => setSnippets(snippets.filter((s) => s.id !== id))}
      />
      <Divider />
      <RecentCommands
        entries={recent}
        onAdd={(e) => setRecent([e, ...recent].slice(0, 50))}
        onClear={() => setRecent([])}
      />
      <Divider />
      <OperationalReferences
        refs={refs}
        onAdd={(r) => setRefs([r, ...refs])}
        onDelete={(id) => setRefs(refs.filter((r) => r.id !== id))}
      />
    </div>
  );
}
