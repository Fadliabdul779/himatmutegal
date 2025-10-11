import sgMail from '@sendgrid/mail';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const body = await req.json();
  const { nama, nim, email, prodi, agree_coc } = body || {};
  if (!nama || !nim || !email || !prodi || !agree_coc) {
    return NextResponse.json({ message: 'Data belum lengkap / COC harus disetujui' }, { status: 400 });
  }

  try {
    if (process.env.GOOGLE_SHEETS_WEBHOOK_URL) {
      await fetch(process.env.GOOGLE_SHEETS_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'membership_signup',
          payload: { nama, nim, email, prodi, agree_coc, ts: Date.now() },
        }),
      });
    }

    if (process.env.SENDGRID_API_KEY) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      await sgMail.send({
        to: email,
        from: process.env.EMAIL_FROM,
        subject: 'Selamat bergabung di Hima Informatika!',
        html: '<p>Halo, terima kasih telah bergabung. Terlampir paket selamat datang (link) dan informasi komunitas.</p>',
      });
    }

    return NextResponse.json({ message: 'Pendaftaran berhasil. Cek email kamu!' }, { status: 200 });
  } catch (e) {
    console.error('membership error', e);
    return NextResponse.json({ message: 'Terjadi kesalahan. Coba lagi.' }, { status: 500 });
  }
}