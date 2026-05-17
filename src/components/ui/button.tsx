import { clsx } from 'clsx';
import { forwardRef, type ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          'inline-flex items-center justify-center font-medium rounded-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#050505] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] min-h-[40px]',
          {
            'bg-white text-black hover:bg-zinc-200 focus:ring-zinc-500': variant === 'primary',
            'bg-zinc-800 text-zinc-200 border border-zinc-700 hover:bg-zinc-700 hover:border-zinc-600 focus:ring-zinc-500': variant === 'secondary',
            'bg-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 focus:ring-zinc-500 min-h-[36px]': variant === 'ghost',
            'bg-red-500/15 text-red-400 border border-red-500/40 hover:bg-red-500/25 hover:border-red-500/60 focus:ring-red-500/50': variant === 'danger',
          },
          {
            'px-4 py-2 text-sm min-h-[36px]': size === 'sm',
            'px-5 py-2.5 text-sm min-h-[44px]': size === 'md',
            'px-6 py-3 text-base min-h-[48px]': size === 'lg',
          },
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Loading...</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';