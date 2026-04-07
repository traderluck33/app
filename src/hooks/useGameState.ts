'use client';
import { useState, useEffect, useCallback } from 'react';
import type { Player, SpawnPoint, TreasureChest, CaughtCreature, CatchResult, ChestOpenResult, PlayerUpgrade } from '@/types';

export function useGameState(lat: number | null, lng: number | null) {
  const [player, setPlayer] = useState<Player | null>(null);
  const [spawns, setSpawns] = useState<SpawnPoint[]>([]);
  const [chests, setChests] = useState<TreasureChest[]>([]);
  const [caught, setCaught] = useState<CaughtCreature[]>([]);
  const [upgrades, setUpgrades] = useState<PlayerUpgrade[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch player on mount
  useEffect(() => {
    fetch('/api/player')
      .then(r => r.json())
      .then(data => {
        if (data.exists) {
          setPlayer(data.player);
          setCaught(data.caught || []);
          setUpgrades(data.upgrades || []);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const initPlayer = useCallback(async (name: string) => {
    const res = await fetch('/api/player', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    setPlayer(data.player);
  }, []);

  const refreshSpawns = useCallback(async () => {
    if (!lat || !lng) return;
    try {
      const res = await fetch(`/api/spawn?lat=${lat}&lng=${lng}`);
      const data = await res.json();
      setSpawns(data.spawns || []);
      setChests(data.chests || []);
    } catch (e) {
      console.error('Failed to refresh spawns:', e);
    }
  }, [lat, lng]);

  const refreshChests = useCallback(async () => {
    if (!lat || !lng) return;
    try {
      const res = await fetch(`/api/chest?lat=${lat}&lng=${lng}`);
      const data = await res.json();
      setChests(data.chests || []);
    } catch (e) {
      console.error('Failed to refresh chests:', e);
    }
  }, [lat, lng]);

  const refreshPlayer = useCallback(async () => {
    const res = await fetch('/api/player');
    const data = await res.json();
    if (data.exists) {
      setPlayer(data.player);
      setCaught(data.caught || []);
      setUpgrades(data.upgrades || []);
    }
  }, []);

  // Poll spawns every 30 seconds
  useEffect(() => {
    if (!lat || !lng || !player) return;
    refreshSpawns();
    const interval = setInterval(refreshSpawns, 30000);
    return () => clearInterval(interval);
  }, [lat, lng, player, refreshSpawns]);

  const catchCreature = useCallback(async (spawnId: number, playerLat: number, playerLng: number): Promise<CatchResult> => {
    const res = await fetch('/api/catch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ spawnId, playerLat, playerLng }),
    });
    const data = await res.json();
    if (data.player) setPlayer(data.player);
    if (data.success) {
      refreshSpawns();
      refreshPlayer();
    }
    return data;
  }, [refreshSpawns, refreshPlayer]);

  const openChest = useCallback(async (chestId: number, playerLat: number, playerLng: number): Promise<ChestOpenResult> => {
    const res = await fetch('/api/chest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chestId, playerLat, playerLng }),
    });
    const data = await res.json();
    if (data.success) {
      refreshChests();
      refreshPlayer();
    }
    return data;
  }, [refreshChests, refreshPlayer]);

  return {
    player, spawns, chests, caught, upgrades, loading,
    initPlayer, catchCreature, openChest, refreshSpawns, refreshChests, refreshPlayer,
  };
}
