'use client';

import { useState, useEffect } from 'react';

interface Mission {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'pending' | 'completed';
}

export function MissionConsole({ 
  tasks = [],
  currentMonth = 1 
}: { 
  tasks?: any[]; 
  currentMonth?: number 
}) {
  const [missions, setMissions] = useState<Mission[]>([]);
  
  useEffect(() => {
    const activeTasks = tasks
      .filter(t => t.status !== 'done')
      .slice(0, 5)
      .map(t => ({
        id: t.id,
        title: t.title,
        priority: t.priority as 'high' | 'medium' | 'low',
        status: t.status === 'in_progress' ? 'active' : 'pending' as 'active' | 'pending' | 'completed',
      }));
    setMissions(activeTasks);
  }, [tasks]);

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-amber-400';
      default: return 'text-zinc-500';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs font-mono text-zinc-500">
        <span>PHASE M{currentMonth.toString().padStart(2, '0')}</span>
        <span>{missions.filter(m => m.status === 'active').length} ACTIVE</span>
      </div>
      
      <div className="space-y-2">
        {missions.length === 0 ? (
          <p className="font-mono text-xs text-zinc-600 text-center py-4">
            NO ACTIVE MISSIONS
          </p>
        ) : (
          missions.map(m => (
            <div
              key={m.id}
              className="flex items-center gap-3 p-2 bg-zinc-900/40 border border-zinc-800/30 rounded"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${
                m.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-600'
              }`} />
              <span className="font-mono text-xs text-zinc-300 flex-1 truncate">
                {m.title}
              </span>
              <span className={`font-mono text-[10px] uppercase ${getPriorityColor(m.priority)}`}>
                {m.priority}
              </span>
            </div>
          ))
        )}
      </div>
      
      <div className="pt-2 border-t border-zinc-800/30">
        <div className="flex items-center justify-between text-xs font-mono text-zinc-600">
          <span>SYSTEM READY</span>
          <span className="text-emerald-500">● ONLINE</span>
        </div>
      </div>
    </div>
  );
}