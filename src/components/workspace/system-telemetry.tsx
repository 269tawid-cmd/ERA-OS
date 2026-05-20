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
  const [time, setTime] = useState<string>('--:--:--');
  const [uptime, setUptime] = useState(0);
  const [cpuLoad, setCpuLoad] = useState(12);
  const [memory, setMemory] = useState(34);
  
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
    
    // Simulate subtle telemetry fluctuations
    const telemetryInterval = setInterval(() => {
      setCpuLoad(prev => Math.max(5, Math.min(25, prev + (Math.random() - 0.5) * 4)));
      setMemory(prev => Math.max(25, Math.min(45, prev + (Math.random() - 0.5) * 2)));
    }, 3000);
    
    return () => {
      clearInterval(timeInterval);
      clearInterval(telemetryInterval);
    };
  }, []);
  
  const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  };

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

      {/* Telemetry Grid */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-2 bg-zinc-900/20 border border-zinc-800/10 rounded text-center">
          <p className="font-mono text-xl text-emerald-400">{streakCurrent}</p>
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

      {/* System Resources */}
      <div className="space-y-2 pt-2 border-t border-zinc-800/20">
        <div className="flex items-center justify-between text-[10px]">
          <span className="font-mono text-zinc-600">CPU</span>
          <span className="font-mono text-zinc-500">{cpuLoad.toFixed(1)}%</span>
        </div>
        <div className="h-1 bg-zinc-800/30 rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-500/60 transition-all duration-1000"
            style={{ width: `${cpuLoad}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between text-[10px]">
          <span className="font-mono text-zinc-600">MEM</span>
          <span className="font-mono text-zinc-500">{memory.toFixed(1)}%</span>
        </div>
        <div className="h-1 bg-zinc-800/30 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500/60 transition-all duration-1000"
            style={{ width: `${memory}%` }}
          />
        </div>
      </div>

      {/* Status Line */}
      <div className="pt-2 border-t border-zinc-800/20">
        <div className="flex items-center gap-2 text-[10px] font-mono">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-50"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
          </span>
          <span className="text-zinc-500">ERA-OS</span>
          <span className="text-zinc-700">v0.1.0</span>
          <span className="text-zinc-700">•</span>
          <span className="text-emerald-600">SYSTEM NOMINAL</span>
        </div>
      </div>
    </div>
  );
}