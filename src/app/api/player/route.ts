import { NextResponse } from 'next/server';
import { getPlayer, initPlayer, getCaughtCreatures, getActiveUpgrades } from '@/lib/db';

export async function GET() {
  const player = getPlayer();
  if (!player) return NextResponse.json({ exists: false });

  const caught = getCaughtCreatures(player.id);
  const upgrades = getActiveUpgrades(player.id);
  return NextResponse.json({ exists: true, player, caught, upgrades });
}

export async function POST(request: Request) {
  const { name } = await request.json();
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return NextResponse.json({ error: 'Name required' }, { status: 400 });
  }
  const player = initPlayer(name.trim().slice(0, 20));
  return NextResponse.json({ player });
}
