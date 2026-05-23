'use client';

import { useState, useEffect, useMemo } from 'react';
import { useWorkspaceState } from './workspace-state';
import type { Task } from '@/types';

interface Mission {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'pending' | 'stale';
  pillar?: string;
  daysStale?: number;
  isOverdue?: boolean;
  impactScore?: number;
}

interface TaskWithPriority extends Task {
  priority: 'high' | 'medium' | 'low';
}

export function MissionConsole({ 
  tasks = [],
  currentMonth = 1 
}: { 
  tasks?: Task[]; 
  currentMonth?: number 
}) {
  const { context, memory, continuity } = useWorkspaceState();
  const { 
    weakPillars, 
    operationalPressure, 
    staleMissionCount,
    daysBehindRoadmap,
    rhythmState,
    momentumScore,
    strategic,
  } = context;
  
  const [systemTime, setSystemTime] = useState<string>('--:--:--');
  
  const neglectedPillars = strategic?.neglectedPillars || [];
  const primaryRecommendation = strategic?.primaryFocusRecommendation || '';
  
  const missions = useMemo(() => {
    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    
    return tasks
      .filter(t => t.status !== 'done')
      .map(t => {
        const updatedAt = new Date(t.created_at).getTime();
        const isStale = now - updatedAt > sevenDaysAgo;
        const daysStale = Math.floor((now - updatedAt) / (24 * 60 * 60 * 1000));
        
        const isOverdue = !!(t.due_date && new Date(t.due_date).getTime() < now);
        const isNeglected = weakPillars.includes(t.pillar);
        const isPillarNeglected = neglectedPillars.includes(t.pillar as any);
        
        let priority: 'high' | 'medium' | 'low' = (t.priority as string || 'medium') as 'high' | 'medium' | 'low';
        let impactScore = 0;
        
        if (isOverdue) {
          priority = 'high';
          impactScore += 50;
        }
        if (isNeglected && isStale) {
          priority = 'high';
          impactScore += 40;
        }
        if (isPillarNeglected) {
          impactScore += 25;
        }
        if (t.status === 'in_progress') {
          impactScore += 20;
        }
        if (rhythmState === 'momentum' && t.xp_value > 50) {
          impactScore += 15;
        }
        if (isStale && daysStale > 3) {
          priority = priority === 'low' ? 'medium' : priority;
          impactScore += 10;
        }
        
        const status: 'active' | 'pending' | 'stale' = 
          t.status === 'in_progress' 
            ? (isStale ? 'stale' : 'active')
            : (isStale ? 'stale' : 'pending');
        
        return {
          id: t.id,
          title: t.title,
          priority,
          status,
          pillar: t.pillar,
          daysStale: isStale ? daysStale : undefined,
          isOverdue,
          impactScore,
        } as Mission;
      })
      .sort((a, b) => {
        if (a.isOverdue && !b.isOverdue) return -1;
        if (!a.isOverdue && b.isOverdue) return 1;
        if (a.priority === 'high' && b.priority !== 'high') return -1;
        if (a.priority !== 'high' && b.priority === 'high') return 1;
        if (a.impactScore !== b.impactScore) return (b.impactScore || 0) - (a.impactScore || 0);
        return 0;
      })
      .slice(0, 6);
  }, [tasks, weakPillars, neglectedPillars, rhythmState, momentumScore]);

  useEffect(() => {
    const updateTime = () => {
      setSystemTime(new Date().toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-amber-400';
      default: return 'text-zinc-500';
    }
  };

  const getStatusIndicator = (mission: Mission) => {
    if (mission.isOverdue) {
      return 'bg-red-500 animate-pulse';
    }
    switch (mission.status) {
      case 'active': return 'bg-emerald-500';
      case 'stale': return 'bg-amber-500/50 animate-pulse';
      default: return 'bg-zinc-600';
    }
  };

  const getPillarIndicator = (pillar?: string) => {
    switch (pillar) {
      case 'HACK': return 'text-red-500';
      case 'BUILD': return 'text-blue-500';
      case 'AI': return 'text-purple-500';
      case 'PRESENCE': return 'text-amber-500';
      default: return 'text-zinc-600';
    }
  };

  const activeCount = missions.filter(m => m.status === 'active').length;
  const staleCount = missions.filter(m => m.status === 'stale').length;
  const overdueCount = missions.filter(m => m.isOverdue).length;

  const getStatusLine = () => {
    if (operationalPressure === 'critical') {
      return { text: 'OPERATION QUEUE SATURATED', color: 'text-red-500' };
    }
    if (operationalPressure === 'high') {
      return { text: `${staleMissionCount} STALLED`, color: 'text-amber-500/60' };
    }
    if (daysBehindRoadmap > 7) {
      return { text: `${daysBehindRoadmap}d drift`, color: 'text-amber-500/40' };
    }
    return null;
  };

  const statusLine = getStatusLine();
  
  const showStrategicHint = rhythmState === 'momentum' || rhythmState === 'recovery' || neglectedPillars.length > 0;

  const unfinishedChainCount = memory?.unfinishedMissionChains?.length || 0;
  const showMissionArc = unfinishedChainCount > 0;
  const missionArcText = showMissionArc
    ? `${unfinishedChainCount} unfinished mission chain${unfinishedChainCount > 1 ? 's' : ''} — backlog pressure ${context.backlogPressure.toFixed(0)}%`
    : '';

  return (
    <div className="space-y-3">
      {/* Mission Status Bar */}
      <div className="flex items-center justify-between text-xs font-mono text-zinc-500">
        <div className="flex items-center gap-2">
          <span>PHASE M{currentMonth.toString().padStart(2, '0')}</span>
          <span className="text-zinc-700">|</span>
          <span className="text-zinc-600">{systemTime}</span>
        </div>
        <div className="flex items-center gap-2">
          {overdueCount > 0 && (
            <span className="text-red-500/60 animate-pulse">{overdueCount} OVERDUE</span>
          )}
          {context.orchestration?.pacingProfile && context.orchestration.pacingProfile !== 'maintenance' && (
            <span className={`font-mono ${
              context.orchestration.pacingProfile === 'acceleration' ? 'text-emerald-500/50' :
              context.orchestration.pacingProfile === 'stabilization' ? 'text-amber-500/50' :
              context.orchestration.pacingProfile === 'consolidation' ? 'text-zinc-500' :
              'text-blue-500/50'
            }`}>
              {context.orchestration.pacingProfile.toUpperCase()}
            </span>
          )}
          <span className={`${statusLine?.color || 'text-emerald-500/60'}`}>
            ● ACTIVE
          </span>
        </div>
      </div>

      {/* Warning Banner */}
      {statusLine && (
        <div className="p-2 bg-zinc-900/20 border border-zinc-800/30 rounded text-center">
          <span className={`font-mono text-[10px] ${statusLine.color}`}>
            {statusLine.text}
          </span>
        </div>
      )}
      
      {/* Mission Queue */}
      <div className="space-y-1.5">
        {missions.length === 0 ? (
          <div className="text-center py-4 border border-dashed border-zinc-800/40 rounded">
            <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-wider">
              Mission Queue Clear
            </p>
            <p className="font-mono text-[10px] text-zinc-700 mt-1">
              Awaiting tasking
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {missions.map(m => (
              <div
                key={m.id}
                className={`flex items-center gap-2 p-2 border rounded transition-colors ${
                  m.isOverdue
                    ? 'bg-red-950/20 border-red-900/30'
                    : m.status === 'stale'
                      ? 'bg-amber-950/10 border-amber-900/20'
                      : 'bg-zinc-900/30 border-zinc-800/20 hover:bg-zinc-900/50'
                }`}
              >
                <span className={`w-1 h-3 rounded-sm ${getStatusIndicator(m)}`} />
                <span className={`text-[10px] ${getPillarIndicator(m.pillar)}`}>
                  [{m.pillar?.slice(0, 1) || '?'}]
                </span>
                <span className="font-mono text-xs text-zinc-400 flex-1 truncate">
                  {m.title}
                </span>
                {m.daysStale && m.daysStale > 3 && (
                  <span className="font-mono text-[9px] text-amber-500/60">
                    {m.daysStale}d
                  </span>
                )}
                <span className={`font-mono text-[9px] uppercase tracking-wider ${getPriorityColor(m.priority)}`}>
                  {m.priority}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Operation Stats */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-800/30">
        <div className="text-center">
          <p className="font-mono text-lg text-emerald-400">{activeCount}</p>
          <p className="font-mono text-[9px] text-zinc-600 uppercase">Engaged</p>
        </div>
        <div className="text-center">
          <p className={`font-mono text-lg ${staleCount > 0 ? 'text-amber-400' : 'text-zinc-400'}`}>
            {staleCount}
          </p>
          <p className="font-mono text-[9px] text-zinc-600 uppercase">Stalled</p>
        </div>
        <div className="text-center">
          <p className={`font-mono text-lg ${overdueCount > 0 ? 'text-red-400' : 'text-zinc-400'}`}>
            {overdueCount}
          </p>
          <p className="font-mono text-[9px] text-zinc-600 uppercase">Expired</p>
        </div>
      </div>

      {/* Weak Pillar Warning */}
      {weakPillars.length > 0 && (
        <div className="pt-2 border-t border-zinc-800/20">
          <div className="flex items-center gap-2 text-[10px] font-mono">
            <span className="text-amber-500/40">!</span>
            <span className="text-zinc-500">Lagging:</span>
            <span className="text-red-500/60">{weakPillars.join(', ')}</span>
          </div>
        </div>
      )}
      
      {/* Strategic Hint */}
      {showStrategicHint && primaryRecommendation && (
        <div className="pt-2 border-t border-zinc-800/20">
          <p className="font-mono text-[9px] text-zinc-600 leading-relaxed">
            → {primaryRecommendation}
          </p>
        </div>
      )}
      
      {/* Mission Arc Continuity */}
      {showMissionArc && (
        <div className="pt-2 border-t border-zinc-800/20">
          <p className="font-mono text-[9px] text-zinc-500 leading-relaxed">
            → {missionArcText}
          </p>
        </div>
      )}

      {/* Mission Chains */}
      {context.missionChains && context.missionChains.length > 0 && (
        <div className="pt-2 border-t border-zinc-800/20">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-wider">Chains</span>
            <span className="text-zinc-700 text-[8px] font-mono">
              {context.missionChains.filter(c => c.state === 'active').length} active
            </span>
          </div>
          <div className="space-y-1">
            {context.missionChains.filter(c => c.state !== 'resolved').slice(0, 3).map(chain => (
              <div key={chain.id} className="flex items-center gap-2 text-[10px] font-mono">
                <span className={`text-zinc-600 w-3 text-center ${
                  chain.state === 'active' ? 'text-emerald-500/60' :
                  chain.state === 'abandoned' ? 'text-red-500/40' :
                  'text-zinc-600'
                }`}>
                  {chain.state === 'active' ? '◐' : chain.state === 'abandoned' ? '⊙' : '○'}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <span className="text-zinc-500 truncate">{chain.name}</span>
                    <span className="text-zinc-600 ml-1">{chain.completedCount}/{chain.totalCount}</span>
                  </div>
                  <div className="w-full h-0.5 bg-zinc-800/30 rounded-full mt-0.5 overflow-hidden">
                    <div
                      className="h-full bg-zinc-600/50 rounded-full transition-all"
                      style={{ width: `${chain.totalCount > 0 ? (chain.completedCount / chain.totalCount) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Campaigns */}
      {(context.orchestration?.campaignStages || context.campaigns) && (
        <div className="pt-2 border-t border-zinc-800/20">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-wider">Campaigns</span>
          </div>
          <div className="space-y-1">
            {(context.orchestration?.campaignStages || context.campaigns || []).filter(c => c.taskCount > 0).slice(0, 3).map(campaign => {
              const stageGlyph = 'stage' in campaign
                ? (campaign as any).stage === 'archived' ? '◼' :
                  (campaign as any).stage === 'consolidation' ? '◐' :
                  (campaign as any).stage === 'sustained' ? '◓' :
                  (campaign as any).stage === 'escalation' ? '◑' :
                  (campaign as any).stage === 'activation' ? '○' : '○'
                : '○';
              const stageColor = 'stage' in campaign
                ? (campaign as any).stage === 'archived' ? 'text-emerald-500/40' :
                  (campaign as any).stage === 'consolidation' ? 'text-zinc-500' :
                  (campaign as any).stage === 'sustained' ? 'text-zinc-500' :
                  (campaign as any).stage === 'escalation' ? 'text-amber-500/60' :
                  'text-zinc-700'
                : 'text-zinc-700';
              const maturityScore = 'maturityScore' in campaign ? (campaign as any).maturityScore : null;
              return (
                <div key={campaign.id} className="text-[10px] font-mono">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className={`${stageColor}`}>{stageGlyph}</span>
                      <span className="text-zinc-500 truncate">{campaign.name}</span>
                    </div>
                    <span className="text-zinc-600 flex-shrink-0">{campaign.completedCount}/{campaign.taskCount}</span>
                  </div>
                  <div className="w-full h-0.5 bg-zinc-800/30 rounded-full mt-0.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        campaign.completedCount === campaign.taskCount && campaign.taskCount > 0
                          ? 'bg-emerald-500/40'
                          : campaign.completedCount > 0
                            ? 'bg-zinc-600/50'
                            : 'bg-zinc-800/10'
                      }`}
                      style={{ width: `${campaign.taskCount > 0 ? (campaign.completedCount / campaign.taskCount) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recovery Actions */}
      {((context.recoveryActions || []).filter(a => a.priority === 'high').length > 0 ||
        (context.orchestration?.recoveryIntelligence || []).filter(a => a.priority === 'high').length > 0) && (
        <div className="pt-2 border-t border-zinc-800/20">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-wider">Recovery</span>
          </div>
          <div className="space-y-0.5">
            {[...(context.orchestration?.recoveryIntelligence || []), ...(context.recoveryActions || [])]
              .filter((a, i, arr) => a.priority === 'high' && arr.findIndex(x => x.suggestion === a.suggestion) === i)
              .slice(0, 2)
              .map((action, i) => (
                <p key={i} className="font-mono text-[9px] text-amber-500/50 leading-relaxed">
                  → {action.suggestion}
                </p>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}