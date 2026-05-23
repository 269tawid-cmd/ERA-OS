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

  const getBorderColor = () => {
    if (isActive) {
      switch (environmentTone) {
        case 'critical': return 'border-red-600/60';
        case 'tense': return 'border-amber-600/50';
        case 'calm': return 'border-emerald-600/50';
        default: return 'border-zinc-600/60';
      }
    }
    if (isFocused) {
      return 'border-zinc-700/80';
    }
    return 'border-zinc-800/60';
  };

  const getHeaderStyle = () => {
    if (isActive) {
      switch (environmentTone) {
        case 'critical': return 'bg-red-950/30 border-red-900/30';
        case 'tense': return 'bg-amber-950/20 border-amber-900/30';
        case 'calm': return 'bg-emerald-950/20 border-emerald-900/30';
        default: return 'bg-zinc-900/60 border-zinc-800/40';
      }
    }
    if (isFocused) {
      return 'bg-zinc-900/60 border-zinc-700/40';
    }
    return 'hover:bg-zinc-900/50 border-zinc-800/40';
  };

  const getIndicatorColor = () => {
    if (isActive) {
      switch (environmentTone) {
        case 'critical': return 'bg-red-500';
        case 'tense': return 'bg-amber-500';
        case 'calm': return 'bg-emerald-500';
        default: return 'bg-zinc-400';
      }
    }
    return 'bg-zinc-600';
  };

  const getShadowStyle = (): React.CSSProperties => {
    if (isDragging) {
      return {
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03), 0 20px 60px -12px rgba(0,0,0,0.5), 0 8px 20px -8px rgba(0,0,0,0.4)',
      };
    }
    if (isHovered || isActive) {
      return {
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.035), 0 8px 24px -6px rgba(0,0,0,0.4), 0 20px 48px -12px rgba(0,0,0,0.3)',
      };
    }
    return {
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.025), 0 2px 8px -4px rgba(0,0,0,0.3), 0 8px 24px -8px rgba(0,0,0,0.2)',
    };
  };

  return (
    <div
      ref={panelRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        floating-panel
        absolute
        bg-gradient-to-b from-zinc-950/90 to-zinc-950/85
        border
        rounded-lg
        overflow-hidden
        select-none
        will-change-transform
        ${isDragging 
          ? 'z-[100] transition-shadow duration-100' 
          : `transition-shadow duration-300 ${getBorderColor()}`
        }
        ${className}
      `}
      style={{
        left: localPosition.x,
        top: localPosition.y,
        minWidth: '320px',
        maxWidth: '420px',
        zIndex,
        ...getShadowStyle(),
      }}
    >
      {/* Static internal reflection */}
      <div className="absolute inset-0 rounded-lg pointer-events-none" style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.015) 100%)',
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
          transition-colors duration-150
          ${getHeaderStyle()}
        `}
      >
        {icon && (
          <span className={`text-xs transition-all duration-300 ${
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
        <span className={`w-1.5 h-1.5 rounded-full ${getIndicatorColor()} ${isActive ? 'animate-pulse' : ''}`} />
      </div>
      <div className="panel-content p-3 relative z-[1]">
        {children}
      </div>
    </div>
  );
}