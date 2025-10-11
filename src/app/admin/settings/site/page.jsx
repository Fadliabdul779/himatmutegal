"use client";
import { useEffect, useState } from "react";

export default function AdminSiteSettingsPage() {
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [campusName, setCampusName] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/admin/site');
        const data = await res.json();
        setHeroTitle(data.heroTitle || "");
        setHeroSubtitle(data.heroSubtitle || "");
        setCampusName(data.campusName || "");
      } catch {}
    })();
  }, []);

  async function onSave(e) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch('/api/admin/site', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ heroTitle, heroSubtitle, campusName }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg('Pengaturan tersimpan');
        setHeroTitle(data.heroTitle || heroTitle);
        setHeroSubtitle(data.heroSubtitle || heroSubtitle);
        setCampusName(data.campusName || campusName);
      } else {
        setMsg(data.message || 'Gagal menyimpan');
      }
    } catch {
      setMsg('Gagal menyimpan, periksa jaringan');
    }
    setLoading(false);
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-heading font-bold">Pengaturan Dashboard</h1>
      <p className="mt-2 text-slate-600">Ubah teks utama (hero) di halaman beranda.</p>
      <form onSubmit={onSave} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium">Judul Hero</label>
          <input className="mt-1 w-full border rounded-lg px-3 py-2" value={heroTitle} onChange={(e)=>setHeroTitle(e.target.value)} placeholder="Himpunan Mahasiswa Informatika" />
        </div>
        <div>
          <label className="block text-sm font-medium">Subjudul Hero</label>
          <input className="mt-1 w-full border rounded-lg px-3 py-2" value={heroSubtitle} onChange={(e)=>setHeroSubtitle(e.target.value)} placeholder="Tempat berkarya, berkolaborasi..." />
        </div>
        <div>
          <label className="block text-sm font-medium">Nama Kampus</label>
          <input className="mt-1 w-full border rounded-lg px-3 py-2" value={campusName} onChange={(e)=>setCampusName(e.target.value)} placeholder="TMU (Tegal Muhammadiyah University)" />
        </div>
        {msg && <div className="text-sm text-slate-700">{msg}</div>}
        <button className="rounded-lg bg-[var(--primary)] text-white px-4 py-2 hover:scale-[1.03] transition" disabled={loading}>
          {loading ? 'Menyimpan...' : 'Simpan'}
        </button>
      </form>
      <div className="mt-6 text-sm text-slate-500">
        Catatan: Konfigurasi disimpan lokal (dev). Untuk produksi, gunakan database/CRM atau CMS.
      </div>
    </div>
  );
}