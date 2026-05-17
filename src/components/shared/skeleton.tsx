'use client';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-zinc-800/40 rounded ${className}`}
      aria-hidden="true"
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="p-4 bg-zinc-900/60 border border-zinc-800/60 rounded-lg space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-2 w-12" />
      </div>
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-2 w-full" />
      <Skeleton className="h-2 w-2/3" />
    </div>
  );
}

export function TaskSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 border border-zinc-800/40 rounded-md">
      <Skeleton className="h-4 w-4 rounded" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-2 w-1/2" />
      </div>
      <Skeleton className="h-6 w-16 rounded" />
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="p-4 bg-zinc-900/60 border border-zinc-800/60 rounded-lg">
      <Skeleton className="h-2 w-16 mb-2" />
      <Skeleton className="h-5 w-20 mb-1" />
      <Skeleton className="h-1.5 w-full rounded-full" />
    </div>
  );
}