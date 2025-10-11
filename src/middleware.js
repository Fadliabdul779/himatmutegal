import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const secret = process.env.NEXTAUTH_SECRET || 'devsecret';
  const disabled = process.env.DISABLE_AUTH === 'true';

  if (disabled) {
    return NextResponse.next();
  }

  // Admin area protection (except login) — require approved status
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = await getToken({ req, secret });
    if (!token || token.role !== 'admin' || token.status !== 'approved') {
      const loginUrl = new URL('/admin/login', req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Struct area protection (except login) — require approved status
  if (pathname.startsWith('/struct') && pathname !== '/struct/login') {
    const token = await getToken({ req, secret });
    if (!token || token.role !== 'struct' || token.status !== 'approved') {
      const loginUrl = new URL('/struct/login', req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Member area protection (except login) — require approved status
  if (pathname.startsWith('/member') && pathname !== '/member/login') {
    const token = await getToken({ req, secret });
    if (!token || token.role !== 'member' || token.status !== 'approved') {
      const loginUrl = new URL('/member/login', req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/struct/:path*', '/member/:path*'],
};