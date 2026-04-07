import type { CreatureType, Rarity, SpawnPoint } from '@/types';
import { creatures, getCreaturesByBiome } from './creatures';
import { addJitter } from './geo';
import {
  getPOIs, createSpawn, countActiveSpawns, cleanExpiredSpawns,
  getSpawnsNear, getActiveUpgrades, getPlayer, createChest,
  countActiveChests, cleanExpiredChests,
} from './db';

const MAX_SPAWNS = 30;
const MAX_CHESTS = 5;
const SPAWN_CHANCE = 0.4;

function rollRarity(forcedMinRarity?: Rarity): Rarity {
  const roll = Math.random() * 100;
  if (forcedMinRarity === 'rare' || forcedMinRarity === 'legendary') {
    if (roll < 20) return 'legendary';
    return 'rare';
  }
  if (roll >= 95) return 'legendary';
  if (roll >= 85) return 'rare';
  if (roll >= 60) return 'uncommon';
  return 'common';
}

function pickCreature(biome: CreatureType, rarity: Rarity) {
  let candidates = getCreaturesByBiome(biome).filter(c => c.rarity === rarity);
  if (candidates.length === 0) {
    candidates = creatures.filter(c => c.rarity === rarity);
  }
  if (candidates.length === 0) {
    candidates = creatures.filter(c => c.rarity === 'common');
  }
  return candidates[Math.floor(Math.random() * candidates.length)];
}

export function generateSpawns(lat: number, lng: number, radiusKm: number = 2): SpawnPoint[] {
  cleanExpiredSpawns();

  const currentCount = countActiveSpawns();
  if (currentCount >= MAX_SPAWNS) {
    return getSpawnsNear(lat, lng, radiusKm);
  }

  const pois = getPOIs();
  const player = getPlayer();
  let forcedMinRarity: Rarity | undefined;

  // Check for active lure upgrades
  if (player) {
    const upgrades = getActiveUpgrades(player.id);
    for (const u of upgrades) {
      if (u.upgradeType === 'rare_lure') forcedMinRarity = 'rare';
    }
  }

  const slotsAvailable = MAX_SPAWNS - currentCount;
  let spawned = 0;

  // Spawn at POIs
  for (const poi of pois) {
    if (spawned >= slotsAvailable) break;
    if (Math.random() > SPAWN_CHANCE) continue;

    const rarity = rollRarity(forcedMinRarity);
    const creature = pickCreature(poi.biome as CreatureType, rarity);
    const pos = addJitter(poi.lat, poi.lng, 50);
    createSpawn(creature.id, pos.lat, pos.lng, poi.biome);
    spawned++;
  }

  // Scatter some wild normal-type spawns
  const wildCount = Math.min(3, slotsAvailable - spawned);
  for (let i = 0; i < wildCount; i++) {
    const rarity = rollRarity(forcedMinRarity);
    const creature = pickCreature('normal', rarity);
    const pos = addJitter(lat, lng, 500);
    createSpawn(creature.id, pos.lat, pos.lng, 'normal');
  }

  return getSpawnsNear(lat, lng, radiusKm);
}

export function generateChests(lat: number, lng: number): void {
  cleanExpiredChests();

  const currentCount = countActiveChests();
  if (currentCount >= MAX_CHESTS) return;

  const pois = getPOIs();
  // Chests only at landmarks, attractions, historic, places of worship
  const chestPOIs = pois.filter(p =>
    p.biome === 'rock' || p.osmType === 'attraction' || p.osmType === 'place_of_worship'
  );

  const slotsAvailable = MAX_CHESTS - currentCount;
  let spawned = 0;

  for (const poi of chestPOIs) {
    if (spawned >= slotsAvailable) break;
    if (Math.random() > 0.3) continue;

    // Roll chest tier
    const roll = Math.random() * 100;
    let tier: string;
    if (roll < 10) tier = 'gold';
    else if (roll < 40) tier = 'silver';
    else tier = 'wooden';

    const pos = addJitter(poi.lat, poi.lng, 30);
    createChest(tier, pos.lat, pos.lng);
    spawned++;
  }

  // If no landmark POIs, scatter a wooden chest randomly
  if (spawned === 0 && currentCount === 0) {
    const pos = addJitter(lat, lng, 300);
    createChest('wooden', pos.lat, pos.lng);
  }
}
