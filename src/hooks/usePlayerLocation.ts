'use client';
import { useState, useEffect } from 'react';

// Default fallback: 3421 Richards St, Nashville TN 37215
const DEFAULT_LAT = 36.1058;
const DEFAULT_LNG = -86.8295;

interface LocationState {
  lat: number | null;
  lng: number | null;
  accuracy: number | null;
  error: string | null;
  loading: boolean;
}

export function usePlayerLocation(): LocationState {
  const [state, setState] = useState<LocationState>({
    lat: null, lng: null, accuracy: null, error: null, loading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        lat: DEFAULT_LAT, lng: DEFAULT_LNG, accuracy: null,
        error: 'Geolocation not supported - using default location', loading: false,
      });
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setState({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          error: null,
          loading: false,
        });
      },
      (err) => {
        console.warn('Geolocation error:', err.message);
        setState({
          lat: DEFAULT_LAT, lng: DEFAULT_LNG, accuracy: null,
          error: `GPS unavailable - using default location`,
          loading: false,
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return state;
}
