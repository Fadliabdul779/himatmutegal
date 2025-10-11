import { NextResponse } from 'next/server';

export async function POST(req) {
  const { password } = await req.json();
  const expected = process.env.ADMIN_PASSWORD || 'admin123';
  if (password === expected) {
    const res = NextResponse.json({ ok: true });
    res.cookies.set('role', 'admin', { httpOnly: true, path: '/', maxAge: 60 * 60 * 6 });
    return res;
  }
  return NextResponse.json({ message: 'Kata sandi salah' }, { status: 401 });
}