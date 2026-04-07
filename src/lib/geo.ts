const EARTH_RADIUS_M = 6371000;

export function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return EARTH_RADIUS_M * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function boundingBox(lat: number, lng: number, radiusM: number) {
  const latDelta = (radiusM / EARTH_RADIUS_M) * (180 / Math.PI);
  const lngDelta = latDelta / Math.cos((lat * Math.PI) / 180);
  return {
    south: lat - latDelta,
    north: lat + latDelta,
    west: lng - lngDelta,
    east: lng + lngDelta,
  };
}

export function addJitter(lat: number, lng: number, metersMax: number = 50): { lat: number; lng: number } {
  const angle = Math.random() * 2 * Math.PI;
  const dist = Math.random() * metersMax;
  const dLat = (dist * Math.cos(angle)) / EARTH_RADIUS_M * (180 / Math.PI);
  const dLng = (dist * Math.sin(angle)) / (EARTH_RADIUS_M * Math.cos(lat * Math.PI / 180)) * (180 / Math.PI);
  return { lat: lat + dLat, lng: lng + dLng };
}
