import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import bcrypt from 'bcryptjs';
import { updateUser } from '../../../../../lib/users';

async function requireAdmin(req) {
  if (process.env.DISABLE_ADMIN_PROTECTION === 'true') return null;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || 'devsecret' });
  if (!token || token.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

export async function PUT(req) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;
  try {
    const { id, newPassword } = await req.json();
    if (!id || !newPassword) return NextResponse.json({ message: 'ID dan password baru wajib' }, { status: 400 });
    const passwordHash = await bcrypt.hash(newPassword, 10);
    const { user, error } = await updateUser(id, { passwordHash });
    if (error) return NextResponse.json({ message: error }, { status: 404 });
    return NextResponse.json({ item: { id: user.id, email: user.email } });
  } catch (e) {
    return NextResponse.json({ message: 'Gagal reset password' }, { status: 500 });
  }
}