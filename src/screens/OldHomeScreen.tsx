import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, ScrollView, TextInput, Image, Animated, Dimensions, PanResponder } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Search, Bus, Car, MapPin, Repeat2, Sparkles, Train, CalendarDays } from 'lucide-react-native';
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
  onOpenServices?: () => void;
  onOpenPickup?: (place: PickupInfo) => void;
};

export function HomeScreen({ onOpenProfile, onOpenServices, onOpenPickup }: Props) {
  const RECENT_SEARCHES_KEY = '@EverRide:recentPickupSearches';
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ResultItem[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isPickupFocused, setIsPickupFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const shouldShowBottomSheet = !isPickupFocused;
  const scrollViewRef = useRef<ScrollView>(null);

  const screenHeight = Dimensions.get('window').height;
  const sheetMaxHeight = Math.min(screenHeight * 0.7, 560);
  const sheetPeekHeight = Math.min(screenHeight * 0.3, sheetMaxHeight - 24);
  const maxUpwardTravel = sheetMaxHeight - sheetPeekHeight;
  const sheetTranslateY = useRef(new Animated.Value(0)).current;
  const dragStartY = useRef(0);

  const snapTo = (toValue: number) => {
    Animated.spring(sheetTranslateY, {
      toValue,
      useNativeDriver: true,
      bounciness: 0,
      speed: 20,
    }).start();
  };

  const toggleSheet = () => {
    sheetTranslateY.stopAnimation((value) => {
      const shouldExpand = value > -maxUpwardTravel / 2;
      snapTo(shouldExpand ? -maxUpwardTravel : 0);
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 6,
      onPanResponderGrant: () => {
        sheetTranslateY.stopAnimation((value) => {
          dragStartY.current = value;
        });
      },
      onPanResponderMove: (_, gesture) => {
        const nextValue = Math.min(0, Math.max(-maxUpwardTravel, dragStartY.current + gesture.dy));
        sheetTranslateY.setValue(nextValue);
      },
      onPanResponderRelease: (_, gesture) => {
        const releaseValue = Math.min(0, Math.max(-maxUpwardTravel, dragStartY.current + gesture.dy));
        const shouldExpand = gesture.vy < -0.35 || releaseValue < -maxUpwardTravel / 2;
        snapTo(shouldExpand ? -maxUpwardTravel : 0);
      },
      onPanResponderTerminate: (_, gesture) => {
        const releaseValue = Math.min(0, Math.max(-maxUpwardTravel, dragStartY.current + gesture.dy));
        const shouldExpand = gesture.vy < -0.35 || releaseValue < -maxUpwardTravel / 2;
        snapTo(shouldExpand ? -maxUpwardTravel : 0);
      },
    })
  ).current;

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
        if (!stored) return;
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecentSearches(parsed.filter((item) => typeof item === 'string').slice(0, 12));
        }
      } catch { }
    })();
  }, []);

  useEffect(() => {
    if (!isPickupFocused) {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }
  }, [isPickupFocused]);

  useEffect(() => {
    if (!isPickupFocused) {
      setIsSearching(false);
      setResults([]);
      setFetchError(null);
      return;
    }

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
  }, [query, isPickupFocused]);

  const openPickupFromAction = (modeLabel?: string) => {
    if (!onOpenPickup) return;
    const baseLabel = query.trim().length > 0 ? query.trim() : 'Current location';
    onOpenPickup({
      label: modeLabel ? `${baseLabel} • ${modeLabel}` : baseLabel,
      center: pickupCenterFromResults(results),
    });
  };

  const pickupCenterFromResults = (items: ResultItem[]) => {
    const firstWithCenter = items.find((item) => Array.isArray(item.center) && item.center.length >= 2);
    return firstWithCenter?.center;
  };

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

      <ScrollView 
        ref={scrollViewRef}
        nestedScrollEnabled 
        contentContainerStyle={{ paddingBottom: shouldShowBottomSheet ? sheetPeekHeight + 32 : 120 }}>
        <View className="px-4 pt-3">


          <View className="backdrop-blur-lg bg-[#ffffff] shadow-2xl border-t border-[#ffffff]/80 rounded-2xl px-2 py-3 flex-row items-center mt-1 mb-4">
            <View className="w-10 h-10 rounded-xl items-center justify-center">
              <MapPin size={21} color="#1F2937" />
            </View>

            <TextInput
              value={query}
              onChangeText={setQuery}
              onFocus={() => setIsPickupFocused(true)}
              onBlur={() => {
                setIsPickupFocused(false);
                setResults([]);
                setIsSearching(false);
                setFetchError(null);
              }}
              placeholder="Enter pickup location"
              placeholderTextColor="#9CA3AF"
              className="flex-1 ml-3 text-[#111827] bg-[#ffffff] font-poppins-medium text-[14px]"
            />

            <Pressable className="w-9 h-9 rounded-xl items-center justify-center">
              <Search size={21} color="#1F2937" />
            </Pressable>
          </View>

          {isSearching ? <Text className="text-[#6B7280] mb-2">Searching...</Text> : null}

          {!isSearching && fetchError ? (
            <Text className="text-[#EF4444] mb-2">{fetchError}</Text>
          ) : null}

          {(isPickupFocused && (results.length > 0 || (query.trim().length < 3 && recentSearches.length > 0))) ? (
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
                          AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next)).catch(() => { });
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
              <View className="flex-row items-center" style={{ gap: 4 }}>
                <Sparkles size={11} color="#E8EDFF" />
                <Text className="text-[#E8EDFF] text-[10px] font-poppins-medium tracking-[0.3px]">OFFERS & DEALS</Text>
              </View>
            </View>

            <Text className="text-white font-syne-bold text-[18px] leading-[24px] w-[84%]">
              Get 30% off your first Metro ride!
            </Text>

            <Pressable className="mt-4 self-start h-10 px-5 rounded-full bg-[#F4BE2A] items-center justify-center">
              <Text className="font-poppins-semibold text-[#111827] text-[12px]">CLAIM NOW →</Text>
            </Pressable>
          </View>

          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-[#1E3A8A] text-[29px] font-syne-bold">Our Services</Text>
            <Pressable onPress={() => onOpenServices?.()}>
              <Text className="text-[#EAAE1F] font-poppins-semibold text-[12px]">View all →</Text>
            </Pressable>
          </View>

          <View className="bg-[#EEF2FF] p-2 rounded-2xl flex-row justify-between">

            {/* Bus */}
            <Pressable onPress={() => openPickupFromAction('Bus')} className="flex-1 mx-1 bg-white rounded-xl items-center justify-center py-3 shadow-sm">
              <Bus size={18} color="#7C9A14" />
              <Text className="text-[11px] mt-1 text-[#1E3A8A] font-semibold">Bus</Text>
            </Pressable>

            {/* Metro */}
            <Pressable onPress={() => openPickupFromAction('Metro')} className="flex-1 mx-1 bg-white rounded-xl items-center justify-center py-3 shadow-sm">
              <Train size={18} color="#1E3A8A" />
              <Text className="text-[11px] mt-1 text-[#1E3A8A] font-semibold">Metro</Text>
            </Pressable>

            {/* Cab */}
            <Pressable onPress={() => openPickupFromAction('Cab')} className="flex-1 mx-1 bg-white rounded-xl items-center justify-center py-3 shadow-sm">
              <Car size={18} color="#F4BE2A" />
              <Text className="text-[11px] mt-1 text-[#1E3A8A] font-semibold">Cab</Text>
            </Pressable>

            {/* Multimode */}
            <Pressable onPress={() => openPickupFromAction('Multimode')} className="flex-1 mx-1 bg-white rounded-xl items-center justify-center py-3 shadow-sm">
              <Repeat2 size={18} color="#3AA6C8" />
              <Text className="text-[11px] mt-1 text-[#1E3A8A] font-semibold">Multi</Text>
            </Pressable>

          </View>
        

        </View>
      </ScrollView>

      {shouldShowBottomSheet ? (
      <Animated.View
        className="absolute bottom-0 left-0 right-0 rounded-t-3xl bg-[#ffffff] border-t border-[#ffffff]/80"
        style={{
          bottom: -maxUpwardTravel,
          height: sheetMaxHeight,
          transform: [{ translateY: sheetTranslateY }],
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.12,
          shadowRadius: 18,
          elevation: 18,
        }}>
        <View {...panResponder.panHandlers} className="items-center pt-2 pb-1">
          <Pressable onPress={toggleSheet} className="items-center py-2 px-6">
            <View className="w-14 h-1.5 rounded-full bg-[#CBD5E1]" />
          </Pressable>
        </View>

        <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={true} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 28 }}>
          <Pressable onPress={() => openPickupFromAction('Plan your trip')} className="w-full h-16 rounded-2xl bg-[#F4BE2A] border-2 border-[#F4BE2A] items-center justify-center my-4">
            <Text className="text-[#111827] font-syne-semibold text-[21px]">Plan your trip 🚞</Text>
          </Pressable>
          <View className="bg-[#EEF2FF] p-2 rounded-2xl flex-row justify-between">

            {/* Bus */}
            <Pressable onPress={() => openPickupFromAction('Bus')} className="flex-1 mx-1 bg-white rounded-xl items-center justify-center py-3 shadow-sm">
              <Bus size={18} color="#7C9A14" />
              <Text className="text-[11px] mt-1 text-[#1E3A8A] font-semibold">Bus</Text>
            </Pressable>

            {/* Metro */}
            <Pressable onPress={() => openPickupFromAction('Metro')} className="flex-1 mx-1 bg-white rounded-xl items-center justify-center py-3 shadow-sm">
              <Train size={18} color="#1E3A8A" />
              <Text className="text-[11px] mt-1 text-[#1E3A8A] font-semibold">Metro</Text>
            </Pressable>

            {/* Cab */}
            <Pressable onPress={() => openPickupFromAction('Cab')} className="flex-1 mx-1 bg-white rounded-xl items-center justify-center py-3 shadow-sm">
              <Car size={18} color="#F4BE2A" />
              <Text className="text-[11px] mt-1 text-[#1E3A8A] font-semibold">Cab</Text>
            </Pressable>

            {/* Multimode */}
            <Pressable onPress={() => openPickupFromAction('Multimode')} className="flex-1 mx-1 bg-white rounded-xl items-center justify-center py-3 shadow-sm">
              <Repeat2 size={18} color="#3AA6C8" />
              <Text className="text-[11px] mt-1 text-[#1E3A8A] font-semibold">Multi</Text>
            </Pressable>

          </View>
          <View className=" my-4 rounded-3xl bg-[#E9EDFF] border border-[#DCE4FF] p-4">
            <View className="self-start flex-row items-center px-3 py-1 rounded-full bg-[#CFD7F7]" style={{ gap: 6 }}>
              <CalendarDays size={13} color="#37549A" />
              <Text className="text-[#37549A] text-[12px] font-poppins-semibold tracking-[0.3px]">MULTIMODE</Text>
            </View>

            <Text className="text-[#2B468C] font-syne-bold text-[36px] leading-[38px] mt-3">Seamless Multimode</Text>
            <Text className="text-[#2B468C] font-syne-bold text-[36px] leading-[38px]">Transport</Text>
            <Text className="text-[#5F6E8F] text-[14px] leading-[22px] font-poppins-medium mt-3">
              Combine Bus, Metro, and Cab rides for a smart, hassle-free journey!
            </Text>

            <View className="mt-4 rounded-3xl bg-white p-4 border border-[#E5EAFB]">
              <View className="flex-row items-center justify-between">
                <MapPin size={20} color="#7C9A14" />
                <View className="flex-row items-center" style={{ gap: 4 }}>
                  <View className="w-1.5 h-1.5 rounded-full bg-[#7FB3CE]" />
                  <View className="w-1.5 h-1.5 rounded-full bg-[#7FB3CE]" />
                  <View className="w-1.5 h-1.5 rounded-full bg-[#7FB3CE]" />
                </View>
                <Bus size={20} color="#7C9A14" />
                <View className="flex-row items-center" style={{ gap: 4 }}>
                  <View className="w-1.5 h-1.5 rounded-full bg-[#7FB3CE]" />
                  <View className="w-1.5 h-1.5 rounded-full bg-[#7FB3CE]" />
                  <View className="w-1.5 h-1.5 rounded-full bg-[#7FB3CE]" />
                </View>
                <Train size={20} color="#2B468C" />
                <View className="flex-row items-center" style={{ gap: 4 }}>
                  <View className="w-1.5 h-1.5 rounded-full bg-[#7FB3CE]" />
                  <View className="w-1.5 h-1.5 rounded-full bg-[#7FB3CE]" />
                  <View className="w-1.5 h-1.5 rounded-full bg-[#7FB3CE]" />
                </View>
                <Car size={20} color="#D6A722" />
                <View className="flex-row items-center" style={{ gap: 4 }}>
                  <View className="w-1.5 h-1.5 rounded-full bg-[#7FB3CE]" />
                  <View className="w-1.5 h-1.5 rounded-full bg-[#7FB3CE]" />
                  <View className="w-1.5 h-1.5 rounded-full bg-[#7FB3CE]" />
                </View>
                <MapPin size={20} color="#2B59B0" />
              </View>

              <View className="mt-2 flex-row justify-center" style={{ gap: 34 }}>
                <Text className="text-[#2B468C] text-[13px] font-poppins-semibold">Bus</Text>
                <Text className="text-[#2B468C] text-[13px] font-poppins-semibold">Metro</Text>
                <Text className="text-[#2B468C] text-[13px] font-poppins-semibold">Cab</Text>
              </View>

              <Text className="mt-3 text-center text-[#39445E] text-[20px] font-syne-bold">Bus + Metro + Cab</Text>

              <Pressable onPress={() => openPickupFromAction('Explore Multimode')} className="mt-4 h-12 rounded-full bg-[#F4BE2A] items-center justify-center self-center px-8">
                <Text className="text-[#1F2A44] text-[24px] font-syne-semibold">Explore Multimode →</Text>
              </Pressable>
            </View>
          </View>
          <View className="rounded-3xl p-4 bg-[#233F89] mt-4 mb-8">
            <View className="self-start px-3 py-1 rounded-full border border-[#6E83C3] bg-[#274A9E] mb-3">
              <View className="flex-row items-center" style={{ gap: 4 }}>
                <Sparkles size={11} color="#E8EDFF" />
                <Text className="text-[#E8EDFF] text-[10px] font-poppins-medium tracking-[0.3px]">OFFERS & DEALS</Text>
              </View>
            </View>

            <Text className="text-white font-syne-bold text-[18px] leading-[24px] w-[84%]">
              Get 30% off your first Metro ride!
            </Text>

            <Pressable className="mt-4 self-start h-10 px-5 rounded-full bg-[#F4BE2A] items-center justify-center">
              <Text className="font-poppins-semibold text-[#111827] text-[12px]">CLAIM NOW →</Text>
            </Pressable>
          </View>
        </ScrollView>
      </Animated.View>
      ) : null}
    </View>
  );
}

export default HomeScreen;
