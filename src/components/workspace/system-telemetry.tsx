'use client';

import { useState, useEffect, useRef } from 'react';
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
  const lastUpdateRef = useRef(Date.now());
  const [freshness, setFreshness] = useState('now');
  
  useEffect(() => {
    lastUpdateRef.current = Date.now();
    setFreshness('now');
  }, [
    context.operationalPressure, context.streakStatus, context.backlogPressure,
    context.mentorUrgency, context.missionLoad, context.readinessLevel,
    context.platforms?.length, context.researchPatterns?.length,
    logsCount, ctfCount,
  ]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      }));

      const elapsed = Math.floor((Date.now() - lastUpdateRef.current) / 1000);
      if (elapsed < 5) {
        setFreshness('now');
      } else if (elapsed < 60) {
        setFreshness(`${elapsed}s ago`);
      } else {
        setFreshness(`${Math.floor(elapsed / 60)}m ago`);
      }
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
        return { text: 'SATURATED', color: 'text-red-400', glow: 'bg-red-500' };
      case 'high':
        return { text: 'ELEVATED', color: 'text-amber-400', glow: 'bg-amber-500' };
      case 'medium':
        return { text: 'STEADY', color: 'text-zinc-400', glow: 'bg-zinc-500' };
      default:
        return { text: 'NOMINAL', color: 'text-emerald-400', glow: 'bg-emerald-500' };
    }
  };

  const status = getSystemStatus();

  return (
    <div className="space-y-3">
      {/* System Time */}
      <div className="flex items-center justify-between p-3 bg-zinc-900/30 border border-zinc-800/20 rounded">
        <div>
          <p className="font-mono text-[10px] text-zinc-600 uppercase">System Time</p>
          <p className="font-mono text-xl text-zinc-200 tracking-widest">{time}</p>
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
          <p className="font-mono text-[9px] text-zinc-600 uppercase">Continuity</p>
        </div>
        <div className="p-2 bg-zinc-900/20 border border-zinc-800/10 rounded text-center">
          <p className="font-mono text-xl text-zinc-200">{tasksCompleted}/{tasksTotal}</p>
          <p className="font-mono text-[9px] text-zinc-600 uppercase">Ops</p>
        </div>
        <div className="p-2 bg-zinc-900/20 border border-zinc-800/10 rounded text-center">
          <p className="font-mono text-xl text-amber-400">{logsCount}</p>
          <p className="font-mono text-[9px] text-zinc-600 uppercase">Sessions</p>
        </div>
        <div className="p-2 bg-zinc-900/20 border border-zinc-800/10 rounded text-center">
          <p className="font-mono text-xl text-red-400">{ctfCount}</p>
          <p className="font-mono text-[9px] text-zinc-600 uppercase">Security</p>
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
            <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${status.glow}`}></span>
          </span>
          <span className="text-zinc-500">ERA-OS</span>
          <span className="text-zinc-700">v0.1.0</span>
          <span className="text-zinc-700">•</span>
          <span className={status.color}>{status.text}</span>
          <span className="text-zinc-700">•</span>
          <span className="text-zinc-600">{freshness}</span>
        </div>
      </div>

      {/* Orchestration Telemetry */}
      {context.orchestration?.pacingProfile && (
        <div className="pt-1.5 border-t border-zinc-800/20">
          <div className="flex items-center gap-2 text-[9px] font-mono">
            <span className="text-zinc-600">pace</span>
            <span className={`${
              context.orchestration.pacingProfile === 'acceleration' ? 'text-emerald-500/50' :
              context.orchestration.pacingProfile === 'stabilization' ? 'text-amber-500/50' :
              context.orchestration.pacingProfile === 'consolidation' ? 'text-zinc-500' :
              context.orchestration.pacingProfile === 'recovery' ? 'text-blue-500/50' :
              'text-zinc-600'
            }`}>
              {context.orchestration.pacingProfile.slice(0, 4).toUpperCase()}
            </span>
            <span className="text-zinc-700">|</span>
            <span className="text-zinc-600">cadence</span>
            <span className="text-zinc-500">{context.orchestration.cadence.interactionCadence}</span>
            <span className="text-zinc-700">/</span>
            <span className="text-zinc-500">{context.orchestration.cadence.environmentalPacing}</span>
          </div>
        </div>
      )}

      {context.orchestration?.driftIndicators && context.orchestration.driftIndicators.some(d => d.detected) && (
        <div className="pt-1.5 border-t border-zinc-800/20">
          <div className="flex items-center gap-1.5 text-[9px] font-mono flex-wrap">
            <span className="text-zinc-600">drift</span>
            {context.orchestration.driftIndicators.filter(d => d.detected && d.severity > 20).slice(0, 3).map(d => (
              <span key={d.type} className={`${
                d.severity > 60 ? 'text-red-500/50' : d.severity > 30 ? 'text-amber-500/50' : 'text-amber-500/30'
              }`}>
                {d.type === 'roadmap_drift' ? 'rd' : d.type === 'campaign_neglect' ? 'cn' : d.type === 'pacing_instability' ? 'pi' : d.type === 'overload_accumulation' ? 'oa' : 'cc'}
                {d.severity}
              </span>
            ))}
          </div>
        </div>
      )}

      {context.orchestration?.strategicMemory && (
        <div className="pt-1.5 border-t border-zinc-800/20">
          <div className="flex items-center gap-1.5 text-[8px] font-mono">
            <span className="text-zinc-700">mem</span>
            <span className="text-zinc-600">
              {context.orchestration.strategicMemory.pacingHistory.length}pc
            </span>
            <span className="text-zinc-700">/</span>
            <span className="text-zinc-600">
              {context.orchestration.strategicMemory.campaignCompletions.length}cm
            </span>
            <span className="text-zinc-700">/</span>
            <span className="text-zinc-600">
              {context.orchestration.strategicMemory.overloadCycleCount}ol
            </span>
            <span className="text-zinc-700">/</span>
            <span className={context.orchestration.strategicMemory.sustainableExecutionDays > 3 ? 'text-emerald-500/40' : 'text-zinc-600'}>
              {context.orchestration.strategicMemory.sustainableExecutionDays}d
            </span>
            {context.orchestration.evolution && (
              <>
                <span className="text-zinc-700">|</span>
                <span className="text-zinc-600">
                  {context.orchestration.evolution.environment.level.slice(0, 4)}
                </span>
                <span className="text-zinc-700">/</span>
                <span className={`${
                  context.orchestration.evolution.temperament.temperament === 'momentum_oriented' ? 'text-emerald-500/40' :
                  context.orchestration.evolution.temperament.temperament === 'recovery_oriented' ? 'text-blue-500/40' :
                  context.orchestration.evolution.temperament.temperament === 'stabilization_focused' ? 'text-amber-500/40' :
                  context.orchestration.evolution.temperament.temperament === 'consolidation_oriented' ? 'text-zinc-500' :
                  'text-zinc-600'
                }`}>
                  {context.orchestration.evolution.temperament.temperament === 'momentum_oriented' ? 'mo' :
                   context.orchestration.evolution.temperament.temperament === 'recovery_oriented' ? 'ro' :
                   context.orchestration.evolution.temperament.temperament === 'stabilization_focused' ? 'sf' :
                   context.orchestration.evolution.temperament.temperament === 'consolidation_oriented' ? 'co' :
                   'ad'}
                </span>
                {context.orchestration.evolution.operationalResidue > 50 && (
                  <span className="text-zinc-700">{context.orchestration.evolution.operationalResidue}r</span>
                )}
                {context.orchestration.evolution.scarTissue.isHardened && (
                  <span className="text-zinc-600">•</span>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {context.researchPatterns && context.researchPatterns.length > 0 && (
        <div className="pt-1.5 border-t border-zinc-800/20">
          <div className="flex items-center gap-1.5 text-[8px] font-mono">
            <span className="text-zinc-700">ops</span>
            <span className="text-zinc-600">{context.operationEvidence?.length || 0}ev</span>
            <span className="text-zinc-700">/</span>
            <span className="text-zinc-600">{context.platforms?.length || 0}pf</span>
            <span className="text-zinc-700">/</span>
            <span className="text-zinc-600">{context.researchPatterns.length}pt</span>
            {context.investigativeMemoryContent && context.investigativeMemoryContent.unresolvedFindings.length > 0 && (
              <>
                <span className="text-zinc-700">/</span>
                <span className="text-amber-500/40">{context.investigativeMemoryContent.unresolvedFindings.length}un</span>
              </>
            )}
            {context.knowledgeCrystallization && (
              <>
                <span className="text-zinc-700">/</span>
                <span className="text-zinc-600">{context.knowledgeCrystallization.crystallizationIndex}kc</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}