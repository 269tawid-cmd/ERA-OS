'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui';
import { importRoadmap, previewRoadmap } from '@/lib/actions/roadmap';
import type { ParsedRoadmap } from '@/lib/roadmap/parser';

interface ConfidenceScore {
  overall: number;
  title_confidence: number;
  month_confidence: number;
  task_confidence: number;
  formatting_score: number;
}

const SAMPLE_ROADMAP = `# Hacker Era King v1.0

Month 1: Linux Mastery
- Master CLI fundamentals (ls, cd, cat, grep, find)
- Bash scripting basics and automation
- File permissions and ownership deep dive
- Practice: TryHackMe Linux Basics

Month 2: Network Foundations
- TCP/IP and OSI model deep dive
- Wireshark packet analysis
- Subnetting and IP addressing
- Practice: TryHackMe Networking path

Month 3: Web Security Basics
- OWASP Top 10 (2021) theory
- DVWA setup and practice
- SQL injection fundamentals
- XSS attack and defense

Month 4: Pentesting Toolkit
- Burp Suite mastering
- Nmap and enumeration
- Metasploit fundamentals
- Building your methodology

Month 5: CTF Season
- PicoCTF beginner challenges
- HackTheBox Easy machines
- Writeup documentation
- Team collaboration practice

Month 6: Advanced Exploitation
- Buffer overflow basics
- Privilege escalation techniques
- Active Directory attacks
- Document findings properly`;

interface RoadmapPreviewProps {
  parsed: ParsedRoadmap;
  stats: {
    totalMonths: number;
    totalTasks: number;
    totalHours: number;
    pillarDistribution: Record<string, number>;
    categoryDistribution: Record<string, number>;
  };
}

function RoadmapPreview({ parsed, stats }: RoadmapPreviewProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-mono text-base font-semibold text-zinc-200">
          {parsed.title}
        </h3>
        <span className="font-mono text-xs text-zinc-500 uppercase tracking-wider">
          Year {parsed.year}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-wider">Months</span>
          </div>
          <p className="font-mono text-3xl font-bold text-zinc-100">{stats.totalMonths}</p>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-wider">Tasks</span>
          </div>
          <p className="font-mono text-3xl font-bold text-zinc-100">{stats.totalTasks}</p>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-wider">Hours</span>
          </div>
          <p className="font-mono text-3xl font-bold text-zinc-100">{stats.totalHours}</p>
        </div>
      </div>

      <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg p-4">
        <p className="font-mono text-xs text-zinc-500 uppercase tracking-wider mb-3">Pillar Distribution</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(stats.pillarDistribution)
            .filter(([, count]) => count > 0)
            .map(([pillar, count]) => {
              const colors: Record<string, string> = {
                HACK: 'bg-red-500/20 border-red-500/40 text-red-300',
                BUILD: 'bg-blue-500/20 border-blue-500/40 text-blue-300',
                AI: 'bg-purple-500/20 border-purple-500/40 text-purple-300',
                PRESENCE: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300',
              };
              return (
                <span
                  key={pillar}
                  className={`font-mono text-xs px-3 py-1.5 rounded-lg border ${colors[pillar] || 'bg-zinc-800/60 border-zinc-700/40 text-zinc-400'}`}
                >
                  {pillar}: {count}
                </span>
              );
            })}
        </div>
      </div>

      <div className="space-y-2">
        <p className="font-mono text-xs text-zinc-500 uppercase tracking-wider">Month Breakdown</p>
        <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
          {parsed.months.map((month) => {
            const taskCount = month.focus_areas.length + month.suggested_tasks.length;
            return (
              <div
                key={month.month}
                className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg p-4 hover:border-zinc-700/60 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-zinc-100">
                      M{month.month.toString().padStart(2, '0')}
                    </span>
                    <span className="font-mono text-sm text-zinc-300 font-medium">
                      {month.title}
                    </span>
                  </div>
                  <span className="font-mono text-xs text-zinc-600">
                    {taskCount} items
                  </span>
                </div>
                
                {month.suggested_tasks.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-zinc-800/60">
                    <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-wider mb-2">
                      Suggested Tasks
                    </p>
                    <div className="space-y-1">
                      {month.suggested_tasks.slice(0, 3).map((task, i) => (
                        <p key={i} className="font-mono text-xs text-zinc-400 flex items-start gap-2">
                          <span className="text-zinc-600">›</span>
                          <span className="truncate">{task}</span>
                        </p>
                      ))}
                      {month.suggested_tasks.length > 3 && (
                        <p className="font-mono text-[10px] text-zinc-600">
                          +{month.suggested_tasks.length - 3} more tasks
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface RoadmapImportFormProps {
  onImportComplete?: (roadmapId: string) => void;
}

export function RoadmapImportForm({ onImportComplete }: RoadmapImportFormProps) {
  const [rawInput, setRawInput] = useState('');
  const [parsed, setParsed] = useState<ParsedRoadmap | null>(null);
  const [stats, setStats] = useState<{
    totalMonths: number;
    totalTasks: number;
    totalHours: number;
    pillarDistribution: Record<string, number>;
    categoryDistribution: Record<string, number>;
  } | null>(null);
  const [confidence, setConfidence] = useState<ConfidenceScore | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePreview = useCallback(() => {
    if (!rawInput.trim()) return;
    
    setIsPreviewLoading(true);
    setErrors([]);
    setWarnings([]);

    previewRoadmap(rawInput).then((result) => {
      setIsPreviewLoading(false);
      if (result) {
        setParsed(result.parsed);
        if (result.stats) {
          setStats(result.stats as typeof stats);
        }
        if (result.confidence) {
          setConfidence(result.confidence as ConfidenceScore);
        }
        setErrors(result.errors);
        setWarnings(result.warnings);
      }
    });
  }, [rawInput]);

  const handleImport = useCallback(() => {
    if (!parsed) return;
    
    setIsImporting(true);
    setErrors([]);

    importRoadmap(rawInput, true).then((result) => {
      setIsImporting(false);
      if (result.success && result.roadmap_id) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setRawInput('');
          setParsed(null);
          setStats(null);
          onImportComplete?.(result.roadmap_id!);
        }, 2500);
      } else {
        setErrors(result.errors || ['Import failed']);
        setWarnings(result.warnings || []);
      }
    });
  }, [parsed, rawInput, onImportComplete]);

  const handleLoadSample = useCallback(() => {
    setRawInput(SAMPLE_ROADMAP);
    setParsed(null);
    setStats(null);
    setErrors([]);
    setWarnings([]);
  }, []);

  const handleClear = useCallback(() => {
    setRawInput('');
    setParsed(null);
    setStats(null);
    setConfidence(null);
    setErrors([]);
    setWarnings([]);
  }, []);

  const handleTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRawInput(e.target.value);
    setParsed(null);
    setStats(null);
    setConfidence(null);
  }, []);

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-amber-400';
    return 'text-red-400';
  };

  const getConfidenceBar = (score: number) => {
    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all ${getConfidenceColor(score).replace('text-', 'bg-')}`}
            style={{ width: `${score}%` }}
          />
        </div>
        <span className={`font-mono text-xs ${getConfidenceColor(score)} w-12 text-right`}>
          {score}%
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {showSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-mono text-sm text-emerald-400 font-semibold">Blueprint Activated</p>
              <p className="font-mono text-xs text-emerald-300/60">Your roadmap is now ready for adaptive generation</p>
            </div>
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="font-mono text-sm text-zinc-300 uppercase tracking-wider">
            Paste Your Roadmap
          </label>
          <Button size="sm" variant="ghost" onClick={handleLoadSample}>
            Load Sample
          </Button>
        </div>
        <textarea
          value={rawInput}
          onChange={handleTextareaChange}
          placeholder={`Month 1: Topic Name
- Task or focus area 1
- Task or focus area 2
- Task or focus area 3

Month 2: Next Topic
- Another task
- More focus areas...`}
          className="w-full h-72 bg-zinc-900 border border-zinc-700/60 rounded-lg p-4 font-mono text-sm text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 resize-none"
        />
      </div>

      {errors.length > 0 && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-mono text-xs text-red-400 uppercase tracking-wider">Errors</p>
          </div>
          <ul className="space-y-1">
            {errors.map((err, i) => (
              <li key={i} className="font-mono text-xs text-red-300/80 flex items-start gap-2">
                <span className="text-red-400 mt-0.5">›</span>
                <span>{err}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {warnings.length > 0 && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="font-mono text-xs text-amber-400 uppercase tracking-wider">Warnings</p>
          </div>
          <ul className="space-y-1">
            {warnings.map((warn, i) => (
              <li key={i} className="font-mono text-xs text-amber-300/80 flex items-start gap-2">
                <span className="text-amber-400 mt-0.5">›</span>
                <span>{warn}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center gap-3">
        <Button
          variant="secondary"
          onClick={handlePreview}
          disabled={!rawInput.trim() || isPreviewLoading || isImporting}
        >
          {isPreviewLoading ? 'Parsing...' : 'Preview Blueprint'}
        </Button>
        <Button
          onClick={handleImport}
          disabled={!parsed || isImporting || isPreviewLoading}
          loading={isImporting}
        >
          {isImporting ? (
            'Activating...'
          ) : parsed ? (
            'Activate Blueprint'
          ) : (
            'Activate Blueprint'
          )}
        </Button>
        {rawInput && (
          <Button variant="ghost" onClick={handleClear}>
            Clear
          </Button>
        )}
      </div>

      {parsed && stats && (
        <div className="pt-6 border-t border-zinc-800">
          {confidence && (
            <div className="mb-6 p-4 bg-zinc-900/40 border border-zinc-800/60 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-zinc-800/60 rounded-lg flex items-center justify-center">
                  <span className={`font-mono text-lg font-bold ${getConfidenceColor(confidence.overall)}`}>
                    {confidence.overall}%
                  </span>
                </div>
                <div>
                  <p className="font-mono text-sm text-zinc-200 font-semibold">Parsing Confidence</p>
                  <p className="font-mono text-xs text-zinc-500">
                    {confidence.overall >= 80 ? 'High quality blueprint' : 
                     confidence.overall >= 60 ? 'Good blueprint, some warnings' : 
                     'Review warnings before activating'}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-wider mb-2">Title</p>
                  {getConfidenceBar(confidence.title_confidence)}
                </div>
                <div>
                  <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-wider mb-2">Months</p>
                  {getConfidenceBar(confidence.month_confidence)}
                </div>
                <div>
                  <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-wider mb-2">Tasks</p>
                  {getConfidenceBar(confidence.task_confidence)}
                </div>
                <div>
                  <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-wider mb-2">Format</p>
                  {getConfidenceBar(confidence.formatting_score)}
                </div>
              </div>
            </div>
          )}
          
          <RoadmapPreview parsed={parsed} stats={stats} />
        </div>
      )}

      {!parsed && rawInput && !isPreviewLoading && (
        <div className="pt-6 border-t border-zinc-800">
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-zinc-800/60 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="font-mono text-sm text-zinc-400 mb-2">Blueprint ready for preview</p>
            <p className="font-mono text-xs text-zinc-600">
              Click &quot;Preview Blueprint&quot; to see your parsed roadmap
            </p>
          </div>
        </div>
      )}
    </div>
  );
}