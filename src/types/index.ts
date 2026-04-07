export type CreatureType = 'water' | 'grass' | 'fire' | 'electric' | 'rock' | 'normal';
export type Rarity = 'common' | 'uncommon' | 'rare' | 'legendary';
export type ChestTier = 'wooden' | 'silver' | 'gold';

export interface CreatureDefinition {
  id: number;
  name: string;
  type: CreatureType;
  rarity: Rarity;
  emoji: string;
  description: string;
  catchRate: number;
  xpReward: number;
}

export interface SpawnPoint {
  id: number;
  creatureId: number;
  lat: number;
  lng: number;
  biome: CreatureType;
  spawnedAt: string;
  expiresAt: string;
  caught: boolean;
  creature?: CreatureDefinition;
}

export interface Player {
  id: number;
  name: string;
  xp: number;
  level: number;
  creaturesCaught: number;
  createdAt: string;
}

export interface CaughtCreature {
  id: number;
  playerId: number;
  creatureId: number;
  caughtAt: string;
  lat: number;
  lng: number;
  creature?: CreatureDefinition;
}

export interface POI {
  osmId: string;
  name: string;
  lat: number;
  lng: number;
  osmType: string;
  biome: CreatureType;
}

export interface TreasureChest {
  id: number;
  tier: ChestTier;
  lat: number;
  lng: number;
  spawnedAt: string;
  expiresAt: string;
  opened: boolean;
}

export type UpgradeType =
  | 'lucky_charm'
  | 'xp_boost'
  | 'creature_radar'
  | 'super_ball'
  | 'rare_lure'
  | 'biome_shift'
  | 'golden_touch'
  | 'master_charm'
  | 'legendary_lure';

export interface UpgradeDefinition {
  type: UpgradeType;
  name: string;
  emoji: string;
  description: string;
  rarity: Rarity;
  durationMinutes: number | null; // null = instant or use-based
  usesTotal: number | null;       // null = time-based
}

export interface PlayerUpgrade {
  id: number;
  playerId: number;
  upgradeType: UpgradeType;
  grantedAt: string;
  expiresAt: string | null;
  usesRemaining: number | null;
}

export interface CatchResult {
  success: boolean;
  escaped?: boolean;
  creature?: CreatureDefinition;
  xpGained?: number;
  levelUp?: boolean;
  player?: Player;
}

export interface ChestOpenResult {
  success: boolean;
  tier: ChestTier;
  upgrades: UpgradeDefinition[];
  error?: string;
}
