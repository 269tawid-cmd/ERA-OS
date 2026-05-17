'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Home', icon: '▣' },
  { href: '/roadmap', label: 'Roadmap', icon: '◈' },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-zinc-900/95 backdrop-blur-md border-t border-zinc-800/60">
      <div className="flex items-center justify-around px-2 py-2 safe-area-bottom">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-colors duration-150 min-w-[64px] ${
                isActive
                  ? 'text-red-400'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <span className="font-mono text-lg">{item.icon}</span>
              <span className="font-mono text-[9px] uppercase tracking-wider">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}