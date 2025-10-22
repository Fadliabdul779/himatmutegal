"use client";
import { useState } from 'react';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: 'member', nim: '', prodi: '', agree_coc: false });

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMsg('');
    if (form.password !== form.confirm) {
      setError('Konfirmasi kata sandi tidak cocok');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password, role: form.role, nim: form.nim, prodi: form.prodi, agree_coc: form.agree_coc }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg(data.message || 'Pendaftaran berhasil. Menunggu verifikasi admin.');
        setForm({ name: '', email: '', password: '', confirm: '', role: 'member', nim: '', prodi: '', agree_coc: false });
      } else {
        setError(data.message || 'Gagal mendaftar');
      }
    } catch {
      setError('Terjadi kesalahan jaringan');
    }
    setLoading(false);
  }

  return (
    <div className="max-w-md mx-auto px-6 py-12">
      <h1 className="text-2xl font-heading font-bold">Daftar Akun</h1>
      <p className="mt-2 text-slate-600">Buat akun Anggota atau Struktural. Akun akan menunggu verifikasi admin.</p>
      <form onSubmit={onSubmit} className="mt-6 space-y-3">
        <input value={form.name} onChange={(e)=>setForm({ ...form, name: e.target.value })} type="text" className="w-full border rounded-lg px-3 py-2" placeholder="Nama lengkap" required />
        <input value={form.email} onChange={(e)=>setForm({ ...form, email: e.target.value })} type="email" className="w-full border rounded-lg px-3 py-2" placeholder="Email" required />
        <div className="grid grid-cols-2 gap-3">
          <input value={form.nim} onChange={(e)=>setForm({ ...form, nim: e.target.value })} type="text" className="w-full border rounded-lg px-3 py-2" placeholder="NIM (opsional)" />
          <input value={form.prodi} onChange={(e)=>setForm({ ...form, prodi: e.target.value })} type="text" className="w-full border rounded-lg px-3 py-2" placeholder="Prodi (opsional)" />
        </div>
        <input value={form.password} onChange={(e)=>setForm({ ...form, password: e.target.value })} type="password" className="w-full border rounded-lg px-3 py-2" placeholder="Kata sandi" required />
        <input value={form.confirm} onChange={(e)=>setForm({ ...form, confirm: e.target.value })} type="password" className="w-full border rounded-lg px-3 py-2" placeholder="Konfirmasi kata sandi" required />
        <select value={form.role} onChange={(e)=>setForm({ ...form, role: e.target.value })} className="w-full border rounded-lg px-3 py-2">
          <option value="member">Anggota</option>
          <option value="struct">Struktural</option>
        </select>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" checked={form.agree_coc} onChange={(e)=>setForm({ ...form, agree_coc: e.target.checked })} />
          <span>Saya menyetujui Code of Conduct.</span>
        </label>
        {error && <div className="text-sm text-red-600">{error}</div>}
        {msg && <div className="text-sm text-green-700">{msg}</div>}
        <button type="submit" disabled={loading} className="w-full rounded-lg bg-[var(--primary)] text-white px-4 py-2 hover:scale-[1.03] transition disabled:opacity-50">
          {loading ? 'Mendaftar...' : 'Daftar'}
        </button>
      </form>
    </div>
  );
}