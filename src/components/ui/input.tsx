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
          <label htmlFor={inputId} className="block text-sm font-medium text-zinc-400 mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            'w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-md text-zinc-200 text-sm placeholder:text-zinc-600 min-h-[44px]',
            'focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-offset-[#050505] focus:border-zinc-600 focus:ring-zinc-500/30 transition-colors duration-150',
            error
              ? 'border-red-500/60 focus:ring-red-500/30'
              : 'hover:border-zinc-700',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';