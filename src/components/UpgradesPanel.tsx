'use client';
import type { PlayerUpgrade } from '@/types';
import { getUpgradeByType } from '@/lib/items';

interface Props {
  upgrades: PlayerUpgrade[];
}

export default function UpgradesPanel({ upgrades }: Props) {
  if (upgrades.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        <div className="text-3xl mb-2">📦</div>
        <p className="text-sm">No active upgrades. Find treasure chests on the map!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="font-bold text-sm text-gray-400 uppercase">Active Upgrades</h3>
      {upgrades.map(u => {
        const def = getUpgradeByType(u.upgradeType);
        if (!def) return null;
        return (
          <div key={u.id} className="bg-[#1a1a2e] rounded-lg p-3 flex items-center gap-3">
            <span className="text-2xl">{def.emoji}</span>
            <div className="flex-1">
              <div className="font-semibold text-sm">{def.name}</div>
              <div className="text-gray-400 text-xs">{def.description}</div>
            </div>
            {u.usesRemaining !== null && (
              <span className="text-xs bg-blue-900 px-2 py-1 rounded">{u.usesRemaining} uses</span>
            )}
            {u.expiresAt && (
              <span className="text-xs bg-purple-900 px-2 py-1 rounded">timed</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
