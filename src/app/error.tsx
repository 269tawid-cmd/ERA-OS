'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Page error:', error);
  }, [error]);

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 min-h-screen">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="mb-6">
          <span className="font-mono text-[10px] text-zinc-600 tracking-widest uppercase">
            era-os · operational interface
          </span>
        </div>

        <div className="w-8 h-0.5 bg-red-500/40 mb-6" />

        <h1 className="font-mono text-2xl font-bold text-zinc-300 mb-3">
          System Error
        </h1>

        <p className="font-mono text-sm text-zinc-500 mb-8 max-w-md">
          An operational fault was detected. The interface encountered an unexpected condition.
        </p>

        <button
          onClick={reset}
          className="font-mono text-sm px-5 py-2.5 bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-md hover:bg-zinc-700 hover:border-zinc-600 transition-all duration-150"
        >
          Retry Connection
        </button>
      </div>
    </main>
  );
}
