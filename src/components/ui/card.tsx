import { clsx } from 'clsx';
import type { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'glow';
  glow?: 'hack' | 'build' | 'ai' | 'presence';
  hover?: boolean;
}

export function Card({ className, variant = 'default', glow, hover: withHover, children, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-lg transition-all duration-200',
        {
          'cyber-panel border border-zinc-800/40 shadow-sm': variant === 'default',
          'cyber-panel border border-zinc-700/40 shadow-sm': variant === 'bordered',
          'cyber-panel border border-zinc-800/30 shadow-sm': variant === 'glow',
        },
        glow === 'hack' && 'glow-hack border-red-500/30',
        glow === 'build' && 'glow-build border-purple-500/30',
        glow === 'ai' && 'glow-ai border-teal-500/30',
        glow === 'presence' && 'glow-presence border-amber-500/30',
        withHover && 'hover:border-zinc-700/60 cursor-default',
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
