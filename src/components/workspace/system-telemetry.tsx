'use client';

import { useState, useEffect } from 'react';

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
  const [time, setTime] = useState<string>('');
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
    const interval = setInterval(updateTime, 1000);
    setUptime(Math.floor(Math.random() * 3600) + 1800);
    
    return () => clearInterval(interval);
  }, []);
  
  const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between p-3 bg-zinc-900/40 border border-zinc-800/30 rounded">
        <div>
          <p className="font-mono text-[10px] text-zinc-600 uppercase">System Time</p>
          <p className="font-mono text-lg text-zinc-200 tracking-widest">{time}</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-[10px] text-zinc-600 uppercase">Uptime</p>
          <p className="font-mono text-sm text-zinc-400">{formatUptime(uptime)}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <div className="p-2 bg-zinc-900/30 border border-zinc-800/20 rounded text-center">
          <p className="font-mono text-xl text-emerald-400">{streakCurrent}</p>
          <p className="font-mono text-[10px] text-zinc-600 uppercase">Streak</p>
        </div>
        <div className="p-2 bg-zinc-900/30 border border-zinc-800/20 rounded text-center">
          <p className="font-mono text-xl text-zinc-200">{tasksCompleted}/{tasksTotal}</p>
          <p className="font-mono text-[10px] text-zinc-600 uppercase">Tasks</p>
        </div>
        <div className="p-2 bg-zinc-900/30 border border-zinc-800/20 rounded text-center">
          <p className="font-mono text-xl text-amber-400">{logsCount}</p>
          <p className="font-mono text-[10px] text-zinc-600 uppercase">Logs</p>
        </div>
        <div className="p-2 bg-zinc-900/30 border border-zinc-800/20 rounded text-center">
          <p className="font-mono text-xl text-red-400">{ctfCount}</p>
          <p className="font-mono text-[10px] text-zinc-600 uppercase">CTFs</p>
        </div>
      </div>
      
      <div className="pt-2 border-t border-zinc-800/30">
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-zinc-500">ERA-OS v0.1.0</span>
          <span className="text-zinc-700">•</span>
          <span className="text-zinc-600">SECURE</span>
        </div>
      </div>
    </div>
  );
}