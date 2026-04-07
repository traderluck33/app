import { NextResponse } from 'next/server';
import { generateSpawns, generateChests } from '@/lib/spawner';
import { getChestsNear } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get('lat') || '');
  const lng = parseFloat(searchParams.get('lng') || '');

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ error: 'lat and lng required' }, { status: 400 });
  }

  const spawns = generateSpawns(lat, lng);
  generateChests(lat, lng);
  const chests = getChestsNear(lat, lng);

  return NextResponse.json({ spawns, chests });
}
