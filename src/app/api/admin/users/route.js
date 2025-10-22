import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import bcrypt from 'bcryptjs';
import sgMail from '@sendgrid/mail';
import { listUsers, updateUser, findUserByEmail, createUser, deleteUser, findUserById } from '../../../../lib/users';

async function requireAdmin(req) {
  if (process.env.DISABLE_ADMIN_PROTECTION === 'true') return null;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || 'devsecret' });
  if (!token || token.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

export async function GET(req) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;
  try {
    const url = new URL(req.url);
    const role = url.searchParams.get('role');
    const status = url.searchParams.get('status');
    const q = url.searchParams.get('q');
    const users = await listUsers({ role, status, q });
    return NextResponse.json({ items: users });
  } catch (e) {
    return NextResponse.json({ message: 'Gagal mengambil users' }, { status: 500 });
  }
}

export async function PUT(req) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) return NextResponse.json({ message: 'ID wajib' }, { status: 400 });
    const prev = await findUserById(id);
    const body = await req.json();
    const { user, error } = await updateUser(id, body);
    if (error) return NextResponse.json({ message: error }, { status: 404 });

    // Jika status berubah menjadi approved, beri tahu user via email (opsional)
    try {
      if (prev && body.status === 'approved' && prev.status !== 'approved' && process.env.SENDGRID_API_KEY && process.env.EMAIL_FROM) {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        await sgMail.send({
          to: user.email,
          from: process.env.EMAIL_FROM,
          subject: 'Akun kamu telah disetujui',
          html: `<p>Halo ${user.name || ''}, akun kamu telah <strong>disetujui</strong>.</p>
                 <p>Silakan login sebagai Anggota di <a href="${process.env.PUBLIC_BASE_URL || ''}/member/login" target="_blank">/member/login</a>.</p>
                 <p>Jika kamu mendaftar via formulir membership, hubungi admin untuk mendapatkan kata sandi atau tunggu reset password.</p>`,
        });
      }
    } catch (e) {
      console.error('sendgrid notify user (approved) error', e);
    }

    return NextResponse.json({ item: user });
  } catch (e) {
    return NextResponse.json({ message: 'Gagal memperbarui user' }, { status: 500 });
  }
}

export async function POST(req) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;
  try {
    const { name, email, role = 'member', password } = await req.json();
    if (!name || !email) return NextResponse.json({ message: 'Nama dan email wajib' }, { status: 400 });
    if (!['member', 'struct', 'admin'].includes(role)) return NextResponse.json({ message: 'Role tidak valid' }, { status: 400 });
    const exists = await findUserByEmail(email);
    if (exists) return NextResponse.json({ message: 'Email sudah terdaftar' }, { status: 400 });
    const passwordHash = password ? await bcrypt.hash(password, 10) : null;
    const { user } = await createUser({ name, email, role, status: 'approved', passwordHash });
    return NextResponse.json({ item: user });
  } catch (e) {
    return NextResponse.json({ message: 'Gagal membuat user' }, { status: 500 });
  }
}

export async function DELETE(req) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) return NextResponse.json({ message: 'ID wajib' }, { status: 400 });
    const { user, error } = await deleteUser(id);
    if (error) return NextResponse.json({ message: error }, { status: 404 });
    return NextResponse.json({ item: { id: user.id, email: user.email } });
  } catch (e) {
    return NextResponse.json({ message: 'Gagal menghapus user' }, { status: 500 });
  }
}