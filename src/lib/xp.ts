import type { Player } from '@/types';

const MAX_LEVEL = 30;

export function xpForLevel(level: number): number {
  return level * 200;
}

export function addXP(player: Player, amount: number): { xp: number; level: number; levelUp: boolean } {
  let { xp, level } = player;
  xp += amount;
  let levelUp = false;

  while (level < MAX_LEVEL && xp >= xpForLevel(level + 1)) {
    xp -= xpForLevel(level + 1);
    level++;
    levelUp = true;
  }

  return { xp, level, levelUp };
}

export function xpProgress(player: Player): { current: number; needed: number; percent: number } {
  if (player.level >= MAX_LEVEL) {
    return { current: player.xp, needed: 0, percent: 100 };
  }
  const needed = xpForLevel(player.level + 1);
  return { current: player.xp, needed, percent: Math.floor((player.xp / needed) * 100) };
}
