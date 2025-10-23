import { NextResponse } from 'next/server';
import { get } from '@vercel/edge-config';

export async function GET() {
  try {
    const greeting = await get('greeting');
    return NextResponse.json(greeting ?? { message: 'Hello HIMATIKA TMU' });
  } catch (e) {
    return NextResponse.json({ message: 'Edge Config error', error: String(e?.message || e) }, { status: 500 });
  }
}