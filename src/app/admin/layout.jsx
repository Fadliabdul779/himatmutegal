"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const menu = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/events", label: "Event" },
  { href: "/admin/news", label: "Berita" },
  { href: "/admin/members", label: "Anggota" },
  { href: "/admin/resources", label: "Resource" },
  { href: "/admin/settings/auth", label: "Pengaturan Autentikasi" },
  { href: "/admin/settings/site", label: "Pengaturan Dashboard" },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const devMode = typeof window !== 'undefined' && (process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true' || process.env.DISABLE_AUTH === 'true');
  return (
    <div className="min-h-screen flex">
      <aside className="w-60 shrink-0 border-r border-slate-200 bg-white">
        <div className="h-14 flex items-center px-4 border-b">
          <Link href="/admin" className="font-heading font-bold">Admin</Link>
        </div>
        <nav className="px-2 py-3 space-y-1">
          {menu.map((m) => {
            const active = pathname === m.href;
            return (
              <Link
                key={m.href}
                href={m.href}
                className={`block rounded-lg px-3 py-2 ${active ? 'bg-[var(--primary)] text-white' : 'hover:bg-slate-100'}`}
              >
                {m.label}
              </Link>
            );
          })}
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full text-left rounded-lg px-3 py-2 text-red-600 hover:bg-red-50"
          >
            Logout
          </button>
        </nav>
      </aside>
      <main className="flex-1 h-screen overflow-auto bg-white relative">
        {devMode && (
          <div className="absolute top-2 right-2 z-20 rounded-md bg-yellow-100 border border-yellow-300 text-yellow-800 px-3 py-1 text-sm">
            Dev Mode aktif: proteksi akses dimatikan
          </div>
        )}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}