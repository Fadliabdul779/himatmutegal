import Link from "next/link";

export const metadata = {
  title: "Dashboard Admin — Hima Informatika TMU",
};

export default function AdminDashboard() {
  const cards = [
    { href: "/admin/events", title: "Kelola Event", desc: "Tambah/edit event, pendaftaran, status." },
    { href: "/admin/news", title: "Kelola Berita", desc: "Posting, tag, publikasi." },
    { href: "/admin/members", title: "Anggota", desc: "Verifikasi dan data membership." },
    { href: "/admin/resources", title: "Dokumen & Resource", desc: "Materi, akses anggota." },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="rounded-md bg-[var(--neutral-50)] border border-slate-200 px-4 py-2 text-sm text-slate-700 mb-4">
        Himpunan Mahasiswa Informatika TMU (Tegal Muhammadiyah University)
      </div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Dashboard Admin</h1>
        <form action="/api/admin/logout" method="POST">
          <button className="rounded-lg border px-3 py-2">Logout</button>
        </form>
      </div>

      <p className="mt-2 text-slate-600">Kelola konten situs Hima Informatika.</p>
      <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="block border rounded-lg p-4 hover:shadow-sm transition">
            <div className="font-medium">{c.title}</div>
            <p className="mt-1 text-sm text-slate-600">{c.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}