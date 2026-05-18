'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardHeader, CardContent } from '@/components/ui';
import { PILLARS, PILLAR_ORDER } from '@/lib/constants';

interface PillarXPData {
  label: string;
  xp: number;
  color: string;
}

interface XPBarChartProps {
  pillarXP: Record<string, number>;
}

export function XPBarChart({ pillarXP }: XPBarChartProps) {
  const data: PillarXPData[] = PILLAR_ORDER.map((key) => {
    const pillar = PILLARS[key];
    return {
      label: key,
      xp: pillarXP[key] || 0,
      color: pillar.color,
    };
  });

  const maxXP = Math.max(...data.map((d) => d.xp), 1);

  return (
    <Card className="bg-zinc-900/60 border border-zinc-800/60 backdrop-blur-sm overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest">
            Pillar XP Distribution
          </span>
          <span className="font-mono text-xs text-zinc-400">
            {data.reduce((s, d) => s + d.xp, 0)} total
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="label"
                tick={{ fontFamily: 'ui-monospace', fontSize: 11, fill: '#71717a' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontFamily: 'ui-monospace', fontSize: 11, fill: '#71717a' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181b',
                  border: '1px solid #27272a',
                  borderRadius: '6px',
                  fontFamily: 'ui-monospace',
                  fontSize: '12px',
                  color: '#e4e4e7',
                }}
                labelStyle={{ color: '#a1a1aa' }}
                formatter={(value: unknown) => [`${value} XP`, 'XP']}
              />
              <Bar dataKey="xp" radius={[3, 3, 0, 0]}>
                {data.map((entry) => (
                  <Cell key={entry.label} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-3 grid grid-cols-4 gap-2">
          {data.map((d) => {
            const pct = Math.round(((d.xp) / maxXP) * 100);
            return (
              <div key={d.label} className="text-center">
                <div className="h-[3px] rounded-full mb-1 overflow-hidden" style={{ backgroundColor: `${d.color}20` }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: d.color,
                      boxShadow: `0 0 6px ${d.color}50`,
                    }}
                  />
                </div>
                <p className="font-mono text-sm" style={{ color: d.color }}>
                  {d.xp}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}