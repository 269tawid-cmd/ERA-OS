'use client';

import { useState, useEffect, useRef } from 'react';
import { SUBSYSTEM_IDENTITY } from '@/lib/constants/operational-language';

interface BootSequenceProps {
  onComplete: () => void;
  isReturnVisit?: boolean;
}

type Stage = 'init' | 'systemCheck' | 'subsystems' | 'handshake' | 'environ' | 'operational' | 'fade_out';

type SubState = 'hidden' | 'loading' | 'ready';

export function BootSequence({ onComplete, isReturnVisit = false }: BootSequenceProps) {
  const [stage, setStage] = useState<Stage>('init');
  const [subStates, setSubStates] = useState<SubState[]>(
    SUBSYSTEM_IDENTITY.map(() => 'hidden')
  );
  const [envOpacity, setEnvOpacity] = useState(0);
  const [readyItems, setReadyItems] = useState<Set<number>>(new Set());
  const [handshakeLines, setHandshakeLines] = useState<string[]>([]);
  const [showContinuityNotice, setShowContinuityNotice] = useState(false);
  const rafRef = useRef<number>(0);
  const envFadeStart = useRef(0);

  const SYSTEM_LINES = isReturnVisit
    ? SUBSYSTEM_IDENTITY.map(s => s.bootMessage)
    : SUBSYSTEM_IDENTITY.map(s => `Initializing ${s.name.toLowerCase()}`);

  const HANDSHAKE_LINES = [
    `MISSION-SYS-01 ◇ link established`,
    `MENTOR-SYS-02 ○ interface synchronized`,
    `ROADMAP-SYS-03 ◈ data feed active`,
    `TELEM-SYS-04 ● telemetry nominal`,
  ];

  /* ── Stage progression ── */
  useEffect(() => {
    if (stage === 'init') {
      const t1 = setTimeout(() => setStage('systemCheck'), isReturnVisit ? 300 : 600);
      return () => clearTimeout(t1);
    }
    if (stage === 'systemCheck') {
      const t2 = setTimeout(() => setStage('subsystems'), isReturnVisit ? 600 : 1000);
      return () => clearTimeout(t2);
    }
    if (stage === 'subsystems') {
      const totalDelay = 150 + SUBSYSTEM_IDENTITY.length * 250 + 400;
      const t3 = setTimeout(() => {
        setStage('handshake');
      }, totalDelay + 200);
      return () => clearTimeout(t3);
    }
    if (stage === 'handshake') {
      const t4 = setTimeout(() => {
        setStage('environ');
        envFadeStart.current = Date.now();
      }, 1800);
      return () => clearTimeout(t4);
    }
    if (stage === 'environ') {
      const t5 = setTimeout(() => setStage('operational'), isReturnVisit ? 800 : 1500);
      return () => clearTimeout(t5);
    }
    if (stage === 'operational') {
      const t6 = setTimeout(() => setStage('fade_out'), isReturnVisit ? 600 : 1200);
      return () => clearTimeout(t6);
    }
    if (stage === 'fade_out') {
      const t7 = setTimeout(onComplete, isReturnVisit ? 400 : 600);
      return () => clearTimeout(t7);
    }
  }, [stage, onComplete, isReturnVisit]);

  /* ── Subsystem staggered reveal ── */
  useEffect(() => {
    if (stage !== 'subsystems') return;

    const timers: ReturnType<typeof setTimeout>[] = [];

    SUBSYSTEM_IDENTITY.forEach((_, i) => {
      timers.push(
        setTimeout(() => {
          setSubStates(prev => {
            const next = [...prev];
            next[i] = 'loading';
            return next;
          });
        }, 150 + i * 250)
      );
    });

    const readyDelays = [350, 300, 320, 280];
    readyDelays.forEach((delay, i) => {
      timers.push(
        setTimeout(() => {
          setReadyItems(prev => new Set(prev).add(i));
          setSubStates(prev => {
            const next = [...prev];
            next[i] = 'ready';
            return next;
          });
        }, 150 + i * 250 + delay)
      );
    });

    return () => timers.forEach(clearTimeout);
  }, [stage]);

  /* ── Handshake reveal ── */
  useEffect(() => {
    if (stage !== 'handshake') return;

    if (isReturnVisit) {
      setHandshakeLines(HANDSHAKE_LINES.slice(0, 2));
      setShowContinuityNotice(true);
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];
    HANDSHAKE_LINES.forEach((line, i) => {
      timers.push(
        setTimeout(() => {
          setHandshakeLines(prev => [...prev, line]);
        }, 200 + i * 350)
      );
    });

    return () => timers.forEach(clearTimeout);
  }, [stage, isReturnVisit]);

  /* ── Environment fade-in (RAF for smoothness) ── */
  useEffect(() => {
    if (stage !== 'environ' && stage !== 'operational' && stage !== 'fade_out') return;

    let running = true;
    const animate = () => {
      if (!running) return;
      const elapsed = Date.now() - envFadeStart.current;
      const target = Math.min(1, elapsed / 1200);
      setEnvOpacity(target);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [stage]);

  /* ── Cleanup ── */
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const showContent = stage !== 'init' && stage !== 'systemCheck';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{
        background: stage === 'fade_out'
          ? 'rgba(5,5,5,0)'
          : `rgba(5,5,5,${stage === 'operational' ? 1 - envOpacity * 0.5 : 1})`,
        transition: stage === 'fade_out' ? 'background 0.6s ease-out' : 'none',
      }}
    >
      {/* Environment reveal layer */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: stage === 'init' || stage === 'systemCheck' || stage === 'subsystems' ? 0 : envOpacity,
          background: `
            radial-gradient(ellipse 100% 60% at 50% 70%, rgba(40,80,180,0.06) 0%, transparent 100%),
            linear-gradient(to bottom, rgba(5,5,15,1) 0%, rgba(5,5,13,0.95) 40%, rgba(4,4,10,0.9) 100%)
          `,
          transition: 'opacity 0.3s ease-out',
        }}
      />

      {/* Subdued atmosphere hint */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: stage === 'subsystems' ? envOpacity * 0.3 : stage === 'environ' || stage === 'operational' ? envOpacity * 0.6 : 0,
          background: `
            radial-gradient(ellipse 70% 12% at 50% 75%, rgba(10,20,50,0.04) 0%, transparent 100%),
            radial-gradient(ellipse 50% 8% at 50% 80%, rgba(15,25,60,0.03) 0%, transparent 100%)
          `,
          transition: 'opacity 0.5s ease-out',
        }}
      />

      {/* ── Boot Content ── */}
      <div className="relative w-[400px] max-w-[85vw]">
        {/* Stage: System text (init + systemCheck) */}
        {!showContent ? (
          <div
            className="text-center"
            style={{
              opacity: stage === 'init' ? 0 : 1,
              transform: stage === 'init' ? 'translateY(-10px)' : 'none',
              transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
            }}
          >
            <div className="font-mono text-sm text-zinc-400 tracking-[0.3em] uppercase">
              ERA-OS
            </div>
            {stage === 'systemCheck' && (
              <div className="mt-4 space-y-1">
                <div className="font-mono text-[11px] text-zinc-600 flex items-center justify-center gap-2">
                  <span className="animate-pulse">.</span>
                  <span>Running system integrity check</span>
                  <span className="animate-pulse" style={{ animationDelay: '0.3s' }}>.</span>
                  <span className="animate-pulse" style={{ animationDelay: '0.6s' }}>.</span>
                </div>
                {isReturnVisit && (
                  <div className="font-mono text-[10px] text-zinc-700 mt-2">
                    Session continuity detected — fast boot
                  </div>
                )}
              </div>
            )}
          </div>
        ) : null}

        {/* Stage: Subsystem initialization + Handshake + Environment + Operational */}
        {showContent ? (
          <div
            className="space-y-[3px]"
            style={{
              opacity: stage === 'fade_out' ? 0 : 1,
              transition: 'opacity 0.4s ease-out',
            }}
          >
            {/* Subsystem initialization lines */}
            {stage === 'subsystems' && SYSTEM_LINES.map((msg, i) => (
              <div
                key={SUBSYSTEM_IDENTITY[i].id}
                className="font-mono text-[11px] flex items-center gap-3 leading-6"
                style={{
                  opacity: subStates[i] === 'hidden' ? 0 : 1,
                  transform: subStates[i] === 'hidden' ? 'translateY(4px)' : 'none',
                  transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
                }}
              >
                <span
                  className="w-[14px] text-center shrink-0"
                  style={{
                    opacity: readyItems.has(i) ? 1 : 0.6,
                    color: readyItems.has(i)
                      ? 'rgb(52 211 153)'
                      : 'rgb(113 113 122)',
                    transition: 'opacity 0.15s ease, color 0.15s ease',
                  }}
                >
                  {readyItems.has(i) ? '\u2713' : '\u25CB'}
                </span>

                <span
                  className="text-zinc-400"
                  style={{
                    opacity: readyItems.has(i) ? 0.7 : 1,
                    transition: 'opacity 0.2s ease',
                  }}
                >
                  {msg}
                </span>

                {subStates[i] === 'loading' && !readyItems.has(i) ? (
                  <span className="text-zinc-600">
                    <span className="animate-pulse">.</span>
                    <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>.</span>
                    <span className="animate-pulse" style={{ animationDelay: '0.4s' }}>.</span>
                  </span>
                ) : null}

                {readyItems.has(i) ? (
                  <span className="text-[9px] text-emerald-700/50 tracking-wider ml-auto">
                    [{SUBSYSTEM_IDENTITY[i].operationalSignature}]
                  </span>
                ) : null}
              </div>
            ))}

            {/* Handshake — operational link verification */}
            {(stage === 'handshake' || stage === 'environ' || stage === 'operational') && (
              <div className="mt-6 pt-4 border-t border-zinc-800/30 space-y-2">
                {isReturnVisit && showContinuityNotice && (
                  <div className="font-mono text-[10px] text-zinc-600 text-center mb-3 tracking-wider">
                    ── Session continuity verified ──
                  </div>
                )}
                <div className="font-mono text-[10px] text-zinc-600 tracking-wider mb-2 flex items-center gap-2">
                  <span className="text-zinc-700">{'<'}</span>
                  <span>Subsystem handshake</span>
                  <span className="text-zinc-700">{'/>'}</span>
                </div>
                {HANDSHAKE_LINES.map((line, i) => (
                  <div
                    key={i}
                    className="font-mono text-[10px] flex items-center gap-2 leading-5"
                    style={{
                      opacity: handshakeLines.includes(line) ? 0.6 : 0,
                      transition: 'opacity 0.3s ease-out',
                    }}
                  >
                    <span className="text-emerald-600/60">{'>'}</span>
                    <span className="text-zinc-500">{line}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Progress bar */}
            {(stage === 'subsystems' || stage === 'handshake' || stage === 'environ') ? (
              <div
                className="mt-8 h-px relative overflow-hidden"
                style={{
                  opacity: stage === 'environ' || stage === 'handshake' ? Math.max(0.2, 1 - envOpacity * 0.5) : 1,
                  transition: 'opacity 0.4s ease',
                }}
              >
                <div className="absolute inset-0 bg-zinc-800" />
                <div
                  className="absolute inset-y-0 left-0 bg-zinc-500 transition-all duration-300"
                  style={{
                    width: stage === 'environ' ? '100%' : stage === 'handshake' ? '85%' : `${
                      readyItems.size > 0
                        ? Math.max(5, (readyItems.size / SUBSYSTEM_IDENTITY.length) * 60)
                        : 5
                    }%`,
                  }}
                />
              </div>
            ) : null}

            {/* Operational state */}
            {stage === 'operational' || stage === 'fade_out' ? (
              <div
                className="text-center"
                style={{
                  opacity: stage === 'fade_out' ? 0 : 1,
                  transform: stage === 'fade_out' ? 'translateY(-6px)' : 'none',
                  transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
                }}
              >
                <div className="font-mono text-xs text-zinc-500 tracking-[0.25em] uppercase flex items-center justify-center gap-3">
                  <span
                    className="w-[6px] h-[6px] rounded-full bg-emerald-500"
                    style={{
                      boxShadow: '0 0 12px rgba(52,211,153,0.4)',
                    }}
                  />
                  OPERATIONAL
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
