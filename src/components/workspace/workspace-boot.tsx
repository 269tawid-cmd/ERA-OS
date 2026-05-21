'use client';

import { useState, useEffect } from 'react';

interface BootSequenceProps {
  onComplete: () => void;
}

const BOOT_STEPS = [
  { text: 'ERA-OS v0.1.0', delay: 0 },
  { text: 'Initializing workspace...', delay: 400 },
  { text: 'Loading mission subsystems...', delay: 900 },
  { text: 'Connecting mentor interface...', delay: 1400 },
  { text: 'Syncing roadmap telemetry...', delay: 1900 },
  { text: 'System ready.', delay: 2400 },
];

export function BootSequence({ onComplete }: BootSequenceProps) {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep >= BOOT_STEPS.length) {
      setTimeout(onComplete, 500);
      return;
    }

    const timer = setTimeout(() => {
      setVisibleLines(prev => [...prev, currentStep]);
      setCurrentStep(prev => prev + 1);
    }, BOOT_STEPS[currentStep].delay);

    return () => clearTimeout(timer);
  }, [currentStep, onComplete]);

  if (visibleLines.length >= BOOT_STEPS.length) {
    return (
      <div className="fixed inset-0 z-50 bg-zinc-950 flex items-center justify-center">
        <div className="font-mono text-sm text-zinc-500 animate-fade-out">
          <span className="text-emerald-500">●</span> OPERATIONAL
        </div>
        <style>{`
          @keyframes fade-out {
            0% { opacity: 1; }
            100% { opacity: 0; }
          }
          .animate-fade-out {
            animation: fade-out 0.5s ease-out forwards;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950 flex items-center justify-center">
      <div className="w-80 space-y-1">
        {BOOT_STEPS.map((step, i) => (
          <div
            key={i}
            className={`
              font-mono text-xs transition-all duration-300
              ${visibleLines.includes(i) 
                ? 'text-zinc-400 opacity-100' 
                : 'text-zinc-800 opacity-0'}
            `}
          >
            <span className="text-zinc-600 mr-2">
              [{String(i + 1).padStart(2, '0')}]
            </span>
            {step.text}
          </div>
        ))}
        
        <div className="mt-4 h-px bg-zinc-800">
          <div 
            className="h-full bg-zinc-600 transition-all duration-100"
            style={{ 
              width: `${((currentStep + 1) / BOOT_STEPS.length) * 100}%` 
            }} 
          />
        </div>
      </div>
    </div>
  );
}