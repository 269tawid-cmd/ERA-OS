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
        'rounded-lg transition-shadow duration-150',
        {
          'bg-zinc-900/60 border border-zinc-800/60 backdrop-blur-md': variant === 'default',
          'bg-zinc-900/60 border border-zinc-700/60 backdrop-blur-md': variant === 'bordered',
          'bg-zinc-900/60 border backdrop-blur-md': variant === 'glow',
          'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.15)]': glow === 'hack',
          'border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.15)]': glow === 'build',
          'border-teal-500/50 shadow-[0_0_20px_rgba(45,212,191,0.15)]': glow === 'ai',
          'border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.15)]': glow === 'presence',
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
    <div className={clsx('px-4 py-3 border-b border-zinc-800/70', className)} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx('p-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx('px-4 py-3 border-t border-zinc-800/70', className)} {...props}>
      {children}
    </div>
  );
}