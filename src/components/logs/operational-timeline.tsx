'use client';

import { useState, useMemo, useTransition } from 'react';
import { deleteLog } from '@/lib/actions/logs';
import { deleteCTF } from '@/lib/actions/ctf';
import { PILLARS } from '@/lib/constants';
import type { LogRow, CtfEntryRow } from '@/lib/supabase/database.types';

interface OperationalTimelineProps {
  logs: LogRow[];
  ctfEntries: CtfEntryRow[];
}

type FilterMode = 'all' | 'sessions' | 'ctfs';

interface TimelineEntry {
  id: string;
  type: 'session' | 'ctf';
  date: string;
  createdAt: string;
  pillar?: string;
  isWin?: boolean;
  content?: string;
  name?: string;
  platform?: string;
  category?: string;
  difficulty?: string;
  solved?: boolean;
  xpEarned?: number;
  flagNotes?: string | null;
}

function formatDateLabel(dateStr: string): string {
  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

  if (dateStr === today) return 'Today'
  if (dateStr === yesterday) return 'Yesterday'

  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function formatTime(isoStr: string): string {
  const d = new Date(isoStr)
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
}

function groupByDate(entries: TimelineEntry[]): Map<string, TimelineEntry[]> {
  const groups = new Map<string, TimelineEntry[]>()
  for (const entry of entries) {
    const label = formatDateLabel(entry.date)
    const group = groups.get(label) || []
    group.push(entry)
    groups.set(label, group)
  }
  return groups
}

function useDeleteHandlers() {
  const [, startTransition] = useTransition()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDeleteLog = (logId: string) => {
    setDeletingId(`log-${logId}`)
    startTransition(async () => {
      const result = await deleteLog(logId)
      if (!result.success) {
        console.error('Failed to delete log:', result.error)
      }
      setDeletingId(null)
    })
  }

  const handleDeleteCTF = (ctfId: string) => {
    setDeletingId(`ctf-${ctfId}`)
    startTransition(async () => {
      const result = await deleteCTF(ctfId)
      if (!result.success) {
        console.error('Failed to delete CTF:', result.error)
      }
      setDeletingId(null)
    })
  }

  return { deletingId, handleDeleteLog, handleDeleteCTF }
}

export function OperationalTimeline({ logs, ctfEntries }: OperationalTimelineProps) {
  const [filter, setFilter] = useState<FilterMode>('all')
  const { deletingId, handleDeleteLog, handleDeleteCTF } = useDeleteHandlers()

  const entries = useMemo(() => {
    const all: TimelineEntry[] = [
      ...logs.map(l => ({
        id: l.id,
        type: 'session' as const,
        date: l.date,
        createdAt: l.created_at,
        pillar: l.pillar,
        isWin: l.is_win,
        content: l.content,
      })),
      ...ctfEntries.map(c => ({
        id: c.id,
        type: 'ctf' as const,
        date: c.date,
        createdAt: c.created_at,
        name: c.name,
        platform: c.platform,
        category: c.category,
        difficulty: c.difficulty,
        solved: c.solved,
        xpEarned: c.xp_earned,
        flagNotes: c.flag_notes,
      })),
    ]

    all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return all
  }, [logs, ctfEntries])

  const filtered = useMemo(() => {
    if (filter === 'sessions') return entries.filter(e => e.type === 'session')
    if (filter === 'ctfs') return entries.filter(e => e.type === 'ctf')
    return entries
  }, [entries, filter])

  const grouped = useMemo(() => groupByDate(filtered), [filtered])
  const dateLabels = Array.from(grouped.keys())

  const filterTabs: { key: FilterMode; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: entries.length },
    { key: 'sessions', label: 'Sessions', count: entries.filter(e => e.type === 'session').length },
    { key: 'ctfs', label: 'CTFs', count: entries.filter(e => e.type === 'ctf').length },
  ]

  return (
    <div className="space-y-1">
      {/* Filter tabs */}
      <div className="flex items-center gap-1 pb-3 border-b border-zinc-800/30">
        {filterTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`font-mono text-xs px-2.5 py-1 rounded transition-colors duration-100 ${
              filter === tab.key
                ? 'bg-zinc-800/60 text-zinc-300'
                : 'text-zinc-600 hover:text-zinc-400 hover:bg-zinc-800/30'
            }`}
          >
            {tab.label}
            <span className="ml-1.5 text-[10px] text-zinc-700">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-10">
          <p className="font-mono text-sm text-zinc-600">
            {filter === 'all'
              ? 'No operational history yet'
              : filter === 'sessions'
                ? 'No session logs recorded'
                : 'No CTF entries logged'}
          </p>
          <p className="font-mono text-xs text-zinc-700 mt-1">
            {filter === 'all'
              ? 'Use the forms above to record your work'
              : `Use the ${filter === 'sessions' ? 'Session Log' : 'Security Log'} form above`}
          </p>
        </div>
      )}

      {/* Timeline entries */}
      <div className="divide-y divide-zinc-800/15">
        {dateLabels.map(label => (
          <div key={label}>
            <div className="flex items-center gap-2 py-2.5">
              <span className="w-1 h-3 rounded bg-zinc-700/50" />
              <span className="font-mono text-xs text-zinc-500 uppercase tracking-wider">
                {label}
              </span>
              <span className="font-mono text-[10px] text-zinc-700">
                ({grouped.get(label)!.length})
              </span>
            </div>

            <div className="space-y-0">
              {grouped.get(label)!.map(entry => {
                const isProcessing = deletingId === `${entry.type}-${entry.id}`

                if (entry.type === 'session') {
                  const pillarColor = entry.pillar && PILLARS[entry.pillar as keyof typeof PILLARS]
                    ? PILLARS[entry.pillar as keyof typeof PILLARS].color
                    : undefined

                  return (
                    <div
                      key={`session-${entry.id}`}
                      className={`group flex items-start gap-3 py-2.5 px-1 rounded transition-colors duration-100 hover:bg-zinc-800/20 ${
                        isProcessing ? 'opacity-50 pointer-events-none' : ''
                      }`}
                    >
                      <div className="flex items-center gap-1.5 shrink-0 min-w-[60px] pt-0.5">
                        <span className="font-mono text-[10px] text-zinc-600">{formatTime(entry.createdAt)}</span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                        <span
                          className="font-mono text-[10px] px-1.5 py-0.5 rounded border uppercase tracking-wider"
                          style={{
                            color: pillarColor,
                            borderColor: pillarColor ? `${pillarColor}30` : undefined,
                            backgroundColor: pillarColor ? `${pillarColor}08` : undefined,
                          }}
                        >
                          {entry.pillar || 'SESS'}
                        </span>
                        {entry.isWin && (
                          <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-wider">
                            WIN
                          </span>
                        )}
                      </div>

                      <p className="font-mono text-xs text-zinc-400 flex-1 min-w-0 leading-relaxed">
                        {entry.content}
                      </p>

                      <button
                        onClick={() => handleDeleteLog(entry.id)}
                        disabled={!!deletingId}
                        className="font-mono text-[10px] text-zinc-700 hover:text-zinc-500 transition-colors duration-100 opacity-0 group-hover:opacity-100 shrink-0 disabled:opacity-30"
                      >
                        del
                      </button>
                    </div>
                  )
                }

                // CTF entry
                const solvedColor = entry.solved ? 'text-emerald-400' : 'text-zinc-600'
                return (
                  <div
                    key={`ctf-${entry.id}`}
                    className={`group flex items-start gap-3 py-2.5 px-1 rounded transition-colors duration-100 hover:bg-zinc-800/20 ${
                      isProcessing ? 'opacity-50 pointer-events-none' : ''
                    }`}
                  >
                    <div className="flex items-center gap-1.5 shrink-0 min-w-[60px] pt-0.5">
                      <span className="font-mono text-[10px] text-zinc-600">{formatTime(entry.createdAt)}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                      <span className="font-mono text-[9px] px-1.5 py-0.5 rounded border border-zinc-700/40 bg-zinc-800/40 text-zinc-500 uppercase tracking-wider">
                        CTF
                      </span>
                      <span className="font-mono text-[10px] text-zinc-500">{entry.platform}</span>
                      {entry.category && (
                        <span className="font-mono text-[10px] text-zinc-600">{entry.category}</span>
                      )}
                      <span className={`font-mono text-[10px] ${solvedColor}`}>
                        {entry.solved ? 'Solved' : 'Attempted'}
                      </span>
                      {entry.solved && entry.xpEarned && entry.xpEarned > 0 && (
                        <span className="font-mono text-[10px] text-red-400/70">
                          +{entry.xpEarned} XP
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-xs text-zinc-400 truncate">
                        {entry.name}
                      </p>
                      {entry.flagNotes && (
                        <p className="font-mono text-[10px] text-zinc-600 truncate mt-0.5">
                          {entry.flagNotes}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handleDeleteCTF(entry.id)}
                      disabled={!!deletingId}
                      className="font-mono text-[10px] text-zinc-700 hover:text-zinc-500 transition-colors duration-100 opacity-0 group-hover:opacity-100 shrink-0 disabled:opacity-30"
                    >
                      del
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
