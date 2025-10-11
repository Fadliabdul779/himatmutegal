'use client';

import Link from 'next/link';
import { useState } from 'react';

const nav = [
  { href: '/', label: 'Beranda' },
  { href: '/about', label: 'Tentang Kami' },
  { href: '/events', label: 'Kegiatan' },
  { href: '/news', label: 'Berita' },
  { href: '/projects', label: 'Proyek' },
  { href: '/resources', label: 'Resource' },
  { href: '/gallery', label: 'Galeri' },
  { href: '/membership', label: 'Bergabung' },
  { href: '/sponsors', label: 'Sponsor' },
  { href: '/contact', label: 'Kontak' },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold">
          Hima Informatika
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="hover:text-blue-600">
              {n.label}
            </Link>
          ))}
        </nav>
        <button className="md:hidden p-2" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          <span className="block w-6 h-[2px] bg-slate-900" />
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-slate-200 px-6 py-3 space-y-2">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="block" onClick={() => setOpen(false)}>
              {n.label}
            </Link>
          ))}
          <Link href="/admin" className="inline-block mt-2 rounded-lg border px-3 py-2">Admin</Link>
        </div>
      )}
    </header>
  );
}