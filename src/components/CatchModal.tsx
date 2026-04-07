'use client';
import { useState } from 'react';
import type { SpawnPoint, CatchResult } from '@/types';

const rarityColors: Record<string, string> = {
  common: 'text-gray-300',
  uncommon: 'text-green-400',
  rare: 'text-blue-400',
  legendary: 'text-yellow-400',
};

const typeColors: Record<string, string> = {
  water: 'bg-blue-600',
  grass: 'bg-green-600',
  fire: 'bg-red-600',
  electric: 'bg-yellow-600',
  rock: 'bg-stone-600',
  normal: 'bg-gray-600',
};

interface Props {
  spawn: SpawnPoint;
  onCatch: (spawnId: number) => Promise<CatchResult | null>;
  onClose: () => void;
}

export default function CatchModal({ spawn, onCatch, onClose }: Props) {
  const [state, setState] = useState<'ready' | 'throwing' | 'caught' | 'escaped'>('ready');
  const [result, setResult] = useState<CatchResult | null>(null);

  const creature = spawn.creature;
  if (!creature) return null;

  const handleThrow = async () => {
    setState('throwing');
    const res = await onCatch(spawn.id);
    if (!res) {
      onClose();
      return;
    }
    setResult(res);
    setState(res.success ? 'caught' : 'escaped');
  };

  return (
    <div className="fixed inset-0 z-[2000] modal-backdrop flex items-center justify-center p-4">
      <div className="bg-[#16213e] rounded-2xl p-6 max-w-sm w-full text-center space-y-4 border border-gray-700">
        {/* Creature display */}
        <div className={`text-7xl ${state === 'throwing' ? 'wiggle' : ''} ${state === 'caught' ? 'catch-success' : ''}`}>
          {creature.emoji}
        </div>

        <div>
          <h2 className="text-2xl font-bold">{creature.name}</h2>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeColors[creature.type]}`}>
              {creature.type}
            </span>
            <span className={`text-sm font-medium capitalize ${rarityColors[creature.rarity]}`}>
              {creature.rarity}
            </span>
          </div>
          <p className="text-gray-400 text-sm mt-2">{creature.description}</p>
        </div>

        {/* Action area */}
        {state === 'ready' && (
          <div className="space-y-3">
            <button
              onClick={handleThrow}
              className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 font-bold text-lg transition-colors"
            >
              Throw Ball!
            </button>
            <button
              onClick={onClose}
              className="w-full py-2 rounded-xl bg-gray-700 hover:bg-gray-600 text-sm transition-colors"
            >
              Run Away
            </button>
          </div>
        )}

        {state === 'throwing' && (
          <div className="py-4">
            <div className="text-2xl animate-bounce">🔴</div>
            <p className="text-gray-400 mt-2">...</p>
          </div>
        )}

        {state === 'caught' && result && (
          <div className="space-y-3">
            <div className="text-green-400 text-xl font-bold">Caught!</div>
            <div className="text-yellow-400 font-semibold float-up">+{result.xpGained} XP</div>
            {result.levelUp && (
              <div className="text-purple-400 font-bold text-lg animate-pulse">Level Up!</div>
            )}
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 font-bold transition-colors"
            >
              Awesome!
            </button>
          </div>
        )}

        {state === 'escaped' && (
          <div className="space-y-3">
            <div className="text-red-400 text-xl font-bold">It escaped!</div>
            <div className="flex gap-2">
              <button
                onClick={() => setState('ready')}
                className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 font-bold transition-colors"
              >
                Run Away
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
