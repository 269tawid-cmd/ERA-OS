import { CardSkeleton } from '@/components/shared/skeleton';

export default function Loading() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="mb-8">
        <div className="animate-pulse space-y-4">
          <div className="h-3 w-48 bg-zinc-800/40 rounded" />
          <div className="h-8 w-64 bg-zinc-800/40 rounded" />
          <div className="h-3 w-96 bg-zinc-800/40 rounded" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <CardSkeleton />
        </div>
        <div>
          <CardSkeleton />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 bg-zinc-900/60 border border-zinc-800/60 rounded-lg">
            <div className="h-2 w-16 bg-zinc-800/40 rounded mb-2 animate-pulse" />
            <div className="h-5 w-20 bg-zinc-800/40 rounded mb-1 animate-pulse" />
            <div className="h-1.5 w-full bg-zinc-800/40 rounded animate-pulse" />
          </div>
        ))}
      </div>

      <div className="space-y-4 mb-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </main>
  );
}
