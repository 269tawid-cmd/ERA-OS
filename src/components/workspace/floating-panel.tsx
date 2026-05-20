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
}

export function FloatingPanel({
  id,
  title,
  icon,
  initialPosition,
  children,
  className = '',
}: FloatingPanelProps) {
  const { state, updatePanelPosition, bringToFront } = useWorkspaceState();
  const panelState = state.panels.find(p => p.id === id);
  
  const [localPosition, setLocalPosition] = useState<Position>(
    panelState?.x !== undefined 
      ? { x: panelState.x, y: panelState.y }
      : initialPosition || { x: 0, y: 0 }
  );
  const [isDragging, setIsDragging] = useState(false);
  const offsetRef = useRef<Position>({ x: 0, y: 0 });

  const isFocused = state.focusedPanelId === id;
  const zIndex = panelState?.zIndex || 1;

  useEffect(() => {
    if (panelState && !isDragging) {
      setLocalPosition({ x: panelState.x, y: panelState.y });
    }
  }, [panelState?.x, panelState?.y, isDragging]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    bringToFront(id);
    setIsDragging(true);
    offsetRef.current = {
      x: e.clientX - localPosition.x,
      y: e.clientY - localPosition.y,
    };
  }, [id, localPosition, bringToFront]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const newX = e.clientX - offsetRef.current.x;
    const newY = e.clientY - offsetRef.current.y;
    
    setLocalPosition({ x: newX, y: newY });
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      updatePanelPosition(id, localPosition.x, localPosition.y);
    }
    setIsDragging(false);
  }, [isDragging, id, localPosition, updatePanelPosition]);

  const handleMouseLeave = useCallback(() => {
    if (isDragging) {
      updatePanelPosition(id, localPosition.x, localPosition.y);
    }
    setIsDragging(false);
  }, [isDragging, id, localPosition, updatePanelPosition]);

  if (panelState?.isOpen === false) return null;

  return (
    <div
      className={`
        floating-panel
        absolute
        bg-zinc-950/90
        border
        backdrop-blur-md
        rounded-lg
        overflow-hidden
        select-none
        transition-all duration-200
        ${isDragging 
          ? 'shadow-2xl shadow-black/50 z-[100]' 
          : isFocused
            ? 'border-zinc-700/80 shadow-xl shadow-black/40'
            : 'border-zinc-800/60 shadow-lg shadow-black/30'
        }
        ${className}
      `}
      style={{
        left: localPosition.x,
        top: localPosition.y,
        minWidth: '320px',
        maxWidth: '420px',
        zIndex,
      }}
    >
      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className={`
          panel-header
          flex items-center gap-2
          px-4 py-3
          border-b
          cursor-grab
          ${isDragging ? 'cursor-grabbing' : ''}
          transition-colors duration-150
          ${isFocused 
            ? 'bg-zinc-900/60 border-zinc-700/40' 
            : 'hover:bg-zinc-900/50 border-zinc-800/40'
          }
        `}
      >
        {icon && <span className="text-zinc-500 text-sm">{icon}</span>}
        <span className={`font-mono text-xs uppercase tracking-wider flex-1 ${
          isFocused ? 'text-zinc-300' : 'text-zinc-400'
        }`}>
          {title}
        </span>
        <div className="flex items-center gap-1">
          <span className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
            isFocused ? 'bg-emerald-500' : 'bg-zinc-600'
          }`} />
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
        </div>
      </div>
      <div className="panel-content p-4">
        {children}
      </div>
    </div>
  );
}