import sgMail from '@sendgrid/mail';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const body = await req.json();
  const { slug, nama, nim, email, prodi, tshirt, makanan } = body || {};
  if (!slug || !nama || !nim || !email || !prodi) {
    return NextResponse.json({ message: 'Data belum lengkap' }, { status: 400 });
  }

  try {
    if (process.env.GOOGLE_SHEETS_WEBHOOK_URL) {
      await fetch(process.env.GOOGLE_SHEETS_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'event_registration',
          payload: { slug, nama, nim, email, prodi, tshirt, makanan, ts: Date.now() },
        }),
      });
    }

    if (process.env.SENDGRID_API_KEY) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      await sgMail.send({
        to: email,
        from: process.env.EMAIL_FROM,
        subject: `Konfirmasi Pendaftaran Event: ${slug}`,
        html: `<p>Halo ${nama},</p><p>Terima kasih telah mendaftar. Kami akan menghubungi kamu untuk detail selanjutnya.</p>`,
      });
      if (process.env.EMAIL_ADMIN) {
        await sgMail.send({
          to: process.env.EMAIL_ADMIN,
          from: process.env.EMAIL_FROM,
          subject: `Peserta baru untuk ${slug}`,
          html: `<pre>${JSON.stringify({ slug, nama, nim, email, prodi, tshirt, makanan }, null, 2)}</pre>`,
        });
      }
    }

    return NextResponse.json({ message: 'Pendaftaran berhasil. Cek email kamu!' }, { status: 200 });
  } catch (e) {
    console.error('register error', e);
    return NextResponse.json({ message: 'Terjadi kesalahan. Coba lagi.' }, { status: 500 });
  }
}