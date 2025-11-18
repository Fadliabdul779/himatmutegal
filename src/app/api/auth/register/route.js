import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';
import bcrypt from 'bcryptjs';
import { createUser, findUserByEmail } from '../../../../lib/users';

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password, role, nim, prodi } = body || {};
    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Nama, email, dan password wajib' }, { status: 400 });
    }
    if (role && !['member', 'struct'].includes(role)) {
      return NextResponse.json({ message: 'Role tidak valid' }, { status: 400 });
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return NextResponse.json({ message: 'Email sudah terdaftar, silakan login atau reset password' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const { user, error } = await createUser({ name, email, role: role || 'member', status: 'pending', passwordHash, meta: { nim, prodi, agree_coc: !!body.agree_coc } });
    if (error) {
      return NextResponse.json({ message: error }, { status: 500 });
    }

    // Kirim notifikasi ke Admin tentang pendaftar baru (jika konfigurasi email tersedia)
    try {
      if (process.env.SENDGRID_API_KEY && process.env.EMAIL_ADMIN && process.env.EMAIL_FROM) {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        await sgMail.send({
          to: process.env.EMAIL_ADMIN,
          from: process.env.EMAIL_FROM,
          subject: 'Pendaftar akun baru menunggu verifikasi',
          html: `<p>Ada pendaftar baru:</p>
                 <ul>
                   <li>Nama: ${user.name || name}</li>
                   <li>Email: ${user.email}</li>
                   <li>Role: ${user.role}</li>
                   <li>Status: ${user.status}</li>
                 </ul>
                 <p>Silakan verifikasi di halaman Admin &rarr; Members.</p>`,
        });
      }
    } catch (e) {
      console.error('sendgrid notify admin (register) error', e);
    }

    return NextResponse.json({ message: 'Pendaftaran akun berhasil. Menunggu verifikasi admin.', user: { id: user.id, email: user.email, role: user.role, status: user.status } }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ message: 'Terjadi kesalahan saat mendaftar' }, { status: 500 });
  }
}