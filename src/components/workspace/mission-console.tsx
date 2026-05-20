'use client';

import { useState, useEffect, useMemo } from 'react';
import { useWorkspaceState } from './workspace-state';

interface Mission {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'pending' | 'stale';
  pillar?: string;
  daysStale?: number;
  isOverdue?: boolean;
}

export function MissionConsole({ 
  tasks = [],
  currentMonth = 1 
}: { 
  tasks?: any[]; 
  currentMonth?: number 
}) {
  const { intelligence, data } = useWorkspaceState();
  const { 
    weakPillars, 
    operationalPressure, 
    staleMissionCount,
    daysBehindRoadmap 
  } = intelligence;
  
  const [missions, setMissions] = useState<Mission[]>([]);
  const [systemTime, setSystemTime] = useState<string>('--:--:--');
  
  useEffect(() => {
    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    
    const processedMissions: Mission[] = tasks
      .filter(t => t.status !== 'done')
      .map(t => {
        const updatedAt = new Date(t.updated_at || t.created_at).getTime();
        const isStale = now - updatedAt > sevenDaysAgo;
        const daysStale = Math.floor((now - updatedAt) / (24 * 60 * 60 * 1000));
        
        const isOverdue = !!(t.due_date && new Date(t.due_date).getTime() < now);
        const isNeglected = weakPillars.includes(t.pillar);
        
        let priority: 'high' | 'medium' | 'low' = (t.priority as string || 'medium') as any;
        
        if (isOverdue) priority = 'high';
        else if (isNeglected && isStale) priority = 'high';
        else if (isStale && daysStale > 3) priority = 'medium';
        
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
        } as Mission;
      })
      .sort((a, b) => {
        if (a.isOverdue && !b.isOverdue) return -1;
        if (!a.isOverdue && b.isOverdue) return 1;
        if (a.priority === 'high' && b.priority !== 'high') return -1;
        if (a.priority !== 'high' && b.priority === 'high') return 1;
        return 0;
      })
      .slice(0, 6);
    
    setMissions(processedMissions);
  }, [tasks, weakPillars]);

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
      return { text: 'BACKLOG CRITICAL', color: 'text-red-500' };
    }
    if (operationalPressure === 'high') {
      return { text: `${staleMissionCount} STALE`, color: 'text-amber-500/60' };
    }
    if (daysBehindRoadmap > 7) {
      return { text: `${daysBehindRoadmap}d behind`, color: 'text-amber-500/40' };
    }
    return null;
  };

  const statusLine = getStatusLine();

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
          <span className={`${statusLine?.color || 'text-emerald-500/60'}`}>
            ● LIVE
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
              Queue Empty
            </p>
            <p className="font-mono text-[10px] text-zinc-700 mt-1">
              Awaiting mission assignment
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
          <p className="font-mono text-[9px] text-zinc-600 uppercase">Active</p>
        </div>
        <div className="text-center">
          <p className={`font-mono text-lg ${staleCount > 0 ? 'text-amber-400' : 'text-zinc-400'}`}>
            {staleCount}
          </p>
          <p className="font-mono text-[9px] text-zinc-600 uppercase">Stale</p>
        </div>
        <div className="text-center">
          <p className={`font-mono text-lg ${overdueCount > 0 ? 'text-red-400' : 'text-zinc-400'}`}>
            {overdueCount}
          </p>
          <p className="font-mono text-[9px] text-zinc-600 uppercase">Overdue</p>
        </div>
      </div>

      {/* Weak Pillar Warning */}
      {weakPillars.length > 0 && (
        <div className="pt-2 border-t border-zinc-800/20">
          <div className="flex items-center gap-2 text-[10px] font-mono">
            <span className="text-amber-500/40">!</span>
            <span className="text-zinc-500">Neglected:</span>
            <span className="text-red-500/60">{weakPillars.join(', ')}</span>
          </div>
        </div>
      )}
    </div>
  );
}