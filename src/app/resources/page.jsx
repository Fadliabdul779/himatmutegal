import Link from "next/link";
import { sanityClient, queries } from "../../lib/sanity";
import { getSiteSettings } from "../../lib/site";

export const metadata = { title: "Resource — Hima Informatika TMU" };

export default async function ResourcesPage() {
  let resources = [];
  if (sanityClient) {
    try {
      const posts = await sanityClient.fetch(queries.posts);
      resources = (posts || []).filter((p) => {
        const tags = Array.isArray(p.tags) ? p.tags : [];
        return p.status === 'member' || tags.includes('resource');
      });
    } catch {
      resources = [];
    }
  }

  const settings = await getSiteSettings();
  const handle = (settings?.instagram || '').replace(/^@/, '');
  const instagramPosts = Array.isArray(settings?.instagramPosts) ? settings.instagramPosts : [];
  const embeds = instagramPosts
    .map((url) => {
      const m = String(url).match(/instagram\.com\/(p|reel)\/([^\/?#]+)/i);
      return m ? `https://www.instagram.com/${m[1]}/${m[2]}/embed` : null;
    })
    .filter(Boolean);
  const documents = Array.isArray(settings?.documents) ? settings.documents : [];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="font-heading text-2xl font-bold">Dokumen & Resource</h1>
      <p className="mt-2 text-slate-600">Akses materi dan dokumen untuk anggota.</p>
      <div className="mt-6 grid md:grid-cols-3 gap-4">
        {resources.length > 0 ? (
          resources.map((p) => (
            <Link key={p._id} href={`/news/${p.slug || ''}`} className="block border rounded-lg p-4 hover:shadow-sm transition">
              <div className="text-sm text-slate-500">{p.publishedAt ? new Date(p.publishedAt).toLocaleDateString('id-ID') : ''}</div>
              <div className="mt-1 font-medium">{p.title}</div>
              {p.excerpt && <p className="mt-1 text-sm text-slate-600">{p.excerpt}</p>}
              <span className="mt-3 inline-block text-[var(--primary)] text-sm">Buka →</span>
            </Link>
          ))
        ) : (
          <div className="text-slate-600">Belum ada resource tersedia.</div>
        )}
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold">Dokumen</h2>
        <div className="mt-2 grid md:grid-cols-2 gap-4">
          {documents.length > 0 ? (
            documents.map((d, idx) => (
              <a key={idx} href={d.url} target="_blank" rel="noopener noreferrer" className="block border rounded-lg p-4 hover:shadow-sm transition">
                <div className="font-medium">{d.title}</div>
                <div className="text-sm text-slate-600 break-all">{d.url}</div>
                <span className="mt-3 inline-block text-[var(--primary)] text-sm">Unduh/Buka →</span>
              </a>
            ))
          ) : (
            <div className="text-slate-600">Belum ada dokumen.</div>
          )}
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold">Posting Instagram</h2>
        <div className="mt-2 grid md:grid-cols-3 gap-4">
          {embeds.length > 0 ? (
            embeds.map((src, i) => (
              <iframe
                key={i}
                src={src}
                className="w-full min-h-[480px] border rounded-lg"
                allowFullScreen
                sandbox="allow-scripts allow-same-origin allow-popups"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ))
          ) : (
            <p className="text-slate-600">Belum ada posting ditambahkan.</p>
          )}
        </div>
      </div>

      <div className="mt-10 border rounded-lg p-4">
        <h2 className="text-lg font-semibold">Kontak</h2>
        <ul className="mt-2 text-slate-700 space-y-1">
          <li><strong>Email:</strong> <a className="text-blue-600" href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a></li>
          <li><strong>Telp:</strong> {settings.contactPhone}</li>
          <li><strong>Alamat:</strong> {settings.contactAddress}</li>
          <li><strong>Instagram:</strong> <a className="text-blue-600" href={`https://instagram.com/${handle}`} target="_blank" rel="noopener noreferrer">@{handle}</a></li>
        </ul>
        <p className="mt-3 text-sm text-slate-500">Data kontak dapat diedit melalui halaman Pengaturan Dashboard (Admin).</p>
      </div>
    </div>
  );
}