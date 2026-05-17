'use server';

import { createClientWithAuth } from '@/lib/supabase/server';
import { ROADMAP_DATA } from '@/lib/roadmap';
import type { Pillar, TaskCategory } from '@/types';

export async function migrateStaticRoadmapToDB(): Promise<{
  success: boolean;
  roadmap_id?: string;
  error?: string;
}> {
  const { client, user } = await createClientWithAuth();
  
  const { data: existingRoadmaps } = await (client.from('yearly_roadmaps') as ReturnType<typeof client.from>).select('id').eq('user_id', user.id).eq('is_active', true).limit(1);
  
  if (existingRoadmaps && existingRoadmaps.length > 0) {
    return {
      success: true,
      roadmap_id: String((existingRoadmaps[0] as { id?: unknown })?.id || ''),
      error: 'Roadmap already exists. Skipping migration.',
    };
  }
  
  const normalized = {
    roadmap: {
      title: 'Year 1: Cybersecurity Foundation',
      description: 'First year cybersecurity roadmap focusing on web application penetration testing',
      year: 1,
    },
    months: ROADMAP_DATA.map(m => ({
      month: m.month,
      title: m.title,
      description: m.title,
      focus_areas: m.focus,
      deliverables: m.deliverables,
      suggested_tasks: m.suggested_tasks.map(t => ({
        title: t,
        pillar: 'HACK' as Pillar,
        category: 'practice' as TaskCategory,
        xp_value: 15,
        estimated_minutes: 45,
      })),
      estimated_hours: 40,
    })),
    milestones: [
      { month: 3, name: 'Linux Basic', description: 'Complete Linux fundamentals', xp_required: 500 },
      { month: 6, name: 'Web Security Foundation', description: 'Complete OWASP + DVWA', xp_required: 1500 },
      { month: 9, name: 'Jr Pentester Path', description: 'Complete TryHackMe Jr Pentester', xp_required: 2500 },
      { month: 12, name: 'Year 1 Complete', description: 'Finish first year of journey', xp_required: 4000 },
    ],
  };
  
  const { data: roadmapData, error: roadmapError } = await (client.from('yearly_roadmaps') as ReturnType<typeof client.from>).insert({
    user_id: user.id,
    title: normalized.roadmap.title,
    description: normalized.roadmap.description,
    year: normalized.roadmap.year,
    is_active: true,
  } as Record<string, unknown>).select().single();
  
  if (roadmapError || !roadmapData) {
    return {
      success: false,
      error: 'Failed to create roadmap: ' + (roadmapError?.message || 'Unknown error'),
    };
  }
  
  const roadmap = roadmapData as { id: string };
  
  for (const monthData of normalized.months) {
    await (client.from('roadmap_months') as ReturnType<typeof client.from>).insert({
      roadmap_id: roadmap.id,
      month: monthData.month,
      title: monthData.title,
      description: monthData.description,
      focus_areas: monthData.focus_areas,
      deliverables: monthData.deliverables,
      suggested_tasks: monthData.suggested_tasks,
      estimated_hours: monthData.estimated_hours,
    } as Record<string, unknown>);
  }
  
  for (const milestone of normalized.milestones) {
    await (client.from('roadmap_milestones') as ReturnType<typeof client.from>).insert({
      roadmap_id: roadmap.id,
      month: milestone.month,
      name: milestone.name,
      description: milestone.description,
      xp_required: milestone.xp_required,
    } as Record<string, unknown>);
  }
  
  return {
    success: true,
    roadmap_id: roadmap.id,
  };
}

export async function ensureRoadmapExists(): Promise<string> {
  const { client, user } = await createClientWithAuth();
  
  const { data: existingRoadmap } = await (client.from('yearly_roadmaps') as ReturnType<typeof client.from>).select('id').eq('user_id', user.id).eq('is_active', true).single();
  
  if (existingRoadmap) {
    return String((existingRoadmap as { id?: unknown })?.id || '');
  }
  
  const result = await migrateStaticRoadmapToDB();
  if (!result.success || !result.roadmap_id) {
    throw new Error(result.error || 'Failed to ensure roadmap exists');
  }
  
  return result.roadmap_id;
}