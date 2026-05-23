'use client';

import { useMemo } from 'react';
import { useWorkspaceState } from './workspace-state';
import type { CrystallizedReference, TechniqueSpecialization } from './workspace-ecosystem';

export function OpsEvidence() {
  const { context } = useWorkspaceState();
  const evidence = context.operationEvidence || [];
  const platforms = context.platforms || [];
  const invMemory = context.investigativeMemoryContent;
  const knowledge = context.knowledgeCrystallization;

  const activePlatforms = platforms.filter(p => p.entryCount > 0);
  const unresolvedCount = invMemory?.unresolvedFindings.length || 0;
  const recentEvidence = evidence.slice(0, 4);
  const topRefs = knowledge?.references?.slice(0, 5) || [];
  const topSpecs = knowledge?.specializations?.slice(0, 5) || [];

  const ctfCount = evidence.filter(e => e.source === 'ctf').length;
  const completionRatio = ctfCount > 0
    ? Math.round((evidence.filter(e => e.source === 'ctf' && e.resolved).length / ctfCount) * 100)
    : 0;

  return (
    <div className="space-y-3">
      {/* Platform Activity */}
      {activePlatforms.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-wider">Platforms</span>
          </div>
          <div className="space-y-1">
            {activePlatforms.slice(0, 4).map(p => (
              <div key={p.platform} className="flex items-center justify-between text-[10px] font-mono">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className={`w-1 h-1 rounded-full ${p.lastOutcome === 'solved' ? 'bg-emerald-500/50' : 'bg-amber-500/50'}`} />
                  <span className="text-zinc-500 truncate">{p.platform}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-zinc-600">{p.entryCount}</span>
                  <span className={`text-[8px] ${p.lastOutcome === 'solved' ? 'text-emerald-500/40' : 'text-amber-500/40'}`}>
                    {p.lastOutcome}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Operation Evidence */}
      {recentEvidence.length > 0 && (
        <div className="pt-2 border-t border-zinc-800/20">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-wider">Evidence</span>
            <span className="text-zinc-700 text-[8px] font-mono">
              {completionRatio > 0 ? `${completionRatio}% resolved` : ''}
            </span>
          </div>
          <div className="space-y-1">
            {recentEvidence.map(ev => (
              <div key={ev.id} className="flex items-center gap-1.5 text-[10px] font-mono">
                <span className={`w-1 h-1 rounded-full flex-shrink-0 ${
                  ev.resolved ? 'bg-emerald-500/40' :
                  ev.type === 'exploit_attempt' ? 'bg-amber-500/50' :
                  ev.type === 'recon' ? 'bg-blue-500/40' :
                  'bg-zinc-600'
                }`} />
                <span className="text-zinc-600 flex-shrink-0 w-4 text-center">
                  {ev.type === 'finding' ? '!' :
                   ev.type === 'exploit_attempt' ? '~' :
                   ev.type === 'recon' ? '?' :
                   ev.type === 'writeup_fragment' ? 'w' :
                   '.'}
                </span>
                <span className="text-zinc-500 truncate flex-1">{ev.title}</span>
                {ev.xpValue > 0 && (
                  <span className="text-zinc-700 flex-shrink-0">{ev.xpValue}xp</span>
                )}
                {!ev.resolved && (
                  <span className="text-amber-500/40 text-[8px] flex-shrink-0">open</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Crystallized Knowledge */}
      {topRefs.length > 0 && (
        <div className="pt-2 border-t border-zinc-800/20">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-wider">Knowledge</span>
            {knowledge && (
              <span className="text-zinc-700 text-[8px] font-mono">{knowledge.crystallizationIndex}%</span>
            )}
          </div>
          <div className="space-y-1">
            {topRefs.slice(0, 3).map(ref => (
              <div key={ref.id} className="flex items-center gap-1.5 text-[10px] font-mono">
                <span className={`flex-shrink-0 w-2 ${
                  ref.maturity === 'seasoned' ? 'text-emerald-500/40' :
                  ref.maturity === 'established' ? 'text-zinc-500' :
                  'text-zinc-600'
                }`}>
                  {ref.maturity === 'seasoned' ? '◆' : ref.maturity === 'established' ? '◇' : '○'}
                </span>
                <span className="text-zinc-500 truncate flex-1">{ref.title}</span>
                <span className="text-zinc-700 flex-shrink-0">{ref.weight}</span>
                <span className={`text-[8px] flex-shrink-0 ${
                  ref.successRate > 70 ? 'text-emerald-500/40' : 'text-zinc-600'
                }`}>
                  {ref.successRate}%
                </span>
              </div>
            ))}
          </div>
          {topSpecs.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {topSpecs.slice(0, 4).map(sp => (
                <span key={`${sp.type}-${sp.technique}`} className={`font-mono text-[7px] px-1 py-0.5 rounded ${
                  sp.trend === 'growing' ? 'text-emerald-500/50 bg-zinc-900/30 border border-zinc-800/10' :
                  sp.trend === 'declining' ? 'text-red-500/30' :
                  'text-zinc-500'
                }`}>
                  {sp.technique}
                  <span className="text-zinc-700 ml-0.5">{sp.mastery}%</span>
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Investigative Memory */}
      {unresolvedCount > 0 && (
        <div className="pt-2 border-t border-zinc-800/20">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-wider">Unresolved</span>
            <span className="text-amber-500/40 text-[8px] font-mono">{unresolvedCount}</span>
          </div>
          <div className="space-y-0.5">
            {invMemory!.unresolvedFindings.slice(0, 3).map((f, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[9px] font-mono">
                <span className={`${f.staleDays > 14 ? 'text-red-500/40' : f.staleDays > 7 ? 'text-amber-500/40' : 'text-zinc-500'}`}>! </span>
                <span className="text-zinc-500 truncate flex-1">{f.subject}</span>
                <span className="text-zinc-700">{f.staleDays}d</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!evidence.length && !activePlatforms.length && (
        <div className="text-center py-4 border border-dashed border-zinc-800/40 rounded">
          <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-wider">
            No Operational Data
          </p>
          <p className="font-mono text-[10px] text-zinc-700 mt-1">
            Evidence accumulates with operations
          </p>
        </div>
      )}
    </div>
  );
}
