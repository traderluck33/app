import type { CreatureDefinition } from '@/types';

export const creatures: CreatureDefinition[] = [
  // === WATER (6) ===
  { id: 1,  name: 'Splashfin',   type: 'water',    rarity: 'common',    emoji: '🐟', description: 'A playful fish that leaps from puddles.',       catchRate: 0.8, xpReward: 50 },
  { id: 2,  name: 'Tidecrawler', type: 'water',    rarity: 'common',    emoji: '🦀', description: 'Scuttles along riverbanks at dawn.',             catchRate: 0.8, xpReward: 50 },
  { id: 3,  name: 'Bubbletoad',  type: 'water',    rarity: 'uncommon',  emoji: '🐸', description: 'Blows enchanted bubbles to confuse predators.', catchRate: 0.5, xpReward: 100 },
  { id: 4,  name: 'Coralhorn',   type: 'water',    rarity: 'uncommon',  emoji: '🦈', description: 'Has a horn made of living coral.',               catchRate: 0.5, xpReward: 100 },
  { id: 5,  name: 'Misteel',     type: 'water',    rarity: 'rare',      emoji: '🐋', description: 'A steel-plated creature wreathed in mist.',      catchRate: 0.25, xpReward: 250 },
  { id: 6,  name: 'Tsunadrake',  type: 'water',    rarity: 'legendary', emoji: '🐉', description: 'Commands the tides with a roar.',                catchRate: 0.1, xpReward: 500 },

  // === GRASS (6) ===
  { id: 7,  name: 'Sproutling',  type: 'grass',    rarity: 'common',    emoji: '🌱', description: 'A tiny sprout with curious eyes.',               catchRate: 0.8, xpReward: 50 },
  { id: 8,  name: 'Thornpaw',    type: 'grass',    rarity: 'common',    emoji: '🦔', description: 'Its thorny back protects it from danger.',       catchRate: 0.8, xpReward: 50 },
  { id: 9,  name: 'Mossback',    type: 'grass',    rarity: 'uncommon',  emoji: '🐢', description: 'An ancient turtle covered in moss.',             catchRate: 0.5, xpReward: 100 },
  { id: 10, name: 'Vinewhip',    type: 'grass',    rarity: 'uncommon',  emoji: '🌿', description: 'Lashes out with whip-like vines.',               catchRate: 0.5, xpReward: 100 },
  { id: 11, name: 'Petalion',    type: 'grass',    rarity: 'rare',      emoji: '🦁', description: 'A majestic lion with a floral mane.',            catchRate: 0.25, xpReward: 250 },
  { id: 12, name: 'Elderoot',    type: 'grass',    rarity: 'legendary', emoji: '🌳', description: 'An ancient tree spirit, guardian of forests.',   catchRate: 0.1, xpReward: 500 },

  // === FIRE (5) ===
  { id: 13, name: 'Emberpup',    type: 'fire',     rarity: 'common',    emoji: '🐕', description: 'A warm puppy that sparks when excited.',         catchRate: 0.8, xpReward: 50 },
  { id: 14, name: 'Cinderfly',   type: 'fire',     rarity: 'common',    emoji: '🦋', description: 'A butterfly with smoldering wings.',             catchRate: 0.8, xpReward: 50 },
  { id: 15, name: 'Blazeclaw',   type: 'fire',     rarity: 'uncommon',  emoji: '🐻', description: 'Rakes its fiery claws against stone.',           catchRate: 0.5, xpReward: 100 },
  { id: 16, name: 'Magmashell',  type: 'fire',     rarity: 'rare',      emoji: '🐌', description: 'Its shell oozes with molten rock.',              catchRate: 0.25, xpReward: 250 },
  { id: 17, name: 'Infernotusk', type: 'fire',     rarity: 'legendary', emoji: '🐘', description: 'A colossal beast wreathed in eternal flame.',   catchRate: 0.1, xpReward: 500 },

  // === ELECTRIC (5) ===
  { id: 18, name: 'Sparkrat',    type: 'electric', rarity: 'common',    emoji: '🐀', description: 'Generates static as it scurries.',               catchRate: 0.8, xpReward: 50 },
  { id: 19, name: 'Voltbug',     type: 'electric', rarity: 'common',    emoji: '🐛', description: 'A glowing bug that crackles with electricity.',  catchRate: 0.8, xpReward: 50 },
  { id: 20, name: 'Zapphare',    type: 'electric', rarity: 'uncommon',  emoji: '🐇', description: 'So fast it leaves lightning in its wake.',       catchRate: 0.5, xpReward: 100 },
  { id: 21, name: 'Thundermane', type: 'electric', rarity: 'rare',      emoji: '🐴', description: 'A stormy stallion with a crackling mane.',       catchRate: 0.25, xpReward: 250 },
  { id: 22, name: 'Stormraptor', type: 'electric', rarity: 'legendary', emoji: '🦅', description: 'Rides the storm clouds, summoning lightning.',   catchRate: 0.1, xpReward: 500 },

  // === ROCK (4) ===
  { id: 23, name: 'Pebblite',    type: 'rock',     rarity: 'common',    emoji: '🪨', description: 'A small living stone with a friendly face.',     catchRate: 0.8, xpReward: 50 },
  { id: 24, name: 'Boulderback', type: 'rock',     rarity: 'uncommon',  emoji: '🦏', description: 'Carries a massive boulder on its back.',         catchRate: 0.5, xpReward: 100 },
  { id: 25, name: 'Crystavern',  type: 'rock',     rarity: 'rare',      emoji: '💎', description: 'A cave dweller made of living crystal.',         catchRate: 0.25, xpReward: 250 },
  { id: 26, name: 'Ironpeak',    type: 'rock',     rarity: 'legendary', emoji: '🏔️', description: 'A walking mountain, ancient beyond measure.',    catchRate: 0.1, xpReward: 500 },

  // === NORMAL (4) ===
  { id: 27, name: 'Fluffling',   type: 'normal',   rarity: 'common',    emoji: '🐑', description: 'An irresistibly fluffy ball of fur.',             catchRate: 0.8, xpReward: 50 },
  { id: 28, name: 'Dashfox',     type: 'normal',   rarity: 'common',    emoji: '🦊', description: 'Quick and cunning, always on the move.',         catchRate: 0.8, xpReward: 50 },
  { id: 29, name: 'Howlcub',     type: 'normal',   rarity: 'uncommon',  emoji: '🐺', description: 'Howls at the moon for mysterious power.',        catchRate: 0.5, xpReward: 100 },
  { id: 30, name: 'Chimewren',   type: 'normal',   rarity: 'rare',      emoji: '🐦', description: 'Its song can heal wounds and lift spirits.',     catchRate: 0.25, xpReward: 250 },
];

export function getCreatureById(id: number): CreatureDefinition | undefined {
  return creatures.find(c => c.id === id);
}

export function getCreaturesByBiome(biome: string): CreatureDefinition[] {
  return creatures.filter(c => c.type === biome);
}

export function getCreaturesByRarity(rarity: string): CreatureDefinition[] {
  return creatures.filter(c => c.rarity === rarity);
}
