import { clsx } from 'clsx';
import type { HTMLAttributes } from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'hack' | 'build' | 'ai' | 'presence';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantColors: Record<BadgeVariant, string> = {
  default: 'bg-zinc-800/80 text-zinc-400 border border-zinc-700/50',
  success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
  warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
  error: 'bg-red-500/10 text-red-400 border border-red-500/30',
  hack: 'bg-red-500/10 text-red-400 border border-red-500/30',
  build: 'bg-purple-500/10 text-purple-400 border border-purple-500/30',
  ai: 'bg-teal-500/10 text-teal-400 border border-teal-500/30',
  presence: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
};

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider',
        variantColors[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}