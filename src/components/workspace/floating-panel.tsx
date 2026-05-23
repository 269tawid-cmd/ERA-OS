'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useWorkspaceState } from './workspace-state';
import { SUBSYSTEM_IDENTITY } from '@/lib/constants/operational-language';

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
}

export function FloatingPanel({
  id,
  title,
  icon,
  initialPosition,
  children,
  className = '',
  isActive = false,
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

  /* ─── Dynamic subsystem insignia ─── */
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

  const getToneKey = () => {
    if (isActive || isFocused) return environmentTone;
    return 'default';
  };

  const getEdgeGlow = (): React.CSSProperties => {
    const tone = environmentTone;
    const active = isActive || isFocused;
    const color = active
      ? tone === 'critical' ? 'rgba(220,50,50,0.15)' :
        tone === 'tense' ? 'rgba(200,120,30,0.12)' :
        tone === 'calm' ? 'rgba(50,180,120,0.1)' :
        'rgba(100,120,160,0.1)'
      : 'rgba(100,120,160,0.04)';
    const dragColor = tone === 'critical' ? 'rgba(220,50,50,0.2)' :
      tone === 'tense' ? 'rgba(200,120,30,0.18)' :
      tone === 'calm' ? 'rgba(50,180,120,0.15)' :
      'rgba(100,120,160,0.15)';

    if (isDragging) {
      return {
        boxShadow: `0 0 20px ${dragColor}, 0 0 60px ${dragColor.replace('0.15', '0.06')}`, 
      };
    }
    if (active) {
      return {
        boxShadow: `0 0 12px ${color}, 0 0 40px ${color.replace('0.12', '0.04')}`,
      };
    }
    return {
      boxShadow: `0 0 8px ${color}`,
    };
  };

  const getGlassBg = () => {
    if (isDragging) return 'from-zinc-950/65 to-zinc-950/60';
    if (isActive) {
      switch (environmentTone) {
        case 'critical': return 'from-red-950/35 to-zinc-950/30';
        case 'tense': return 'from-amber-950/30 to-zinc-950/25';
        case 'calm': return 'from-emerald-950/25 to-zinc-950/20';
        default: return 'from-zinc-950/45 to-zinc-950/40';
      }
    }
    return 'from-zinc-950/40 to-zinc-950/35';
  };

  const edgeGlow = getEdgeGlow();
  const glassBg = getGlassBg();

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
        will-change-transform
        backdrop-blur-[12px]
        bg-gradient-to-b ${glassBg}
        ${isDragging ? 'z-[100]' : ''}
        ${className}
      `}
      style={{
        left: localPosition.x,
        top: localPosition.y,
        minWidth: '320px',
        maxWidth: '420px',
        zIndex,
        ...edgeGlow,
      }}
    >
      {/* Environmental reflection overlay */}
      <div className="absolute inset-0 rounded-sm pointer-events-none" style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 45%, transparent 65%, rgba(255,255,255,0.015) 100%)',
        mixBlendMode: 'overlay',
      }} />
      {/* Subtle edge light */}
      <div className="absolute inset-0 rounded-sm pointer-events-none" style={{
        border: '1px solid rgba(255,255,255,0.04)',
      }} />

      <div
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className={`
          panel-header
          flex items-center gap-2
          px-3 py-2
          border-b border-white/[0.04]
          cursor-grab
          ${isDragging ? 'cursor-grabbing' : ''}
        `}
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