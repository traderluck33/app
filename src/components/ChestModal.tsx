'use client';
import { useState } from 'react';
import type { TreasureChest, ChestOpenResult } from '@/types';

const tierConfig: Record<string, { emoji: string; label: string; color: string }> = {
  wooden: { emoji: '📦', label: 'Wooden Chest', color: 'text-amber-600' },
  silver: { emoji: '🪙', label: 'Silver Chest', color: 'text-gray-300' },
  gold:   { emoji: '👑', label: 'Gold Chest', color: 'text-yellow-400' },
};

interface Props {
  chest: TreasureChest;
  onOpen: (chestId: number) => Promise<ChestOpenResult | null>;
  onClose: () => void;
}

export default function ChestModal({ chest, onOpen, onClose }: Props) {
  const [state, setState] = useState<'ready' | 'opening' | 'revealed'>('ready');
  const [result, setResult] = useState<ChestOpenResult | null>(null);

  const config = tierConfig[chest.tier] || tierConfig.wooden;

  const handleOpen = async () => {
    setState('opening');
    const res = await onOpen(chest.id);
    if (!res || !res.success) {
      onClose();
      return;
    }
    setResult(res);
    setTimeout(() => setState('revealed'), 1000);
  };

  return (
    <div className="fixed inset-0 z-[2000] modal-backdrop flex items-center justify-center p-4">
      <div className="bg-[#16213e] rounded-2xl p-6 max-w-sm w-full text-center space-y-4 border border-gray-700">
        {/* Chest display */}
        <div className={`text-7xl ${state === 'opening' ? 'wiggle' : ''}`}>
          {state === 'revealed' ? '✨' : config.emoji}
        </div>

        <h2 className={`text-2xl font-bold ${config.color}`}>{config.label}</h2>

        {state === 'ready' && (
          <div className="space-y-3">
            <p className="text-gray-400">You found a treasure chest! Open it to discover upgrades.</p>
            <button
              onClick={handleOpen}
              className="w-full py-3 rounded-xl bg-yellow-600 hover:bg-yellow-700 font-bold text-lg transition-colors"
            >
              Open Chest!
            </button>
            <button
              onClick={onClose}
              className="w-full py-2 rounded-xl bg-gray-700 hover:bg-gray-600 text-sm transition-colors"
            >
              Leave It
            </button>
          </div>
        )}

        {state === 'opening' && (
          <div className="py-4">
            <div className="text-3xl animate-pulse">🔓</div>
            <p className="text-gray-400 mt-2">Opening...</p>
          </div>
        )}

        {state === 'revealed' && result && (
          <div className="space-y-4">
            <p className="text-green-400 font-bold text-lg">Treasure Found!</p>
            <div className="space-y-2">
              {result.upgrades.map((upgrade, i) => (
                <div key={i} className="bg-[#1a1a2e] rounded-xl p-3 flex items-center gap-3 text-left sparkle" style={{ animationDelay: `${i * 0.2}s` }}>
                  <span className="text-3xl">{upgrade.emoji}</span>
                  <div>
                    <div className="font-semibold text-sm">{upgrade.name}</div>
                    <div className="text-gray-400 text-xs">{upgrade.description}</div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 font-bold transition-colors"
            >
              Nice!
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
