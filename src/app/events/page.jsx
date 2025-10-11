import Link from "next/link";
import { sanityClient, queries } from "../../lib/sanity";

export const metadata = { title: "Kegiatan — Hima Informatika TMU" };

export default async function EventsPage() {
  let events = [];
  if (sanityClient) {
    try {
      events = await sanityClient.fetch(queries.events);
    } catch {
      events = [];
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="font-heading text-2xl font-bold">Kegiatan & Acara</h1>
      <p className="mt-2 text-slate-600">Ikuti kegiatan dan acara terbaru HIMATIKA.</p>
      <div className="mt-6 grid md:grid-cols-3 gap-4">
        {events.length > 0 ? (
          events.map((e) => (
            <Link key={e._id} href={`/events/${e.slug?.current || ''}`} className="block border rounded-lg p-4 hover:shadow-sm transition">
              <div className="text-sm text-slate-500">{e.date ? new Date(e.date).toLocaleDateString('id-ID') : ''}</div>
              <div className="mt-1 font-medium">{e.title}</div>
              {e.summary && <p className="mt-1 text-sm text-slate-600">{e.summary}</p>}
              <span className="mt-3 inline-block text-[var(--primary)] text-sm">Detail acara →</span>
            </Link>
          ))
        ) : (
          <div className="text-slate-600">Belum ada kegiatan.</div>
        )}
      </div>
    </div>
  );
}