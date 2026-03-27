import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, Image, Pressable, TextInput, Platform, PermissionsAndroid } from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';
import Geolocation from 'react-native-geolocation-service';
import { MapPin, Clock3, DollarSign, Route, ArrowRight } from 'lucide-react-native';
import { reverseMapplsLocationName, searchMapplsPlaces, type MapplsSuggestion } from '../services/mapplsPlaces';
import { MAPPLS_CLIENT_ID, MAPPLS_CLIENT_SECRET } from '../constants/mappls';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  gradientTop: '#F8F4ED',
  gradientBottom: '#E8DFD1',
  navy: '#0C1E5B',
  gold: '#F4B000',
  textGray: '#8A8D9F',
};

type SuggestionItem = MapplsSuggestion;

type RouteOption = {
  id: string;
  title: string;
  fare: string;
  duration: string;
  startTime: string;
  endTime: string;
  routeCodes: string[];
  fromLabel: string;
  frequencyLabel: string;
  bookLabel: string;
  timeline: {
    time: string;
    title: string;
    subtitle?: string;
    note?: string;
    isTransit?: boolean;
  }[];
};

type Props = {
  onClose: () => void;
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
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
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
  const autoMins = Math.max(9, Math.round(km * 2.8));
  const cabMins = Math.max(8, Math.round(km * 2.5));

  return [
    {
      id: 'r1',
      title: 'Walk + BRTS + Metro + Walk',
      fare: `₹${Math.round(14 + km * 2.2)}`,
      duration: `${Math.round(walkStart / 75 + brtsMins + metroMins + walkEnd / 75)} min`,
      startTime: '9:48 PM',
      endTime: '10:09 PM',
      routeCodes: ['31/5', '31/5SH', '35'],
      fromLabel: 'From Jawaharnagar',
      frequencyLabel: 'every 10 min',
      bookLabel: 'Book Auto',
      timeline: [
        {
          time: '9:48 PM',
          title: 'Dharnidhar Derasar',
          subtitle: '120 Feet Ring Rd, Ahmedabad 380007',
          note: `Walk • About ${Math.max(8, Math.round(walkStart / 75))} min`,
        },
        {
          time: '9:58 PM',
          title: 'Jawaharnagar',
          subtitle: 'Board BRTS route 31/5',
          note: `${brtsMins} min (13 stops)`,
          isTransit: true,
        },
        {
          time: '10:05 PM',
          title: 'Gandhigram Railway Station',
          subtitle: 'Interchange to Metro',
          note: `${metroMins} min metro ride`,
          isTransit: true,
        },
        {
          time: '10:09 PM',
          title: 'M.J. Library BRTS Stop',
          subtitle: 'Destination',
          note: `Walk • About ${Math.max(4, Math.round(walkEnd / 75))} min`,
        },
      ],
    },
    {
      id: 'r2',
      title: 'Metro + Walk',
      fare: `₹${Math.round(18 + km * 2.3)}`,
      duration: `${Math.round(metroMins + walkEnd / 75)} min`,
      startTime: '9:48 PM',
      endTime: '10:15 PM',
      routeCodes: ['1D', '3D', '12D', '101'],
      fromLabel: 'From Jawaharnagar',
      frequencyLabel: 'every 8 min',
      bookLabel: 'Book Metro',
      timeline: [
        {
          time: '9:48 PM',
          title: 'Jawaharnagar',
          subtitle: 'Enter metro station',
          note: `${metroMins + 6} min (9 stops)`,
          isTransit: true,
        },
        {
          time: '10:12 PM',
          title: 'Paldi Metro',
          subtitle: 'Exit towards destination',
          note: `Walk • About ${Math.max(4, Math.round(walkEnd / 75))} min`,
        },
        {
          time: '10:15 PM',
          title: 'Destination',
          subtitle: 'Arrive',
        },
      ],
    },
    {
      id: 'r3',
      title: 'Auto Direct',
      fare: `₹${Math.round(35 + km * 7.2)}`,
      duration: `${autoMins} min`,
      startTime: '10:04 PM',
      endTime: '10:25 PM',
      routeCodes: ['34/4'],
      fromLabel: 'From Jawaharnagar',
      frequencyLabel: 'on demand',
      bookLabel: 'Book Auto',
      timeline: [
        {
          time: '10:04 PM',
          title: 'Pickup at Jawaharnagar',
          subtitle: 'Auto assigned nearby',
        },
        {
          time: '10:25 PM',
          title: 'Destination',
          subtitle: 'Drop-off complete',
          isTransit: true,
        },
      ],
    },
    {
      id: 'r4',
      title: 'Cab Direct',
      fare: `₹${Math.round(58 + km * 10.8)}`,
      duration: `${cabMins} min`,
      startTime: '9:52 PM',
      endTime: '10:13 PM',
      routeCodes: ['Cab'],
      fromLabel: 'From Jawaharnagar',
      frequencyLabel: 'on demand',
      bookLabel: 'Book Cab',
      timeline: [
        {
          time: '9:52 PM',
          title: 'Pickup at Jawaharnagar',
          subtitle: 'Cab arrives in 3 min',
        },
        {
          time: '10:13 PM',
          title: 'Destination',
          subtitle: 'Drop-off complete',
          isTransit: true,
        },
      ],
    },
    {
      id: 'r5',
      title: 'Walk + AMTS + Walk',
      fare: `₹${Math.round(8 + km * 1.4)}`,
      duration: `${Math.round(walkStart / 75 + amtsMins + walkEnd / 75)} min`,
      startTime: '9:50 PM',
      endTime: '10:18 PM',
      routeCodes: ['2U', '9U'],
      fromLabel: 'From Jawaharnagar',
      frequencyLabel: 'every 12 min',
      bookLabel: 'Book Bus',
      timeline: [
        {
          time: '9:50 PM',
          title: 'Walk to AMTS stop',
          subtitle: 'Nearby stop',
          note: `Walk • About ${Math.max(8, Math.round(walkStart / 75))} min`,
        },
        {
          time: '9:59 PM',
          title: 'AMTS Boarding',
          subtitle: 'Route 2U / 9U',
          note: `${amtsMins} min transit`,
          isTransit: true,
        },
        {
          time: '10:18 PM',
          title: 'Destination',
          subtitle: 'Arrive',
          note: `Walk • About ${Math.max(4, Math.round(walkEnd / 75))} min`,
        },
      ],
    },
  ];
}

export default function MultiTransportScreen({ onClose }: Props) {
  const CURRENT_LOCATION_PREFIX = 'Current location';
  const [pickupLabel, setPickupLabel] = useState<string>('');
  const [pickupCenter, setPickupCenter] = useState<number[] | undefined>(undefined);
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
  const [expandedRouteId, setExpandedRouteId] = useState<string | null>(null);

  // Load current location on mount
  useEffect(() => {
    let mounted = true;
    const setFallback = () => {
      if (!mounted) return;
      setPickupLabel(CURRENT_LOCATION_PREFIX);
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
          async (position) => {
            if (!mounted) return;
            const { latitude, longitude } = position.coords;
            setPickupCenter([longitude, latitude]);
            const controller = new AbortController();
            const resolvedName = await reverseMapplsLocationName(latitude, longitude, controller.signal).catch(() => null);
            if (!mounted) return;
            setPickupLabel(resolvedName ?? `${CURRENT_LOCATION_PREFIX} (${latitude.toFixed(5)}, ${longitude.toFixed(5)})`);
          },
          () => {
            setFallback();
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 10000,
          }
        );
      } catch {
        setFallback();
      }
    };

    requestCurrentLocation();
    return () => {
      mounted = false;
    };
  }, []);

  // Pickup search effect
  useEffect(() => {
    if (!isPickupFocused) {
      setPickupResults([]);
      setPickupError(null);
      return;
    }

    const trimmed = pickupLabel.trim();
    if (trimmed.startsWith(CURRENT_LOCATION_PREFIX) || trimmed.length < 3) {
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
          setPickupError('Missing Mappls credentials');
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
        setPickupResults([]);
        setPickupError(err instanceof Error ? err.message : 'Network error');
      } finally {
        setIsSearchingPickup(false);
      }
    }, 350);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [pickupLabel, isPickupFocused]);

  // Destination search effect
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
          setDestinationError('Missing Mappls credentials');
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
        setDestinationError(err instanceof Error ? err.message : 'Network error');
      } finally {
        setIsSearchingDestination(false);
      }
    }, 350);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [destination, isDestinationFocused]);

  const hasInputs = pickupLabel.trim().length > 0 && destination.trim().length > 0;
  const routes = hasInputs ? buildRoutes(pickupCenter, destinationCenter) : [];

  return (
    <LinearGradient colors={[COLORS.gradientTop, COLORS.gradientBottom]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
    <View className="flex-1">
      {/* Header */}
      <View
        className="px-4 pt-5 pb-3 flex-row items-center justify-between"
        style={{
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(255, 255, 255, 0.85)',
          backgroundColor: 'rgba(255, 255, 255, 0.12)',
        }}
      >
        <View className="flex-row items-center">
          <Image source={require('../assets/logo.png')} style={{ width: 34, height: 34 }} resizeMode="contain" />
          <Text className="ml-2 font-syne-bold text-[22px]" style={{ color: COLORS.navy }}>EVERRIDE</Text>
        </View>
        <Pressable onPress={onClose} className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: COLORS.gold }}>
          <Text className="font-syne-bold text-[18px]" style={{ color: COLORS.navy }}>✕</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="px-4 pt-4">
          {/* Search Section */}
          <View className="mb-6">
            <Text className="font-syne-bold text-[24px] mb-1" style={{ color: COLORS.navy }}>Multimode Routes</Text>
            <Text className="text-[13px] mb-4 font-poppins-medium" style={{ color: COLORS.textGray }}>Find the best combination of transports</Text>

            {/* Pickup Input */}
            <View className="mb-3">
              <View className="rounded-xl bg-white p-3 border border-[#E5E7EB] flex-row items-center" style={{gap: 8}}>
                <MapPin size={18} color={COLORS.navy} />
                <TextInput
                  value={pickupLabel}
                  onChangeText={setPickupLabel}
                  onFocus={() => setIsPickupFocused(true)}
                  onBlur={() => setIsPickupFocused(false)}
                  placeholder="Pickup location"
                  placeholderTextColor="#9CA3AF"
                  className="flex-1 text-[#111827] font-poppins-medium text-[13px]"
                />
              </View>
              {isSearchingPickup && <Text className="text-[#6B7280] text-[12px] mt-2">Searching...</Text>}
              {pickupError && <Text className="text-[#EF4444] text-[12px] mt-2">{pickupError}</Text>}
              
              {pickupResults.length > 0 && (
                <View className="mt-2 bg-white rounded-xl overflow-hidden border border-[#E5E7EB]">
                  {pickupResults.map((item) => (
                    <Pressable
                      key={item.id}
                      onPress={() => {
                        setPickupLabel(formatSuggestionLabel(item));
                        setPickupCenter(item.center);
                        setIsPickupFocused(false);
                        setPickupResults([]);
                      }}
                      className="px-4 py-3 border-b border-[#E5E7EB] bg-white"
                    >
                      <Text className="text-[#111827] font-poppins-semibold text-[13px]">{formatSuggestionLabel(item)}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            {/* Destination Input */}
            <View className="mb-3">
              <View className="rounded-xl bg-white p-3 border border-[#E5E7EB] flex-row items-center" style={{gap: 8}}>
                <MapPin size={18} color={COLORS.gold} />
                <TextInput
                  value={destination}
                  onChangeText={setDestination}
                  onFocus={() => setIsDestinationFocused(true)}
                  onBlur={() => setIsDestinationFocused(false)}
                  placeholder="Destination"
                  placeholderTextColor="#9CA3AF"
                  className="flex-1 text-[#111827] font-poppins-medium text-[13px]"
                />
              </View>
              {isSearchingDestination && <Text className="text-[#6B7280] text-[12px] mt-2">Searching...</Text>}
              {destinationError && <Text className="text-[#EF4444] text-[12px] mt-2">{destinationError}</Text>}
              
              {destinationResults.length > 0 && (
                <View className="mt-2 bg-white rounded-xl overflow-hidden border border-[#E5E7EB]">
                  {destinationResults.map((item) => (
                    <Pressable
                      key={item.id}
                      onPress={() => {
                        setDestination(formatSuggestionLabel(item));
                        setDestinationCenter(item.center);
                        setIsDestinationFocused(false);
                        setDestinationResults([]);
                      }}
                      className="px-4 py-3 border-b border-[#E5E7EB] bg-white"
                    >
                      <Text className="text-[#111827] font-poppins-semibold text-[13px]">{formatSuggestionLabel(item)}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            <View className="rounded-2xl bg-white border border-[#E5E7EB] overflow-hidden mb-3">
              {pickupCenter && destinationCenter ? (
                <View className="h-44">
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
                        paddingTop: 20,
                        paddingBottom: 20,
                        paddingLeft: 20,
                        paddingRight: 20,
                      }}
                    />

                    <MapLibreGL.ShapeSource
                      id="multimode-main-line"
                      shape={{
                        type: 'Feature',
                        geometry: {
                          type: 'LineString',
                          coordinates: buildRouteLine(pickupCenter, destinationCenter, 0),
                        },
                        properties: {},
                      }}
                    >
                      <MapLibreGL.LineLayer
                        id="multimode-main-line-layer"
                        style={{
                          lineColor: '#1E3A8A',
                          lineWidth: 4,
                          lineOpacity: 0.85,
                        }}
                      />
                    </MapLibreGL.ShapeSource>

                    <MapLibreGL.ShapeSource
                      id="multimode-main-points"
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
                        id="multimode-main-points-layer"
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
                <View className="h-32 px-4 items-center justify-center">
                  <Text className="text-[#6B7280] text-[12px] text-center">
                    Select pickup and destination suggestions to preview route on map.
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Routes List */}
          {routes.length === 0 ? (
            <View className="rounded-2xl bg-white border border-[#E5E7EB] p-6 items-center">
              <Route size={32} color="#D1D5DB" />
              <Text className="text-[#6B7280] text-[13px] mt-3 text-center">Enter both locations to see available routes</Text>
            </View>
          ) : (
            <View>
              <Text className="font-syne-bold text-[18px] mb-3" style={{ color: COLORS.navy }}>{routes.length} Routes Available</Text>
              {routes.map((route, index) => (
                <Pressable
                  key={route.id}
                  onPress={() => setExpandedRouteId((prev) => (prev === route.id ? null : route.id))}
                  className="bg-white rounded-2xl p-4 mb-3 border border-gray-100 shadow-sm"
                >
                  <View className="flex-row items-center justify-between">
                    <View>
                      <Text className="font-poppins-semibold text-[#111827] text-[16px]">{route.startTime}—{route.endTime}</Text>
                      <Text className="text-[#6B7280] text-[11px] mt-0.5">{route.title}</Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-[#111827] text-[16px] font-poppins-semibold">{route.duration}</Text>
                      <Text className="text-[#1E3A8A] text-[11px] mt-0.5">{route.fare}</Text>
                    </View>
                  </View>

                  <View className="flex-row items-center mt-2" style={{ gap: 6 }}>
                    {route.routeCodes.map((code, i) => (
                      <View key={`${route.id}-${code}-${i}`} className="px-2 py-[2px] rounded-md border border-[#D1D5DB] bg-[#F8FAFF]">
                        <Text className="text-[10px] text-[#374151] font-poppins-medium">{code}</Text>
                      </View>
                    ))}
                  </View>

                  <View className="flex-row items-center justify-between mt-2">
                    <View className="flex-row items-center" style={{ gap: 4 }}>
                      <Clock3 size={13} color="#6B7280" />
                      <Text className="text-[#6B7280] text-[11px]">{route.fromLabel}</Text>
                    </View>
                    <Text className="text-[#6B7280] text-[11px]">{route.frequencyLabel}</Text>
                  </View>

                  <Text className="text-[#1E88E5] text-[12px] mt-2 font-poppins-medium">
                    {expandedRouteId === route.id ? 'Hide details' : 'Details'}
                  </Text>

                  {expandedRouteId === route.id ? (
                    <View className="mt-3 border-t border-[#E5E7EB] pt-3">
                      {route.timeline.map((step, stepIndex) => (
                        <View key={`${route.id}-step-${stepIndex}`} className="flex-row">
                          <View className="w-16 pr-2">
                            <Text className="text-[#4B5563] text-[11px] font-poppins-medium">{step.time}</Text>
                          </View>
                          <View className="items-center mr-3">
                            <View className={`w-2.5 h-2.5 rounded-full ${step.isTransit ? 'bg-[#1E88E5]' : 'bg-[#6B7280]'}`} />
                            {stepIndex !== route.timeline.length - 1 ? <View className="w-[2px] flex-1 bg-[#93C5FD] mt-1" /> : null}
                          </View>
                          <View className="flex-1 pb-4">
                            <Text className="text-[#111827] text-[15px] font-poppins-semibold">{step.title}</Text>
                            {step.subtitle ? <Text className="text-[#6B7280] text-[12px] mt-0.5">{step.subtitle}</Text> : null}
                            {step.note ? <Text className="text-[#4B5563] text-[12px] mt-1">{step.note}</Text> : null}
                          </View>
                        </View>
                      ))}

                      <View className="flex-row items-center justify-between mt-1">
                        <Text className="text-[#6B7280] text-[12px]">Cost: {route.fare}</Text>
                        <Pressable className="h-10 rounded-full items-center justify-center px-5 flex-row" style={{ gap: 6, backgroundColor: COLORS.gold }}>
                          <Text className="text-[12px] font-poppins-semibold" style={{ color: COLORS.navy }}>{route.bookLabel}</Text>
                          <ArrowRight size={12} color={COLORS.navy} />
                        </Pressable>
                      </View>
                    </View>
                  ) : null}
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
