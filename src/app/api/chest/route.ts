import { NextResponse } from 'next/server';
import { getChestsNear, getChestById, getPlayer } from '@/lib/db';
import { haversineDistance } from '@/lib/geo';
import { openChest } from '@/lib/chests';
import type { ChestTier } from '@/types';

const OPEN_RADIUS_M = 50;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get('lat') || '');
  const lng = parseFloat(searchParams.get('lng') || '');

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ error: 'lat and lng required' }, { status: 400 });
  }

  const chests = getChestsNear(lat, lng);
  return NextResponse.json({ chests });
}

export async function POST(request: Request) {
  const { chestId, playerLat, playerLng } = await request.json();

  const player = getPlayer();
  if (!player) return NextResponse.json({ error: 'No player' }, { status: 400 });

  const chest = getChestById(chestId);
  if (!chest) return NextResponse.json({ error: 'Chest not found' }, { status: 404 });
  if (chest.opened) return NextResponse.json({ error: 'Already opened' }, { status: 400 });

  const now = new Date();
  if (new Date(chest.expiresAt) <= now) {
    return NextResponse.json({ error: 'Chest expired' }, { status: 400 });
  }

  const dist = haversineDistance(playerLat, playerLng, chest.lat, chest.lng);
  if (dist > OPEN_RADIUS_M) {
    return NextResponse.json({ error: 'Too far away', distance: Math.round(dist) }, { status: 403 });
  }

  const result = openChest(chestId, chest.tier as ChestTier);
  return NextResponse.json(result);
}
