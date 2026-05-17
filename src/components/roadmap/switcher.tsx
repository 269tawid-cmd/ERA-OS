'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui';
import { getActiveRoadmap } from '@/lib/actions/roadmap';
import { setActiveRoadmap, deleteRoadmap } from '@/lib/actions/roadmap';

interface RoadmapInfo {
  id: string;
  title: string;
  description: string | null;
  year: number;
  is_active: boolean;
}

interface RoadmapSwitcherProps {
  onRoadmapChange?: () => void;
}

export function RoadmapSwitcher({ onRoadmapChange }: RoadmapSwitcherProps) {
  const [roadmaps, setRoadmaps] = useState<RoadmapInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const loadRoadmaps = () => {
    setLoading(true);
    getActiveRoadmap().then((active) => {
      if (active) {
        setRoadmaps([{
          id: active.id,
          title: active.title,
          description: active.description,
          year: active.year,
          is_active: true,
        }]);
      } else {
        setRoadmaps([]);
      }
      setLoading(false);
    });
  };

  const handleSetActive = (roadmapId: string) => {
    startTransition(async () => {
      await setActiveRoadmap(roadmapId);
      onRoadmapChange?.();
      loadRoadmaps();
    });
  };

  const handleDelete = (roadmapId: string) => {
    if (!confirm('Delete this roadmap? This cannot be undone.')) return;
    
    setDeletingId(roadmapId);
    startTransition(async () => {
      await deleteRoadmap(roadmapId);
      onRoadmapChange?.();
      loadRoadmaps();
      setDeletingId(null);
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-mono text-sm text-zinc-400 uppercase tracking-wider">
          Your Roadmaps
        </h3>
        <Button size="sm" variant="ghost" onClick={loadRoadmaps}>
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="font-mono text-sm text-zinc-500">Loading roadmaps...</p>
        </div>
      ) : roadmaps.length === 0 ? (
        <div className="text-center py-8 bg-zinc-900/40 border border-zinc-800/60 rounded-lg">
          <div className="w-12 h-12 mx-auto mb-4 bg-zinc-800/60 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="font-mono text-sm text-zinc-400 mb-2">No roadmaps yet</p>
          <p className="font-mono text-xs text-zinc-600">
            Import your first roadmap above to get started
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {roadmaps.map((roadmap) => (
            <div
              key={roadmap.id}
              className={`p-4 bg-zinc-900/60 border rounded-lg transition-all ${
                roadmap.is_active 
                  ? 'border-emerald-500/50 bg-emerald-500/5' 
                  : 'border-zinc-800/60 hover:border-zinc-700/60'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {roadmap.is_active && (
                      <span className="font-mono text-xs text-emerald-400 uppercase tracking-wider">
                        Active
                      </span>
                    )}
                    <h4 className="font-mono text-sm font-semibold text-zinc-200">
                      {roadmap.title}
                    </h4>
                  </div>
                  {roadmap.description && (
                    <p className="font-mono text-xs text-zinc-500 mb-2">
                      {roadmap.description}
                    </p>
                  )}
                  <p className="font-mono text-xs text-zinc-600">
                    Year {roadmap.year}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {!roadmap.is_active && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleSetActive(roadmap.id)}
                    >
                      Activate
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(roadmap.id)}
                    disabled={deletingId === roadmap.id}
                  >
                    {deletingId === roadmap.id ? '...' : 'Delete'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}