import { NextResponse } from 'next/server';
import { sanityClient, sanityWriteClient, queries } from '../../../../lib/sanity';
import { getToken } from 'next-auth/jwt';

function slugify(text) {
  return (text || '')
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function requireAdmin(req) {
  if (process.env.DISABLE_ADMIN_PROTECTION === 'true') return null;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || 'devsecret' });
  if (!token || token.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

export async function GET() {
  try {
    let events = [];
    if (sanityClient) {
      events = await sanityClient.fetch(queries.events);
    }
    return NextResponse.json({ items: events });
  } catch (e) {
    return NextResponse.json({ message: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(req) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;
  if (!sanityWriteClient) {
    return NextResponse.json({ message: 'SANITY_WRITE_TOKEN belum diset' }, { status: 400 });
  }
  const body = await req.json();
  const { title, date, location, status, summary, category } = body || {};
  if (!title) return NextResponse.json({ message: 'Judul wajib' }, { status: 400 });
  const slug = slugify(title);
  try {
    const created = await sanityWriteClient.create({
      _type: 'event',
      title,
      date,
      location,
      status,
      summary,
      category,
      slug: { current: slug },
    });
    return NextResponse.json({ item: created }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ message: 'Gagal membuat event' }, { status: 500 });
  }
}

export async function PUT(req) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;
  if (!sanityWriteClient) {
    return NextResponse.json({ message: 'SANITY_WRITE_TOKEN belum diset' }, { status: 400 });
  }
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  const body = await req.json();
  if (!id) return NextResponse.json({ message: 'ID wajib' }, { status: 400 });
  try {
    const patched = await sanityWriteClient.patch(id).set(body).commit();
    return NextResponse.json({ item: patched });
  } catch (e) {
    return NextResponse.json({ message: 'Gagal mengubah event' }, { status: 500 });
  }
}

export async function DELETE(req) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;
  if (!sanityWriteClient) {
    return NextResponse.json({ message: 'SANITY_WRITE_TOKEN belum diset' }, { status: 400 });
  }
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) return NextResponse.json({ message: 'ID wajib' }, { status: 400 });
  try {
    await sanityWriteClient.delete(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ message: 'Gagal menghapus event' }, { status: 500 });
  }
}