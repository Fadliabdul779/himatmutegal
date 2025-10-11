"use client";
import { useState } from 'react';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'member' });

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMsg('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg(data.message || 'Pendaftaran berhasil. Menunggu verifikasi admin.');
        setForm({ name: '', email: '', password: '', role: 'member' });
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
        <input value={form.password} onChange={(e)=>setForm({ ...form, password: e.target.value })} type="password" className="w-full border rounded-lg px-3 py-2" placeholder="Kata sandi" required />
        <select value={form.role} onChange={(e)=>setForm({ ...form, role: e.target.value })} className="w-full border rounded-lg px-3 py-2">
          <option value="member">Anggota</option>
          <option value="struct">Struktural</option>
        </select>
        {error && <div className="text-sm text-red-600">{error}</div>}
        {msg && <div className="text-sm text-green-700">{msg}</div>}
        <button type="submit" disabled={loading} className="w-full rounded-lg bg-[var(--primary)] text-white px-4 py-2 hover:scale-[1.03] transition disabled:opacity-50">
          {loading ? 'Mendaftar...' : 'Daftar'}
        </button>
      </form>
    </div>
  );
}