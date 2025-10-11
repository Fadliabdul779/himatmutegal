import Link from "next/link";
import { sanityClient, queries } from "../../lib/sanity";

export const metadata = { title: "Berita — Hima Informatika TMU" };

export default async function NewsPage() {
  let posts = [];
  if (sanityClient) {
    try {
      posts = await sanityClient.fetch(queries.posts);
    } catch {
      posts = [];
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="font-heading text-2xl font-bold">Berita & Pengumuman</h1>
      <p className="mt-2 text-slate-600">Kabar terbaru seputar HIMATIKA.</p>
      <div className="mt-6 grid md:grid-cols-3 gap-4">
        {posts.length > 0 ? (
          posts.map((p) => (
            <Link key={p._id} href={`/news/${p.slug || ''}`} className="block border rounded-lg p-4 hover:shadow-sm transition">
              <div className="text-sm text-slate-500">{p.publishedAt ? new Date(p.publishedAt).toLocaleDateString('id-ID') : ''}</div>
              <div className="mt-1 font-medium">{p.title}</div>
              {p.excerpt && <p className="mt-1 text-sm text-slate-600">{p.excerpt}</p>}
              <span className="mt-3 inline-block text-[var(--primary)] text-sm">Baca selengkapnya →</span>
            </Link>
          ))
        ) : (
          <div className="text-slate-600">Belum ada berita.</div>
        )}
      </div>
    </div>
  );
}