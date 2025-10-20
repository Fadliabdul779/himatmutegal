'use client';

import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';

export default function ContactPage() {
  const { register, handleSubmit, reset } = useForm();
  const [msg, setMsg] = useState('');
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/admin/site');
        const data = await res.json();
        setSettings(data || {});
      } catch {}
    })();
  }, []);

  const onSubmit = async (values) => {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      setMsg(data.message || 'Terkirim');
      if (res.ok) reset();
    } catch {
      setMsg('Gagal mengirim. Coba lagi.');
    }
  };

  const defaultEmail = process.env.NEXT_PUBLIC_EMAIL || 'info@kampus.id';
  const handle = (settings?.instagram || '').replace(/^@/, '');

  return (
    <div className="px-6 py-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold">Kontak</h1>
      <p className="mt-2 text-slate-700">
        Isi form di bawah atau email kami di{' '}
        <a className="text-blue-600" href={`mailto:${settings?.contactEmail || defaultEmail}`}>
          {settings?.contactEmail || defaultEmail}
        </a>
      </p>

      <div className="mt-6 border rounded-lg p-4">
        <h2 className="text-lg font-semibold">Data Kontak</h2>
        <ul className="mt-2 text-slate-700 space-y-1">
          <li><strong>Email:</strong> <a className="text-blue-600" href={`mailto:${settings?.contactEmail || defaultEmail}`}>{settings?.contactEmail || defaultEmail}</a></li>
          <li><strong>Telp:</strong> {settings?.contactPhone || '—'}</li>
          <li><strong>Alamat:</strong> {settings?.contactAddress || '—'}</li>
          <li><strong>Instagram:</strong> {settings?.instagram ? (
            <a className="text-blue-600" href={`https://instagram.com/${handle}`} target="_blank" rel="noopener noreferrer">@{handle}</a>
          ) : '—'}</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-3">
        <input className="border rounded-lg px-3 py-2 w-full" placeholder="Nama" {...register('nama')} />
        <input className="border rounded-lg px-3 py-2 w-full" placeholder="Email" {...register('email')} />
        <textarea className="border rounded-lg px-3 py-2 w-full min-h-[120px]" placeholder="Pesan" {...register('pesan')} />
        <button className="rounded-lg bg-blue-600 text-white px-5 py-3 shadow hover:scale-[1.03] transition">Kirim Pesan</button>
      </form>
      {msg && <p className="mt-3">{msg}</p>}
    </div>
  );
}