'use client';

import { Card, CardContent, CardHeader } from '@/components/ui';
import { PILLARS, PILLAR_ORDER } from '@/lib/constants';

interface PillarProgressProps {
  pillarXP: Record<string, number>;
  compact?: boolean;
}

export function PillarProgress({ pillarXP, compact = false }: PillarProgressProps) {
  const totalXP = PILLAR_ORDER.reduce((sum, p) => sum + (pillarXP[p] || 0), 0);

  if (compact) {
    return (
      <div className="grid grid-cols-4 gap-2">
        {PILLAR_ORDER.map((pillar) => {
          const pillarData = PILLARS[pillar];
          const xp = pillarXP[pillar] || 0;
          const percentage = totalXP > 0 ? Math.round((xp / totalXP) * 100) : 0;

          return (
            <div key={pillar} className="text-center">
              <div
                className="h-1 rounded-full mb-1 mx-auto overflow-hidden"
                style={{ width: '60%', backgroundColor: `${pillarData.color}15` }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: pillarData.color,
                    boxShadow: `0 0 6px ${pillarData.color}60`
                  }}
                />
              </div>
              <p className="font-mono text-sm" style={{ color: pillarData.color }}>
                {xp}
              </p>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <Card className="bg-zinc-900/60 border border-zinc-800/60 backdrop-blur-sm overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest">Domain Distribution</span>
          <span className="font-mono text-xs text-zinc-400">{totalXP} XP</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {PILLAR_ORDER.map((pillar) => {
          const pillarData = PILLARS[pillar];
          const xp = pillarXP[pillar] || 0;
          const maxXP = 1000;
          const percentage = Math.min(Math.round((xp / maxXP) * 100), 100);

          return (
            <div key={pillar}>
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className="font-mono text-xs font-semibold"
                  style={{ color: pillarData.color }}
                >
                  {pillar}
                </span>
                <span className="font-mono text-xs text-zinc-500">{xp} XP</span>
              </div>
              <div className="h-[3px] bg-zinc-800/60 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: pillarData.color,
                    boxShadow: `0 0 8px ${pillarData.color}40`
                  }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}