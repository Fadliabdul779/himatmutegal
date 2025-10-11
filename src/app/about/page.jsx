export const metadata = {
  title: 'Tentang Kami — Hima Informatika',
  description:
    'Visi, misi, struktur kepengurusan, dan sejarah singkat Himpunan Mahasiswa Informatika.',
};

export default function AboutPage() {
  const pengurus = [
    { nama: 'Ketua Hima', jabatan: 'Ketua', foto: '/vercel.svg' },
    { nama: 'Wakil Ketua', jabatan: 'Wakil Ketua', foto: '/vercel.svg' },
    { nama: 'Sekretaris', jabatan: 'Sekretaris', foto: '/vercel.svg' },
    { nama: 'Bendahara', jabatan: 'Bendahara', foto: '/vercel.svg' },
    { nama: 'Koordinator Acara', jabatan: 'Divisi Acara', foto: '/vercel.svg' },
    { nama: 'Koordinator Media', jabatan: 'Divisi Media', foto: '/vercel.svg' },
  ];

  const timeline = [
    { tahun: '2018', deskripsi: 'Hima Informatika resmi dibentuk.' },
    { tahun: '2020', deskripsi: 'Menyelenggarakan hackathon perdana tingkat kampus.' },
    { tahun: '2022', deskripsi: 'Kolaborasi dengan industri untuk program magang.' },
    { tahun: '2024', deskripsi: 'Transformasi digital dan portal anggota.' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <header className="text-center mb-12">
        <h1 className="text-3xl font-bold">Tentang Kami</h1>
        <p className="mt-3 text-slate-700">
          Himpunan Mahasiswa Informatika adalah wadah berkolaborasi, berkarya, dan berkembang
          bagi mahasiswa Informatika.
        </p>
      </header>

      <section className="grid md:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-xl font-semibold">Visi</h2>
          <p className="mt-2 text-slate-700">
            Mewujudkan mahasiswa Informatika yang kreatif, berintegritas, dan berkontribusi pada
            masyarakat.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Misi</h2>
          <ul className="mt-2 list-disc list-inside space-y-1 text-slate-700">
            <li>Menyelenggarakan kegiatan edukatif dan aplikatif (workshop, seminar, hackathon).</li>
            <li>Mendorong proyek nyata, riset terapan, dan kolaborasi lintas disiplin.</li>
            <li>Memfasilitasi jejaring dengan alumni, industri, dan komunitas.</li>
            <li>Menjaga budaya inklusif, profesional, dan beretika.</li>
          </ul>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold">Struktur Kepengurusan</h2>
        <div className="mt-4 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {pengurus.map((p) => (
            <div key={p.nama} className="border rounded-lg p-4 flex items-center gap-4">
              <img src={p.foto} alt={p.nama} className="w-12 h-12 rounded-full bg-slate-100" />
              <div>
                <div className="font-medium">{p.nama}</div>
                <div className="text-slate-600 text-sm">{p.jabatan}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Sejarah Singkat</h2>
        <div className="mt-4 space-y-4">
          {timeline.map((t) => (
            <div key={t.tahun} className="flex items-start gap-4">
              <div className="w-16 flex-shrink-0 font-semibold">{t.tahun}</div>
              <p className="text-slate-700">{t.deskripsi}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}