import React from 'react';
import { ScrollView, Text, View, Image, Pressable } from 'react-native';
import { Bus, Car, Package, Repeat2, ShoppingBag, Train } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  gradientTop: '#F8F4ED',
  gradientBottom: '#E8DFD1',
  navy: '#0C1E5B',
  gold: '#F4B000',
  textGray: '#8A8D9F',
};

type PickupInfo = { label: string; center?: number[] };
type Props = {
  onOpenProfile: () => void;
  onOpenPickup?: (place: PickupInfo) => void;
};
export function ServicesScreen({ onOpenProfile, onOpenPickup }: Props) {
  return (
    <LinearGradient colors={[COLORS.gradientTop, COLORS.gradientBottom]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View className="flex-1">
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

            <Pressable onPress={onOpenProfile} className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: COLORS.gold }}>
              <Text className="font-syne-bold text-[18px]" style={{ color: COLORS.navy }}>A</Text>
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
            <View className="px-4 pt-6">
              <Text className="text-3xl font-syne-bold" style={{ color: COLORS.navy }}>Services</Text>
              <Text className="mt-1 mb-5 font-poppins-medium" style={{ color: COLORS.textGray }}>Travel smart across all modes</Text>

              <View className="flex-row flex-wrap justify-between">
                <Pressable
                  onPress={() => onOpenPickup?.({ label: 'Multimode Travel' })}
                  className="w-[48%] rounded-3xl p-4 mb-4 shadow-sm relative"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.9)' }}
                >
                  <View className="absolute top-2 left-2 px-2 py-[2px] rounded-full" style={{ backgroundColor: COLORS.navy }}>
                    <Text className="text-white text-[10px] font-poppins-semibold">Plan</Text>
                  </View>
                  <View className="items-center mt-4">
                    <Repeat2 size={28} color="#00A1C7" />
                    <Text className="mt-3 font-poppins-semibold" style={{ color: COLORS.navy }}>Multimode</Text>
                    <Text className="text-[11px] font-poppins-medium" style={{ color: COLORS.textGray }}>Best route</Text>
                  </View>
                </Pressable>

                <View
                  className="w-[48%] rounded-3xl p-4 mb-4 shadow-sm relative"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.9)' }}
                >
                  <View className="absolute top-2 left-2 px-2 py-[2px] rounded-full" style={{ backgroundColor: COLORS.gold }}>
                    <Text className="text-[10px] font-poppins-semibold" style={{ color: COLORS.navy }}>-25%</Text>
                  </View>
                  <Pressable onPress={() => onOpenPickup?.({ label: 'Cab Trip' })} className="items-center mt-4">
                    <Car size={28} color="#F4B000" />
                    <Text className="mt-3 font-poppins-semibold" style={{ color: COLORS.navy }}>Trip</Text>
                    <Text className="text-[11px] font-poppins-medium" style={{ color: COLORS.textGray }}>Quick ride</Text>
                  </Pressable>
                </View>

                <Pressable onPress={() => onOpenPickup?.({ label: 'Bus' })} className="w-[23%] rounded-2xl p-3 mb-4 shadow-sm items-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.9)' }}>
                  <Bus size={22} color="#7C9A14" />
                  <Text className="text-[12px] mt-2 font-poppins-medium" style={{ color: COLORS.navy }}>Bus</Text>
                </Pressable>

                <Pressable onPress={() => onOpenPickup?.({ label: 'Metro' })} className="w-[23%] rounded-2xl p-3 mb-4 shadow-sm items-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.9)' }}>
                  <Train size={22} color="#0C1E5B" />
                  <Text className="text-[12px] mt-2 font-poppins-medium" style={{ color: COLORS.navy }}>Metro</Text>
                </Pressable>

                <Pressable onPress={() => onOpenPickup?.({ label: 'Cab' })} className="w-[23%] rounded-2xl p-3 mb-4 shadow-sm items-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.9)' }}>
                  <Car size={22} color="#F4B000" />
                  <Text className="text-[12px] mt-2 font-poppins-medium" style={{ color: COLORS.navy }}>Cab</Text>
                </Pressable>

                <Pressable onPress={() => onOpenPickup?.({ label: 'Auto' })} className="w-[23%] rounded-2xl p-3 mb-4 shadow-sm items-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.9)' }}>
                  <Bus size={22} color="#00A1C7" />
                  <Text className="text-[12px] mt-2 font-poppins-medium" style={{ color: COLORS.navy }}>Auto</Text>
                </Pressable>
              </View>
            </View>
            <View className="rounded-3xl p-5 my-4 mx-4 shadow-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.9)' }}>

              <Text className="text-lg mt-4 font-bold mb-1" style={{ color: COLORS.navy }}>
                Smart Multimode Travel
              </Text>
              <Text className="text-xs mb-4" style={{ color: COLORS.textGray }}>
                Combine multiple rides seamlessly
              </Text>

              <View className="flex-row items-center justify-between mb-4">

                <Text className="text-xl">📍</Text>

                <View className="flex-1 border-t border-dashed border-gray-300 mx-2" />

                <Bus size={18} color="#7C9A14" />

                <View className="flex-1 border-t border-dashed border-gray-300 mx-2" />

                <Train size={18} color="#0C1E5B" />

                <View className="flex-1 border-t border-dashed border-gray-300 mx-2" />

                <Car size={18} color="#F4B000" />

                <View className="flex-1 border-t border-dashed border-gray-300 mx-2" />

                <Text className="text-xl">📍</Text>
              </View>

              <View className="flex-row justify-between mb-4 px-1">
                <Text className="text-[10px] text-gray-400">Start</Text>
                <Text className="text-[10px] text-gray-400">Bus</Text>
                <Text className="text-[10px] text-gray-400">Metro</Text>
                <Text className="text-[10px] text-gray-400">Cab</Text>
                <Text className="text-[10px] text-gray-400">End</Text>
              </View>

              <View className="py-3 rounded-2xl items-center" style={{ backgroundColor: COLORS.gold }}>
                <Pressable onPress={() => onOpenPickup?.({ label: 'Multimode Travel' })}>
                  <Text className="font-semibold" style={{ color: COLORS.navy }}>
                    Plan Smart Route →
                  </Text>
                </Pressable>
              </View>

            </View>

          </ScrollView>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

export default ServicesScreen;
