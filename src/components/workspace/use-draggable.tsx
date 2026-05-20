'use client';

import { useState, useCallback, useRef } from 'react';

interface Position {
  x: number;
  y: number;
}

interface UseDraggableOptions {
  initialPosition?: Position;
  bounds?: { minX?: number; maxX?: number; minY?: number; maxY?: number };
}

export function useDraggable(options: UseDraggableOptions = {}) {
  const { initialPosition = { x: 0, y: 0 }, bounds } = options;
  
  const [position, setPosition] = useState<Position>(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const offsetRef = useRef<Position>({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    offsetRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  }, [position]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    let newX = e.clientX - offsetRef.current.x;
    let newY = e.clientY - offsetRef.current.y;
    
    if (bounds) {
      if (bounds.minX !== undefined) newX = Math.max(bounds.minX, newX);
      if (bounds.maxX !== undefined) newX = Math.min(bounds.maxX, newX);
      if (bounds.minY !== undefined) newY = Math.max(bounds.minY, newY);
      if (bounds.maxY !== undefined) newY = Math.min(bounds.maxY, newY);
    }
    
    setPosition({ x: newX, y: newY });
  }, [isDragging, bounds]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  return {
    position,
    isDragging,
    handlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseUp,
    },
  };
}