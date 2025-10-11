export const metadata = {
  title: 'Code of Conduct — Hima Informatika',
};

export default function CodeOfConductPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold">Code of Conduct</h1>
      <p className="mt-3 text-slate-700">
        Kami berkomitmen pada lingkungan yang inklusif, profesional, dan saling menghormati.
        Ketentuan berikut berlaku bagi seluruh anggota dan peserta kegiatan.
      </p>
      <h2 className="mt-8 text-xl font-semibold">Prinsip Utama</h2>
      <ul className="mt-2 list-disc list-inside text-slate-700 space-y-1">
        <li>Hormati sesama, tanpa diskriminasi.</li>
        <li>Jaga integritas, kejujuran, dan profesionalitas.</li>
        <li>Laporkan pelanggaran kepada pengurus.</li>
        <li>Patuhi aturan kampus dan hukum yang berlaku.</li>
      </ul>
      <h2 className="mt-6 text-xl font-semibold">Pelanggaran</h2>
      <p className="mt-2 text-slate-700">
        Pelanggaran dapat berakibat pada teguran, pembatasan akses, atau sanksi organisasi sesuai
        ketentuan yang berlaku.
      </p>
    </div>
  );
}