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
        'rounded-lg',
        {
          'bg-zinc-900/80 border border-zinc-800/60 backdrop-blur-sm': variant === 'default',
          'bg-zinc-900/80 border border-zinc-800 backdrop-blur-sm': variant === 'bordered',
          'bg-zinc-900/80 border backdrop-blur-sm': variant === 'glow',
          'border-[#ef4444] glow-hack': glow === 'hack',
          'border-[#a855f7] glow-build': glow === 'build',
          'border-[#2dd4bf] glow-ai': glow === 'ai',
          'border-[#f59e0b] glow-presence': glow === 'presence',
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
    <div className={clsx('px-4 py-3 border-b border-zinc-800/60', className)} {...props}>
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
    <div className={clsx('px-4 py-3 border-t border-zinc-800/60', className)} {...props}>
      {children}
    </div>
  );
}