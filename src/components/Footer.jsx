import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-6 py-8 grid md:grid-cols-4 gap-6">
        <div>
          <h4 className="font-semibold mb-2">Tentang</h4>
          <p className="text-sm text-slate-600">
            Himpunan Mahasiswa Informatika — wadah berkegiatan, belajar, dan berkolaborasi.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Tautan Cepat</h4>
          <div className="flex flex-col text-sm">
            <Link href="/events">Kegiatan</Link>
            <Link href="/news">Berita</Link>
            <Link href="/resources">Resource</Link>
            <Link href="/membership">Bergabung</Link>
            <Link href="/about">Tentang Kami</Link>
            <Link href="/privacy">Privasi</Link>
            <Link href="/code-of-conduct">Code of Conduct</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Kontak</h4>
          <ul className="text-sm text-slate-600 space-y-1">
            <li>Email: <a href="mailto:himitikatmu@gmail.com" className="text-[var(--primary)]">himitikatmu@gmail.com</a></li>
            <li>Telp: 085869230249</li>
            <li>Alamat: Jl. melati No. 27, Kejambon, Kec. Tegal Timur, Kota Tegal, Jawa Tengah</li>
            <li>Instagram: <a href="https://instagram.com/hmpi_tmu" target="_blank" className="text-[var(--primary)]">@hmpi_tmu</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Newsletter</h4>
          <form className="flex gap-2">
            <input className="flex-1 border rounded-lg px-3 py-2" placeholder="Email kamu" />
            <button className="rounded-lg bg-[var(--secondary)] text-white px-4 py-2 hover:scale-[1.03] transition">
              Daftar
            </button>
          </form>
        </div>
      </div>
      <div className="px-6 py-4 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Himpunan Mahasiswa Informatika — All rights reserved.
      </div>
    </footer>
  );
}