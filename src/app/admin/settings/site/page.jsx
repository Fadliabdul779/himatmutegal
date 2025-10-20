"use client";
import { useEffect, useState } from "react";

export default function AdminSiteSettingsPage() {
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [campusName, setCampusName] = useState("");
  // kontak
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactAddress, setContactAddress] = useState("");
  const [instagram, setInstagram] = useState("");
  // tentang kami
  const [aboutIntro, setAboutIntro] = useState("");
  const [visi, setVisi] = useState("");
  const [misiText, setMisiText] = useState("");
  const [historyText, setHistoryText] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [pengurus, setPengurus] = useState([]);
  const [instagramPostsText, setInstagramPostsText] = useState("");
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/admin/site');
        const data = await res.json();
        setHeroTitle(data.heroTitle || "");
        setHeroSubtitle(data.heroSubtitle || "");
        setCampusName(data.campusName || "");
        // kontak
        setContactEmail(data.contactEmail || "");
        setContactPhone(data.contactPhone || "");
        setContactAddress(data.contactAddress || "");
        setInstagram(data.instagram || "");
        // tentang
        setAboutIntro(data.aboutIntro || "");
        setVisi(data.visi || "");
        setMisiText(Array.isArray(data.misi) ? data.misi.join("\n") : (data.misi || ""));
        setHistoryText(Array.isArray(data.history) ? data.history.join("\n") : (data.history || ""));
        setPengurus(Array.isArray(data.pengurus) ? data.pengurus : []);
        setInstagramPostsText(Array.isArray(data.instagramPosts) ? data.instagramPosts.join("\n") : "");
        setDocuments(Array.isArray(data.documents) ? data.documents : []);
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
        body: JSON.stringify({ heroTitle, heroSubtitle, campusName, contactEmail, contactPhone, contactAddress, instagram, aboutIntro, visi, misi: misiText.split("\n").map((x)=>x.trim()).filter(Boolean), history: historyText.split("\n").map((x)=>x.trim()).filter(Boolean), pengurus, instagramPosts: instagramPostsText.split("\n").map((x)=>x.trim()).filter(Boolean), documents }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg('Pengaturan tersimpan');
        setHeroTitle(data.heroTitle || heroTitle);
        setHeroSubtitle(data.heroSubtitle || heroSubtitle);
        setCampusName(data.campusName || campusName);
        // kontak
        setContactEmail(data.contactEmail || contactEmail);
        setContactPhone(data.contactPhone || contactPhone);
        setContactAddress(data.contactAddress || contactAddress);
        setInstagram(data.instagram || instagram);
        // tentang
        setAboutIntro(data.aboutIntro || aboutIntro);
        setVisi(data.visi || visi);
        setMisiText(Array.isArray(data.misi) ? data.misi.join("\n") : misiText);
        setHistoryText(Array.isArray(data.history) ? data.history.join("\n") : historyText);
        setPengurus(Array.isArray(data.pengurus) ? data.pengurus : pengurus);
        setInstagramPostsText(Array.isArray(data.instagramPosts) ? data.instagramPosts.join("\n") : instagramPostsText);
        setDocuments(Array.isArray(data.documents) ? data.documents : documents);
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
      <p className="mt-2 text-slate-600">Ubah teks utama (hero) di halaman beranda dan data kontak.</p>
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

        <div className="pt-2">
          <h2 className="text-lg font-semibold">Data Kontak</h2>
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input className="mt-1 w-full border rounded-lg px-3 py-2" value={contactEmail} onChange={(e)=>setContactEmail(e.target.value)} placeholder="himitikatmu@gmail.com" />
        </div>
        <div>
          <label className="block text-sm font-medium">Telp/WhatsApp</label>
          <input className="mt-1 w-full border rounded-lg px-3 py-2" value={contactPhone} onChange={(e)=>setContactPhone(e.target.value)} placeholder="085869230249" />
        </div>
        <div>
          <label className="block text-sm font-medium">Alamat</label>
          <textarea className="mt-1 w-full border rounded-lg px-3 py-2 min-h-[80px]" value={contactAddress} onChange={(e)=>setContactAddress(e.target.value)} placeholder="Jl. melati No. 27, Kejambon, Kec. Tegal Timur, Kota Tegal, Jawa Tengah" />
        </div>
        <div>
          <label className="block text-sm font-medium">Instagram (handle)</label>
          <input className="mt-1 w-full border rounded-lg px-3 py-2" value={instagram} onChange={(e)=>setInstagram(e.target.value)} placeholder="@hmpi_tmu" />
        </div>
        <div>
          <label className="block text-sm font-medium">Posting Instagram (URL, satu per baris)</label>
          <textarea className="mt-1 w-full border rounded-lg px-3 py-2 min-h-[120px]" value={instagramPostsText} onChange={(e)=>setInstagramPostsText(e.target.value)} placeholder={'https://www.instagram.com/p/SHORTCODE/\nhttps://www.instagram.com/reel/SHORTCODE/'} />
        </div>
        <div className="pt-4">
          <h2 className="text-lg font-semibold">Dokumen</h2>
          <p className="text-sm text-slate-600">Tambah tautan dokumen (judul dan URL).</p>
        </div>
        {documents?.map((d, idx)=> (
          <div key={idx} className="border rounded-lg p-3 space-y-2">
            <div>
              <label className="block text-sm font-medium">Judul</label>
              <input className="mt-1 w-full border rounded-lg px-3 py-2" value={d.title || ''} onChange={(e)=>setDocuments((prev)=>{const next=[...prev]; next[idx]={...next[idx], title: e.target.value}; return next;})} />
            </div>
            <div>
              <label className="block text-sm font-medium">URL</label>
              <input className="mt-1 w-full border rounded-lg px-3 py-2" value={d.url || ''} onChange={(e)=>setDocuments((prev)=>{const next=[...prev]; next[idx]={...next[idx], url: e.target.value}; return next;})} placeholder="https://..." />
            </div>
            <div className="flex gap-3">
              <button type="button" className="text-red-600 text-sm" onClick={()=>setDocuments((prev)=>prev.filter((_,i)=>i!==idx))}>Hapus</button>
            </div>
          </div>
        ))}
        <div>
          <button type="button" className="rounded-lg border px-3 py-2 text-sm" onClick={()=>setDocuments((prev)=>[...prev,{ title:'', url:'' }])}>Tambah Dokumen</button>
        </div>

        <div className="pt-4">
          <h2 className="text-lg font-semibold">Tentang Kami</h2>
          <p className="text-sm text-slate-600">Ubah konten halaman Tentang (intro, visi, misi, sejarah).</p>
        </div>
        <div>
          <label className="block text-sm font-medium">Intro</label>
          <textarea className="mt-1 w-full border rounded-lg px-3 py-2 min-h-[80px]" value={aboutIntro} onChange={(e)=>setAboutIntro(e.target.value)} placeholder="Himpunan Mahasiswa Informatika adalah wadah ..." />
        </div>
        <div>
          <label className="block text-sm font-medium">Visi</label>
          <textarea className="mt-1 w-full border rounded-lg px-3 py-2 min-h-[80px]" value={visi} onChange={(e)=>setVisi(e.target.value)} placeholder="Mewujudkan mahasiswa Informatika ..." />
        </div>
        <div>
          <label className="block text-sm font-medium">Misi (satu per baris)</label>
          <textarea className="mt-1 w-full border rounded-lg px-3 py-2 min-h-[120px]" value={misiText} onChange={(e)=>setMisiText(e.target.value)} placeholder={'Menyelenggarakan kegiatan edukatif...\nMendorong proyek nyata...\nMemfasilitasi jejaring...\nMenjaga budaya inklusif...'} />
        </div>
        <div>
          <label className="block text-sm font-medium">Sejarah Singkat (paragraf, satu per baris)</label>
          <textarea className="mt-1 w-full border rounded-lg px-3 py-2 min-h-[120px]" value={historyText} onChange={(e)=>setHistoryText(e.target.value)} placeholder={'Hima Informatika resmi dibentuk.\nMenyelenggarakan hackathon perdana tingkat kampus.\nKolaborasi dengan industri untuk program magang.\nTransformasi digital dan portal anggota.'} />
        </div>
        <div className="pt-4">
          <h2 className="text-lg font-semibold">Struktur Kepengurusan</h2>
          <p className="text-sm text-slate-600">Tambahkan data pengurus (nama, jabatan, foto).</p>
        </div>
        {pengurus?.map((p, idx)=> (
          <div key={idx} className="border rounded-lg p-3 space-y-2">
            <div>
              <label className="block text-sm font-medium">Nama</label>
              <input className="mt-1 w-full border rounded-lg px-3 py-2" value={p.nama || ''} onChange={(e)=>setPengurus((prev)=>{const next=[...prev]; next[idx]={...next[idx], nama: e.target.value}; return next;})} />
            </div>
            <div>
              <label className="block text-sm font-medium">Jabatan</label>
              <input className="mt-1 w-full border rounded-lg px-3 py-2" value={p.jabatan || ''} onChange={(e)=>setPengurus((prev)=>{const next=[...prev]; next[idx]={...next[idx], jabatan: e.target.value}; return next;})} />
            </div>
            <div>
              <label className="block text-sm font-medium">Foto (URL)</label>
              <input className="mt-1 w-full border rounded-lg px-3 py-2" value={p.foto || ''} onChange={(e)=>setPengurus((prev)=>{const next=[...prev]; next[idx]={...next[idx], foto: e.target.value}; return next;})} placeholder="/vercel.svg" />
            </div>
            <div className="flex gap-3">
              <button type="button" className="text-red-600 text-sm" onClick={()=>setPengurus((prev)=>prev.filter((_,i)=>i!==idx))}>Hapus</button>
            </div>
          </div>
        ))}
        <div>
          <button type="button" className="rounded-lg border px-3 py-2 text-sm" onClick={()=>setPengurus((prev)=>[...prev,{ nama:'', jabatan:'', foto:'' }])}>Tambah Pengurus</button>
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