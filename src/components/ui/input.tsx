import { clsx } from 'clsx';
import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            'w-full px-3 py-2 bg-zinc-950 border rounded-md text-zinc-200 placeholder-zinc-600 text-sm',
            'focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-offset-[#050505] transition-colors duration-150',
            error
              ? 'border-red-500/50 focus:ring-red-500/30'
              : 'border-zinc-800/80 focus:border-zinc-600/80 focus:ring-zinc-500/20',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';