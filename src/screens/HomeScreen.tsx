import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView, TextInput, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MAPPLS_CLIENT_ID, MAPPLS_CLIENT_SECRET } from '../constants/mappls';
import { searchMapplsPlaces, type MapplsSuggestion } from '../services/mapplsPlaces';

type PickupInfo = { label: string; center?: number[] };

type ResultItem = {
  id: string;
  place_name?: string;
  text?: string;
  center?: number[];
  type?: string;
  placeAddress?: string;
  placeName?: string;
  alternateName?: string;
  eLoc?: string;
  suggester?: string;
};

type Props = {
  onOpenProfile: () => void;
  onOpenPickup?: (place: PickupInfo) => void;
};

export function HomeScreen({ onOpenProfile, onOpenPickup }: Props) {
  const RECENT_SEARCHES_KEY = '@EverRide:recentPickupSearches';
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ResultItem[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isPickupFocused, setIsPickupFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
        if (!stored) return;
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecentSearches(parsed.filter((item) => typeof item === 'string').slice(0, 12));
        }
      } catch {}
    })();
  }, []);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 3) {
      setResults([]);
      setFetchError(null);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        setFetchError(null);
        if (!MAPPLS_CLIENT_ID || !MAPPLS_CLIENT_SECRET) {
          setResults([]);
          setFetchError('Missing Mappls client credentials in src/constants/mappls.ts');
          return;
        }

        setIsSearching(true);
        const items = (await searchMapplsPlaces(trimmed, controller.signal)) as MapplsSuggestion[] as ResultItem[];

        if (items.length > 0) {
          setResults(items);
        } else {
          setResults([]);
          setFetchError('No results');
        }
      } catch (err) {
        if ((err as any)?.name === 'AbortError') return;
        console.warn('Geocoding error', err);
        setResults([]);
        const message = err instanceof Error ? err.message : 'Network error';
        setFetchError(message);
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
    <View className="flex-1 bg-[#ecedff]">
      <View className="px-4 pt-5 pb-3 flex-row items-center justify-between border-b border-[#ffffff] bg-[#ecedff]">
        <View className="flex-row items-center">
          <Image source={require('../assets/logo.png')} style={{ width: 34, height: 34 }} resizeMode="contain" />
          <Text className="ml-2 text-black font-syne-bold text-[22px]">EVERRIDE</Text>
        </View>

        <Pressable onPress={onOpenProfile} className="w-10 h-10 rounded-full bg-white items-center justify-center">
          <Text className="font-syne-bold text-[#111827] text-[18px]">A</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="px-4 pt-3">
          <View className="flex-row items-start justify-between mb-4">
            <View>
              <Text className="text-[#F59E0B] font-poppins-semibold text-[11px] tracking-[0.5px]">GOOD MORNING ☀️</Text>
              <Text className="text-[#1E3A8A] font-syne-bold text-[21px] leading-[26px]">Where are you</Text>
              <Text className="text-[#EAAE1F] font-syne-bold text-[21px] leading-[26px]">headed today?</Text>
            </View>
          </View>

          <View className="backdrop-blur-lg bg-[#ffffff] shadow-2xl border-t border-[#ffffff]/80 rounded-2xl px-4 py-3 flex-row items-center mt-1 mb-4">
            <View className="w-10 h-10 rounded-xl items-center justify-center">
              <Text className="text-white text-[16px]">📍</Text>
            </View>

            <TextInput
              value={query}
              onChangeText={setQuery}
              onFocus={() => setIsPickupFocused(true)}
              placeholder="Enter pickup location"
              placeholderTextColor="#9CA3AF"
              className="flex-1 ml-3 text-[#111827] bg-[#ffffff] font-poppins-medium text-[14px]"
            />

            <Pressable className="w-9 h-9 rounded-xl items-center justify-center">
              <Text className="text-[#1F2937]">↗</Text>
            </Pressable>
          </View>

          {isSearching ? <Text className="text-[#6B7280] mb-2">Searching...</Text> : null}

          {!isSearching && fetchError ? (
            <Text className="text-[#EF4444] mb-2">{fetchError}</Text>
          ) : null}

          {(results.length > 0 || (isPickupFocused && query.trim().length < 3 && recentSearches.length > 0)) ? (
            <View className="mb-4 bg-white rounded-xl overflow-hidden">
              {(results.length > 0
                ? results
                : recentSearches.map((label, idx) => ({ id: `recent-${idx}-${label}`, place_name: label, placeName: label, placeAddress: 'Recent search' as string } as ResultItem))).map((item) => {
                const label = item.place_name ?? item.text ?? 'Unknown';
                const center = item.center;
                const title = item.placeName ?? label;
                const subtitle = item.placeAddress ?? label;
                return (
                  <Pressable
                    key={item.id}
                    onPress={() => {
                      setIsPickupFocused(false);
                      setQuery(label);
                      setResults([]);
                      setRecentSearches((prev) => {
                        const next = [label, ...prev.filter((itemValue) => itemValue !== label)].slice(0, 12);
                        AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next)).catch(() => {});
                        return next;
                      });
                      if (onOpenPickup) onOpenPickup({ label, center });
                    }}
                    className="px-4 py-3 border-b border-[#E5E7EB] bg-white"
                  >
                    <View className="flex-row items-start justify-between">
                      <View className="flex-1 pr-3">
                        <Text numberOfLines={1} className="text-[#111827] font-poppins-semibold text-[14px]">{title}</Text>
                        <Text numberOfLines={1} className="text-[#6B7280] text-[12px] mt-0.5">{subtitle}</Text>
                        {item.alternateName ? (
                          <Text numberOfLines={1} className="text-[#9CA3AF] text-[11px] mt-0.5">Also known as {item.alternateName}</Text>
                        ) : null}
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

          <View className="rounded-3xl p-4 bg-[#233F89] mb-4">
            <View className="self-start px-3 py-1 rounded-full border border-[#6E83C3] bg-[#274A9E] mb-3">
              <Text className="text-[#E8EDFF] text-[10px] font-poppins-medium tracking-[0.3px]">🎯 OFFERS & DEALS</Text>
            </View>

            <Text className="text-white font-syne-bold text-[18px] leading-[24px] w-[84%]">
              Get 30% off your first Metro ride! 🚇
            </Text>

            <Pressable className="mt-4 self-start h-10 px-5 rounded-full bg-[#F4BE2A] items-center justify-center">
              <Text className="font-poppins-semibold text-[#111827] text-[12px]">CLAIM NOW →</Text>
            </Pressable>
          </View>

          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-[#1E3A8A] text-[29px] font-syne-bold">Our Services</Text>
            <Pressable>
              <Text className="text-[#EAAE1F] font-poppins-semibold text-[12px]">View all →</Text>
            </Pressable>
          </View>

          <View className="flex-row justify-between mb-3">
            <View className="w-[48.5%] rounded-3xl backdrop-blur-lg bg-[#ffffff] shadow-2xl border-t border-[#ffffff]/80  p-4">
              <View className="w-12 h-12 rounded-2xl bg-[#7C9A14] items-center justify-center mb-4">
                <Text className="text-[22px]">🚌</Text>
              </View>
              <Text className="text-[#1E3A8A] text-[15px] leading-[18px] font-syne-bold">Bus</Text>
              <Text className="text-[#7C9A14] text-[12px] leading-[16px] font-poppins-semibold">Eco-friendly</Text>
            </View>

            <View className="w-[48.5%] rounded-3xl backdrop-blur-lg bg-[#ffffff] border-t border-[#ffffff]/80  p-4">
              <View className="w-12 h-12 rounded-2xl bg-[#1E3A8A] items-center justify-center mb-4">
                <Text className="text-[22px]">🚇</Text>
              </View>
              <Text className="text-[#1E3A8A] text-[15px] leading-[18px] font-syne-bold">Metro</Text>
              <Text className="text-[#1E3A8A] text-[12px] leading-[16px] font-poppins-semibold">Fastest</Text>
            </View>
          </View>

          <View className="flex-row justify-between">
            <View className="w-[48.5%] rounded-3xl backdrop-blur-lg bg-[#ffffff] border-t border-[#ffffff]/80  p-4">
              <View className="w-12 h-12 rounded-2xl bg-[#F4BE2A] items-center justify-center mb-4">
                <Text className="text-[22px]">🛺</Text>
              </View>
              <Text className="text-[#1E3A8A] text-[15px] leading-[18px] font-syne-bold">Cab</Text>
              <Text className="text-[#D69E0A] text-[12px] leading-[16px] font-poppins-semibold">Door to door</Text>
            </View>

            <View className="w-[48.5%] rounded-3xl backdrop-blur-lg bg-[#ffffff] border-t border-[#ffffff]/80  p-4">
              <View className="w-12 h-12 rounded-2xl bg-[#3AA6C8] items-center justify-center mb-4">
                <Text className="text-[22px]">🔁</Text>
              </View>
              <Text className="text-[#1E3A8A] text-[15px] leading-[18px] font-syne-bold">Multimode</Text>
              <Text className="text-[#3AA6C8] text-[12px] leading-[16px] font-poppins-semibold">Smart combo</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default HomeScreen;
