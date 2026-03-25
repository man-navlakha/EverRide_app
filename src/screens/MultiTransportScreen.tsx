import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, Image, Pressable, TextInput, Platform, PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { MapPin, Clock3, DollarSign, Route, ArrowRight } from 'lucide-react-native';
import { searchMapplsPlaces, type MapplsSuggestion } from '../services/mapplsPlaces';
import { MAPPLS_CLIENT_ID, MAPPLS_CLIENT_SECRET } from '../constants/mappls';

type SuggestionItem = MapplsSuggestion;

type RouteOption = {
  id: string;
  title: string;
  fare: string;
  duration: string;
  modes: string[];
  description: string;
  color: string;
};

type Props = {
  onClose: () => void;
};

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
  const bikeMins = Math.max(7, Math.round(km * 2.4));
  const autoMins = Math.max(9, Math.round(km * 2.8));
  const cabMins = Math.max(8, Math.round(km * 2.5));

  return [
    {
      id: 'r1',
      title: 'Walk + BRTS + Metro + AMTS',
      fare: `₹${Math.round(14 + km * 2.2)}`,
      duration: `${Math.round(walkStart / 75 + brtsMins + metroMins + amtsMins + walkEnd / 75)} min`,
      modes: ['🚶', '🚌', '🚇', '🚌'],
      description: `${Math.round(km * 10) / 10}km • Most economical`,
      color: '#1E3A8A',
    },
    {
      id: 'r2',
      title: 'Walk + Metro + Walk',
      fare: `₹${Math.round(10 + km * 1.8)}`,
      duration: `${Math.round(walkStart / 75 + metroMins + walkEnd / 75)} min`,
      modes: ['🚶', '🚇', '🚶'],
      description: `${Math.round(km * 10) / 10}km • Direct route`,
      color: '#166534',
    },
    {
      id: 'r3',
      title: 'Auto + Metro + Walk',
      fare: `₹${Math.round(22 + km * 3.6)}`,
      duration: `${Math.round(autoMins * 0.45 + metroMins)} min`,
      modes: ['🚗', '🚇', '🚶'],
      description: `${Math.round(km * 10) / 10}km • Fastest hybrid`,
      color: '#D97706',
    },
    {
      id: 'r4',
      title: 'Cab Direct',
      fare: `₹${Math.round(58 + km * 10.8)}`,
      duration: `${cabMins} min`,
      modes: ['🚕'],
      description: `${Math.round(km * 10) / 10}km • Direct & comfortable`,
      color: '#1D4ED8',
    },
    {
      id: 'r5',
      title: 'Auto Direct',
      fare: `₹${Math.round(35 + km * 7.2)}`,
      duration: `${autoMins} min`,
      modes: ['🚗'],
      description: `${Math.round(km * 10) / 10}km • Quick & reliable`,
      color: '#B45309',
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
          (position) => {
            if (!mounted) return;
            const { latitude, longitude } = position.coords;
            setPickupCenter([longitude, latitude]);
            setPickupLabel(`${CURRENT_LOCATION_PREFIX}`);
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
    <View className="flex-1 bg-[#ecedff]">
      {/* Header */}
      <View className="px-4 pt-5 pb-3 flex-row items-center justify-between border-b border-[#ffffff] bg-[#ecedff]">
        <View className="flex-row items-center">
          <Image source={require('../assets/logo.png')} style={{ width: 34, height: 34 }} resizeMode="contain" />
          <Text className="ml-2 text-black font-syne-bold text-[22px]">EVERRIDE</Text>
        </View>
        <Pressable onPress={onClose} className="w-10 h-10 rounded-full bg-white items-center justify-center">
          <Text className="font-syne-bold text-[#111827] text-[18px]">✕</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="px-4 pt-4">
          {/* Search Section */}
          <View className="mb-6">
            <Text className="text-[#1E3A8A] font-syne-bold text-[24px] mb-1">Multimode Routes</Text>
            <Text className="text-[#6B7280] text-[13px] mb-4 font-poppins-medium">Find the best combination of transports</Text>

            {/* Pickup Input */}
            <View className="mb-3">
              <View className="rounded-xl bg-white p-3 border border-[#E5E7EB] flex-row items-center" style={{gap: 8}}>
                <MapPin size={18} color="#1E3A8A" />
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
                <MapPin size={18} color="#F4BE2A" />
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
          </View>

          {/* Routes Grid */}
          {routes.length === 0 ? (
            <View className="rounded-2xl bg-white border border-[#E5E7EB] p-6 items-center">
              <Route size={32} color="#D1D5DB" />
              <Text className="text-[#6B7280] text-[13px] mt-3 text-center">Enter both locations to see available routes</Text>
            </View>
          ) : (
            <View>
              <Text className="text-[#1E3A8A] font-syne-bold text-[18px] mb-3">{routes.length} Routes Available</Text>
              <View className="flex-row flex-wrap justify-between">
                {routes.map((route, index) => (
                  <View
                    key={route.id}
                    className="w-[48%] bg-white rounded-2xl p-3 mb-3 border border-gray-100 shadow-sm"
                  >
                    {/* Badge */}
                    <View className="absolute top-2 right-2 bg-[#F4BE2A] px-2 py-1 rounded-full">
                      <Text className="text-[#1E3A8A] text-[10px] font-poppins-semibold">#{index + 1}</Text>
                    </View>

                    {/* Modes */}
                    <View className="flex-row items-center mb-2" style={{ gap: 4 }}>
                      {route.modes.map((mode, i) => (
                        <Text key={i} className="text-[16px]">
                          {mode}
                        </Text>
                      ))}
                      {route.modes.length > 1 && (
                        <View className="ml-1 flex-1 h-px bg-[#E5E7EB]" />
                      )}
                    </View>

                    {/* Title */}
                    <Text className="text-[#1E3A8A] font-poppins-semibold text-[12px] mb-2 leading-4">{route.title}</Text>

                    {/* Duration & Fare */}
                    <View className="flex-row items-center justify-between mb-2">
                      <View className="flex-row items-center" style={{gap: 4}}>
                        <Clock3 size={13} color="#6B7280" />
                        <Text className="text-[#111827] font-poppins-semibold text-[11px]">{route.duration}</Text>
                      </View>
                      <View className="flex-row items-center" style={{gap: 4}}>
                        <DollarSign size={13} color="#7C9A14" />
                        <Text className="text-[#7C9A14] font-poppins-semibold text-[11px]">{route.fare}</Text>
                      </View>
                    </View>

                    {/* Description */}
                    <Text className="text-[#6B7280] text-[10px] mb-3">{route.description}</Text>

                    {/* Book Button */}
                    <Pressable className="bg-[#233F89] rounded-xl p-2 items-center justify-center flex-row" style={{gap: 4}}>
                      <Text className="text-white font-poppins-semibold text-[11px]">Book</Text>
                      <ArrowRight size={11} color="#ffffff" />
                    </Pressable>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
