import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView, TextInput, PermissionsAndroid, Platform } from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';
import Geolocation from 'react-native-geolocation-service';
import { MAPPLS_CLIENT_ID, MAPPLS_CLIENT_SECRET } from '../constants/mappls';
import { searchMapplsPlaces, type MapplsSuggestion } from '../services/mapplsPlaces';

type Props = {
  onClose: () => void;
  selectedPickup?: { label: string; center?: number[] } | null;
};

type SuggestionItem = MapplsSuggestion;

type RouteOption = {
  id: string;
  title: string;
  fare: string;
  duration: string;
  color: string;
  path: string;
};

function withRouteBend(from: number[], to: number[], bendFactor: number): number[] {
  const midLng = (from[0] + to[0]) / 2;
  const midLat = (from[1] + to[1]) / 2;
  const deltaLng = to[0] - from[0];
  const deltaLat = to[1] - from[1];
  const length = Math.max(Math.sqrt(deltaLng * deltaLng + deltaLat * deltaLat), 0.0001);
  const normalLng = -deltaLat / length;
  const normalLat = deltaLng / length;
  const offset = Math.min(0.02, length * bendFactor);

  return [midLng + normalLng * offset, midLat + normalLat * offset];
}

function buildRouteLine(from: number[], to: number[], routeIndex: number): number[][] {
  const bend = ((routeIndex % 5) - 2) * 0.12;
  const midpoint = withRouteBend(from, to, bend);
  return [from, midpoint, to];
}

function getBounds(from: number[], to: number[]) {
  const minLng = Math.min(from[0], to[0]);
  const maxLng = Math.max(from[0], to[0]);
  const minLat = Math.min(from[1], to[1]);
  const maxLat = Math.max(from[1], to[1]);
  const pad = 0.01;

  return {
    ne: [maxLng + pad, maxLat + pad] as [number, number],
    sw: [minLng - pad, minLat - pad] as [number, number],
  };
}

function formatSuggestionLabel(item: SuggestionItem) {
  const placeName = item.placeName ?? item.place_name ?? 'Unknown';
  const alt = item.alternateName?.trim();
  const address = item.placeAddress?.trim();

  const nameWithAlt = alt ? `${placeName}, (${alt})` : placeName;
  return address ? `${nameWithAlt} ${address}` : nameWithAlt;
}

function distanceKm(from?: number[], to?: number[]) {
  if (!from || !to || from.length < 2 || to.length < 2) return null;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const lat1 = from[1];
  const lon1 = from[0];
  const lat2 = to[1];
  const lon2 = to[0];
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return 6371 * c;
}

function buildRoutes(from?: number[], to?: number[]): RouteOption[] {
  const km = distanceKm(from, to) ?? 8;
  const walkStart = Math.max(120, Math.round(km * 55));
  const walkEnd = Math.max(100, Math.round(km * 45));
  const brtsMins = Math.max(8, Math.round(km * 4));
  const metroMins = Math.max(7, Math.round(km * 3.2));
  const amtsMins = Math.max(10, Math.round(km * 4.6));
  const bikeMins = Math.max(7, Math.round(km * 2.4));
  const autoMins = Math.max(9, Math.round(km * 2.8));
  const cabMins = Math.max(8, Math.round(km * 2.5));

  return [
    {
      id: 'r1',
      title: 'Walk + BRTS + Metro + AMTS + Walk',
      fare: `₹${Math.round(14 + km * 2.2)}`,
      duration: `${walkStart / 1000 + brtsMins + metroMins + amtsMins + walkEnd / 1000 > 1 ? Math.round(walkStart / 75 + brtsMins + metroMins + amtsMins + walkEnd / 75) : 0} min`,
      color: '#1E3A8A',
      path: `${walkStart}m walk → BRTS ${brtsMins}m → Metro ${metroMins}m → AMTS ${amtsMins}m → ${walkEnd}m walk → Destination`,
    },
    {
      id: 'r2',
      title: 'Walk + Metro + Walk',
      fare: `₹${Math.round(10 + km * 1.8)}`,
      duration: `${Math.round(walkStart / 75 + metroMins + walkEnd / 75)} min`,
      color: '#166534',
      path: `${walkStart}m walk → Metro ${metroMins}m → ${walkEnd}m walk → Destination`,
    },
    {
      id: 'r3',
      title: 'Walk + AMTS + Walk',
      fare: `₹${Math.round(8 + km * 1.4)}`,
      duration: `${Math.round(walkStart / 75 + amtsMins + walkEnd / 75)} min`,
      color: '#0F766E',
      path: `${walkStart}m walk → AMTS ${amtsMins}m → ${walkEnd}m walk → Destination`,
    },
    {
      id: 'r4',
      title: 'Auto + Metro',
      fare: `₹${Math.round(22 + km * 3.6)}`,
      duration: `${Math.round(autoMins * 0.45 + metroMins)} min`,
      color: '#D97706',
      path: `Auto ${Math.round(autoMins * 0.45)}m → Metro ${metroMins}m → short walk → Destination`,
    },
    {
      id: 'r5',
      title: 'Bike + BRTS',
      fare: `₹${Math.round(18 + km * 2.9)}`,
      duration: `${Math.round(bikeMins * 0.4 + brtsMins)} min`,
      color: '#0284C7',
      path: `Bike ${Math.round(bikeMins * 0.4)}m → BRTS ${brtsMins}m → walk → Destination`,
    },
    {
      id: 'r6',
      title: 'Auto Direct',
      fare: `₹${Math.round(35 + km * 7.2)}`,
      duration: `${autoMins} min`,
      color: '#B45309',
      path: `Auto direct ${Math.round(km * 10) / 10} km → Destination`,
    },
    {
      id: 'r7',
      title: 'Cab Direct',
      fare: `₹${Math.round(58 + km * 10.8)}`,
      duration: `${cabMins} min`,
      color: '#1D4ED8',
      path: `Cab direct ${Math.round(km * 10) / 10} km → Destination`,
    },
    {
      id: 'r8',
      title: 'Bike Direct',
      fare: `₹${Math.round(25 + km * 5.4)}`,
      duration: `${bikeMins} min`,
      color: '#047857',
      path: `Bike direct ${Math.round(km * 10) / 10} km → Destination`,
    },
  ];
}

export default function PickupScreen({ onClose, selectedPickup }: Props) {
  const CURRENT_LOCATION_PREFIX = 'Current location';
  const [pickupLabel, setPickupLabel] = useState<string>(selectedPickup?.label ?? '');
  const [pickupCenter, setPickupCenter] = useState<number[] | undefined>(selectedPickup?.center);
  const [destination, setDestination] = useState<string>('');
  const [destinationCenter, setDestinationCenter] = useState<number[] | undefined>(undefined);
  const [pickupResults, setPickupResults] = useState<SuggestionItem[]>([]);
  const [isSearchingPickup, setIsSearchingPickup] = useState(false);
  const [pickupError, setPickupError] = useState<string | null>(null);
  const [isPickupFocused, setIsPickupFocused] = useState(false);

  const [destinationResults, setDestinationResults] = useState<SuggestionItem[]>([]);
  const [isSearchingDestination, setIsSearchingDestination] = useState(false);
  const [destinationError, setDestinationError] = useState<string | null>(null);
  const [isDestinationFocused, setIsDestinationFocused] = useState(false);

  useEffect(() => {
    setPickupLabel(selectedPickup?.label ?? '');
    setPickupCenter(selectedPickup?.center);
  }, [selectedPickup]);

  useEffect(() => {
    if (selectedPickup?.label) return;

    let mounted = true;
    const setFallback = () => {
      if (!mounted) return;
      setPickupLabel(CURRENT_LOCATION_PREFIX);
      setPickupResults([]);
      setPickupError(null);
    };

    const requestCurrentLocation = async () => {
      try {
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            setFallback();
            return;
          }
        }

        Geolocation.getCurrentPosition(
          (position) => {
            if (!mounted) return;
            const { latitude, longitude } = position.coords;
            setPickupCenter([longitude, latitude]);
            setPickupLabel(`${CURRENT_LOCATION_PREFIX} (${latitude.toFixed(5)}, ${longitude.toFixed(5)})`);
            setPickupResults([]);
            setPickupError(null);
          },
          () => {
            setFallback();
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 10000,
          },
        );
      } catch {
        setFallback();
      }
    };

    requestCurrentLocation();

    return () => {
      mounted = false;
    };
  }, [selectedPickup]);

  useEffect(() => {
    if (!isPickupFocused) {
      setPickupResults([]);
      setPickupError(null);
      return;
    }

    const trimmed = pickupLabel.trim();
    if (trimmed.startsWith(CURRENT_LOCATION_PREFIX)) {
      setPickupResults([]);
      setPickupError(null);
      return;
    }
    if (trimmed.length < 3) {
      setPickupResults([]);
      setPickupError(null);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        setPickupError(null);
        if (!MAPPLS_CLIENT_ID || !MAPPLS_CLIENT_SECRET) {
          setPickupResults([]);
          setPickupError('Missing Mappls client credentials.');
          return;
        }

        setIsSearchingPickup(true);
        const items = await searchMapplsPlaces(trimmed, controller.signal);

        if (items.length > 0) {
          setPickupResults(items);
        } else {
          setPickupResults([]);
          setPickupError('No results');
        }
      } catch (err) {
        if ((err as any)?.name === 'AbortError') return;
        const message = err instanceof Error ? err.message : 'Network error';
        setPickupResults([]);
        setPickupError(message);
      } finally {
        setIsSearchingPickup(false);
      }
    }, 350);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [pickupLabel, isPickupFocused]);

  useEffect(() => {
    if (!isDestinationFocused) {
      setDestinationResults([]);
      setDestinationError(null);
      return;
    }

    const trimmed = destination.trim();
    if (trimmed.length < 3) {
      setDestinationResults([]);
      setDestinationError(null);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        setDestinationError(null);
        if (!MAPPLS_CLIENT_ID || !MAPPLS_CLIENT_SECRET) {
          setDestinationResults([]);
          setDestinationError('Missing Mappls client credentials.');
          return;
        }

        setIsSearchingDestination(true);
        const items = await searchMapplsPlaces(trimmed, controller.signal);

        if (items.length > 0) {
          setDestinationResults(items);
        } else {
          setDestinationResults([]);
          setDestinationError('No results');
        }
      } catch (err) {
        if ((err as any)?.name === 'AbortError') return;
        setDestinationResults([]);
        const message = err instanceof Error ? err.message : 'Network error';
        setDestinationError(message);
      } finally {
        setIsSearchingDestination(false);
      }
    }, 350);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [destination, isDestinationFocused]);

  return (
    <View className="flex-1 bg-[#ecedff]">
      <View className="px-4 pt-5 pb-3 flex-row items-center justify-between border-b border-[#ffffff] bg-[#ecedff]">
        <View>
          <Text className="text-[#1E3A8A] font-syne-bold text-[18px]">Plan Your Route</Text>
          <Text className="text-[#6B7280] text-[12px]">Find the best way to get there</Text>
        </View>

        <Pressable onPress={onClose} className="w-10 h-10 rounded-full bg-white items-center justify-center">
          <Text className="font-syne-bold text-[#111827] text-[18px]">✕</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="px-4 pt-4">
          <View className="mb-4">
            <View className="rounded-xl bg-[#233F89] p-3 mb-3">
              <TextInput
                value={pickupLabel}
                onChangeText={setPickupLabel}
                onFocus={() => setIsPickupFocused(true)}
                onBlur={() => setIsPickupFocused(false)}
                placeholder="Pickup location"
                placeholderTextColor="#E8EDFF"
                className="text-white font-poppins-semibold text-[12px]"
              />
            </View>

            {isSearchingPickup ? <Text className="text-[#6B7280] mb-2">Searching...</Text> : null}

            {!isSearchingPickup && pickupError ? (
              <Text className="text-[#EF4444] mb-2">{pickupError}</Text>
            ) : null}

            {pickupResults.length > 0 ? (
              <View className="mb-2 bg-white rounded-xl overflow-hidden border border-[#E5E7EB]">
                {pickupResults.map((item) => {
                  const label = formatSuggestionLabel(item);
                  return (
                    <Pressable
                      key={item.id}
                      onPress={() => {
                        setPickupLabel(label);
                        setPickupCenter(item.center);
                        setIsPickupFocused(false);
                        setPickupResults([]);
                      }}
                      className="px-4 py-3 border-b border-[#E5E7EB] bg-white"
                    >
                      <View className="flex-row items-start justify-between">
                        <View className="flex-1 pr-3">
                          <Text numberOfLines={2} className="text-[#111827] font-poppins-semibold text-[14px]">{label}</Text>
                        </View>
                        <View className="items-end">
                          {item.type ? (
                            <View className="px-2 py-1 rounded-full bg-[#EFF6FF] border border-[#DBEAFE]">
                              <Text className="text-[#1E3A8A] text-[10px] font-poppins-semibold">{item.type}</Text>
                            </View>
                          ) : null}
                          {item.eLoc ? (
                            <Text className="text-[#9CA3AF] text-[10px] mt-1">{item.eLoc}</Text>
                          ) : null}
                        </View>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            ) : null}

            <View className="rounded-xl bg-white p-3 border border-[#E5E7EB]">
              <TextInput
                value={destination}
                onChangeText={setDestination}
                onFocus={() => setIsDestinationFocused(true)}
                onBlur={() => setIsDestinationFocused(false)}
                placeholder="Destination"
                placeholderTextColor="#9CA3AF"
                className="text-[#1E3A8A] font-poppins-medium text-[13px]"
              />
            </View>

            {isSearchingDestination ? <Text className="text-[#6B7280] mt-2">Searching...</Text> : null}

            {!isSearchingDestination && destinationError ? (
              <Text className="text-[#EF4444] mt-2">{destinationError}</Text>
            ) : null}

            {destinationResults.length > 0 ? (
              <View className="mt-2 bg-white rounded-xl overflow-hidden border border-[#E5E7EB]">
                {destinationResults.map((item) => {
                  const label = formatSuggestionLabel(item);
                  return (
                    <Pressable
                      key={item.id}
                      onPress={() => {
                        setDestination(label);
                        setDestinationCenter(item.center);
                        setIsDestinationFocused(false);
                        setDestinationResults([]);
                      }}
                      className="px-4 py-3 border-b border-[#E5E7EB] bg-white"
                    >
                      <View className="flex-row items-start justify-between">
                        <View className="flex-1 pr-3">
                          <Text numberOfLines={2} className="text-[#111827] font-poppins-semibold text-[14px]">{label}</Text>
                        </View>
                        <View className="items-end">
                          {item.type ? (
                            <View className="px-2 py-1 rounded-full bg-[#EFF6FF] border border-[#DBEAFE]">
                              <Text className="text-[#1E3A8A] text-[10px] font-poppins-semibold">{item.type}</Text>
                            </View>
                          ) : null}
                          {item.eLoc ? (
                            <Text className="text-[#9CA3AF] text-[10px] mt-1">{item.eLoc}</Text>
                          ) : null}
                        </View>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            ) : null}
          </View>

          <View className="mb-4">
            <View className="flex-row items-center space-x-2 mb-3">
              <Pressable className="px-3 py-1 rounded-full bg-[#FEF3C7] border border-[#FDE68A]">
                <Text className="text-[#92400E] text-[12px] font-poppins-semibold">⚡ Fastest</Text>
              </Pressable>
              <Pressable className="px-3 py-1 rounded-full bg-[#ECFCCB] border border-[#BBF7D0]">
                <Text className="text-[#3F6212] text-[12px] font-poppins-semibold">💰 Cheapest</Text>
              </Pressable>
              <Pressable className="px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#93C5FD]">
                <Text className="text-[#1E3A8A] text-[12px] font-poppins-semibold">🌿 Eco</Text>
              </Pressable>
            </View>

            {(() => {
              const hasRouteInputs = pickupLabel.trim().length > 0 && destination.trim().length > 0;
              const routes = hasRouteInputs ? buildRoutes(pickupCenter, destinationCenter) : [];
              if (routes.length === 0) {
                return (
                  <View className="rounded-2xl p-4 mb-3 border bg-white border-[#E5E7EB]">
                    <Text className="text-[#6B7280] text-[12px]">Select both pickup and destination to view routes.</Text>
                  </View>
                );
              }

              return routes.map((route, index) => (
                <View
                  key={route.id}
                  className={`rounded-2xl p-4 mb-3 border ${index === 0 ? 'bg-white border-[#E5E7EB]' : 'bg-[#F8FAFF] border-[#DBEAFE]'}`}
                >
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-1 pr-3">
                      <Text className="font-syne-bold text-[16px]" style={{ color: route.color }}>{route.title}</Text>
                      <Text className="text-[#6B7280] text-[12px] mt-0.5">{route.path}</Text>
                    </View>
                    <View className="items-end">
                      <Text className="font-syne-bold text-[18px]" style={{ color: route.color }}>{route.fare}</Text>
                      <Text className="text-[#6B7280] text-[12px]">{route.duration}</Text>
                    </View>
                  </View>

                  {pickupCenter && destinationCenter ? (
                    <View className="mt-2 h-36 rounded-xl overflow-hidden border border-[#E5E7EB]">
                      <MapLibreGL.MapView
                        style={{ flex: 1 }}
                        mapStyle="https://demotiles.maplibre.org/style.json"
                        zoomEnabled={false}
                        scrollEnabled={false}
                        rotateEnabled={false}
                        pitchEnabled={false}
                        compassEnabled={false}
                        logoEnabled={false}
                        attributionEnabled={false}
                      >
                        <MapLibreGL.Camera
                          animationDuration={0}
                          bounds={{
                            ...getBounds(pickupCenter, destinationCenter),
                            paddingTop: 18,
                            paddingBottom: 18,
                            paddingLeft: 18,
                            paddingRight: 18,
                          }}
                        />

                        <MapLibreGL.ShapeSource
                          id={`${route.id}-line`}
                          shape={{
                            type: 'Feature',
                            geometry: {
                              type: 'LineString',
                              coordinates: buildRouteLine(pickupCenter, destinationCenter, index),
                            },
                            properties: {},
                          }}
                        >
                          <MapLibreGL.LineLayer
                            id={`${route.id}-line-layer`}
                            style={{
                              lineColor: route.color,
                              lineWidth: 4,
                              lineOpacity: 0.85,
                            }}
                          />
                        </MapLibreGL.ShapeSource>

                        <MapLibreGL.ShapeSource
                          id={`${route.id}-points`}
                          shape={{
                            type: 'FeatureCollection',
                            features: [
                              {
                                type: 'Feature',
                                properties: { pointType: 'pickup' },
                                geometry: { type: 'Point', coordinates: pickupCenter },
                              },
                              {
                                type: 'Feature',
                                properties: { pointType: 'destination' },
                                geometry: { type: 'Point', coordinates: destinationCenter },
                              },
                            ],
                          }}
                        >
                          <MapLibreGL.CircleLayer
                            id={`${route.id}-points-layer`}
                            style={{
                              circleRadius: 5,
                              circleColor: ['match', ['get', 'pointType'], 'pickup', '#2563EB', '#16A34A'],
                              circleStrokeWidth: 2,
                              circleStrokeColor: '#FFFFFF',
                            }}
                          />
                        </MapLibreGL.ShapeSource>
                      </MapLibreGL.MapView>
                    </View>
                  ) : (
                    <View className="mt-2 rounded-xl p-3 border bg-white border-[#E5E7EB]">
                      <Text className="text-[#6B7280] text-[12px]">Select suggestions with coordinates to preview this route on map.</Text>
                    </View>
                  )}

                  {index === 0 ? (
                    <Pressable className="mt-3 self-start h-10 px-5 rounded-full bg-[#F4BE2A] items-center justify-center">
                      <Text className="font-poppins-semibold text-[#111827] text-[12px]">Book This Route →</Text>
                    </Pressable>
                  ) : null}
                </View>
              ));
            })()}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
