'use client';

import { useState, useEffect } from 'react';

interface Mission {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'pending' | 'completed';
  pillar?: string;
}

export function MissionConsole({ 
  tasks = [],
  currentMonth = 1 
}: { 
  tasks?: any[]; 
  currentMonth?: number 
}) {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [systemTime, setSystemTime] = useState<string>('--:--:--');
  
  useEffect(() => {
    const activeTasks: Mission[] = tasks
      .filter(t => t.status !== 'done')
      .slice(0, 5)
      .map(t => ({
        id: t.id,
        title: t.title,
        priority: (t.priority || 'medium') as 'high' | 'medium' | 'low',
        status: (t.status === 'in_progress' ? 'active' : 'pending') as 'active' | 'pending',
        pillar: t.pillar,
      }));
    setMissions(activeTasks);
  }, [tasks]);

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
  const pendingCount = missions.filter(m => m.status === 'pending').length;

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
          <span className="text-emerald-500/60">●</span>
          <span>LIVE</span>
        </div>
      </div>
      
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
                className="flex items-center gap-2 p-2 bg-zinc-900/30 border border-zinc-800/20 rounded hover:bg-zinc-900/50 transition-colors"
              >
                <span className={`w-1 h-3 rounded-sm ${
                  m.status === 'active' 
                    ? 'bg-emerald-500 animate-pulse' 
                    : m.status === 'pending'
                      ? 'bg-amber-500/40'
                      : 'bg-zinc-700'
                }`} />
                <span className={`text-[10px] ${getPillarIndicator(m.pillar)}`}>
                  [{m.pillar?.slice(0, 1) || '?'}]
                </span>
                <span className="font-mono text-xs text-zinc-400 flex-1 truncate">
                  {m.title}
                </span>
                <span className={`font-mono text-[9px] uppercase tracking-wider ${getPriorityColor(m.priority)}`}>
                  {m.priority}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Operation Stats */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800/30">
        <div className="text-center">
          <p className="font-mono text-lg text-emerald-400">{activeCount}</p>
          <p className="font-mono text-[9px] text-zinc-600 uppercase">Active</p>
        </div>
        <div className="text-center">
          <p className="font-mono text-lg text-zinc-400">{pendingCount}</p>
          <p className="font-mono text-[9px] text-zinc-600 uppercase">Pending</p>
        </div>
      </div>
    </div>
  );
}