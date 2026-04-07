import { NextResponse } from 'next/server';
import { fetchPOIs } from '@/lib/overpass';
import { savePOIs, getPOICount } from '@/lib/db';

export async function POST(request: Request) {
  const { lat, lng } = await request.json();

  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return NextResponse.json({ error: 'lat and lng required' }, { status: 400 });
  }

  // Skip if we already have POIs cached
  const existing = getPOICount();
  if (existing > 0) {
    return NextResponse.json({ count: existing, cached: true });
  }

  try {
    const pois = await fetchPOIs(lat, lng);
    savePOIs(pois);
    return NextResponse.json({ count: pois.length, cached: false });
  } catch (err) {
    console.error('Overpass API error:', err);
    return NextResponse.json({ count: 0, error: 'Failed to fetch POIs' }, { status: 500 });
  }
}
