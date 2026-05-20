'use client';

import { useState, useCallback, useRef } from 'react';

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
  const [position, setPosition] = useState<Position>(initialPosition || { x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const offsetRef = useRef<Position>({ x: 0, y: 0 });
  
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    offsetRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  }, [position]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const newX = e.clientX - offsetRef.current.x;
    const newY = e.clientY - offsetRef.current.y;
    
    setPosition({ x: newX, y: newY });
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div
      className={`
        floating-panel
        absolute
        bg-zinc-950/90
        border border-zinc-800/60
        backdrop-blur-md
        rounded-lg
        overflow-hidden
        select-none
        ${isDragging ? 'shadow-2xl shadow-black/50 z-50' : 'shadow-lg shadow-black/30'}
        ${className}
      `}
      style={{
        left: position.x,
        top: position.y,
        minWidth: '320px',
        maxWidth: '420px',
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
          border-b border-zinc-800/40
          cursor-grab
          ${isDragging ? 'cursor-grabbing' : ''}
          hover:bg-zinc-900/50
          transition-colors duration-150
        `}
      >
        {icon && <span className="text-zinc-500 text-sm">{icon}</span>}
        <span className="font-mono text-xs text-zinc-400 uppercase tracking-wider flex-1">
          {title}
        </span>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
        </div>
      </div>
      <div className="panel-content p-4">
        {children}
      </div>
    </div>
  );
}