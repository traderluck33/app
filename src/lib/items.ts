import type { UpgradeDefinition, ChestTier, Rarity } from '@/types';

export const upgrades: UpgradeDefinition[] = [
  // Common
  { type: 'lucky_charm',    name: 'Lucky Charm',    emoji: '🍀', description: '+20% catch rate for 30 minutes',        rarity: 'common',    durationMinutes: 30,  usesTotal: null },
  { type: 'xp_boost',       name: 'XP Boost',       emoji: '⭐', description: '2x XP from catches for 30 minutes',    rarity: 'common',    durationMinutes: 30,  usesTotal: null },
  { type: 'creature_radar', name: 'Creature Radar',  emoji: '📡', description: 'Spawns 5 extra creatures nearby',      rarity: 'common',    durationMinutes: null, usesTotal: null },
  // Uncommon
  { type: 'super_ball',     name: 'Super Ball',     emoji: '🔵', description: '+40% catch rate for 15 minutes',        rarity: 'uncommon',  durationMinutes: 15,  usesTotal: null },
  { type: 'rare_lure',      name: 'Rare Lure',      emoji: '🎣', description: 'Next 3 spawns are rare or better',     rarity: 'uncommon',  durationMinutes: null, usesTotal: 3 },
  { type: 'biome_shift',    name: 'Biome Shift',    emoji: '🌀', description: 'Shifts nearby spawns to a new type',   rarity: 'uncommon',  durationMinutes: 20,  usesTotal: null },
  // Rare
  { type: 'golden_touch',   name: 'Golden Touch',   emoji: '✨', description: '3x XP from catches for 15 minutes',    rarity: 'rare',      durationMinutes: 15,  usesTotal: null },
  { type: 'master_charm',   name: 'Master Charm',   emoji: '💫', description: '+80% catch rate for 10 minutes',        rarity: 'rare',      durationMinutes: 10,  usesTotal: null },
  // Legendary
  { type: 'legendary_lure', name: 'Legendary Lure', emoji: '🌟', description: 'Guarantees 1 legendary spawn nearby', rarity: 'legendary', durationMinutes: null, usesTotal: null },
];

export function getUpgradeByType(type: string): UpgradeDefinition | undefined {
  return upgrades.find(u => u.type === type);
}

// Loot table: what rarity items each chest tier can drop
const lootWeights: Record<ChestTier, Record<Rarity, number>> = {
  wooden: { common: 70, uncommon: 25, rare: 5, legendary: 0 },
  silver: { common: 40, uncommon: 40, rare: 18, legendary: 2 },
  gold:   { common: 10, uncommon: 30, rare: 45, legendary: 15 },
};

const itemCounts: Record<ChestTier, [number, number]> = {
  wooden: [1, 1],
  silver: [1, 2],
  gold:   [2, 3],
};

export function rollLoot(tier: ChestTier): UpgradeDefinition[] {
  const [min, max] = itemCounts[tier];
  const count = min + Math.floor(Math.random() * (max - min + 1));
  const weights = lootWeights[tier];
  const results: UpgradeDefinition[] = [];

  for (let i = 0; i < count; i++) {
    const roll = Math.random() * 100;
    let rarity: Rarity;
    if (roll < weights.legendary) rarity = 'legendary';
    else if (roll < weights.legendary + weights.rare) rarity = 'rare';
    else if (roll < weights.legendary + weights.rare + weights.uncommon) rarity = 'uncommon';
    else rarity = 'common';

    const candidates = upgrades.filter(u => u.rarity === rarity);
    if (candidates.length > 0) {
      results.push(candidates[Math.floor(Math.random() * candidates.length)]);
    }
  }

  return results;
}
