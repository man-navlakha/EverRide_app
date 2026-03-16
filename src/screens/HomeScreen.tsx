import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, ScrollView, PermissionsAndroid, Platform, TextInput } from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';
import Geolocation from 'react-native-geolocation-service';
import { MAPTILER_API_KEY } from '../constants/maptiler';

type Props = {
  onOpenProfile: () => void;
};

export function HomeScreen({ onOpenProfile }: Props) {
  const [showEmojis, setShowEmojis] = useState(false);
  const [centerCoordinate, setCenterCoordinate] = useState<[number, number]>([79.8612, 6.9271]);
  const [marker, setMarker] = useState<[number, number] | null>(null);
  const [locationDenied, setLocationDenied] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Array<{ id: string; place_name?: string; text?: string; center?: [number, number] }>>([]);
  const [isSearching, setIsSearching] = useState(false);

  const requestLocationPermission = async () => {
    if (Platform.OS !== 'android') {
      return true;
    }
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location permission',
        message: 'EverRide needs your location to show nearby pickup points.',
        buttonPositive: 'Allow',
        buttonNegative: 'No',
        buttonNeutral: 'Ask later',
      },
    );
    return result === PermissionsAndroid.RESULTS.GRANTED;
  };

  const requestCurrentLocation = async () => {
    const granted = await requestLocationPermission();
    if (!granted) {
      setLocationDenied(true);
      return;
    }
    setLocationDenied(false);
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const nextCenter: [number, number] = [longitude, latitude];
        setCenterCoordinate(nextCenter);
        setMarker(nextCenter);
      },
      () => {
        setLocationDenied(true);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  };

  const IconPlaceholder = ({ name }: { name: string }) => {
    const map: Record<string, string> = {
      'home-outline': 'H',
      'ticket-outline': 'P',
      'map-marker-outline': 'L',
      'account-circle-outline': 'U',
    };
    const letter = map[name] ?? '?';
    return (
      <View className="w-8 h-8 rounded-full bg-white items-center justify-center">
        <Text className="font-syne-bold">{letter}</Text>
      </View>
    );
  };

  useEffect(() => {
    requestCurrentLocation();
  }, []);

  const mapCenter = useMemo(() => centerCoordinate, [centerCoordinate]);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 3) {
      setResults([]);
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        setIsSearching(true);
        const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(trimmed)}.json?key=${MAPTILER_API_KEY}&autocomplete=true&limit=5`;
        const response = await fetch(url, { signal: controller.signal });
        const data = await response.json();
        setResults(Array.isArray(data?.features) ? data.features : []);
      } catch {
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 350);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [query]);

  return (
    <View className="flex-1 bg-[#F7F4EF]">
      <View className="px-4 pt-6 pb-3 flex-row items-center justify-between">
        <Text className="font-syne-bold text-[25px] tracking-[1px] text-[#1C1F2A]">EverRide</Text>
        <View className="flex-row items-center">
          <Pressable onPress={onOpenProfile} className="ml-3 p-2 rounded-full bg-white">
            {showEmojis ? <Text className="text-lg">👤</Text> : <IconPlaceholder name="account-circle-outline" />}
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="px-4">
          <View className="relative z-10">
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Enter your destination"
              placeholderTextColor="#000000b0"
              className="bg-[#2F2B5B]/30 text-black rounded-lg px-4 py-3"
            />

            {isSearching ? (
              <Text className="text-[#6B7280] mt-2">Searching...</Text>
            ) : null}

            {results.length > 0 ? (
              <View className="mt-2 bg-white rounded-lg overflow-hidden">
                {results.map((item) => {
                  const label = item.place_name ?? item.text ?? 'Unknown';
                  return (
                    <Pressable
                      key={item.id}
                      onPress={() => {
                        if (!item.center) {
                          return;
                        }
                        setCenterCoordinate(item.center);
                        setMarker(item.center);
                        setQuery(label);
                        setResults([]);
                      }}
                      className="px-4 py-3 border-b border-[#E5E7EB]"
                    >
                      <Text className="text-[#111827]">{label}</Text>
                    </Pressable>
                  );
                })}
              </View>
            ) : null}
          </View>

          <Pressable
            onPress={requestCurrentLocation}
            className="mt-3 mb-4 h-11 rounded-xl bg-white items-center justify-center"
          >
            <Text className="text-[#111827] font-poppins-semibold">Use current location</Text>
          </Pressable>

          {locationDenied ? (
            <Text className="text-[#B91C1C] mb-4">
              Location permission denied. Enable it in settings to use current location.
            </Text>
          ) : null}

          <View className="mb-4 rounded-xl overflow-hidden">
            <MapLibreGL.MapView style={{ height: 220 }}>
              <MapLibreGL.Camera centerCoordinate={mapCenter} zoomLevel={14} />
              <MapLibreGL.UserLocation visible />
              {marker ? (
                <MapLibreGL.PointAnnotation id="destination" coordinate={marker}>
                  <View className="w-3 h-3 rounded-full bg-[#111827] border-2 border-white" />
                </MapLibreGL.PointAnnotation>
              ) : null}
            </MapLibreGL.MapView>
          </View>

          <View className="h-28 bg-[#E5E7EB] rounded-lg items-center justify-center mb-4">
            <Text className="text-[#9CA3AF]">ADS</Text>
          </View>

          <View className="flex-row justify-between mb-4">
            <View className="w-1/3 h-20 bg-white rounded-lg items-center justify-center"> 
              <Text>Icon</Text>
            </View>
            <View className="w-1/3 h-20 bg-white rounded-lg items-center justify-center"> 
              <Text>Icon</Text>
            </View>
            <View className="w-1/3 h-20 bg-white rounded-lg items-center justify-center"> 
              <Text>Icon</Text>
            </View>
          </View>

          <View className="flex-row justify-between mb-4">
            <View className="w-1/2 h-20 bg-gray-200 rounded-lg mr-2" ></View>
            <View className="w-1/2 h-20 bg-gray-200 rounded-lg ml-2" />
          </View>
          <View className="flex-row justify-between mb-4">
            <View className="w-1/2 h-20 bg-gray-200 rounded-lg mr-2" />
            <View className="w-1/2 h-20 bg-gray-200 rounded-lg ml-2" />
          </View>

          <Pressable className="h-12 rounded-2xl bg-[#111827] items-center justify-center mb-6">
            <Text className="text-white font-poppins-semibold">Book for Someone else</Text>
          </Pressable>

        </View>
      </ScrollView>

      {/* BottomBar rendered by App when logged in */}
    </View>
  );
}

export default HomeScreen;
