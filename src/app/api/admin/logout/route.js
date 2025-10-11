import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.redirect('/admin/login');
  // Clear possible role cookie (legacy)
  res.cookies.set('role', '', { httpOnly: true, path: '/', maxAge: 0 });
  // Clear NextAuth cookies (best-effort)
  res.cookies.set('next-auth.session-token', '', { path: '/', maxAge: 0 });
  res.cookies.set('__Secure-next-auth.session-token', '', { path: '/', maxAge: 0 });
  res.cookies.set('next-auth.callback-url', '', { path: '/', maxAge: 0 });
  res.cookies.set('next-auth.csrf-token', '', { path: '/', maxAge: 0 });
  return res;
}