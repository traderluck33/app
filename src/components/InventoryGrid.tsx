'use client';
import { useState } from 'react';
import type { CaughtCreature, CreatureType } from '@/types';

const typeColors: Record<string, string> = {
  water: 'bg-blue-600',
  grass: 'bg-green-600',
  fire: 'bg-red-600',
  electric: 'bg-yellow-600',
  rock: 'bg-stone-600',
  normal: 'bg-gray-600',
};

const rarityStars: Record<string, string> = {
  common: '⭐',
  uncommon: '⭐⭐',
  rare: '⭐⭐⭐',
  legendary: '⭐⭐⭐⭐',
};

interface Props {
  caught: CaughtCreature[];
}

export default function InventoryGrid({ caught }: Props) {
  const [filter, setFilter] = useState<CreatureType | 'all'>('all');

  // Group by creature and count
  const grouped = new Map<number, { creature: CaughtCreature['creature']; count: number; latestCatch: string }>();
  for (const c of caught) {
    if (!c.creature) continue;
    const existing = grouped.get(c.creatureId);
    if (existing) {
      existing.count++;
    } else {
      grouped.set(c.creatureId, { creature: c.creature, count: 1, latestCatch: c.caughtAt });
    }
  }

  const entries = Array.from(grouped.values());
  const filtered = filter === 'all' ? entries : entries.filter(e => e.creature?.type === filter);

  const types: (CreatureType | 'all')[] = ['all', 'water', 'grass', 'fire', 'electric', 'rock', 'normal'];

  if (caught.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <div className="text-5xl mb-3">🗺️</div>
        <p>No creatures caught yet!</p>
        <p className="text-sm mt-1">Explore the map to find and catch creatures.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Filter tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {types.map(t => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              filter === t ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            {t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className="text-xs text-gray-400">{filtered.length} unique / {caught.length} total</div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-2">
        {filtered.map(({ creature, count }) => {
          if (!creature) return null;
          return (
            <div key={creature.id} className="bg-[#1a1a2e] rounded-xl p-3 text-center relative">
              {count > 1 && (
                <span className="absolute top-1 right-1 bg-blue-600 text-xs px-1.5 py-0.5 rounded-full font-bold">
                  x{count}
                </span>
              )}
              <div className="text-3xl mb-1">{creature.emoji}</div>
              <div className="font-semibold text-xs truncate">{creature.name}</div>
              <div className="flex items-center justify-center gap-1 mt-1">
                <span className={`px-1.5 py-0.5 rounded text-[10px] ${typeColors[creature.type]}`}>
                  {creature.type}
                </span>
              </div>
              <div className="text-[10px] mt-0.5">{rarityStars[creature.rarity]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
