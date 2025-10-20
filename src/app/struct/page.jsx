import Link from "next/link";
import { sanityClient, queries } from "../../lib/sanity";

export const metadata = {
  title: "Dashboard Struktural — Hima Informatika TMU",
};

export default async function StructDashboard() {
  const cards = [
    { href: "/events", title: "Agenda & Rapat", desc: "Lihat agenda internal dan rapat." },
    { href: "/projects", title: "Program Kerja", desc: "Pantau proker dan progres." },
    { href: "/resources", title: "Dokumen Internal", desc: "Akses materi dan pedoman." },
  ];

  // Ambil pengumuman internal (status 'internal' atau tag mencakup 'internal')
  let internal = [];
  if (sanityClient) {
    try {
      const posts = await sanityClient.fetch(queries.posts);
      internal = (posts || []).filter((p) => p.status === 'internal' || (Array.isArray(p.tags) && p.tags.includes('internal'))).slice(0, 6);
    } catch (e) {
      internal = [];
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="rounded-md bg-[var(--neutral-50)] border border-slate-200 px-4 py-2 text-sm text-slate-700">
        Himpunan Mahasiswa Informatika TMU (Tegal Muhammadiyah University)
      </div>
      <h1 className="font-heading text-2xl font-bold">Dashboard Struktural</h1>
      <p className="mt-2 text-slate-600">Akses khusus pengurus dan struktural HIMATIKA.</p>
      <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="block border rounded-lg p-4 hover:shadow-sm transition">
            <div className="font-medium">{c.title}</div>
            <p className="mt-1 text-sm text-slate-600">{c.desc}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-block w-6 h-6 bg-[var(--accent)] rounded" />
          <h2 className="text-xl font-semibold">Pengumuman Internal</h2>
        </div>
        {internal.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {internal.map((p) => (
              <Link key={p._id} href={`/news/${p.slug || ""}`} className="block border rounded-lg p-4 hover:shadow-sm transition">
                <div className="text-sm text-slate-500">{p.publishedAt ? new Date(p.publishedAt).toLocaleDateString("id-ID") : ""}</div>
                <div className="mt-2 font-medium">{p.title}</div>
                {p.excerpt && <p className="mt-1 text-sm text-slate-600">{p.excerpt}</p>}
                <span className="mt-3 inline-block text-[var(--primary)] text-sm">Baca selengkapnya →</span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-slate-600">Belum ada pengumuman internal.</div>
        )}
      </div>
    </div>
  );
}