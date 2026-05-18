import { getUser } from '@/lib/supabase/auth';
import { redirect } from 'next/navigation';
import { getActiveRoadmap } from '@/lib/actions/roadmap';
import { RoadmapImportForm } from '@/components/roadmap/import-form';
import { RoadmapSwitcher } from '@/components/roadmap/switcher';
import { Card, CardHeader, CardContent } from '@/components/ui';
import Link from 'next/link';

const pageSubtitle = 'roadmap import';

export default async function ImportPage() {
  const user = await getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const activeRoadmap = await getActiveRoadmap();

  return (
    <div className="min-h-screen text-zinc-200">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Link
              href="/"
              className="font-mono text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              era-os
            </Link>
            <span className="font-mono text-xs text-zinc-700" suppressHydrationWarning>{'//'}</span>
            <span className="font-mono text-xs text-zinc-500">{pageSubtitle}</span>
          </div>
          <h1 className="font-mono text-3xl font-bold text-zinc-100 tracking-tight mb-2">
            Activate Your Blueprint
          </h1>
          <p className="font-mono text-sm text-zinc-500 max-w-xl">
            Import a cybersecurity learning roadmap to begin your adaptive progression journey.
            Paste your structured roadmap below.
          </p>
        </header>

        {activeRoadmap && (
          <div className="mb-6 p-4 bg-zinc-900/60 border border-emerald-500/30 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="font-mono text-sm text-emerald-400">Active Roadmap</span>
              </div>
              <div>
                <span className="font-mono text-lg font-semibold text-zinc-200">
                  {activeRoadmap.title}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          <Card className="bg-zinc-900/80 border border-zinc-700/60 backdrop-blur-sm overflow-hidden">
            <CardHeader className="py-4 px-6 border-b border-zinc-800">
              <h2 className="font-mono text-base font-semibold text-zinc-200">
                Blueprint Input
              </h2>
              <p className="font-mono text-xs text-zinc-500 mt-1">
                Format: Month headers with bullet-point focus areas and tasks
              </p>
            </CardHeader>
            <CardContent className="p-6">
              <RoadmapImportForm />
            </CardContent>
          </Card>

          <div className="border-t border-zinc-800 pt-6">
            <h3 className="font-mono text-sm text-zinc-400 uppercase tracking-wider mb-4">
              Quick Reference
            </h3>
            <Card className="bg-zinc-900/40 border border-zinc-800/60">
              <CardContent className="p-4">
                <pre className="font-mono text-xs text-zinc-500 whitespace-pre-wrap leading-relaxed">{`# Year 1: Cybersecurity Foundation

Month 1: Linux Fundamentals
- Master basic Linux commands (ls, cd, cat, grep)
- Learn bash scripting basics
- Understand file permissions

Month 2: Networking Essentials
- TCP/IP and OSI model deep dive
- Learn Wireshark for packet analysis
- Practice subnetting

Month 3: Web Application Security
- OWASP Top 10 theory and practice
- DVWA exercises: SQLi, XSS
- Learn Burp Suite basics`}</pre>
              </CardContent>
            </Card>
          </div>

          <div className="border-t border-zinc-800 pt-6">
            <RoadmapSwitcher />
          </div>
        </div>
      </main>
    </div>
  );
}