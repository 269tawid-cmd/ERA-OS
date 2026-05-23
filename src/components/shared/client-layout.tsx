'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useServiceWorker } from '@/hooks';
import { MobileNav, OfflineIndicator } from '@/components/shared';
import { OperationalAcknowledgmentProvider } from './operational-acknowledgment';

const TONE_KEY = 'era-os-environment-tone';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [tone, setTone] = useState('normal');
  const toneRef = useRef(tone);
  const pathname = usePathname();
  const isWorkspace = pathname === '/workspace';
  useServiceWorker();

  /* ── Cross-page atmospheric tone from workspace ── */
  useEffect(() => {
    const stored = localStorage.getItem(TONE_KEY);
    if (stored) {
      setTone(stored);
      toneRef.current = stored;
    }

    const poll = setInterval(() => {
      const current = localStorage.getItem(TONE_KEY);
      if (current && current !== toneRef.current) {
        toneRef.current = current;
        setTone(current);
      }
    }, 3000);

    return () => clearInterval(poll);
  }, []);

  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'mobile-web-app-capable';
    meta.content = 'yes';
    document.head.appendChild(meta);

    const appleMeta = document.createElement('meta');
    appleMeta.name = 'apple-mobile-web-app-capable';
    appleMeta.content = 'yes';
    document.head.appendChild(appleMeta);

    const statusMeta = document.createElement('meta');
    statusMeta.name = 'apple-mobile-web-app-status-bar-style';
    statusMeta.content = 'black-translucent';
    document.head.appendChild(statusMeta);

    return () => {
      document.head.removeChild(meta);
      document.head.removeChild(appleMeta);
      document.head.removeChild(statusMeta);
    };
  }, []);

  return (
    <>
      {/* Shared cinematic atmosphere — present across all pages */}
      <div className="cinematic-atmosphere" data-tone={tone} />

      {!isWorkspace && (
        <header className="fixed top-0 left-0 right-0 z-40 h-12 cyber-header backdrop-blur-md flex items-center px-4">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 relative">
              <Image
                src="/logo.png"
                alt="Era OS"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="font-mono text-sm text-zinc-300 tracking-wide">ERA OS</span>
            <span className="font-mono text-[9px] text-zinc-700 tracking-widest ml-2 hidden sm:inline">BRIEFING</span>
          </Link>
        </header>
      )}

      <div className={isWorkspace ? '' : 'pt-12'}>
        <OfflineIndicator />
        <OperationalAcknowledgmentProvider>
          {children}
        </OperationalAcknowledgmentProvider>
      </div>

      {!isWorkspace && <MobileNav />}
    </>
  );
}