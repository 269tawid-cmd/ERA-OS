'use client';

import { useEffect } from 'react';
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
      <OfflineIndicator />
      {children}
      <MobileNav />
    </>
  );
}