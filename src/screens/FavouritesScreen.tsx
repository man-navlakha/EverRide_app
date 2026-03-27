import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, ScrollView, TextInput } from 'react-native';
import { MAPPLS_CLIENT_ID, MAPPLS_CLIENT_SECRET } from '../constants/mappls';
import { searchMapplsPlaces, type MapplsSuggestion } from '../services/mapplsPlaces';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  onBack: () => void;
};

type LocationType = 'Home' | 'Work' | 'Favourites';
type TabType = 'Location' | 'Drivers';

type SavedLocation = {
  id: string;
  label: LocationType;
  title: string;
  subtitle: string;
  center?: number[];
};

function formatSuggestion(item: MapplsSuggestion) {
  const title = item.placeName ?? item.place_name ?? 'Unknown';
  const subtitle = item.placeAddress ?? item.alternateName ?? '';
  const finalSubtitle = subtitle.trim().length > 0 ? subtitle : item.type ?? 'Suggested location';

  return { title, subtitle: finalSubtitle, display: `${title}${finalSubtitle ? `, ${finalSubtitle}` : ''}` };
}

export function FavouritesScreen({ onBack }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>('Location');
  const [homeLocation, setHomeLocation] = useState<SavedLocation | null>(null);
  const [workLocation, setWorkLocation] = useState<SavedLocation | null>(null);
  const [otherLocations, setOtherLocations] = useState<SavedLocation[]>([]);

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<LocationType>('Home');
  const [locationQuery, setLocationQuery] = useState('');
  const [locationResults, setLocationResults] = useState<MapplsSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [selectedSuggestion, setSelectedSuggestion] = useState<MapplsSuggestion | null>(null);

  const hasAnySaved = useMemo(() => Boolean(homeLocation || workLocation || otherLocations.length > 0), [homeLocation, workLocation, otherLocations]);

  const missingType: LocationType | null = useMemo(() => {
    if (!homeLocation) return 'Home';
    if (!workLocation) return 'Work';
    return null;
  }, [homeLocation, workLocation]);

  useEffect(() => {
    if (!isEditorOpen) {
      setLocationResults([]);
      setSearchError(null);
      return;
    }

    const trimmed = locationQuery.trim();
    if (trimmed.length < 3) {
      setLocationResults([]);
      setSearchError(null);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        setSearchError(null);
        if (!MAPPLS_CLIENT_ID || !MAPPLS_CLIENT_SECRET) {
          setLocationResults([]);
          setSearchError('Missing Mappls client credentials.');
          return;
        }

        setIsSearching(true);
        const items = await searchMapplsPlaces(trimmed, controller.signal);
        if (items.length > 0) {
          setLocationResults(items);
        } else {
          setLocationResults([]);
          setSearchError('No results');
        }
      } catch (err) {
        if ((err as any)?.name === 'AbortError') return;
        const message = err instanceof Error ? err.message : 'Network error';
        setLocationResults([]);
        setSearchError(message);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [locationQuery, isEditorOpen]);

  const openEditor = (label: LocationType) => {
    setSelectedLabel(label);
    setLocationQuery('');
    setLocationResults([]);
    setSearchError(null);
    setSelectedSuggestion(null);
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setLocationQuery('');
    setLocationResults([]);
    setSearchError(null);
    setSelectedSuggestion(null);
  };

  const saveLocation = () => {
    if (!selectedSuggestion) return;
    const parsed = formatSuggestion(selectedSuggestion);
    const payload: SavedLocation = {
      id: `${selectedLabel}-${selectedSuggestion.id}-${Date.now()}`,
      label: selectedLabel,
      title: parsed.title,
      subtitle: parsed.subtitle,
      center: selectedSuggestion.center,
    };

    if (selectedLabel === 'Home') {
      setHomeLocation(payload);
    } else if (selectedLabel === 'Work') {
      setWorkLocation(payload);
    } else {
      setOtherLocations((prev) => [payload, ...prev].slice(0, 10));
    }

    closeEditor();
  };

  const removeLocation = (type: LocationType, id?: string) => {
    if (type === 'Home') {
      setHomeLocation(null);
      return;
    }
    if (type === 'Work') {
      setWorkLocation(null);
      return;
    }
    if (id) {
      setOtherLocations((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
    <View className="flex-1 bg-[#ecedff]">
      <View className="px-4 pt-5 pb-3 flex-row items-center justify-between border-b border-[#ffffff] bg-[#ecedff]">
        <View className="flex-row items-center justify-between">
          <Pressable onPress={onBack} className="w-10 h-10 rounded-full bg-white items-center justify-center">
            <Text className="font-syne-bold text-[#111827] text-[18px]">←</Text>
          </Pressable>
          <Text className="ml-3 text-[#1E3A8A] font-syne-bold text-[22px]">Favourites</Text>
        </View>

        <View className="w-10 h-10" />
      </View>

      <View className="px-4 pt-3">
        <View className="flex-row rounded-xl bg-white border border-[#E5E7EB] p-1">
          {(['Location', 'Drivers'] as TabType[]).map((tab) => {
            const active = activeTab === tab;
            return (
              <Pressable
                key={tab}
                onPress={() => setActiveTab(tab)}
                className={`flex-1 items-center py-2 rounded-lg ${active ? 'bg-[#EEF2FF]' : 'bg-transparent'}`}
              >
                <Text className={`text-[13px] font-poppins-semibold ${active ? 'text-[#1E3A8A]' : 'text-[#6B7280]'}`}>{tab}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {activeTab === 'Drivers' ? (
        <View className="flex-1 px-4 pt-5 items-center">
          <View className="w-full rounded-3xl backdrop-blur-lg bg-[#ffffff] border-t border-[#ffffff]/80 p-8 items-center">
            <View className="w-36 h-36 rounded-full bg-[#FDE7C2] items-center justify-center">
              <Text className="text-[70px]">👨🏻</Text>
            </View>
            <View className="mt-[-20px] ml-24 w-14 h-14 rounded-full bg-[#FF475A] items-center justify-center border-4 border-white">
              <Text className="text-white text-[24px]">♥</Text>
            </View>
            <Text className="mt-5 text-center text-[#111827] font-poppins-semibold text-[16px] leading-[24px] px-4">
              All the drivers you mark as favourites will appear here
            </Text>
          </View>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
          <View className="px-4 pt-5">
            {hasAnySaved ? (
              <Pressable onPress={() => openEditor('Favourites')} className="rounded-3xl bg-[#D90429] border border-[#B30A29] px-5 py-4 mb-4 flex-row items-center">
                <Text className="text-white text-[24px] mr-3">⊕</Text>
                <View>
                  <Text className="text-white text-[14px] leading-[18px] font-syne-bold">Add Favourites</Text>
                  <Text className="text-[#FFE7EB] text-[12px] font-poppins-medium">Get routes faster in a click</Text>
                </View>
              </Pressable>
            ) : null}

            {missingType ? (
              <View className="rounded-3xl border border-[#E5E7EB] border-dashed bg-white p-6 mb-4 items-center">
                <View className="w-44 h-32 rounded-2xl bg-[#F9FAFB] items-center justify-center">
                  <Text className="text-[62px]">{missingType === 'Home' ? '🏠' : '🏢'}</Text>
                </View>
                <Text className="mt-4 text-[#1E3A8A] text-[20px] font-syne-bold">{missingType === 'Home' ? 'Add Home' : 'Add Work'}</Text>
                <Text className="mt-2 text-center text-[#6B7280] text-[13px] leading-[20px] font-poppins-medium">
                  {missingType === 'Home'
                    ? 'Adding home address helps you to find commutes more easily'
                    : 'Adding your work address makes commuting simpler'}
                </Text>

                <Pressable
                  onPress={() => openEditor(missingType)}
                  className="mt-6 self-stretch rounded-2xl bg-[#1F2430] h-14 items-center justify-center"
                >
                  <Text className="text-[#FF4B4B] text-[13px] font-syne-bold">
                    ⊕ {missingType === 'Home' ? 'Enter Home Location' : 'Enter Work Location'}
                  </Text>
                </Pressable>
              </View>
            ) : null}

            {workLocation ? (
              <View className="rounded-3xl backdrop-blur-lg bg-[#ffffff] border-t border-[#ffffff]/80 px-5 py-4 mb-3">
                <View className="flex-row items-start">
                  <Text className="text-[22px] mr-3">💼</Text>
                  <View className="flex-1">
                    <Text className="text-[#1E3A8A] text-[16px] leading-[18px] font-syne-bold">Work</Text>
                    <Text numberOfLines={1} className="text-[#7B808A] text-[12px] leading-[16px] font-poppins-semibold">{workLocation.subtitle}</Text>
                  </View>
                  <Pressable onPress={() => openEditor('Work')}>
                    <Text className="text-[#3B82F6] text-[12px]">Edit</Text>
                  </Pressable>
                  <View className="w-2" />
                  <Pressable onPress={() => removeLocation('Work')}>
                    <Text className="text-[#EF4444] text-[12px]">Delete</Text>
                  </Pressable>
                </View>
              </View>
            ) : null}

            {homeLocation ? (
              <View className="rounded-3xl backdrop-blur-lg bg-[#ffffff] border-t border-[#ffffff]/80 px-5 py-4 mb-3">
                <View className="flex-row items-start">
                  <Text className="text-[22px] mr-3">🏠</Text>
                  <View className="flex-1">
                    <Text className="text-[#1E3A8A] text-[16px] leading-[18px] font-syne-bold">Home</Text>
                    <Text numberOfLines={1} className="text-[#7B808A] text-[12px] leading-[16px] font-poppins-semibold">{homeLocation.subtitle}</Text>
                  </View>
                  <Pressable onPress={() => openEditor('Home')}>
                    <Text className="text-[#3B82F6] text-[12px]">Edit</Text>
                  </Pressable>
                  <View className="w-2" />
                  <Pressable onPress={() => removeLocation('Home')}>
                    <Text className="text-[#EF4444] text-[12px]">Delete</Text>
                  </Pressable>
                </View>
              </View>
            ) : null}

            {otherLocations.map((item) => (
              <View key={item.id} className="rounded-3xl backdrop-blur-lg bg-[#ffffff] border-t border-[#ffffff]/80 px-5 py-4 mb-3">
                <View className="flex-row items-start">
                  <Text className="text-[22px] mr-3">❤️</Text>
                  <View className="flex-1">
                    <Text className="text-[#1E3A8A] text-[16px] leading-[18px] font-syne-bold">Favourites</Text>
                    <Text numberOfLines={1} className="text-[#7B808A] text-[12px] leading-[16px] font-poppins-semibold">{item.subtitle}</Text>
                  </View>
                  <Pressable onPress={() => removeLocation('Favourites', item.id)}>
                    <Text className="text-[#EF4444] text-[12px]">Delete</Text>
                  </Pressable>
                </View>
              </View>
            ))}

            <View className="items-center mt-10">
              <Text className="text-[#9CA3AF] text-[12px] font-poppins-semibold">≪ Swipe left on a card for actions</Text>
            </View>
          </View>
        </ScrollView>
      )}

      {isEditorOpen ? (
        <View className="absolute inset-0 bg-black/35 justify-end mb-12 pb-6">
          <View className="bg-[#ecedff] rounded-t-3xl p-4 max-h-[75%]">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-[#1E3A8A] font-syne-bold text-[18px]">Add Favourite Location</Text>
              <Pressable onPress={closeEditor} className="w-9 h-9 rounded-full bg-white items-center justify-center">
                <Text className="text-[#111827] font-syne-bold">✕</Text>
              </Pressable>
            </View>

            <View className="rounded-xl bg-white p-3 border border-[#E5E7EB] mb-2">
              <TextInput
                value={locationQuery}
                onChangeText={(text) => {
                  setLocationQuery(text);
                  setSelectedSuggestion(null);
                }}
                placeholder="Search location"
                placeholderTextColor="#9CA3AF"
                className="text-[#1E3A8A] font-poppins-medium text-[13px]"
              />
            </View>

            <View className="flex-row items-center mb-2">
              {(['Home', 'Work', 'Favourites'] as LocationType[]).map((label) => {
                const active = selectedLabel === label;
                return (
                  <Pressable
                    key={label}
                    onPress={() => setSelectedLabel(label)}
                    className={`mr-2 px-3 py-1.5 rounded-full border ${active ? 'bg-[#EEF2FF] border-[#BFDBFE]' : 'bg-white border-[#E5E7EB]'}`}
                  >
                    <Text className={`${active ? 'text-[#1E3A8A]' : 'text-[#6B7280]'} text-[12px] font-poppins-semibold`}>{label}</Text>
                  </Pressable>
                );
              })}
            </View>

            {isSearching ? <Text className="text-[#6B7280] mb-2">Searching...</Text> : null}
            {!isSearching && searchError ? <Text className="text-[#EF4444] mb-2">{searchError}</Text> : null}

            <ScrollView className="mb-3" style={{ maxHeight: 280 }}>
              {locationResults.map((item) => {
                const parsed = formatSuggestion(item);
                const selected = selectedSuggestion?.id === item.id;

                return (
                  <Pressable
                    key={item.id}
                    onPress={() => {
                      setSelectedSuggestion(item);
                      setLocationQuery(parsed.display);
                      setLocationResults([]);
                    }}
                    className={`px-4 py-3 mb-2 rounded-xl border ${selected ? 'bg-[#EEF2FF] border-[#BFDBFE]' : 'bg-white border-[#E5E7EB]'}`}
                  >
                    <Text numberOfLines={1} className="text-[#111827] font-poppins-semibold text-[14px]">{parsed.title}</Text>
                    <Text numberOfLines={1} className="text-[#6B7280] text-[12px] mt-0.5">{parsed.subtitle}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <Pressable
              onPress={saveLocation}
              disabled={!selectedSuggestion}
              className={`h-12 rounded-full items-center justify-center ${selectedSuggestion ? 'bg-[#1F2430]' : 'bg-[#D1D5DB]'}`}
            >
              <Text className={`${selectedSuggestion ? 'text-[#FF4B4B]' : 'text-[#6B7280]'} text-[14px] font-syne-bold`}>Save Location</Text>
            </Pressable>
          </View>
        </View>
      ) : null}
    </View>
    </SafeAreaView>
  );
}

export default FavouritesScreen;
