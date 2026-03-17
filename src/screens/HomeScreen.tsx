import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView, TextInput, Image } from 'react-native';
import { MAPTILER_API_KEY } from '../constants/maptiler';

type Props = {
  onOpenProfile: () => void;
};

export function HomeScreen({ onOpenProfile }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Array<{ id: string; place_name?: string; text?: string }>>([]);
  const [isSearching, setIsSearching] = useState(false);

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
    <View className="flex-1 bg-[#F3EEE4]">
      <View className="px-4 pt-5 pb-3 flex-row items-center justify-between border-b border-[#ECE7DD] bg-[#F3EEE4]">
        <View className="flex-row items-center">
          <Image source={require('../assets/logo.png')} style={{ width: 34, height: 34 }} resizeMode="contain" />
          <Text className="ml-2 text-[#1E3A8A] font-syne-bold text-[22px]">EverRide</Text>
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

          <View className="bg-[#F2EFEA] rounded-2xl px-4 py-3 flex-row items-center mt-1 mb-4">
            <View className="w-10 h-10 rounded-xl bg-[#1E3A8A] items-center justify-center">
              <Text className="text-white text-[16px]">📍</Text>
            </View>

            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Enter pickup location"
              placeholderTextColor="#9CA3AF"
              className="flex-1 ml-3 text-[#111827] font-poppins-medium text-[14px]"
            />

            <Pressable className="w-9 h-9 rounded-xl bg-[#F4BE2A] items-center justify-center">
              <Text className="text-[#1F2937]">↗</Text>
            </Pressable>
          </View>

          {isSearching ? <Text className="text-[#6B7280] mb-2">Searching...</Text> : null}

          {results.length > 0 ? (
            <View className="mb-4 bg-white rounded-xl overflow-hidden">
              {results.map((item) => {
                const label = item.place_name ?? item.text ?? 'Unknown';
                return (
                  <Pressable
                    key={item.id}
                    onPress={() => {
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
            <View className="w-[48.5%] rounded-3xl bg-[#EFEDE8] p-4">
              <View className="w-12 h-12 rounded-2xl bg-[#7C9A14] items-center justify-center mb-4">
                <Text className="text-[22px]">🚌</Text>
              </View>
              <Text className="text-[#1E3A8A] text-[15px] leading-[18px] font-syne-bold">Bus</Text>
              <Text className="text-[#7C9A14] text-[12px] leading-[16px] font-poppins-semibold">Eco-friendly</Text>
            </View>

            <View className="w-[48.5%] rounded-3xl bg-[#EFEDE8] p-4">
              <View className="w-12 h-12 rounded-2xl bg-[#1E3A8A] items-center justify-center mb-4">
                <Text className="text-[22px]">🚇</Text>
              </View>
              <Text className="text-[#1E3A8A] text-[15px] leading-[18px] font-syne-bold">Metro</Text>
              <Text className="text-[#1E3A8A] text-[12px] leading-[16px] font-poppins-semibold">Fastest</Text>
            </View>
          </View>

          <View className="flex-row justify-between">
            <View className="w-[48.5%] rounded-3xl bg-[#EFEDE8] p-4">
              <View className="w-12 h-12 rounded-2xl bg-[#F4BE2A] items-center justify-center mb-4">
                <Text className="text-[22px]">🛺</Text>
              </View>
              <Text className="text-[#1E3A8A] text-[15px] leading-[18px] font-syne-bold">Cab</Text>
              <Text className="text-[#D69E0A] text-[12px] leading-[16px] font-poppins-semibold">Door to door</Text>
            </View>

            <View className="w-[48.5%] rounded-3xl bg-[#EFEDE8] p-4">
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
