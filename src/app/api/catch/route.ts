import { NextResponse } from 'next/server';
import { getSpawnById, getPlayer, performCatch } from '@/lib/db';
import { haversineDistance } from '@/lib/geo';

const CATCH_RADIUS_M = 50;

export async function POST(request: Request) {
  const { spawnId, playerLat, playerLng } = await request.json();

  const player = getPlayer();
  if (!player) return NextResponse.json({ error: 'No player' }, { status: 400 });

  const spawn = getSpawnById(spawnId);
  if (!spawn) return NextResponse.json({ error: 'Spawn not found' }, { status: 404 });
  if (spawn.caught) return NextResponse.json({ error: 'Already caught' }, { status: 400 });

  const now = new Date();
  if (new Date(spawn.expiresAt) <= now) {
    return NextResponse.json({ error: 'Spawn expired' }, { status: 400 });
  }

  const dist = haversineDistance(playerLat, playerLng, spawn.lat, spawn.lng);
  if (dist > CATCH_RADIUS_M) {
    return NextResponse.json({ error: 'Too far away', distance: Math.round(dist) }, { status: 403 });
  }

  const result = performCatch(spawnId, player.id);
  return NextResponse.json({
    success: result.success,
    escaped: !result.success,
    creature: spawn.creature,
    xpGained: result.xpGained,
    levelUp: result.levelUp,
    player: result.player,
  });
}
