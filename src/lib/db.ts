import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import type { Player, SpawnPoint, CaughtCreature, POI, TreasureChest, PlayerUpgrade } from '@/types';
import { getCreatureById } from './creatures';
import { getUpgradeByType } from './items';
import { addXP } from './xp';

const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(path.join(DATA_DIR, 'game.db'));
db.pragma('journal_mode = WAL');

// Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS player (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    creatures_caught INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS spawn_points (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    creature_id INTEGER NOT NULL,
    lat REAL NOT NULL,
    lng REAL NOT NULL,
    biome TEXT NOT NULL,
    spawned_at TEXT DEFAULT (datetime('now')),
    expires_at TEXT NOT NULL,
    caught INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS caught_creatures (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_id INTEGER NOT NULL,
    creature_id INTEGER NOT NULL,
    caught_at TEXT DEFAULT (datetime('now')),
    lat REAL NOT NULL,
    lng REAL NOT NULL
  );

  CREATE TABLE IF NOT EXISTS pois (
    osm_id TEXT PRIMARY KEY,
    name TEXT,
    lat REAL NOT NULL,
    lng REAL NOT NULL,
    osm_type TEXT,
    biome TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS treasure_chests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tier TEXT NOT NULL,
    lat REAL NOT NULL,
    lng REAL NOT NULL,
    spawned_at TEXT DEFAULT (datetime('now')),
    expires_at TEXT NOT NULL,
    opened INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS player_upgrades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_id INTEGER NOT NULL,
    upgrade_type TEXT NOT NULL,
    granted_at TEXT DEFAULT (datetime('now')),
    expires_at TEXT,
    uses_remaining INTEGER
  );
`);

// === Player ===

export function getPlayer(): Player | null {
  return db.prepare('SELECT id, name, xp, level, creatures_caught AS creaturesCaught, created_at AS createdAt FROM player LIMIT 1').get() as Player | null;
}

export function initPlayer(name: string): Player {
  const existing = getPlayer();
  if (existing) return existing;
  db.prepare('INSERT INTO player (name) VALUES (?)').run(name);
  return getPlayer()!;
}

export function updatePlayerXP(playerId: number, xp: number, level: number, creaturesCaught: number) {
  db.prepare('UPDATE player SET xp = ?, level = ?, creatures_caught = ? WHERE id = ?').run(xp, level, creaturesCaught, playerId);
}

// === Spawns ===

export function getSpawnsNear(lat: number, lng: number, radiusKm: number = 2): SpawnPoint[] {
  const delta = radiusKm / 111.32;
  const rows = db.prepare(`
    SELECT id, creature_id AS creatureId, lat, lng, biome, spawned_at AS spawnedAt,
           expires_at AS expiresAt, caught
    FROM spawn_points
    WHERE caught = 0 AND expires_at > datetime('now')
      AND lat BETWEEN ? AND ? AND lng BETWEEN ? AND ?
  `).all(lat - delta, lat + delta, lng - delta, lng + delta) as SpawnPoint[];

  return rows.map(s => ({
    ...s,
    caught: !!s.caught,
    creature: getCreatureById(s.creatureId),
  }));
}

export function getSpawnById(id: number): SpawnPoint | null {
  const row = db.prepare(`
    SELECT id, creature_id AS creatureId, lat, lng, biome, spawned_at AS spawnedAt,
           expires_at AS expiresAt, caught
    FROM spawn_points WHERE id = ?
  `).get(id) as SpawnPoint | null;
  if (!row) return null;
  return { ...row, caught: !!row.caught, creature: getCreatureById(row.creatureId) };
}

export function createSpawn(creatureId: number, lat: number, lng: number, biome: string): number {
  const result = db.prepare(`
    INSERT INTO spawn_points (creature_id, lat, lng, biome, expires_at)
    VALUES (?, ?, ?, ?, datetime('now', '+30 minutes'))
  `).run(creatureId, lat, lng, biome);
  return result.lastInsertRowid as number;
}

export function markSpawnCaught(spawnId: number) {
  db.prepare('UPDATE spawn_points SET caught = 1 WHERE id = ?').run(spawnId);
}

export function countActiveSpawns(): number {
  const row = db.prepare("SELECT COUNT(*) as cnt FROM spawn_points WHERE caught = 0 AND expires_at > datetime('now')").get() as { cnt: number };
  return row.cnt;
}

export function cleanExpiredSpawns() {
  db.prepare("DELETE FROM spawn_points WHERE expires_at <= datetime('now')").run();
}

// === Caught Creatures ===

export function addCaughtCreature(playerId: number, creatureId: number, lat: number, lng: number) {
  db.prepare('INSERT INTO caught_creatures (player_id, creature_id, lat, lng) VALUES (?, ?, ?, ?)').run(playerId, creatureId, lat, lng);
}

export function getCaughtCreatures(playerId: number): CaughtCreature[] {
  const rows = db.prepare(`
    SELECT id, player_id AS playerId, creature_id AS creatureId, caught_at AS caughtAt, lat, lng
    FROM caught_creatures WHERE player_id = ? ORDER BY caught_at DESC
  `).all(playerId) as CaughtCreature[];
  return rows.map(c => ({ ...c, creature: getCreatureById(c.creatureId) }));
}

// === POIs ===

export function savePOIs(pois: POI[]) {
  const stmt = db.prepare('INSERT OR IGNORE INTO pois (osm_id, name, lat, lng, osm_type, biome) VALUES (?, ?, ?, ?, ?, ?)');
  const tx = db.transaction((items: POI[]) => {
    for (const p of items) {
      stmt.run(p.osmId, p.name, p.lat, p.lng, p.osmType, p.biome);
    }
  });
  tx(pois);
}

export function getPOIs(): POI[] {
  return db.prepare('SELECT osm_id AS osmId, name, lat, lng, osm_type AS osmType, biome FROM pois').all() as POI[];
}

export function getPOICount(): number {
  const row = db.prepare('SELECT COUNT(*) as cnt FROM pois').get() as { cnt: number };
  return row.cnt;
}

// === Treasure Chests ===

export function getChestsNear(lat: number, lng: number, radiusKm: number = 2): TreasureChest[] {
  const delta = radiusKm / 111.32;
  return db.prepare(`
    SELECT id, tier, lat, lng, spawned_at AS spawnedAt, expires_at AS expiresAt, opened
    FROM treasure_chests
    WHERE opened = 0 AND expires_at > datetime('now')
      AND lat BETWEEN ? AND ? AND lng BETWEEN ? AND ?
  `).all(lat - delta, lat + delta, lng - delta, lng + delta) as TreasureChest[];
}

export function getChestById(id: number): TreasureChest | null {
  return db.prepare(`
    SELECT id, tier, lat, lng, spawned_at AS spawnedAt, expires_at AS expiresAt, opened
    FROM treasure_chests WHERE id = ?
  `).get(id) as TreasureChest | null;
}

export function createChest(tier: string, lat: number, lng: number): number {
  const result = db.prepare(`
    INSERT INTO treasure_chests (tier, lat, lng, expires_at)
    VALUES (?, ?, ?, datetime('now', '+60 minutes'))
  `).run(tier, lat, lng);
  return result.lastInsertRowid as number;
}

export function markChestOpened(chestId: number) {
  db.prepare('UPDATE treasure_chests SET opened = 1 WHERE id = ?').run(chestId);
}

export function countActiveChests(): number {
  const row = db.prepare("SELECT COUNT(*) as cnt FROM treasure_chests WHERE opened = 0 AND expires_at > datetime('now')").get() as { cnt: number };
  return row.cnt;
}

export function cleanExpiredChests() {
  db.prepare("DELETE FROM treasure_chests WHERE expires_at <= datetime('now')").run();
}

// === Player Upgrades ===

export function grantUpgrade(playerId: number, upgradeType: string, durationMinutes: number | null, usesRemaining: number | null) {
  const expiresAt = durationMinutes
    ? `datetime('now', '+${durationMinutes} minutes')`
    : null;

  if (expiresAt) {
    db.prepare(`INSERT INTO player_upgrades (player_id, upgrade_type, expires_at, uses_remaining) VALUES (?, ?, ${expiresAt}, ?)`).run(playerId, upgradeType, usesRemaining);
  } else {
    db.prepare('INSERT INTO player_upgrades (player_id, upgrade_type, expires_at, uses_remaining) VALUES (?, ?, NULL, ?)').run(playerId, upgradeType, usesRemaining);
  }
}

export function getActiveUpgrades(playerId: number): PlayerUpgrade[] {
  return db.prepare(`
    SELECT id, player_id AS playerId, upgrade_type AS upgradeType, granted_at AS grantedAt,
           expires_at AS expiresAt, uses_remaining AS usesRemaining
    FROM player_upgrades
    WHERE player_id = ?
      AND (expires_at IS NULL OR expires_at > datetime('now'))
      AND (uses_remaining IS NULL OR uses_remaining > 0)
  `).all(playerId) as PlayerUpgrade[];
}

export function decrementUpgradeUses(upgradeId: number) {
  db.prepare('UPDATE player_upgrades SET uses_remaining = uses_remaining - 1 WHERE id = ? AND uses_remaining IS NOT NULL').run(upgradeId);
}

export function cleanExpiredUpgrades() {
  db.prepare("DELETE FROM player_upgrades WHERE expires_at IS NOT NULL AND expires_at <= datetime('now')").run();
  db.prepare("DELETE FROM player_upgrades WHERE uses_remaining IS NOT NULL AND uses_remaining <= 0").run();
}

// === Composite operations ===

export function performCatch(spawnId: number, playerId: number): { success: boolean; xpGained: number; levelUp: boolean; player: Player } {
  const spawn = getSpawnById(spawnId)!;
  const creature = spawn.creature!;
  const player = getPlayer()!;
  const activeUpgrades = getActiveUpgrades(playerId);

  // Calculate catch rate with upgrades
  let catchBonus = 0;
  for (const u of activeUpgrades) {
    if (u.upgradeType === 'lucky_charm') catchBonus += 0.2;
    if (u.upgradeType === 'super_ball') catchBonus += 0.4;
    if (u.upgradeType === 'master_charm') catchBonus += 0.8;
  }
  const effectiveCatchRate = Math.min(0.95, creature.catchRate + catchBonus);

  const success = Math.random() < effectiveCatchRate;

  if (success) {
    markSpawnCaught(spawnId);
    addCaughtCreature(playerId, creature.id, spawn.lat, spawn.lng);

    // Calculate XP with upgrades
    let xpMultiplier = 1;
    for (const u of activeUpgrades) {
      if (u.upgradeType === 'xp_boost') xpMultiplier = Math.max(xpMultiplier, 2);
      if (u.upgradeType === 'golden_touch') xpMultiplier = Math.max(xpMultiplier, 3);
    }
    const xpGained = creature.xpReward * xpMultiplier;

    const { xp, level, levelUp } = addXP(player, xpGained);
    updatePlayerXP(playerId, xp, level, player.creaturesCaught + 1);

    // Decrement use-based upgrades
    for (const u of activeUpgrades) {
      if (u.usesRemaining !== null) decrementUpgradeUses(u.id);
    }

    return { success: true, xpGained, levelUp, player: getPlayer()! };
  }

  return { success: false, xpGained: 0, levelUp: false, player };
}
