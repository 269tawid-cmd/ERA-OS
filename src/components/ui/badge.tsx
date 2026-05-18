import { clsx } from 'clsx';
import type { HTMLAttributes } from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'hack' | 'build' | 'ai' | 'presence';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantColors: Record<BadgeVariant, string> = {
  default: 'bg-zinc-800/80 text-zinc-300 border border-zinc-700/50',
  success: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/40',
  warning: 'bg-amber-500/15 text-amber-400 border border-amber-500/40',
  error: 'bg-red-500/15 text-red-400 border border-red-500/40',
  hack: 'bg-red-500/15 text-red-400 border border-red-500/40',
  build: 'bg-purple-500/15 text-purple-400 border border-purple-500/40',
  ai: 'bg-teal-500/15 text-teal-400 border border-teal-500/40',
  presence: 'bg-amber-500/15 text-amber-400 border border-amber-500/40',
};

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-1 rounded text-xs font-mono font-semibold',
        variantColors[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}