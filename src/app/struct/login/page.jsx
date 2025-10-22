"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function StructLoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = e.currentTarget;
    const email = form.email.value;
    const password = form.password.value;
    const res = await signIn("credentials", { email, password, role: 'struct', redirect: false });
    if (res?.ok) {
      window.location.href = "/struct";
    } else {
      setError("Login gagal");
    }
    setLoading(false);
  }

  return (
    <div className="max-w-sm mx-auto px-6 py-16">
      <h1 className="text-2xl font-heading font-bold">Login Struktural</h1>
      <div className="mt-2 rounded-md bg-[var(--neutral-50)] border border-slate-200 px-4 py-2 text-sm text-slate-700 text-center">
        Selamat datang Himpunan Mahasiswa Informatika
      </div>
      <div className="mt-2 rounded-md bg-slate-50 border border-slate-200 px-4 py-2 text-sm text-slate-700">
        Peran & Akses: akun Struktural dapat melihat agenda internal, dokumen, dan program kerja. Jika belum diverifikasi admin, akses internal dibatasi.
      </div>
      <p className="mt-2 text-slate-600">Masukkan email dan kata sandi.</p>
      <form onSubmit={onSubmit} className="mt-6 space-y-3">
        <input type="email" name="email" className="w-full border rounded-lg px-3 py-2" placeholder="Email" required />
        <input type="password" name="password" className="w-full border rounded-lg px-3 py-2" placeholder="Kata sandi" required />
        {error && <div className="text-sm text-red-600">{error}</div>}
        <button type="submit" disabled={loading} className="w-full rounded-lg bg-[var(--primary)] text-white px-4 py-2 hover:scale-[1.03] transition disabled:opacity-50">
          {loading ? "Masuk..." : "Masuk"}
        </button>
      </form>
      <div className="mt-6">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <div className="flex-1 h-px bg-slate-200" />
          <span>atau</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>
        <button
          onClick={() => signIn('google', { callbackUrl: '/struct' })}
          className="mt-3 w-full rounded-lg border px-4 py-2 hover:bg-slate-50"
        >
          Masuk dengan Google
        </button>
        <div className="mt-4 text-sm text-slate-600 text-center">
          Belum punya akun? <Link href="/register" className="text-[var(--primary)]">Daftar</Link>
        </div>
      </div>
    </div>
  );
}