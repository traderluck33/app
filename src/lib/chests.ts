import type { ChestTier, ChestOpenResult } from '@/types';
import { rollLoot } from './items';
import { markChestOpened, grantUpgrade, getPlayer } from './db';

export function openChest(chestId: number, tier: ChestTier): ChestOpenResult {
  const loot = rollLoot(tier);

  markChestOpened(chestId);

  const player = getPlayer();
  if (player) {
    for (const upgrade of loot) {
      grantUpgrade(player.id, upgrade.type, upgrade.durationMinutes, upgrade.usesTotal);
    }
  }

  return {
    success: true,
    tier,
    upgrades: loot,
  };
}
