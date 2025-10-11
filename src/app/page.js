import Link from "next/link";
import { upcomingEvents } from "../lib/data";
import EventCard from "../components/EventCard";
import { getSiteSettings } from "../lib/site";

export default async function HomePage() {
  const nextEvent = upcomingEvents()[0];
  const settings = await getSiteSettings();

  return (
    <div>
      <section className="px-6 py-16 md:py-24 bg-gradient-to-br from-[var(--primary)]/10 to-[var(--secondary)]/10">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-heading text-3xl md:text-5xl font-bold tracking-tight">
            <span className="brand-gradient">{settings.heroTitle}</span> — {settings.campusName}
          </h1>
          <p className="mt-4 text-lg md:text-xl text-slate-700">
            {settings.heroSubtitle}
          </p>
          <div className="mt-8 flex gap-4">
            <Link
              href="/membership"
              className="inline-flex items-center rounded-lg bg-[var(--primary)] text-white px-5 py-3 shadow hover:scale-[1.03] transition"
            >
              Gabung Sekarang
            </Link>
            <Link
              href="/events"
              className="inline-flex items-center rounded-lg bg-[var(--secondary)] text-white px-5 py-3 hover:scale-[1.03] transition"
            >
              Lihat Kegiatan
            </Link>
          </div>
        </div>
      </section>

      {/* Section Login */}
      <section className="px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <span className="inline-block w-6 h-6 bg-[var(--primary)] rounded" />
            <h2 className="text-2xl font-semibold">Area Login</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link href="/admin/login" className="block rounded-lg border p-4 hover:shadow-sm transition">
              <div className="font-medium">Login Admin</div>
              <p className="text-sm text-slate-600 mt-1">Masuk untuk mengelola konten situs.</p>
            </Link>
            <Link href="/struct/login" className="block rounded-lg border p-4 hover:shadow-sm transition">
              <div className="font-medium">Login Struktural</div>
              <p className="text-sm text-slate-600 mt-1">Akses internal pengurus dan struktural.</p>
            </Link>
            <Link href="/member/login" className="block rounded-lg border p-4 hover:shadow-sm transition">
              <div className="font-medium">Login Anggota Hima</div>
              <p className="text-sm text-slate-600 mt-1">Masuk untuk fitur anggota dan resource.</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <span className="inline-block w-6 h-6 bg-[var(--primary)] rounded" />
            <h2 className="text-2xl font-semibold">Acara Mendatang</h2>
          </div>
          {nextEvent ? (
            <EventCard event={nextEvent} highlight />
          ) : (
            <p>Belum ada acara mendatang.</p>
          )}
        </div>
      </section>

      <section className="px-6 py-12 bg-[var(--neutral-50)]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <span className="inline-block w-6 h-6 bg-[var(--accent)] rounded" />
            <h2 className="text-2xl font-semibold">Pengumuman</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[1,2,3].map((i) => (
              <Link key={i} href="/news" className="block border rounded-lg p-4 hover:shadow-sm transition">
                <div className="text-sm text-slate-500">12 Okt 2025</div>
                <div className="mt-2 font-medium">Pengumuman #{i}</div>
                <p className="mt-1 text-sm text-slate-600">Ringkasan singkat pengumuman kampus/organisasi.</p>
                <span className="mt-3 inline-block text-[var(--primary)] text-sm">Baca selengkapnya →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <span className="inline-block w-6 h-6 bg-[var(--secondary)] rounded" />
            <h2 className="text-2xl font-semibold">Program Kerja</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Workshop Pemrograman', desc: 'Seri praktis mingguan untuk meningkatkan skill.' },
              { title: 'Seminar & Talks', desc: 'Topik teknologi terkini bersama praktisi.' },
              { title: 'Hackathon', desc: 'Ajang kompetisi membangun solusi nyata.' },
            ].map((p) => (
              <div key={p.title} className="border rounded-lg p-5">
                <div className="font-medium">{p.title}</div>
                <p className="mt-1 text-sm text-slate-600">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-12 bg-[var(--neutral-50)]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <span className="inline-block w-6 h-6 bg-[var(--primary)] rounded" />
            <h2 className="text-2xl font-semibold">Ikuti Kami di Instagram</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, idx) => (
              <a
                key={idx}
                href="https://instagram.com/hmpi_tmu"
                target="_blank"
                rel="noopener noreferrer"
                className="block aspect-square rounded-lg bg-gradient-to-br from-[var(--primary)]/20 to-[var(--secondary)]/20 hover:opacity-90"
              />
            ))}
          </div>
          <div className="mt-4">
            <Link href="https://instagram.com/hmpi_tmu" target="_blank" className="text-[var(--primary)]">@hmpi_tmu</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
