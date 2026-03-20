import { MAPPLS_CLIENT_ID, MAPPLS_CLIENT_SECRET, MAPPLS_REST_KEY } from '../constants/mappls';

export type MapplsSuggestion = {
  id: string;
  place_name?: string;
  type?: string;
  placeAddress?: string;
  placeName?: string;
  alternateName?: string;
  eLoc?: string;
  center?: number[];
};

let cachedToken: string | null = null;
let tokenFetchedAt = 0;
const TOKEN_TTL_MS = 1000 * 60 * 60;

async function getMapplsToken(signal: AbortSignal): Promise<string> {
  if (cachedToken && Date.now() - tokenFetchedAt < TOKEN_TTL_MS) {
    return cachedToken;
  }

  if (!MAPPLS_CLIENT_ID || !MAPPLS_CLIENT_SECRET) {
    throw new Error('Missing Mappls client credentials.');
  }

  const tokenRes = await fetch(
    `https://outpost.mappls.com/api/security/oauth/token?grant_type=client_credentials&client_id=${encodeURIComponent(
      MAPPLS_CLIENT_ID,
    )}&client_secret=${encodeURIComponent(MAPPLS_CLIENT_SECRET)}`,
    { method: 'POST', signal },
  );

  if (!tokenRes.ok) {
    const text = await tokenRes.text();
    throw new Error(`Mappls auth failed (${tokenRes.status}) ${text}`);
  }

  const tokenData = await tokenRes.json();
  const oauthToken = tokenData?.access_token;
  if (!oauthToken) {
    throw new Error('Mappls auth failed (no access_token).');
  }

  cachedToken = oauthToken;
  tokenFetchedAt = Date.now();
  return oauthToken;
}

function clearCachedToken() {
  cachedToken = null;
  tokenFetchedAt = 0;
}

function normalizeSuggestions(data: any): MapplsSuggestion[] {
  const source = Array.isArray(data?.suggestedLocations)
    ? data.suggestedLocations
    : Array.isArray(data?.results)
      ? data.results
      : Array.isArray(data)
        ? data
        : [];

  return source.map((place: any, idx: number) => {
    const lonRaw = place.longitude ?? place.lng ?? place.lon ?? place.placeLng;
    const latRaw = place.latitude ?? place.lat ?? place.placeLat;
    const lon = typeof lonRaw === 'string' ? parseFloat(lonRaw) : lonRaw;
    const lat = typeof latRaw === 'string' ? parseFloat(latRaw) : latRaw;

    return {
      id: place.eLoc ?? place.mapplsPin ?? place.placeId ?? String(idx),
      place_name: place.placeAddress ?? place.placeName ?? place.formatted_address ?? place.name ?? 'Unknown',
      type: place.type,
      placeAddress: place.placeAddress,
      placeName: place.placeName,
      alternateName: place.alternateName,
      eLoc: place.eLoc,
      center: Number.isFinite(lon) && Number.isFinite(lat) ? [lon, lat] : undefined,
    } as MapplsSuggestion;
  });
}

export async function searchMapplsPlaces(query: string, signal: AbortSignal): Promise<MapplsSuggestion[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const oauthEndpoints = [
    `https://atlas.mappls.com/api/places/search/json?query=${encodeURIComponent(trimmed)}&region=IND&itemCount=5`,
    `https://atlas.mappls.com/api/places/search/json?queryString=${encodeURIComponent(trimmed)}&region=IND&itemCount=5`,
  ];

  const runOauthSearch = async () => {
    const oauthToken = await getMapplsToken(signal);
    let anyOk = false;

    for (const endpoint of oauthEndpoints) {
      const response = await fetch(endpoint, {
        signal,
        headers: { Authorization: `Bearer ${oauthToken}` },
      });

      if (response.status === 401) {
        clearCachedToken();
        return { shouldRetry: true, items: [] as MapplsSuggestion[], anyOk };
      }

      if (!response.ok) continue;
      anyOk = true;

      const data = await response.json();
      const items = normalizeSuggestions(data);
      if (items.length > 0) return { shouldRetry: false, items, anyOk };
    }

    return { shouldRetry: false, items: [] as MapplsSuggestion[], anyOk };
  };

  let oauthResult = await runOauthSearch();
  if (oauthResult.shouldRetry) {
    oauthResult = await runOauthSearch();
  }

  if (oauthResult.items.length > 0) return oauthResult.items;

  if (oauthResult.anyOk) {
    return [];
  }

  if (MAPPLS_REST_KEY) {
    let anyOk = false;
    const keyEndpoints = [
      `https://atlas.mappls.com/api/places/search/json?query=${encodeURIComponent(trimmed)}&region=IND&itemCount=5&key=${encodeURIComponent(
        MAPPLS_REST_KEY,
      )}`,
      `https://atlas.mappls.com/api/places/search/json?queryString=${encodeURIComponent(trimmed)}&region=IND&itemCount=5&key=${encodeURIComponent(
        MAPPLS_REST_KEY,
      )}`,
    ];

    for (const endpoint of keyEndpoints) {
      const response = await fetch(endpoint, { signal });
      if (!response.ok) continue;
      anyOk = true;
      const data = await response.json();
      const items = normalizeSuggestions(data);
      if (items.length > 0) return items;
    }

    if (anyOk) {
      return [];
    }
  }

  throw new Error('Mappls search failed');
}
