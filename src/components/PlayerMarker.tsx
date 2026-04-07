'use client';
import { CircleMarker, Circle } from 'react-leaflet';

interface Props {
  lat: number;
  lng: number;
  accuracy: number | null;
}

export default function PlayerMarker({ lat, lng, accuracy }: Props) {
  return (
    <>
      {/* Accuracy circle */}
      {accuracy && accuracy < 200 && (
        <Circle
          center={[lat, lng]}
          radius={accuracy}
          pathOptions={{
            color: '#4a90d9',
            fillColor: '#4a90d9',
            fillOpacity: 0.1,
            weight: 1,
          }}
        />
      )}
      {/* Outer pulse */}
      <CircleMarker
        center={[lat, lng]}
        radius={16}
        pathOptions={{
          color: '#4a90d9',
          fillColor: '#4a90d9',
          fillOpacity: 0.2,
          weight: 0,
        }}
        className="player-pulse"
      />
      {/* Inner dot */}
      <CircleMarker
        center={[lat, lng]}
        radius={8}
        pathOptions={{
          color: '#fff',
          fillColor: '#4a90d9',
          fillOpacity: 1,
          weight: 3,
        }}
      />
    </>
  );
}
