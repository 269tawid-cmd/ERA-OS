'use client';

import { useState } from 'react';
import { useWorkspaceState } from './workspace-state';

export type DepthLevel = 0 | 1 | 2;

interface FloatingPanelProps {
  id: string;
  title: string;
  icon?: string;
  children: React.ReactNode;
  className?: string;
  isActive?: boolean;
  depth?: DepthLevel;
}

const DEPTH_CONFIG: Record<DepthLevel, {
  glass: string;
  glassActive: Record<string, string>;
  blur: string;
  glowFactor: number;
  occlusion: number;
  borderOpacity: number;
  reflectionOpacity: number;
  translateZ: string;
}> = {
  0: {
    glass: 'from-zinc-950/55 to-zinc-950/50',
    glassActive: {
      critical: 'from-red-950/45 to-zinc-950/40',
      tense: 'from-amber-950/40 to-zinc-950/35',
      calm: 'from-emerald-950/35 to-zinc-950/30',
      default: 'from-zinc-950/50 to-zinc-950/45',
    },
    blur: 'backdrop-blur-[8px]',
    glowFactor: 1.0,
    occlusion: 0.50,
    borderOpacity: 0.06,
    reflectionOpacity: 0.06,
    translateZ: 'translateZ(40px)',
  },
  1: {
    glass: 'from-zinc-950/40 to-zinc-950/35',
    glassActive: {
      critical: 'from-red-950/35 to-zinc-950/30',
      tense: 'from-amber-950/30 to-zinc-950/25',
      calm: 'from-emerald-950/25 to-zinc-950/20',
      default: 'from-zinc-950/35 to-zinc-950/30',
    },
    blur: 'backdrop-blur-[12px]',
    glowFactor: 0.65,
    occlusion: 0.30,
    borderOpacity: 0.04,
    reflectionOpacity: 0.04,
    translateZ: 'translateZ(0px)',
  },
  2: {
    glass: 'from-zinc-950/28 to-zinc-950/22',
    glassActive: {
      critical: 'from-red-950/25 to-zinc-950/20',
      tense: 'from-amber-950/20 to-zinc-950/15',
      calm: 'from-emerald-950/18 to-zinc-950/13',
      default: 'from-zinc-950/22 to-zinc-950/18',
    },
    blur: 'backdrop-blur-[16px]',
    glowFactor: 0.4,
    occlusion: 0.18,
    borderOpacity: 0.025,
    reflectionOpacity: 0.025,
    translateZ: 'translateZ(-30px)',
  },
};

export function FloatingPanel({
  id,
  title,
  icon,
  children,
  className = '',
  isActive = false,
  depth = 1,
}: FloatingPanelProps) {
  const { context } = useWorkspaceState();
  const { environmentTone } = context;

  const [isHovered, setIsHovered] = useState(false);

  /* Display glyph uses a subsystem identity if available */
  const displayGlyph = isActive ? '◐' : '○';

  if (false) return null; /* panel open/close handled by parent visibility */

  const cfg = DEPTH_CONFIG[depth];

  const getGlassBg = () => {
    if (isActive) return cfg.glassActive[environmentTone] || cfg.glassActive.default;
    return cfg.glass;
  };

  const getEdgeGlow = (): React.CSSProperties => {
    const active = isActive || isHovered;
    const tone = environmentTone;

    const toneColor = active
      ? tone === 'critical' ? 'rgba(220,50,50,' :
        tone === 'tense' ? 'rgba(200,120,30,' :
        tone === 'calm' ? 'rgba(50,180,120,' :
        'rgba(100,120,160,'
      : 'rgba(100,120,160,';

    const gf = cfg.glowFactor;
    const oc = cfg.occlusion;

    if (active) {
      return {
        boxShadow: [
          `-1px -1px 6px rgba(255,255,255,0.02)`,
          `1px 1px 3px rgba(0,0,0,0.08)`,
          `0 0 16px ${toneColor}${0.15 * gf})`,
          `0 12px 40px rgba(0,0,0,${oc})`,
        ].join(', '),
      };
    }
    return {
      boxShadow: [
        `-1px -1px 4px rgba(255,255,255,0.015)`,
        `0 0 10px ${toneColor}${0.04 * gf})`,
        `0 8px 30px rgba(0,0,0,${oc * 0.7})`,
      ].join(', '),
    };
  };

  const glassBg = getGlassBg();
  const edgeGlow = getEdgeGlow();

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        floating-panel
        absolute
        rounded-sm
        overflow-hidden
        select-none
        ${cfg.blur}
        bg-gradient-to-b ${glassBg}
        ${className}
      `}
      style={{
        transform: cfg.translateZ,
        ...edgeGlow,
      }}
    >
      {/* Directional environmental reflection — stronger on upper-left */}
      <div className="absolute inset-0 rounded-sm pointer-events-none" style={{
        background: `linear-gradient(135deg, rgba(255,255,255,${cfg.reflectionOpacity}) 0%, transparent 45%, transparent 65%, rgba(255,255,255,${cfg.reflectionOpacity * 0.35}) 100%)`,
        mixBlendMode: 'overlay',
      }} />
      {/* Edge rim */}
      <div className="absolute inset-0 rounded-sm pointer-events-none" style={{
        border: `1px solid rgba(255,255,255,${cfg.borderOpacity})`,
      }} />

      <div
        className={`
          panel-header
          flex items-center gap-2
          px-3 py-2
          border-b
        `}
        style={{ borderColor: `rgba(255,255,255,${cfg.borderOpacity * 0.7})` }}
      >
        {icon && (
          <span className={`text-xs ${isActive ? 'text-zinc-300' : 'text-zinc-600'}`}>
            {displayGlyph}
          </span>
        )}
        <span className={`font-mono text-[10px] tracking-wider flex-1 ${isActive ? 'text-zinc-300' : 'text-zinc-500'}`}>
          {title}
        </span>
        <div className={`w-[3px] h-[3px] ${isActive ? 'bg-zinc-400' : 'bg-zinc-700'}`} />
      </div>
      <div className="panel-content p-3 relative z-[1]">
        {children}
      </div>
    </div>
  );
}
