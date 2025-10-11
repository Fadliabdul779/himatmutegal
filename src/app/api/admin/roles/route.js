import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getRoleEmails, saveRoleEmails } from '../../../../lib/roleEmails';

async function requireAdmin(req) {
  if (process.env.DISABLE_ADMIN_PROTECTION === 'true') return null;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || 'devsecret' });
  if (!token || token.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const roles = getRoleEmails();
  return NextResponse.json(roles);
}

export async function PUT(req) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;
  try {
    const payload = await req.json();
    const saved = saveRoleEmails(payload);
    return NextResponse.json(saved);
  } catch (e) {
    return NextResponse.json({ message: 'Gagal menyimpan konfigurasi' }, { status: 500 });
  }
}