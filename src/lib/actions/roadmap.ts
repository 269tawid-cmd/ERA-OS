'use server';

import { createClientWithAuth } from '@/lib/supabase/server';
import { parseRoadmap, validateParsedRoadmap, calculateParsingConfidence } from '@/lib/roadmap/parser';
import { normalizeForDB, getRoadmapStats, normalizeRoadmap } from '@/lib/roadmap/normalizer';
import type { ParsedRoadmap } from '@/lib/roadmap/parser';
import type { YearlyRoadmapSchema } from '@/lib/roadmap/schema';
import type { Pillar, TaskCategory } from '@/types';

export interface ImportRoadmapResult {
  success: boolean;
  roadmap_id?: string;
  stats?: ReturnType<typeof getRoadmapStats>;
  errors?: string[];
  warnings?: string[];
}

export async function importRoadmap(rawInput: string, setAsActive = true): Promise<ImportRoadmapResult> {
  const parsed = parseRoadmap(rawInput);
  
  if (!parsed.success || !parsed.roadmap) {
    return {
      success: false,
      errors: parsed.errors.map(e => e.message),
      warnings: parsed.warnings,
    };
  }
  
  const validationErrors = validateParsedRoadmap(parsed.roadmap);
  const criticalErrors = validationErrors.filter(e => e.severity === 'error');
  
  if (criticalErrors.length > 0) {
    return {
      success: false,
      errors: criticalErrors.map(e => e.message),
      warnings: [...parsed.warnings, ...validationErrors.filter(e => e.severity === 'warning').map(e => e.message)],
    };
  }
  
  const normalized = normalizeForDB(parsed.roadmap);
  const stats = getRoadmapStats(normalizeRoadmap(parsed.roadmap));
  
  const { client, user } = await createClientWithAuth();
  
  if (setAsActive) {
    await (client.from('yearly_roadmaps') as ReturnType<typeof client.from>).update({ is_active: false }).eq('user_id', user.id);
  }
  
  const { data: roadmapData, error: roadmapError } = await (client.from('yearly_roadmaps') as ReturnType<typeof client.from>).insert({
    user_id: user.id,
    title: normalized.roadmap.title,
    description: normalized.roadmap.description,
    year: normalized.roadmap.year,
    is_active: setAsActive,
  } as Record<string, unknown>).select().single();
  
  if (roadmapError || !roadmapData) {
    return {
      success: false,
      errors: ['Failed to create roadmap: ' + (roadmapError?.message || 'Unknown error')],
      warnings: parsed.warnings,
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
    stats,
    warnings: parsed.warnings,
  };
}

export async function getActiveRoadmap(): Promise<{ id: string; title: string; description: string | null; year: number; is_active: boolean } | null> {
  const { client, user } = await createClientWithAuth();
  
  const { data } = await (client.from('yearly_roadmaps') as ReturnType<typeof client.from>).select('id, title, description, year, is_active').eq('user_id', user.id).eq('is_active', true).single();
  
  return data as { id: string; title: string; description: string | null; year: number; is_active: boolean } | null;
}

export async function getRoadmapMonths(roadmapId: string): Promise<Array<{
  id: string;
  month: number;
  title: string;
  description: string | null;
  focus_areas: string[];
  deliverables: string[];
  suggested_tasks: Array<{ title: string; pillar: Pillar; category: TaskCategory; xp_value: number; estimated_minutes: number }>;
  estimated_hours: number | null;
}>> {
  const { client } = await createClientWithAuth();
  
  const { data } = await (client.from('roadmap_months') as ReturnType<typeof client.from>).select('*').eq('roadmap_id', roadmapId).order('month', { ascending: true });
  
  return (data || []) as Array<{
    id: string;
    month: number;
    title: string;
    description: string | null;
    focus_areas: string[];
    deliverables: string[];
    suggested_tasks: Array<{ title: string; pillar: Pillar; category: TaskCategory; xp_value: number; estimated_minutes: number }>;
    estimated_hours: number | null;
  }>;
}

export async function getRoadmapMilestones(roadmapId: string): Promise<Array<{
  id: string;
  month: number;
  name: string;
  description: string | null;
  xp_required: number;
}>> {
  const { client } = await createClientWithAuth();
  
  const { data } = await (client.from('roadmap_milestones') as ReturnType<typeof client.from>).select('*').eq('roadmap_id', roadmapId).order('month', { ascending: true });
  
  return (data || []) as Array<{
    id: string;
    month: number;
    name: string;
    description: string | null;
    xp_required: number;
  }>;
}

export async function getDBRoadmapSchema(roadmapId: string): Promise<YearlyRoadmapSchema | null> {
  const roadmap = await getActiveRoadmap();
  if (!roadmap || roadmap.id !== roadmapId) {
    return null;
  }
  
  const months = await getRoadmapMonths(roadmapId);
  const milestones = await getRoadmapMilestones(roadmapId);
  
  if (months.length === 0) {
    return null;
  }
  
  return {
    year: roadmap.year,
    title: roadmap.title,
    description: roadmap.description || '',
    months: months.map((m) => ({
      month: m.month,
      year: roadmap.year,
      title: m.title,
      description: m.description || '',
      focus_areas: (Array.isArray(m.focus_areas) ? m.focus_areas : []).map((f: unknown) => {
        if (typeof f === 'object' && f !== null) {
          return f as { name: string; description: string; weight: number };
        }
        return { name: String(f), description: String(f), weight: 1 };
      }),
      deliverables: Array.isArray(m.deliverables) ? m.deliverables as string[] : [],
      task_templates: (Array.isArray(m.suggested_tasks) ? m.suggested_tasks : []).map((t, j) => ({
        id: `${m.month}-${j + 1}`,
        title: String((t as { title?: unknown })?.title || ''),
        description: String((t as { title?: unknown })?.title || ''),
        pillar: String((t as { pillar?: unknown })?.pillar || 'HACK') as Pillar,
        category: String((t as { category?: unknown })?.category || 'practice') as TaskCategory,
        priority: 'medium' as const,
        xp_value: Number((t as { xp_value?: unknown })?.xp_value) || 15,
        estimated_minutes: Number((t as { estimated_minutes?: unknown })?.estimated_minutes) || 45,
        resources: [],
      })),
      prerequisites: [],
      success_criteria: [],
      estimated_hours: m.estimated_hours || 0,
    })),
    milestones: milestones.map(m => ({
      month: m.month,
      name: m.name,
      description: m.description || '',
      xp_required: m.xp_required,
    })),
  };
}

export async function deleteRoadmap(roadmapId: string) {
  const { client, user } = await createClientWithAuth();
  
  const { error } = await (client.from('yearly_roadmaps') as ReturnType<typeof client.from>).delete().eq('id', roadmapId).eq('user_id', user.id);
  
  if (error) {
    throw new Error(String(error?.message || 'Unknown error'));
  }
  
  return { success: true };
}

export async function setActiveRoadmap(roadmapId: string) {
  const { client, user } = await createClientWithAuth();
  
  await (client.from('yearly_roadmaps') as ReturnType<typeof client.from>).update({ is_active: false }).eq('user_id', user.id);
  
  await (client.from('yearly_roadmaps') as ReturnType<typeof client.from>).update({ is_active: true }).eq('id', roadmapId).eq('user_id', user.id);
  
  return { success: true };
}

export async function previewRoadmap(rawInput: string): Promise<{
  parsed: ParsedRoadmap | null;
  errors: string[];
  warnings: string[];
  stats: ReturnType<typeof getRoadmapStats> | null;
  confidence: { overall: number; title_confidence: number; month_confidence: number; task_confidence: number; formatting_score: number } | null;
} | null> {
  const parsed = parseRoadmap(rawInput);
  
  if (!parsed.success || !parsed.roadmap) {
    return {
      parsed: null,
      errors: parsed.errors.map(e => e.message),
      warnings: parsed.warnings,
      stats: null,
      confidence: null,
    };
  }
  
  const validationErrors = validateParsedRoadmap(parsed.roadmap);
  const normalized = normalizeRoadmap(parsed.roadmap);
  const stats = getRoadmapStats(normalized);
  const confidence = calculateParsingConfidence(parsed.roadmap, parsed.warnings);
  
  return {
    parsed: parsed.roadmap,
    errors: validationErrors.filter(e => e.severity === 'error').map(e => e.message),
    warnings: [...parsed.warnings, ...validationErrors.filter(e => e.severity === 'warning').map(e => e.message)],
    stats,
    confidence,
  };
}