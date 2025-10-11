"use client";
import { useEffect, useState } from "react";

export default function AdminAuthSettingsPage() {
  const [admin, setAdmin] = useState("");
  const [struct, setStruct] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/admin/roles');
        const data = await res.json();
        setAdmin((data.admin || []).join(", "));
        setStruct((data.struct || []).join(", "));
      } catch {}
    })();
  }, []);

  async function onSave(e) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const payload = { admin, struct };
      const res = await fetch('/api/admin/roles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) setMsg('Disimpan. Perubahan berlaku untuk login berikutnya.');
      else setMsg('Gagal menyimpan');
    } catch {
      setMsg('Gagal menyimpan');
    }
    setLoading(false);
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-heading font-bold">Pengaturan Autentikasi</h1>
      <p className="mt-2 text-slate-600">Kelola daftar email untuk peran Admin dan Struktural. Pisahkan dengan koma.</p>
      <form onSubmit={onSave} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium">Admin Emails</label>
          <textarea className="mt-1 w-full border rounded-lg px-3 py-2 min-h-[100px]" value={admin} onChange={(e) => setAdmin(e.target.value)} placeholder="admin1@example.com, admin2@example.com" />
        </div>
        <div>
          <label className="block text-sm font-medium">Struct Emails</label>
          <textarea className="mt-1 w-full border rounded-lg px-3 py-2 min-h-[100px]" value={struct} onChange={(e) => setStruct(e.target.value)} placeholder="struct1@example.com, struct2@example.com" />
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