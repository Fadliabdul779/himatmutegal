import { getSiteSettings } from "../../lib/site";

export const metadata = {
  title: 'Tentang Kami — Hima Informatika',
  description:
    'Visi, misi, struktur kepengurusan, dan sejarah singkat Himpunan Mahasiswa Informatika.',
};

export default async function AboutPage() {
  const settings = await getSiteSettings();

  const pengurus = Array.isArray(settings.pengurus) ? settings.pengurus : [];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <header className="text-center mb-12">
        <h1 className="text-3xl font-bold">Tentang Kami</h1>
        <p className="mt-3 text-slate-700">{settings.aboutIntro}</p>
      </header>

      <section className="grid md:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-xl font-semibold">Visi</h2>
          <p className="mt-2 text-slate-700">{settings.visi}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Misi</h2>
          <ul className="mt-2 list-disc list-inside space-y-1 text-slate-700">
            {(settings.misi || []).map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
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
          {(settings.history || []).map((para, idx) => (
            <p key={idx} className="text-slate-700">{para}</p>
          ))}
        </div>
      </section>
    </div>
  );
}