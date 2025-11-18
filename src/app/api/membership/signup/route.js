import sgMail from '@sendgrid/mail';
import { NextResponse } from 'next/server';
import { createUser, findUserByEmail } from '../../../../lib/users';

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req) {
  const body = await req.json();
  const { nama, nim, email, prodi, agree_coc } = body || {};
  if (!nama || !nim || !email || !prodi || !agree_coc) {
    return NextResponse.json({ message: 'Data belum lengkap / COC harus disetujui' }, { status: 400 });
  }

  // Buat entri user pending di store agar admin bisa verifikasi
  try {
    const existingUser = await findUserByEmail(email);
    if (!existingUser) {
      const created = await createUser({
        name: nama,
        email,
        role: 'member',
        status: 'pending',
        meta: { nim, prodi, agree_coc: !!agree_coc },
      });
      if (created?.error) {
        return NextResponse.json({ message: created.error }, { status: 500 });
      }
      // Beri tahu admin jika konfigurasi email tersedia
      try {
        if (created?.user && process.env.SENDGRID_API_KEY && process.env.EMAIL_ADMIN && process.env.EMAIL_FROM) {
          sgMail.setApiKey(process.env.SENDGRID_API_KEY);
          await sgMail.send({
            to: process.env.EMAIL_ADMIN,
            from: process.env.EMAIL_FROM,
            subject: 'Pendaftar membership baru menunggu verifikasi',
            html: `<p>Pendaftar baru:</p>
                   <ul>
                     <li>Nama: ${nama}</li>
                     <li>Email: ${email}</li>
                     <li>NIM: ${nim}</li>
                     <li>Prodi: ${prodi}</li>
                   </ul>
                   <p>Silakan verifikasi di halaman Admin &rarr; Members.</p>`,
          });
        }
      } catch (e) {
        console.error('sendgrid notify admin (membership) error', e);
      }
    }
  } catch (e) {
    // ignore store error, lanjutkan email welcome
    console.error('membership signup store error', e);
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

    return NextResponse.json({ message: 'Pendaftaran berhasil. Menunggu verifikasi admin. Cek email kamu!' }, { status: 200 });
  } catch (e) {
    console.error('membership error', e);
    return NextResponse.json({ message: 'Terjadi kesalahan. Coba lagi.' }, { status: 500 });
  }
}