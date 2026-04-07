'use client';
import { Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import type { SpawnPoint } from '@/types';

interface Props {
  spawn: SpawnPoint;
  inRange: boolean;
  onTap: (spawn: SpawnPoint) => void;
}

export default function CreatureMarker({ spawn, inRange, onTap }: Props) {
  const creature = spawn.creature;
  if (!creature) return null;

  const icon = L.divIcon({
    html: `<div class="creature-bounce ${inRange ? 'in-range' : 'out-of-range'}" style="font-size:32px;text-align:center;line-height:1;cursor:pointer;">${creature.emoji}</div>`,
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });

  return (
    <Marker
      position={[spawn.lat, spawn.lng]}
      icon={icon}
      eventHandlers={{
        click: () => onTap(spawn),
      }}
    >
      <Tooltip direction="top" offset={[0, -20]}>
        <span className="font-semibold">{creature.name}</span>
        <br />
        <span className="text-xs capitalize">{creature.type} &middot; {creature.rarity}</span>
        {!inRange && <><br /><span className="text-xs text-red-500">Too far - get closer!</span></>}
      </Tooltip>
    </Marker>
  );
}
