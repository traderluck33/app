import type { POI, CreatureType } from '@/types';

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

function mapOsmToBiome(tags: Record<string, string>): CreatureType {
  const leisure = tags.leisure || '';
  const natural = tags.natural || '';
  const waterway = tags.waterway || '';
  const amenity = tags.amenity || '';
  const tourism = tags.tourism || '';
  const historic = tags.historic || '';
  const landuse = tags.landuse || '';
  const power = tags.power || '';
  const shop = tags.shop || '';

  if (natural === 'water' || waterway || amenity === 'fountain') return 'water';
  if (leisure === 'park' || leisure === 'garden' || leisure === 'nature_reserve' || natural === 'wood') return 'grass';
  if (tourism === 'attraction' || historic || amenity === 'place_of_worship') return 'rock';
  if (landuse === 'industrial' || power) return 'electric';
  if (amenity === 'bbq' || amenity === 'fire_station') return 'fire';
  if (shop || amenity === 'restaurant' || amenity === 'cafe') return 'normal';
  return 'normal';
}

export async function fetchPOIs(lat: number, lng: number, radiusMeters: number = 3000): Promise<POI[]> {
  const query = `
    [out:json][timeout:30];
    (
      node["leisure"="park"](around:${radiusMeters},${lat},${lng});
      node["leisure"="garden"](around:${radiusMeters},${lat},${lng});
      node["natural"="water"](around:${radiusMeters},${lat},${lng});
      node["waterway"](around:${radiusMeters},${lat},${lng});
      node["amenity"="fountain"](around:${radiusMeters},${lat},${lng});
      node["tourism"="attraction"](around:${radiusMeters},${lat},${lng});
      node["historic"](around:${radiusMeters},${lat},${lng});
      node["amenity"="place_of_worship"](around:${radiusMeters},${lat},${lng});
      node["landuse"="industrial"](around:${radiusMeters},${lat},${lng});
      node["amenity"="restaurant"](around:${radiusMeters},${lat},${lng});
      node["amenity"="cafe"](around:${radiusMeters},${lat},${lng});
      node["shop"](around:${radiusMeters},${lat},${lng});
      way["leisure"="park"](around:${radiusMeters},${lat},${lng});
      way["natural"="water"](around:${radiusMeters},${lat},${lng});
      way["waterway"](around:${radiusMeters},${lat},${lng});
      way["tourism"="attraction"](around:${radiusMeters},${lat},${lng});
      way["historic"](around:${radiusMeters},${lat},${lng});
    );
    out center 200;
  `;

  const response = await fetch(OVERPASS_URL, {
    method: 'POST',
    body: `data=${encodeURIComponent(query)}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  if (!response.ok) throw new Error(`Overpass API error: ${response.status}`);
  const data = await response.json();

  const pois: POI[] = [];
  for (const el of data.elements) {
    const elLat = el.lat ?? el.center?.lat;
    const elLng = el.lon ?? el.center?.lon;
    if (!elLat || !elLng) continue;

    const tags = el.tags || {};
    pois.push({
      osmId: `${el.type}/${el.id}`,
      name: tags.name || tags.amenity || tags.leisure || 'Unknown',
      lat: elLat,
      lng: elLng,
      osmType: tags.amenity || tags.leisure || tags.tourism || tags.natural || tags.historic || tags.shop || 'other',
      biome: mapOsmToBiome(tags),
    });
  }

  return pois;
}
