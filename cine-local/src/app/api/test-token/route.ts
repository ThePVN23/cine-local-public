import { NextResponse } from 'next/server';

export async function GET() {
  console.log('TMDB Token:', process.env.NEXT_PUBLIC_TMDB_READ_TOKEN);
  return NextResponse.json({ message: 'Check terminal for token' });
}