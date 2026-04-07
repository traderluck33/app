'use client';
import type { Player } from '@/types';
import { xpProgress } from '@/lib/xp';

interface Props {
  player: Player;
  compact?: boolean;
}

export default function PlayerStats({ player, compact }: Props) {
  const progress = xpProgress(player);

  if (compact) {
    return (
      <div className="bg-black/60 backdrop-blur-sm rounded-xl px-3 py-2 inline-flex items-center gap-3 pointer-events-auto">
        <span className="font-bold text-sm">Lv.{player.level}</span>
        <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all"
            style={{ width: `${progress.percent}%` }}
          />
        </div>
        <span className="text-xs text-gray-400">{progress.current}/{progress.needed}</span>
        <span className="text-xs text-gray-400">🏆 {player.creaturesCaught}</span>
      </div>
    );
  }

  return (
    <div className="bg-[#16213e] rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg">{player.name}</h3>
        <span className="text-blue-400 font-bold">Level {player.level}</span>
      </div>
      <div>
        <div className="flex justify-between text-sm text-gray-400 mb-1">
          <span>XP</span>
          <span>{progress.current} / {progress.needed}</span>
        </div>
        <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all"
            style={{ width: `${progress.percent}%` }}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="bg-[#1a1a2e] rounded-lg p-2 text-center">
          <div className="text-xl">🏆</div>
          <div className="font-bold">{player.creaturesCaught}</div>
          <div className="text-gray-400 text-xs">Caught</div>
        </div>
        <div className="bg-[#1a1a2e] rounded-lg p-2 text-center">
          <div className="text-xl">⭐</div>
          <div className="font-bold">{player.xp}</div>
          <div className="text-gray-400 text-xs">Total XP</div>
        </div>
      </div>
    </div>
  );
}
