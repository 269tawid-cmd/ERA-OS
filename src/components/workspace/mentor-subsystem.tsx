'use client';

import { useState } from 'react';

const MENTOR_INSIGHTS = [
  "Focus on completing your current phase tasks before moving forward.",
  "Your streak is building - consistency is key to mastery.",
  "Consider adding a CTF challenge to your weekly routine.",
  "Document your learning - it compounds over time.",
  "The roadmap is your guide, but your actions define progress.",
];

export function MentorSubsystem({ 
  pillarXP = { HACK: 0, BUILD: 0, AI: 0, PRESENCE: 0 },
  streakCurrent = 0,
  currentMonth = 1
}: { 
  pillarXP?: Record<string, number>;
  streakCurrent?: number;
  currentMonth?: number;
}) {
  const [insight] = useState(() => 
    MENTOR_INSIGHTS[Math.floor(Math.random() * MENTOR_INSIGHTS.length)]
  );
  
  const totalXP = Object.values(pillarXP).reduce((a, b) => a + b, 0);
  
  const getPillarStatus = (xp: number) => {
    if (xp > 500) return { status: 'EXPERT', color: 'text-emerald-400' };
    if (xp > 200) return { status: 'ADVANCED', color: 'text-amber-400' };
    if (xp > 50) return { status: 'LEARNING', color: 'text-zinc-400' };
    return { status: 'INITIATING', color: 'text-zinc-600' };
  };

  return (
    <div className="space-y-4">
      <div className="p-3 bg-zinc-900/40 border border-zinc-800/30 rounded">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-amber-400 text-xs">◆</span>
          <span className="font-mono text-xs text-amber-400/80 uppercase">AI Mentor</span>
        </div>
        <p className="font-mono text-xs text-zinc-400 leading-relaxed">
          {insight}
        </p>
      </div>
      
      <div className="space-y-2">
        <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-wider">
          OPERATOR STATUS
        </p>
        {Object.entries(pillarXP).map(([pillar, xp]) => {
          const { status, color } = getPillarStatus(xp);
          return (
            <div key={pillar} className="flex items-center justify-between">
              <span className="font-mono text-xs text-zinc-400">{pillar}</span>
              <span className="font-mono text-xs text-zinc-500">{xp} XP</span>
            </div>
          );
        })}
      </div>
      
      <div className="pt-2 border-t border-zinc-800/30">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-zinc-600">TOTAL XP</span>
          <span className="font-mono text-sm text-zinc-300">{totalXP}</span>
        </div>
      </div>
    </div>
  );
}