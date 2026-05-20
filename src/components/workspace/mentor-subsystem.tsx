'use client';

import { useState, useEffect, useMemo } from 'react';
import { useWorkspaceState } from './workspace-state';

const PHASE_INSIGHTS: Record<number, string[]> = {
  1: ["Phase 1 is foundational. Master the basics before moving forward."],
  2: ["You're building momentum. Keep the streak alive."],
  3: ["Quarter progress achieved. Consistency is your edge."],
  4: ["Mid-month check. How are your HACK tasks going?"],
  5: ["Halfway through the phase. Push through the challenge."],
  6: ["Phase 6 pressure. Time to show what you've learned."],
  7: ["Week 7 intensity. Your consistency defines your path."],
  8: ["Final stretch of the phase. Focus on completion."],
  9: ["Phase 9 is critical. Don't let momentum slip."],
  10: ["Almost done with this phase. Finish strong."],
  11: ["Approaching phase end. Prioritize unfinished work."],
  12: ["Final phase. Complete your Year 1 journey."],
};

const WEAK_PILLAR_MESSAGES: Record<string, string[]> = {
  HACK: [
    "Your HACK pillar needs attention. CTFs and labs are waiting.",
    "Offensive skills development lagging. Time to hack.",
    "Security fundamentals need work. Get hands-on.",
  ],
  BUILD: [
    "BUILD pillar neglected. Automation and tools matter.",
    "Scripting and development behind schedule.",
    "Time to code something useful.",
  ],
  AI: [
    "AI pillar idle. LLMs and automation are the future.",
    "AI skills need development. Start experimenting.",
    "Don't sleep on AI. It's changing everything.",
  ],
  PRESENCE: [
    "PRESENCE pillar weak. Document your journey.",
    "Write and share. Build your cybersecurity brand.",
    "Learning without documentation is forgotten.",
  ],
};

const URGENT_MESSAGES: string[] = [
  "Operational pressure detected. Review stale missions.",
  "Several tasks overdue. Time to prioritize.",
  "Backlog pressure building. Clear some tasks.",
  "Your streak is at risk. Activity needed today.",
  "Roadmap progress lagging. Push forward.",
];

const CALM_MESSAGES: string[] = [
  "Strong progress. Keep this rhythm.",
  "Excellent consistency. You're building something real.",
  "Roadmap on track. Maintain the momentum.",
  "Your discipline is showing results.",
  "This is how legends are made. Stay the course.",
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
  const { context } = useWorkspaceState();
  const { mentorUrgency, weakPillars, operationalPressure, streakStatus, focusPillar } = context;
  
  const [insightIndex, setInsightIndex] = useState(0);
  const [insight, setInsight] = useState('');

  const totalXP = useMemo(() => 
    Object.values(pillarXP).reduce((a, b) => a + b, 0), 
  [pillarXP]);
  
  const getMaxXP = () => Math.max(...Object.values(pillarXP), 1);

  const getPillarStatus = (xp: number) => {
    if (xp > 500) return { status: 'EXPERT', color: 'text-emerald-400', bar: 'bg-emerald-500' };
    if (xp > 200) return { status: 'ADVANCED', color: 'text-amber-400', bar: 'bg-amber-500' };
    if (xp > 50) return { status: 'LEARNING', color: 'text-zinc-400', bar: 'bg-zinc-500' };
    return { status: 'INITIATING', color: 'text-zinc-600', bar: 'bg-zinc-700' };
  };

  const getMentorTone = () => {
    if (mentorUrgency > 60) return 'alert';
    if (mentorUrgency > 30) return 'warning';
    return 'normal';
  };

  useEffect(() => {
    let messages: string[] = [];
    
    if (operationalPressure === 'critical') {
      messages = URGENT_MESSAGES;
    } else if (streakStatus === 'cold') {
      messages = [
        "Streak cold. Start today or lose momentum.",
        "Your streak needs activity. Now.",
        "No activity detected. Begin a mission.",
      ];
    } else if (weakPillars.length > 0) {
      const weakPillar = weakPillars[0];
      messages = WEAK_PILLAR_MESSAGES[weakPillar] || WEAK_PILLAR_MESSAGES.HACK;
    } else if (streakStatus === 'hot' || streakStatus === 'strong') {
      messages = CALM_MESSAGES;
    } else {
      const phaseMessages = PHASE_INSIGHTS[currentMonth] || PHASE_INSIGHTS[1];
      messages = [...CALM_MESSAGES.slice(0, 2), ...phaseMessages];
    }
    
    setInsight(messages[insightIndex % messages.length]);
  }, [insightIndex, currentMonth, weakPillars, operationalPressure, streakStatus]);

  useEffect(() => {
    const interval = setInterval(() => {
      setInsightIndex(prev => prev + 1);
    }, mentorUrgency > 50 ? 8000 : mentorUrgency > 30 ? 12000 : 20000);
    return () => clearInterval(interval);
  }, [mentorUrgency]);

  const mentorTone = getMentorTone();

  return (
    <div className="space-y-3">
      {/* AI Mentor Status with Context */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className={`absolute inline-flex h-full w-full rounded-full ${
              mentorTone === 'alert' ? 'bg-red-500 opacity-75' :
              mentorTone === 'warning' ? 'bg-amber-500 opacity-75' :
              'bg-amber-400 opacity-75'
            } animate-ping`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${
              mentorTone === 'alert' ? 'bg-red-500' :
              mentorTone === 'warning' ? 'bg-amber-500' :
              'bg-amber-500'
            }`}></span>
          </span>
          <span className={`font-mono text-[10px] uppercase ${
            mentorTone === 'alert' ? 'text-red-400' :
            mentorTone === 'warning' ? 'text-amber-400' :
            'text-amber-400/80'
          }`}>
            AI Mentor
          </span>
        </div>
        <div className="flex items-center gap-2">
          {mentorUrgency > 50 && (
            <span className="font-mono text-[9px] text-red-500/60 animate-pulse">PRIORITY</span>
          )}
          <span className="font-mono text-[9px] text-zinc-600">ACTIVE</span>
        </div>
      </div>
      
      {/* Context-Aware Insight */}
      <div className={`p-3 border rounded transition-colors ${
        mentorTone === 'alert' 
          ? 'bg-red-950/20 border-red-900/30' 
          : mentorTone === 'warning'
            ? 'bg-amber-950/20 border-amber-900/30'
            : 'bg-zinc-900/30 border-zinc-800/20'
      }`}>
        <div className="flex items-center gap-1 mb-2">
          <span className={`text-[9px] font-mono ${
            mentorTone === 'alert' ? 'text-red-500' :
            mentorTone === 'warning' ? 'text-amber-500' :
            'text-zinc-500'
          }`}>
            {currentMonth > 1 ? `PHASE M${currentMonth}` : 'INITIAL PHASE'}
          </span>
          {weakPillars.length > 0 && (
            <>
              <span className="text-zinc-700">|</span>
              <span className="text-[9px] font-mono text-red-500/60">
                {weakPillars[0]} WEAK
              </span>
            </>
          )}
          {focusPillar && weakPillars.includes(focusPillar) && (
            <>
              <span className="text-zinc-700">|</span>
              <span className="text-[9px] font-mono text-amber-500/60">
                FOCUS: {focusPillar}
              </span>
            </>
          )}
        </div>
        <p className="font-mono text-xs text-zinc-400 leading-relaxed animate-fade-in">
          {insight}
        </p>
      </div>
      
      {/* Pillar Status with Real Data */}
      <div className="space-y-2">
        <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-wider">
          XP Breakdown
        </p>
        {Object.entries(pillarXP).map(([pillar, xp]) => {
          const { status, color, bar } = getPillarStatus(xp);
          const percentage = (xp / getMaxXP()) * 100;
          const isWeak = weakPillars.includes(pillar);
          return (
            <div key={pillar} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className={`font-mono text-xs ${isWeak ? 'text-red-400' : 'text-zinc-400'}`}>
                  {pillar}
                  {isWeak && <span className="ml-1 text-[9px] text-red-500/60">!</span>}
                </span>
                <div className="flex items-center gap-2">
                  <span className={`font-mono text-[9px] ${isWeak ? 'text-red-500/60' : color}`}>{status}</span>
                  <span className="font-mono text-xs text-zinc-500">{xp}</span>
                </div>
              </div>
              <div className="h-1 bg-zinc-800/50 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${bar} transition-all duration-500 ${
                    isWeak ? 'opacity-60' : ''
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Streak Context */}
      <div className="pt-2 border-t border-zinc-800/20">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-zinc-600">Current Streak</span>
          <span className={`font-mono text-sm ${
            streakStatus === 'hot' ? 'text-amber-400' :
            streakStatus === 'strong' ? 'text-emerald-400' :
            streakStatus === 'building' ? 'text-zinc-300' :
            'text-zinc-600'
          }`}>
            {streakCurrent} days
            {streakStatus === 'cold' && ' ⚠'}
          </span>
        </div>
        {totalXP > 0 && (
          <div className="mt-1 flex items-center justify-between">
            <span className="font-mono text-[9px] text-zinc-700">Total XP</span>
            <span className="font-mono text-[10px] text-zinc-500">{totalXP}</span>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0.5; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-in-out;
        }
      `}</style>
    </div>
  );
}