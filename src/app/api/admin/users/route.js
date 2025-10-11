import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import bcrypt from 'bcryptjs';
import { listUsers, updateUser, findUserByEmail, createUser } from '../../../../lib/users';

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
    const users = listUsers({ role, status, q });
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
    const body = await req.json();
    const { user, error } = updateUser(id, body);
    if (error) return NextResponse.json({ message: error }, { status: 404 });
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
    const exists = findUserByEmail(email);
    if (exists) return NextResponse.json({ message: 'Email sudah terdaftar' }, { status: 400 });
    const passwordHash = password ? await bcrypt.hash(password, 10) : null;
    const { user } = createUser({ name, email, role, status: 'approved', passwordHash });
    return NextResponse.json({ item: user });
  } catch (e) {
    return NextResponse.json({ message: 'Gagal membuat user' }, { status: 500 });
  }
}