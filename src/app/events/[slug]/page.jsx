"use client";
import Link from 'next/link';
import { sanityClient, queries } from '../../../lib/sanity';
import { getEvent } from '../../../lib/data';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function EventDetailPage() {
  const { slug } = useParams();
  const [event, setEvent] = useState(null);
  const [status, setStatus] = useState({ ok: false, msg: '' });

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    async function load() {
      let ev = null;
      if (sanityClient) {
        try {
          ev = await sanityClient.fetch(queries.eventBySlug, { slug });
        } catch (e) {
          ev = null;
        }
      }
      if (!ev) ev = getEvent(slug);
      if (!cancelled) setEvent(ev);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm();

  const onSubmit = async (values) => {
    try {
      const res = await fetch('/api/events/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, ...values }),
      });
      const data = await res.json();
      setStatus({ ok: res.ok, msg: data.message || 'Terdaftar' });
      if (res.ok) reset();
    } catch (e) {
      setStatus({ ok: false, msg: 'Gagal mendaftar. Coba lagi.' });
    }
  };

  if (!event) return <div className="px-6 py-10">Event tidak ditemukan.</div>;

  return (
    <div className="px-6 py-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">{event.title}</h1>
      <p className="mt-2 text-slate-700">{event.summary || event.description}</p>

      <div className="mt-6 space-y-3">
        <p>
          <strong>Tanggal:</strong> {event.date}
        </p>
        <p>
          <strong>Lokasi:</strong> {event.location}
        </p>
        <div className="mt-2">
          <Link
            href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
              event.title
            )}&dates=${event.ics || ''}&details=${encodeURIComponent(event.summary || '')}&location=${encodeURIComponent(event.location || '')}`}
            target="_blank"
            className="text-blue-600 hover:underline"
          >
            Simpan ke Kalender
          </Link>
        </div>
        <div className="mt-4">
          {event?.mapEmbed && (
            <iframe title="Lokasi" src={event.mapEmbed} className="w-full h-64 rounded-lg" loading="lazy" />
          )}
        </div>
      </div>

      <h2 id="form" className="text-2xl font-semibold mt-10">Form Pendaftaran</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 grid md:grid-cols-2 gap-4">
        <input className="border rounded-lg px-3 py-2" placeholder="Nama lengkap" {...register('nama')} />
        <input className="border rounded-lg px-3 py-2" placeholder="NIM" {...register('nim')} />
        <input className="border rounded-lg px-3 py-2" placeholder="Email institusi" {...register('email')} />
        <input className="border rounded-lg px-3 py-2" placeholder="Prodi" {...register('prodi')} />
        <input className="border rounded-lg px-3 py-2" placeholder="Ukuran T-Shirt" {...register('tshirt')} />
        <input className="border rounded-lg px-3 py-2" placeholder="Preferensi Makanan" {...register('makanan')} />
        <button
          disabled={isSubmitting}
          className="md:col-span-2 rounded-lg bg-blue-600 text-white px-5 py-3 shadow hover:scale-[1.03] transition"
        >
          {isSubmitting ? 'Mengirim...' : 'Daftar'}
        </button>
      </form>
      <div className="mt-3 text-sm">
        {status.msg && <p className={status.ok ? 'text-teal-600' : 'text-red-600'}>{status.msg}</p>}
      </div>
    </div>
  );
}