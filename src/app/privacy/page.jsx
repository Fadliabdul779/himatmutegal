export const metadata = {
  title: 'Kebijakan Privasi — Hima Informatika',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold">Kebijakan Privasi</h1>
      <p className="mt-3 text-slate-700">
        Kami menghargai privasi Anda. Kebijakan ini menjelaskan bagaimana data dikumpulkan,
        digunakan, dan dilindungi saat Anda menggunakan situs Hima Informatika.
      </p>
      <h2 className="mt-8 text-xl font-semibold">Data yang Dikumpulkan</h2>
      <ul className="mt-2 list-disc list-inside text-slate-700 space-y-1">
        <li>Informasi pendaftaran event dan membership (nama, NIM, email, prodi).</li>
        <li>Data penggunaan situs untuk analitik (Google Analytics).</li>
      </ul>
      <h2 className="mt-6 text-xl font-semibold">Penggunaan Data</h2>
      <ul className="mt-2 list-disc list-inside text-slate-700 space-y-1">
        <li>Administrasi pendaftaran dan komunikasi terkait kegiatan.</li>
        <li>Peningkatan layanan dan pengalaman pengguna.</li>
      </ul>
      <h2 className="mt-6 text-xl font-semibold">Keamanan & Penyimpanan</h2>
      <p className="mt-2 text-slate-700">
        Kami menerapkan praktik keamanan standar dan membatasi akses berdasarkan peran. Data yang
        sensitif disimpan secara aman dan hanya diakses oleh pihak berwenang.
      </p>
      <h2 className="mt-6 text-xl font-semibold">Kontak</h2>
      <p className="mt-2 text-slate-700">Jika ada pertanyaan, hubungi kami melalui halaman Kontak.</p>
    </div>
  );
}