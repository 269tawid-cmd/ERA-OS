import { clsx } from 'clsx';
import type { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'glow';
  glow?: 'hack' | 'build' | 'ai' | 'presence';
}

export function Card({ className, variant = 'default', glow, children, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-lg transition-all duration-200',
        {
          'cyber-panel border border-zinc-800/40 shadow-sm': variant === 'default',
          'cyber-panel border border-zinc-700/40 backdrop-blur-md shadow-sm': variant === 'bordered',
          'cyber-panel border border-zinc-800/30 backdrop-blur-md shadow-sm': variant === 'glow',
          'border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]': glow === 'hack',
          'border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.1)]': glow === 'build',
          'border-teal-500/30 shadow-[0_0_15px_rgba(45,212,191,0.1)]': glow === 'ai',
          'border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.1)]': glow === 'presence',
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx('px-5 py-3.5 border-b border-zinc-800/60', className)} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx('p-5', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx('px-5 py-3.5 border-t border-zinc-800/60', className)} {...props}>
      {children}
    </div>
  );
}
