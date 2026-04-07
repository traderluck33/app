'use client';
import { Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import type { TreasureChest } from '@/types';

interface Props {
  chest: TreasureChest;
  inRange: boolean;
  onTap: (chest: TreasureChest) => void;
}

const tierEmoji: Record<string, string> = {
  wooden: '📦',
  silver: '🪙',
  gold: '👑',
};

const tierLabel: Record<string, string> = {
  wooden: 'Wooden Chest',
  silver: 'Silver Chest',
  gold: 'Gold Chest',
};

export default function ChestMarker({ chest, inRange, onTap }: Props) {
  const emoji = tierEmoji[chest.tier] || '📦';

  const icon = L.divIcon({
    html: `<div class="chest-glow ${inRange ? 'in-range' : 'out-of-range'}" style="font-size:28px;text-align:center;line-height:1;cursor:pointer;">${emoji}</div>`,
    className: '',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });

  return (
    <Marker
      position={[chest.lat, chest.lng]}
      icon={icon}
      eventHandlers={{
        click: () => onTap(chest),
      }}
    >
      <Tooltip direction="top" offset={[0, -18]}>
        <span className="font-semibold">{tierLabel[chest.tier]}</span>
        {!inRange && <><br /><span className="text-xs text-red-500">Get closer to open!</span></>}
      </Tooltip>
    </Marker>
  );
}
