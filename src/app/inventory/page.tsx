'use client';
import { useEffect, useState } from 'react';
import type { Player, CaughtCreature, PlayerUpgrade } from '@/types';
import PlayerStats from '@/components/PlayerStats';
import InventoryGrid from '@/components/InventoryGrid';
import UpgradesPanel from '@/components/UpgradesPanel';
import Navbar from '@/components/Navbar';

export default function InventoryPage() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [caught, setCaught] = useState<CaughtCreature[]>([]);
  const [upgrades, setUpgrades] = useState<PlayerUpgrade[]>([]);

  useEffect(() => {
    fetch('/api/player')
      .then(r => r.json())
      .then(data => {
        if (data.exists) {
          setPlayer(data.player);
          setCaught(data.caught || []);
          setUpgrades(data.upgrades || []);
        }
      });
  }, []);

  if (!player) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
        <PlayerStats player={player} />
        <UpgradesPanel upgrades={upgrades} />
        <div>
          <h2 className="font-bold text-lg mb-2">Collection</h2>
          <InventoryGrid caught={caught} />
        </div>
      </div>
      <Navbar />
    </>
  );
}
