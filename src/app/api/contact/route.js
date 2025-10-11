import sgMail from '@sendgrid/mail';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const body = await req.json();
  const { nama, email, pesan } = body || {};
  if (!nama || !email || !pesan) {
    return NextResponse.json({ message: 'Data belum lengkap' }, { status: 400 });
  }

  try {
    if (process.env.SENDGRID_API_KEY && process.env.EMAIL_ADMIN) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      await sgMail.send({
        to: process.env.EMAIL_ADMIN,
        from: process.env.EMAIL_FROM,
        subject: `Kontak baru: ${nama}`,
        html: `<p>Dari: ${nama} (${email})</p><p>Pesan:</p><p>${pesan}</p>`,
      });
    }
    return NextResponse.json({ message: 'Pesan terkirim. Terima kasih!' }, { status: 200 });
  } catch (e) {
    console.error('contact error', e);
    return NextResponse.json({ message: 'Terjadi kesalahan. Coba lagi.' }, { status: 500 });
  }
}