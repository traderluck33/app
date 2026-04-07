'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { usePlayerLocation } from '@/hooks/usePlayerLocation';
import { useGameState } from '@/hooks/useGameState';
import CatchModal from '@/components/CatchModal';
import ChestModal from '@/components/ChestModal';
import PlayerStats from '@/components/PlayerStats';
import Navbar from '@/components/Navbar';
import type { SpawnPoint, TreasureChest } from '@/types';

const GameMap = dynamic(() => import('@/components/GameMap'), { ssr: false });

export default function Home() {
  const { lat, lng, accuracy, error: geoError, loading: geoLoading } = usePlayerLocation();
  const {
    player, spawns, chests, initPlayer, catchCreature, openChest, refreshSpawns, refreshChests,
  } = useGameState(lat, lng);

  const [selectedSpawn, setSelectedSpawn] = useState<SpawnPoint | null>(null);
  const [selectedChest, setSelectedChest] = useState<TreasureChest | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [seeded, setSeeded] = useState(false);

  // Seed POIs on first GPS lock
  useEffect(() => {
    if (lat && lng && !seeded && player) {
      fetch('/api/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lng }),
      }).then(() => {
        setSeeded(true);
        refreshSpawns();
        refreshChests();
      });
    }
  }, [lat, lng, seeded, player, refreshSpawns, refreshChests]);

  const handleCatch = useCallback(async (spawnId: number) => {
    if (!lat || !lng) return null;
    const result = await catchCreature(spawnId, lat, lng);
    return result;
  }, [lat, lng, catchCreature]);

  const handleOpenChest = useCallback(async (chestId: number) => {
    if (!lat || !lng) return null;
    const result = await openChest(chestId, lat, lng);
    return result;
  }, [lat, lng, openChest]);

  // Player creation screen
  if (!player) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-6 max-w-sm">
          <div className="text-6xl">🗺️</div>
          <h1 className="text-3xl font-bold">CreatureQuest</h1>
          <p className="text-gray-400">Explore your city. Catch creatures. Find treasure.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (playerName.trim()) initPlayer(playerName.trim());
            }}
            className="space-y-4"
          >
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name..."
              className="w-full px-4 py-3 rounded-lg bg-[#16213e] border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              maxLength={20}
            />
            <button
              type="submit"
              disabled={!playerName.trim()}
              className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-40 font-semibold transition-colors"
            >
              Start Playing
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Stats overlay */}
      <div className="absolute top-2 left-2 right-2 z-[1000] pointer-events-none">
        <PlayerStats player={player} compact />
      </div>

      {/* GPS status */}
      {geoLoading && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[1000] bg-black/70 px-4 py-2 rounded-full text-sm">
          Acquiring GPS...
        </div>
      )}
      {geoError && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[1000] bg-red-900/70 px-4 py-2 rounded-full text-sm">
          {geoError}
        </div>
      )}

      {/* Map */}
      <div className="flex-1">
        <GameMap
          playerLat={lat}
          playerLng={lng}
          accuracy={accuracy}
          spawns={spawns}
          chests={chests}
          onCreatureTap={setSelectedSpawn}
          onChestTap={setSelectedChest}
        />
      </div>

      {/* Catch modal */}
      {selectedSpawn && (
        <CatchModal
          spawn={selectedSpawn}
          onCatch={handleCatch}
          onClose={() => {
            setSelectedSpawn(null);
            refreshSpawns();
          }}
        />
      )}

      {/* Chest modal */}
      {selectedChest && (
        <ChestModal
          chest={selectedChest}
          onOpen={handleOpenChest}
          onClose={() => {
            setSelectedChest(null);
            refreshChests();
          }}
        />
      )}

      {/* Navigation */}
      <Navbar />
    </>
  );
}
