'use client';

import { useState, useEffect } from 'react';

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
  const [insight, setInsight] = useState(MENTOR_INSIGHTS[0]);
  const [insightIndex, setInsightIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setInsightIndex(prev => (prev + 1) % MENTOR_INSIGHTS.length);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setInsight(MENTOR_INSIGHTS[insightIndex]);
  }, [insightIndex]);

  const totalXP = Object.values(pillarXP).reduce((a, b) => a + b, 0);
  
  const getPillarStatus = (xp: number) => {
    if (xp > 500) return { status: 'EXPERT', color: 'text-emerald-400', bar: 'bg-emerald-500' };
    if (xp > 200) return { status: 'ADVANCED', color: 'text-amber-400', bar: 'bg-amber-500' };
    if (xp > 50) return { status: 'LEARNING', color: 'text-zinc-400', bar: 'bg-zinc-500' };
    return { status: 'INITIATING', color: 'text-zinc-600', bar: 'bg-zinc-700' };
  };

  const getMaxXP = () => Math.max(...Object.values(pillarXP), 1);

  return (
    <div className="space-y-3">
      {/* AI Mentor Active Indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <span className="font-mono text-[10px] text-amber-400/80 uppercase">AI Mentor</span>
        </div>
        <span className="font-mono text-[9px] text-zinc-600">ACTIVE</span>
      </div>
      
      {/* Current Insight */}
      <div className="p-3 bg-zinc-900/30 border border-zinc-800/20 rounded">
        <p className="font-mono text-xs text-zinc-400 leading-relaxed animate-fade-in">
          {insight}
        </p>
      </div>
      
      {/* Pillar Status */}
      <div className="space-y-2">
        <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-wider">
          XP Breakdown
        </p>
        {Object.entries(pillarXP).map(([pillar, xp]) => {
          const { status, color, bar } = getPillarStatus(xp);
          const percentage = (xp / getMaxXP()) * 100;
          return (
            <div key={pillar} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-zinc-400">{pillar}</span>
                <div className="flex items-center gap-2">
                  <span className={`font-mono text-[9px] ${color}`}>{status}</span>
                  <span className="font-mono text-xs text-zinc-500">{xp}</span>
                </div>
              </div>
              <div className="h-1 bg-zinc-800/50 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${bar} transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Streak Display */}
      <div className="pt-2 border-t border-zinc-800/20">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-zinc-600">Current Streak</span>
          <span className={`font-mono text-sm ${
            streakCurrent >= 7 ? 'text-amber-400' : 
            streakCurrent > 0 ? 'text-zinc-300' : 'text-zinc-600'
          }`}>
            {streakCurrent} days
          </span>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0.5; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-in-out;
        }
      `}</style>
    </div>
  );
}