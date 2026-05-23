'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useWorkspaceState } from './workspace-state';
import { SUBSYSTEM_IDENTITY } from '@/lib/constants/operational-language';

type DepthLevel = 0 | 1 | 2;

interface Position {
  x: number;
  y: number;
}

function clampViewport(x: number, y: number, pw = 340, ph = 140): Position {
  const mw = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const mh = typeof window !== 'undefined' ? window.innerHeight : 800;
  return {
    x: Math.max(0, Math.min(x, Math.max(0, mw - pw))),
    y: Math.max(0, Math.min(y, Math.max(0, mh - ph))),
  };
}

interface FloatingPanelProps {
  id: string;
  title: string;
  icon?: string;
  initialPosition?: Position;
  children: React.ReactNode;
  className?: string;
  isActive?: boolean;
  depth?: DepthLevel;
}

const DEPTH_CONFIG: Record<DepthLevel, {
  glass: string;
  glassActive: Record<string, string>;
  glassDrag: string;
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
    glassDrag: 'from-zinc-950/75 to-zinc-950/70',
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
    glassDrag: 'from-zinc-950/65 to-zinc-950/60',
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
    glassDrag: 'from-zinc-950/50 to-zinc-950/45',
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
  initialPosition,
  children,
  className = '',
  isActive = false,
  depth = 1,
}: FloatingPanelProps) {
  const { state, updatePanelPosition, bringToFront, context } = useWorkspaceState();
  const panelState = state.panels.find(p => p.id === id);
  
  const initPos = panelState?.x !== undefined 
    ? { x: panelState.x, y: panelState.y }
    : initialPosition || { x: 0, y: 0 };
  const [localPosition, setLocalPosition] = useState<Position>(clampViewport(initPos.x, initPos.y));
  const positionRef = useRef(localPosition);
  positionRef.current = localPosition;

  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const offsetRef = useRef<Position>({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(true);

  const isFocused = state.focusedPanelId === id;
  const zIndex = panelState?.zIndex || 1;

  const { environmentTone } = context;

  const subsystem = SUBSYSTEM_IDENTITY.find(s => s.label === id);
  const displayGlyph = isFocused
    ? (subsystem?.stateMarkers.focused || '◆')
    : isActive
      ? (subsystem?.stateMarkers.active || '◐')
      : (subsystem?.stateMarkers.idle || '○');

  useEffect(() => {
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    if (panelState && !isDragging) {
      setLocalPosition({ x: panelState.x, y: panelState.y });
    }
  }, [panelState?.x, panelState?.y, isDragging]);

  const handleDragStart = useCallback((clientX: number, clientY: number) => {
    if (!mountedRef.current) return;
    bringToFront(id);
    setIsDragging(true);
    offsetRef.current = {
      x: clientX - positionRef.current.x,
      y: clientY - positionRef.current.y,
    };
  }, [id, bringToFront]);

  const handleDragMove = useCallback((clientX: number, clientY: number) => {
    const newX = clientX - offsetRef.current.x;
    const newY = clientY - offsetRef.current.y;
    if (!isFinite(newX) || !isFinite(newY)) return;
    setLocalPosition(clampViewport(newX, newY));
  }, []);

  const handleDragEnd = useCallback(() => {
    if (!mountedRef.current) return;
    const pos = positionRef.current;
    if (isDragging) {
      updatePanelPosition(id, pos.x, pos.y);
    }
    setIsDragging(false);
  }, [isDragging, id, updatePanelPosition]);

  useEffect(() => {
    if (!isDragging) return;

    const onMouseMove = (e: MouseEvent) => handleDragMove(e.clientX, e.clientY);
    const onMouseUp = () => handleDragEnd();

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  useEffect(() => {
    if (!isDragging) return;

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const onTouchEnd = () => handleDragEnd();

    document.addEventListener('touchmove', onTouchMove, { passive: true });
    document.addEventListener('touchend', onTouchEnd);

    return () => {
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();
    handleDragStart(e.clientX, e.clientY);
  }, [handleDragStart]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, [handleDragStart]);

  if (panelState?.isOpen === false) return null;

  const cfg = DEPTH_CONFIG[depth];

  const getGlassBg = () => {
    if (isDragging) return cfg.glassDrag;
    if (isActive) return cfg.glassActive[environmentTone] || cfg.glassActive.default;
    return cfg.glass;
  };

  const getEdgeGlow = (): React.CSSProperties => {
    const active = isActive || isFocused;
    const tone = environmentTone;

    const toneColor = active
      ? tone === 'critical' ? 'rgba(220,50,50,' :
        tone === 'tense' ? 'rgba(200,120,30,' :
        tone === 'calm' ? 'rgba(50,180,120,' :
        'rgba(100,120,160,'
      : 'rgba(100,120,160,';

    const gf = cfg.glowFactor;
    const oc = cfg.occlusion;

    if (isDragging) {
      return {
        boxShadow: [
          `-1px -1px 8px rgba(255,255,255,0.025)`,
          `1px 1px 4px rgba(0,0,0,0.12)`,
          `0 0 20px ${toneColor}${0.2 * gf})`,
          `0 15px 55px rgba(0,0,0,${oc + 0.15})`,
        ].join(', '),
      };
    }
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
      ref={panelRef}
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
        ${isDragging ? 'z-[100]' : ''}
        ${className}
      `}
      style={{
        left: localPosition.x,
        top: localPosition.y,
        minWidth: depth === 0 ? '340px' : '320px',
        maxWidth: '420px',
        zIndex,
        transform: cfg.translateZ,
        ...edgeGlow,
      }}
    >
      {/* Directional environmental reflection — stronger on upper-left */}
      <div className="absolute inset-0 rounded-sm pointer-events-none" style={{
        background: `linear-gradient(135deg, rgba(255,255,255,${cfg.reflectionOpacity}) 0%, transparent 45%, transparent 65%, rgba(255,255,255,${cfg.reflectionOpacity * 0.35}) 100%)`,
        mixBlendMode: 'overlay',
      }} />
      {/* Subtle edge rim — thinner for recessed panels */}
      <div className="absolute inset-0 rounded-sm pointer-events-none" style={{
        border: `1px solid rgba(255,255,255,${cfg.borderOpacity})`,
      }} />

      <div
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className={`
          panel-header
          flex items-center gap-2
          px-3 py-2
          border-b
          cursor-grab
          ${isDragging ? 'cursor-grabbing' : ''}
        `}
        style={{ borderColor: `rgba(255,255,255,${cfg.borderOpacity * 0.7})` }}
      >
        {icon && (
          <span className={`text-xs ${
            isFocused || isActive ? 'text-zinc-300' : 'text-zinc-600'
          }`}>
            {displayGlyph}
          </span>
        )}
        <span className={`font-mono text-[10px] tracking-wider flex-1 ${
          isActive || isFocused ? 'text-zinc-300' : 'text-zinc-500'
        }`}>
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
