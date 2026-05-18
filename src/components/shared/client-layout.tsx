'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useServiceWorker } from '@/hooks';
import { MobileNav, OfflineIndicator } from '@/components/shared';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  useServiceWorker();

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
      <header className="fixed top-0 left-0 right-0 z-40 h-12 bg-zinc-950/80 backdrop-blur-sm border-b border-zinc-800/60 flex items-center px-4">
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
        </Link>
      </header>
      <div className="pt-12">
        <OfflineIndicator />
        {children}
      </div>
      <MobileNav />
    </>
  );
}