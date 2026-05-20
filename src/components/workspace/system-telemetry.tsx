'use client';

import { useState, useEffect } from 'react';
import { useWorkspaceState } from './workspace-state';

interface TelemetryProps {
  streakCurrent?: number;
  tasksTotal?: number;
  tasksCompleted?: number;
  logsCount?: number;
  ctfCount?: number;
}

export function SystemTelemetry({ 
  streakCurrent = 0,
  tasksTotal = 0,
  tasksCompleted = 0,
  logsCount = 0,
  ctfCount = 0
}: TelemetryProps) {
  const { context, data } = useWorkspaceState();
  const { operationalPressure, streakStatus, backlogPressure, mentorUrgency, missionLoad, readinessLevel } = context;
  
  const [time, setTime] = useState<string>('--:--:--');
  const [uptime, setUptime] = useState(0);
  
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      }));
    };
    
    updateTime();
    const timeInterval = setInterval(updateTime, 1000);
    
    setUptime(Math.floor(Math.random() * 3600) + 1800);
    
    return () => clearInterval(timeInterval);
  }, []);
  
  const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  };

  const getSystemStatus = () => {
    switch (operationalPressure) {
      case 'critical':
        return { text: 'STRESSED', color: 'text-red-400', glow: 'bg-red-500' };
      case 'high':
        return { text: 'ACTIVE', color: 'text-amber-400', glow: 'bg-amber-500' };
      case 'medium':
        return { text: 'NOMINAL', color: 'text-zinc-400', glow: 'bg-zinc-500' };
      default:
        return { text: 'OPTIMAL', color: 'text-emerald-400', glow: 'bg-emerald-500' };
    }
  };

  const status = getSystemStatus();

  return (
    <div className="space-y-3">
      {/* System Clock */}
      <div className="flex items-center justify-between p-3 bg-zinc-900/30 border border-zinc-800/20 rounded">
        <div>
          <p className="font-mono text-[10px] text-zinc-600 uppercase">System Clock</p>
          <p className="font-mono text-xl text-zinc-200 tracking-widest font-mono">{time}</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-[10px] text-zinc-600 uppercase">Uptime</p>
          <p className="font-mono text-sm text-zinc-400">{formatUptime(uptime)}</p>
        </div>
      </div>

      {/* Telemetry Grid - Real Data */}
      <div className="grid grid-cols-2 gap-2">
        <div className={`p-2 border rounded text-center ${
          streakStatus === 'cold' 
            ? 'bg-red-950/20 border-red-900/30' 
            : streakStatus === 'hot'
              ? 'bg-amber-950/20 border-amber-900/30'
              : 'bg-zinc-900/20 border-zinc-800/10'
        }`}>
          <p className={`font-mono text-xl ${
            streakStatus === 'hot' ? 'text-amber-400' :
            streakStatus === 'cold' ? 'text-red-400' :
            'text-emerald-400'
          }`}>{streakCurrent}</p>
          <p className="font-mono text-[9px] text-zinc-600 uppercase">Streak</p>
        </div>
        <div className="p-2 bg-zinc-900/20 border border-zinc-800/10 rounded text-center">
          <p className="font-mono text-xl text-zinc-200">{tasksCompleted}/{tasksTotal}</p>
          <p className="font-mono text-[9px] text-zinc-600 uppercase">Tasks</p>
        </div>
        <div className="p-2 bg-zinc-900/20 border border-zinc-800/10 rounded text-center">
          <p className="font-mono text-xl text-amber-400">{logsCount}</p>
          <p className="font-mono text-[9px] text-zinc-600 uppercase">Logs</p>
        </div>
        <div className="p-2 bg-zinc-900/20 border border-zinc-800/10 rounded text-center">
          <p className="font-mono text-xl text-red-400">{ctfCount}</p>
          <p className="font-mono text-[9px] text-zinc-600 uppercase">CTFs</p>
        </div>
      </div>

      {/* System Status */}
      <div className="pt-2 border-t border-zinc-800/20">
        <div className="flex items-center justify-between text-[10px]">
          <span className="font-mono text-zinc-600">STATUS</span>
          <span className={`font-mono ${status.color}`}>{status.text}</span>
        </div>
        <div className="mt-2 flex items-center gap-2 text-[10px]">
          <span className="font-mono text-zinc-600">PRESSURE</span>
          <div className="flex-1 h-1 bg-zinc-800/30 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${
                operationalPressure === 'critical' ? 'bg-red-500' :
                operationalPressure === 'high' ? 'bg-amber-500' :
                operationalPressure === 'medium' ? 'bg-zinc-500' :
                'bg-emerald-500'
              }`}
              style={{ width: `${backlogPressure}%` }}
            />
          </div>
        </div>
      </div>

      {/* Status Line */}
      <div className="pt-2 border-t border-zinc-800/20">
        <div className="flex items-center gap-2 text-[10px] font-mono">
          <span className={`relative flex h-1.5 w-1.5`}>
            <span className={`absolute inline-flex h-full w-full rounded-full ${status.glow} opacity-50 ${
              operationalPressure === 'critical' ? 'animate-ping' : ''
            }`}></span>
            <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${status.glow}`}></span>
          </span>
          <span className="text-zinc-500">ERA-OS</span>
          <span className="text-zinc-700">v0.1.0</span>
          <span className="text-zinc-700">•</span>
          <span className={status.color}>{status.text}</span>
        </div>
      </div>
    </div>
  );
}