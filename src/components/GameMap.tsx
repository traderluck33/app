'use client';
import { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import PlayerMarker from './PlayerMarker';
import CreatureMarker from './CreatureMarker';
import ChestMarker from './ChestMarker';
import { haversineDistance } from '@/lib/geo';
import type { SpawnPoint, TreasureChest } from '@/types';
import 'leaflet/dist/leaflet.css';

const CATCH_RADIUS = 50; // meters

interface Props {
  playerLat: number | null;
  playerLng: number | null;
  accuracy: number | null;
  spawns: SpawnPoint[];
  chests: TreasureChest[];
  onCreatureTap: (spawn: SpawnPoint) => void;
  onChestTap: (chest: TreasureChest) => void;
}

function MapFollower({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom(), { animate: true });
  }, [lat, lng, map]);
  return null;
}

export default function GameMap({
  playerLat, playerLng, accuracy, spawns, chests, onCreatureTap, onChestTap,
}: Props) {
  const lat = playerLat || 40.7128;
  const lng = playerLng || -74.006;

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={16}
      zoomControl={false}
      attributionControl={false}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />
      <MapFollower lat={lat} lng={lng} />

      {playerLat && playerLng && (
        <PlayerMarker lat={playerLat} lng={playerLng} accuracy={accuracy} />
      )}

      {spawns.map(spawn => {
        const dist = playerLat && playerLng
          ? haversineDistance(playerLat, playerLng, spawn.lat, spawn.lng)
          : Infinity;
        return (
          <CreatureMarker
            key={spawn.id}
            spawn={spawn}
            inRange={dist <= CATCH_RADIUS}
            onTap={onCreatureTap}
          />
        );
      })}

      {chests.map(chest => {
        const dist = playerLat && playerLng
          ? haversineDistance(playerLat, playerLng, chest.lat, chest.lng)
          : Infinity;
        return (
          <ChestMarker
            key={chest.id}
            chest={chest}
            inRange={dist <= CATCH_RADIUS}
            onTap={onChestTap}
          />
        );
      })}
    </MapContainer>
  );
}
