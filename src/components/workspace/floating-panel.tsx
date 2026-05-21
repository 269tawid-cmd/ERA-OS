'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useWorkspaceState } from './workspace-state';

interface Position {
  x: number;
  y: number;
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
  
  const [localPosition, setLocalPosition] = useState<Position>(
    panelState?.x !== undefined 
      ? { x: panelState.x, y: panelState.y }
      : initialPosition || { x: 0, y: 0 }
  );
  const [isDragging, setIsDragging] = useState(false);
  const offsetRef = useRef<Position>({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);

  const isFocused = state.focusedPanelId === id;
  const zIndex = panelState?.zIndex || 1;

  const { environmentTone } = context;

  useEffect(() => {
    if (panelState && !isDragging) {
      setLocalPosition({ x: panelState.x, y: panelState.y });
    }
  }, [panelState?.x, panelState?.y, isDragging]);

  const handleDragStart = useCallback((clientX: number, clientY: number) => {
    bringToFront(id);
    setIsDragging(true);
    offsetRef.current = {
      x: clientX - localPosition.x,
      y: clientY - localPosition.y,
    };
  }, [id, localPosition, bringToFront]);

  const handleDragMove = useCallback((clientX: number, clientY: number) => {
    const newX = clientX - offsetRef.current.x;
    const newY = clientY - offsetRef.current.y;
    setLocalPosition({ x: newX, y: newY });
  }, []);

  const handleDragEnd = useCallback(() => {
    if (isDragging) {
      updatePanelPosition(id, localPosition.x, localPosition.y);
    }
    setIsDragging(false);
  }, [isDragging, id, localPosition, updatePanelPosition]);

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
        boxShadow: '0 20px 60px -12px rgba(0,0,0,0.5), 0 8px 20px -8px rgba(0,0,0,0.4)',
      };
    }
    if (isActive) {
      return {
        boxShadow: '0 4px 16px -4px rgba(0,0,0,0.35), 0 12px 32px -8px rgba(0,0,0,0.25)',
      };
    }
    return {
      boxShadow: '0 2px 8px -4px rgba(0,0,0,0.3), 0 8px 24px -8px rgba(0,0,0,0.2)',
    };
  };

  const getEdgeLightColor = () => {
    if (isActive) {
      switch (environmentTone) {
        case 'critical': return 'from-red-500/4';
        case 'tense': return 'from-amber-500/4';
        case 'calm': return 'from-emerald-500/4';
        default: return 'from-blue-400/4';
      }
    }
    return 'from-transparent';
  };

  return (
    <div
      ref={panelRef}
      className={`
        floating-panel
        absolute
        bg-gradient-to-b from-zinc-950/95 to-zinc-950/90
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
      {/* Environmental light bleed overlay */}
      <div className={`absolute inset-0 rounded-lg pointer-events-none bg-gradient-to-b ${getEdgeLightColor()} to-transparent transition-opacity duration-700`} />
      {/* Panel surface texture */}
      <div className="absolute inset-0 rounded-lg pointer-events-none opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%, rgba(0,0,0,0.05) 100%)' }} />
      <div
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className={`
          panel-header
          flex items-center gap-2
          px-4 py-2.5
          border-b
          cursor-grab
          ${isDragging ? 'cursor-grabbing' : ''}
          transition-colors duration-150
          ${getHeaderStyle()}
        `}
      >
        {icon && <span className="text-zinc-500 text-sm">{icon}</span>}
        <span className={`font-mono text-[10px] uppercase tracking-wider flex-1 ${
          isActive || isFocused ? 'text-zinc-300' : 'text-zinc-500'
        }`}>
          {title}
        </span>
        <div className="flex items-center gap-1">
          <span className={`w-1.5 h-1.5 rounded-full ${getIndicatorColor()} ${isActive ? 'animate-pulse' : ''}`} />
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
        </div>
      </div>
      <div className="panel-content p-3.5">
        {children}
      </div>
    </div>
  );
}