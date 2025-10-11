'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';

export default function MembershipPage() {
  const { register, handleSubmit, reset } = useForm();
  const [msg, setMsg] = useState('');

  const onSubmit = async (values) => {
    try {
      const res = await fetch('/api/membership/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      setMsg(data.message || 'Terdaftar');
      if (res.ok) reset();
    } catch {
      setMsg('Gagal mendaftar. Coba lagi.');
    }
  };

  return (
    <div className="px-6 py-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold">Bergabung / Membership</h1>
      <p className="mt-2 text-slate-700">Benefit: networking, sertifikat, akses resource, event eksklusif.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-3">
        <input className="border rounded-lg px-3 py-2 w-full" placeholder="Nama lengkap" {...register('nama')} />
        <input className="border rounded-lg px-3 py-2 w-full" placeholder="NIM" {...register('nim')} />
        <input className="border rounded-lg px-3 py-2 w-full" placeholder="Email" {...register('email')} />
        <input className="border rounded-lg px-3 py-2 w-full" placeholder="Program Studi" {...register('prodi')} />
        <div className="flex items-center gap-2">
          <input type="checkbox" {...register('agree_coc')} />
          <span>Saya menyetujui Code of Conduct.</span>
        </div>
        <button className="rounded-lg bg-blue-600 text-white px-5 py-3 shadow hover:scale-[1.03] transition">Kirim Pendaftaran</button>
      </form>
      {msg && <p className="mt-3">{msg}</p>}
    </div>
  );
}