import Link from "next/link";
import { sanityClient, queries } from "../../lib/sanity";

export const metadata = {
  title: "Dashboard Anggota — Hima Informatika TMU",
};

export default async function MemberDashboard() {
  const cards = [
    { href: "/events", title: "Kegiatan", desc: "Ikuti event dan kegiatan komunitas." },
    { href: "/resources", title: "Resource", desc: "Materi belajar dan panduan karier." },
    { href: "/membership", title: "Keanggotaan", desc: "Update data dan status keanggotaan." },
  ];

  // Ambil resource anggota (status 'member' atau tag 'member')
  let resources = [];
  if (sanityClient) {
    try {
      const posts = await sanityClient.fetch(queries.posts);
      resources = (posts || []).filter((p) => p.status === 'member' || (Array.isArray(p.tags) && p.tags.includes('member'))).slice(0, 6);
    } catch (e) {
      resources = [];
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="rounded-md bg-[var(--neutral-50)] border border-slate-200 px-4 py-2 text-sm text-slate-700">
        Himpunan Mahasiswa Informatika TMU (Tegal Muhammadiyah University)
      </div>
      <h1 className="font-heading text-2xl font-bold">Dashboard Anggota</h1>
      <p className="mt-2 text-slate-600">Area khusus anggota HIMATIKA.</p>
      <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map((c) => (
          <a key={c.href} href={c.href} className="block border rounded-lg p-4 hover:shadow-sm transition">
            <div className="font-medium">{c.title}</div>
            <p className="mt-1 text-sm text-slate-600">{c.desc}</p>
          </a>
        ))}
      </div>

      <div className="mt-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-block w-6 h-6 bg-[var(--secondary)] rounded" />
          <h2 className="text-xl font-semibold">Resource Anggota</h2>
        </div>
        {resources.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {resources.map((p) => (
              <Link key={p._id} href={`/news/${p.slug || ""}`} className="block border rounded-lg p-4 hover:shadow-sm transition">
                <div className="text-sm text-slate-500">{p.publishedAt ? new Date(p.publishedAt).toLocaleDateString("id-ID") : ""}</div>
                <div className="mt-2 font-medium">{p.title}</div>
                {p.excerpt && <p className="mt-1 text-sm text-slate-600">{p.excerpt}</p>}
                <span className="mt-3 inline-block text-[var(--primary)] text-sm">Baca →</span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-slate-600">Belum ada resource khusus anggota.</div>
        )}
      </div>
    </div>
  );
}