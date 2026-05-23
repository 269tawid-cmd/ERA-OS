'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useWorkspaceState } from './workspace-state';

const SUSTAINED_OVERLOAD: string[] = [
  "Still in overload. Clear small tasks to regain momentum.",
  "Extended pressure cycle. Completion > initiation right now.",
  "Operational load persistent. Consider pruning low-priority items.",
];

const SUSTAINED_MOMENTUM: string[] = [
  "Momentum sustained. Deep work is viable now.",
  "Consistent execution phase. Push strategic priorities.",
  "Strong rhythm continuing. Layer in harder objectives.",
];

const SUSTAINED_STAGNATION: string[] = [
  "Still stalled. One completed task breaks the pattern.",
  "Prolonged inactivity. The hardest part is starting.",
  "Same state persists. Change one variable today.",
];

const SUSTAINED_FATIGUE: string[] = [
  "Fatigue lingering. Rest and small wins only.",
  "Still running low. Quality over output.",
  "Recovery takes time. Light operations only.",
];

const SUSTAINED_RECOVERY: string[] = [
  "Recovery sustaining. Keep the pace manageable.",
  "Steady recovery continuing. Don't rush it.",
  "Building back consistently. Stay patient.",
];

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

const OVERLOAD_MESSAGES: string[] = [
  "You're carrying a heavy load. Consider clearing some tasks before adding more.",
  "Operational capacity is strained. Focus on completion, not expansion.",
  "Mission backlog accumulating. Small wins build momentum.",
  "Your plate is full. Finish what you've started.",
];

const STAGNATION_MESSAGES: string[] = [
  "Nothing completed recently. Start small - one task matters.",
  "Operational stagnation detected. Any progress is better than none.",
  "Break the cycle. Complete one mission today.",
  "Inactivity compounding. Time to execute.",
];

const RECOVERY_MESSAGES: string[] = [
  "Good rhythm building. Maintain this pace.",
  "Consistency returning. Keep the streak alive.",
  "You're recovering well. Small steps, big results.",
];

const MOMENTUM_MESSAGES: string[] = [
  "Strong execution. You're building real capability.",
  "Operational momentum high. This is how legends are made.",
  "Your consistency is paying off. Stay the course.",
  "Execution solid. Keep pushing the boundaries.",
];

const FATIGUE_MESSAGES: string[] = [
  "Signs of fatigue detected. Quality over quantity.",
  "Operational fatigue building. Rest matters.",
  "Consider lighter objectives today. Recovery is progress.",
];

const STRATEGIC_MESSAGES: Record<string, string[]> = {
  pillar_imbalance: [
    "Pillar investment imbalanced. Review your strategic allocation.",
    "Some pillars are carrying load while others lag.",
    "Balance across HACK, BUILD, AI, PRESENCE matters for progression.",
  ],
  drift_risk: [
    "Roadmap drift accumulating. Completion rate needs attention.",
    "Current pace may miss phase targets. Focus on execution.",
    "Tracking behind timeline. Prioritize active missions.",
  ],
  momentum_phase: [
    "Momentum supports deeper project work. Execute with focus.",
    "Strong operational state. Push strategic priorities.",
    "Current rhythm favors advancement. Capitalize on it.",
  ],
  stabilization: [
    "Consistency over volume during this phase.",
    "Quality execution matters more than quantity now.",
    "Sustainability requires measured progress.",
  ],
  neglected_building: [
    "BUILD pillar lagging. Tools and automation defer leverage.",
    "Development skills need attention. Build to scale.",
    "Scripting and automation compound over time.",
  ],
  neglected_hack: [
    "HACK skills at risk. Hands-on practice is irreplaceable.",
    "Offensive capabilities need sharpening.",
    "CTF and lab work builds intuition that reading cannot.",
  ],
  neglected_ai: [
    "AI pillar neglected. LLMs are becoming essential tools.",
    "AI-assisted workflows compound productivity.",
    "Understanding AI capabilities is a strategic advantage.",
  ],
  neglected_presence: [
    "PRESENCE pillar underinvested. Documentation compounds learning.",
    "Sharing knowledge builds authority and reinforces learning.",
    "Your journey documented is your expertise demonstrated.",
  ],
  expansion_ready: [
    "Operational capacity supports expansion work.",
    "Strong foundation allows deeper project execution.",
    "Consider taking on more complex missions.",
  ],
};

export function MentorSubsystem({ 
  pillarXP = { HACK: 0, BUILD: 0, AI: 0, PRESENCE: 0 },
  streakCurrent = 0,
  currentMonth = 1,
  panelId = 'mentor-subsystem',
}: { 
  pillarXP?: Record<string, number>;
  streakCurrent?: number;
  currentMonth?: number;
  panelId?: string;
}) {
  const { context, memory, lifecycle, continuity, state } = useWorkspaceState();
  const { 
    mentorUrgency, 
    weakPillars, 
    operationalPressure, 
    streakStatus, 
    focusPillar,
    rhythmState,
    operationalConfidence,
    strategic,
  } = context;
  
  const [insightIndex, setInsightIndex] = useState(0);
  const [insight, setInsight] = useState('');
  const [strategicInsight, setStrategicInsight] = useState('');
  const staleCyclesRef = useRef(0);
  const lastRhythmRef = useRef(rhythmState);

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
    if (rhythmState === 'overload' || rhythmState === 'fatigue') return 'calm';
    if (mentorUrgency > 60 || rhythmState === 'stagnation') return 'alert';
    if (mentorUrgency > 30) return 'warning';
    return 'normal';
  };

  const getInsightPace = () => {
    if (rhythmState === 'overload' || rhythmState === 'fatigue') return 25000;
    if (rhythmState === 'stagnation') return 10000;
    if (rhythmState === 'momentum') return 15000;
    return 20000;
  };

  const getStrategicMessage = () => {
    if (!strategic) return null;
    
    const { strategicIndicators, neglectedPillars, progressionMapping } = strategic;
    
    if (progressionMapping?.driftRisk === 'high') {
      return STRATEGIC_MESSAGES.drift_risk[Math.floor(Math.random() * STRATEGIC_MESSAGES.drift_risk.length)];
    }
    
    if (rhythmState === 'momentum' && strategicIndicators?.some(i => i.type === 'expansion_ready')) {
      return STRATEGIC_MESSAGES.expansion_ready[Math.floor(Math.random() * STRATEGIC_MESSAGES.expansion_ready.length)];
    }
    
    if (rhythmState === 'recovery' || rhythmState === 'fatigue') {
      return STRATEGIC_MESSAGES.stabilization[Math.floor(Math.random() * STRATEGIC_MESSAGES.stabilization.length)];
    }
    
    if (neglectedPillars?.length > 0) {
      const pillar = neglectedPillars[0];
      const key = `neglected_${pillar.toLowerCase()}`;
      return STRATEGIC_MESSAGES[key]?.[Math.floor(Math.random() * (STRATEGIC_MESSAGES[key]?.length || 1))] || 
        STRATEGIC_MESSAGES.pillar_imbalance[Math.floor(Math.random() * STRATEGIC_MESSAGES.pillar_imbalance.length)];
    }
    
    if (strategicIndicators?.some(i => i.type === 'focus_recommendation')) {
      return strategicIndicators.find(i => i.type === 'focus_recommendation')?.message;
    }
    
    return null;
  };

  useEffect(() => {
    if (rhythmState !== lastRhythmRef.current) {
      staleCyclesRef.current = 0;
      lastRhythmRef.current = rhythmState;
    } else {
      staleCyclesRef.current += 1;
    }

    const sustained = staleCyclesRef.current >= 6;
    let messages: string[] = [];
    
    if (rhythmState === 'overload' && sustained) {
      messages = SUSTAINED_OVERLOAD;
    } else if (rhythmState === 'overload') {
      messages = OVERLOAD_MESSAGES;
    } else if (rhythmState === 'fatigue' && sustained) {
      messages = SUSTAINED_FATIGUE;
    } else if (rhythmState === 'fatigue') {
      messages = FATIGUE_MESSAGES;
    } else if (rhythmState === 'stagnation' && sustained) {
      messages = SUSTAINED_STAGNATION;
    } else if (rhythmState === 'stagnation') {
      messages = STAGNATION_MESSAGES;
    } else if (rhythmState === 'momentum' && sustained) {
      messages = SUSTAINED_MOMENTUM;
    } else if (rhythmState === 'momentum') {
      messages = MOMENTUM_MESSAGES;
    } else if (rhythmState === 'recovery' && sustained) {
      messages = SUSTAINED_RECOVERY;
    } else if (rhythmState === 'recovery') {
      messages = RECOVERY_MESSAGES;
    } else if (operationalPressure === 'critical') {
      messages = [
        "Operational pressure high. Prioritize essential tasks.",
        "Critical load detected. Focus is key.",
      ];
    } else if (weakPillars.length > 0) {
      const weakPillar = weakPillars[0];
      messages = WEAK_PILLAR_MESSAGES[weakPillar] || WEAK_PILLAR_MESSAGES.HACK;
    } else if (streakStatus === 'hot' || streakStatus === 'strong') {
      messages = MOMENTUM_MESSAGES;
    } else {
      const phaseMessages = PHASE_INSIGHTS[currentMonth] || PHASE_INSIGHTS[1];
      messages = [...RECOVERY_MESSAGES.slice(0, 2), ...phaseMessages];
    }
    
    setInsight(messages[insightIndex % messages.length]);
  }, [insightIndex, currentMonth, weakPillars, operationalPressure, streakStatus, rhythmState]);

  useEffect(() => {
    const strategicMsg = getStrategicMessage();
    setStrategicInsight(strategicMsg || '');
  }, [strategic, rhythmState, weakPillars]);

  const isFocused = state.focusedPanelId === panelId;

  useEffect(() => {
    if (!isFocused) return;
    const interval = setInterval(() => {
      setInsightIndex(prev => prev + 1);
    }, getInsightPace());
    return () => clearInterval(interval);
  }, [rhythmState, isFocused]);

  const mentorTone = getMentorTone();

  return (
    <div className="space-y-3">
      {/* AI Mentor Status with Context */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`inline-flex rounded-full h-1.5 w-1.5 ${
            mentorTone === 'calm' ? 'bg-emerald-500' :
            mentorTone === 'alert' ? 'bg-red-500' :
            mentorTone === 'warning' ? 'bg-amber-500' :
            'bg-amber-500'
          }`} />
          <span className={`font-mono text-[10px] uppercase ${
            mentorTone === 'calm' ? 'text-emerald-400' :
            mentorTone === 'alert' ? 'text-red-400' :
            mentorTone === 'warning' ? 'text-amber-400' :
            'text-amber-400/80'
          }`}>
            AI Mentor
          </span>
        </div>
        <div className="flex items-center gap-2">
          {rhythmState !== 'stable' && rhythmState !== 'recovery' && (
            <span className={`font-mono text-[9px] ${
              rhythmState === 'momentum' ? 'text-emerald-500/60' :
              rhythmState === 'fatigue' || rhythmState === 'overload' ? 'text-amber-500/60' :
              'text-red-500/60'
            } uppercase`}>
              {rhythmState}
            </span>
          )}
          <span className="font-mono text-[9px] text-zinc-600">ACTIVE</span>
        </div>
      </div>
      
      {/* Context-Aware Insight */}
      <div className={`p-2.5 border rounded transition-colors ${
        mentorTone === 'calm'
          ? 'bg-emerald-950/20 border-emerald-900/30'
          : mentorTone === 'alert' 
            ? 'bg-red-950/20 border-red-900/30' 
            : mentorTone === 'warning'
              ? 'bg-amber-950/20 border-amber-900/30'
              : 'bg-zinc-900/30 border-zinc-800/20'
      }`}>
        <div className="flex items-center gap-1 mb-1.5 flex-wrap">
          <span className={`text-[9px] font-mono ${
            mentorTone === 'calm' ? 'text-emerald-500' :
            mentorTone === 'alert' ? 'text-red-500' :
            mentorTone === 'warning' ? 'text-amber-500' :
            'text-zinc-500'
          }`}>
            {currentMonth > 1 ? `M${currentMonth}` : 'PHASE 1'}
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
          {rhythmState !== 'stable' && (
            <>
              <span className="text-zinc-700">|</span>
              <span className={`text-[9px] font-mono ${
                rhythmState === 'momentum' ? 'text-emerald-500/60' :
                rhythmState === 'fatigue' ? 'text-amber-500/60' :
                'text-red-500/60'
              }`}>
                {rhythmState}
              </span>
            </>
          )}
        </div>
        <p className="font-mono text-xs text-zinc-400 leading-relaxed">
          {insight}
        </p>
      </div>
      
      {/* Strategic Progression Insight */}
      {strategicInsight && (
        <div className="p-2 border border-zinc-800/40 rounded bg-zinc-900/20">
          <div className="flex items-center gap-1 mb-1">
            <span className="font-mono text-[9px] text-zinc-600 uppercase">Strategic</span>
          </div>
          <p className="font-mono text-[10px] text-zinc-500 leading-relaxed">
            {strategicInsight}
          </p>
        </div>
      )}
      
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
      
      {/* Streak & Confidence Context */}
      <div className="pt-2 border-t border-zinc-800/20 space-y-1">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-zinc-600">Streak</span>
          <span className={`font-mono text-sm ${
            streakStatus === 'hot' ? 'text-amber-400' :
            streakStatus === 'strong' ? 'text-emerald-400' :
            streakStatus === 'building' ? 'text-zinc-300' :
            'text-zinc-600'
          }`}>
            {streakCurrent}d
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-zinc-600">Confidence</span>
          <span className={`font-mono text-sm ${
            operationalConfidence > 70 ? 'text-emerald-400' :
            operationalConfidence > 40 ? 'text-amber-400' :
            'text-zinc-500'
          }`}>
            {operationalConfidence}%
          </span>
        </div>
        {totalXP > 0 && (
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] text-zinc-700">Total XP</span>
            <span className="font-mono text-[10px] text-zinc-500">{totalXP}</span>
          </div>
        )}
      </div>
      
      {/* Operational Continuity Insight */}
      {memory && lifecycle && continuity && (
        <div className="pt-2 border-t border-zinc-800/20">
          <div className="flex items-center gap-1 mb-1">
            <span className="font-mono text-[9px] text-zinc-600 uppercase">Continuity</span>
            {continuity.identity.totalOperationalDays > 5 && (
              <span className="font-mono text-[7px] text-zinc-700 uppercase tracking-wider ml-1">
                {continuity.identity.strategicSignature}
              </span>
            )}
          </div>
          <p className="font-mono text-[9px] text-zinc-500 leading-relaxed">
            {lifecycle.description}
          </p>
          <p className="font-mono text-[8px] text-zinc-400 leading-none mb-1">
            → {lifecycle.recommendedFocus}
          </p>
          {/* Carry-forward awareness */}
          {continuity.identity.totalOperationalDays > 3 && (
            <>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                {continuity.scores.missionContinuityScore > 60 && (
                  <span className="font-mono text-[7px] text-emerald-500/30">• mission continuity stable</span>
                )}
                {continuity.carryForward.unresolvedBacklogTrend === 'increasing' && (
                  <span className="font-mono text-[7px] text-amber-500/30">• backlog pressure rising</span>
                )}
                {continuity.carryForward.neglectedPillarTrend === 'persistent' && (
                  <span className="font-mono text-[7px] text-red-500/30">• pillar neglect persistent</span>
                )}
                {continuity.carryForward.pacingRecommendation === 'slow' && (
                  <span className="font-mono text-[7px] text-amber-500/30">• pacing: decelerate</span>
                )}
                {continuity.carryForward.pacingRecommendation === 'accelerate' && (
                  <span className="font-mono text-[7px] text-emerald-500/30">• pacing: accelerate</span>
                )}
                {memory.operationalCycles > 3 && (
                  <span className="font-mono text-[7px] text-zinc-600/30">• {memory.operationalCycles} cycles completed</span>
                )}
              </div>
              {/* Long-term progression awareness */}
              {continuity.identity.progressionTendency === 'improving' && continuity.identity.totalOperationalDays > 10 && (
                <p className="font-mono text-[8px] text-emerald-500/25 mt-1 leading-relaxed">
                  Long-term trajectory improving. Sustained operational maturity building.
                </p>
              )}
              {continuity.identity.progressionTendency === 'declining' && continuity.identity.totalOperationalDays > 10 && (
                <p className="font-mono text-[8px] text-amber-500/25 mt-1 leading-relaxed">
                  Operational trajectory declining. Course correction recommended.
                </p>
              )}
            </>
          )}
        </div>
      )}
      
    </div>
  );
}