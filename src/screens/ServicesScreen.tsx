import React from 'react';
import { ScrollView, Text, View, Image, Pressable } from 'react-native';
import { Bus, Car, Package, Repeat2, ShoppingBag, Train } from 'lucide-react-native';
type PickupInfo = { label: string; center?: number[] };
type Props = {
  onOpenProfile: () => void;
  onOpenPickup?: (place: PickupInfo) => void;
};
export function ServicesScreen({onOpenProfile, onOpenPickup}: Props) {
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
        <View className="px-4 pt-6">
          <Text className="text-3xl font-syne-bold text-[#1E3A8A]">Services</Text>
          <Text className="text-[#9CA3AF] mt-1 mb-5 font-poppins-medium">Travel smart across all modes</Text>

          <View className="flex-row flex-wrap justify-between">
            <Pressable onPress={() => onOpenPickup?.({ label: 'Multimode Travel' })} className="w-[48%] bg-white rounded-3xl p-4 mb-4 shadow-sm border border-gray-100 relative">
              <View className="absolute top-2 left-2 bg-[#1E3A8A] px-2 py-[2px] rounded-full">
                <Text className="text-white text-[10px] font-poppins-semibold">Plan</Text>
              </View>
              <View className="items-center mt-4">
                <Repeat2 size={28} color="#1E3A8A" />
                <Text className="mt-3 font-poppins-semibold text-[#1E3A8A]">Multimode</Text>
                <Text className="text-[11px] text-gray-400 font-poppins-medium">Best route</Text>
              </View>
            </Pressable>

            <View className="w-[48%] bg-white rounded-3xl p-4 mb-4 shadow-sm border border-gray-100 relative">
              <View className="absolute top-2 left-2 bg-[#F4BE2A] px-2 py-[2px] rounded-full">
                <Text className="text-[#1E3A8A] text-[10px] font-poppins-semibold">-25%</Text>
              </View>
              <Pressable onPress={() => onOpenPickup?.({ label: 'Cab Trip' })} className="items-center mt-4">
                <Car size={28} color="#F4BE2A" />
                <Text className="mt-3 font-poppins-semibold text-[#1E3A8A]">Trip</Text>
                <Text className="text-[11px] text-gray-400 font-poppins-medium">Quick ride</Text>
              </Pressable>
            </View>

            <Pressable onPress={() => onOpenPickup?.({ label: 'Bus' })} className="w-[23%] bg-white rounded-2xl p-3 mb-4 shadow-sm border border-gray-100 items-center">
              <Bus size={22} color="#7C9A14" />
              <Text className="text-[12px] mt-2 text-[#1E3A8A] font-poppins-medium">Bus</Text>
            </Pressable>

            <Pressable onPress={() => onOpenPickup?.({ label: 'Metro' })} className="w-[23%] bg-white rounded-2xl p-3 mb-4 shadow-sm border border-gray-100 items-center">
              <Train size={22} color="#1E3A8A" />
              <Text className="text-[12px] mt-2 text-[#1E3A8A] font-poppins-medium">Metro</Text>
            </Pressable>

            <Pressable onPress={() => onOpenPickup?.({ label: 'Cab' })} className="w-[23%] bg-white rounded-2xl p-3 mb-4 shadow-sm border border-gray-100 items-center">
              <Car size={22} color="#F4BE2A" />
              <Text className="text-[12px] mt-2 text-[#1E3A8A] font-poppins-medium">Cab</Text>
            </Pressable>

            <Pressable onPress={() => onOpenPickup?.({ label: 'Auto' })} className="w-[23%] bg-white rounded-2xl p-3 mb-4 shadow-sm border border-gray-100 items-center">
              <Bus size={22} color="#3AA6C8" />
              <Text className="text-[12px] mt-2 text-[#1E3A8A] font-poppins-medium">Auto</Text>
            </Pressable>
          </View>
        </View>
  <View className="bg-white rounded-3xl p-5 my-4 mx-4 shadow-lg border border-gray-100">

            <Text className="text-[#1E3A8A] text-lg mt-4 font-bold mb-1">
              Smart Multimode Travel
            </Text>
            <Text className="text-gray-500 text-xs mb-4">
              Combine multiple rides seamlessly
            </Text>

            <View className="flex-row items-center justify-between mb-4">

              <Text className="text-xl">📍</Text>

              <View className="flex-1 border-t border-dashed border-gray-300 mx-2" />

              <Bus size={18} color="#7C9A14" />

              <View className="flex-1 border-t border-dashed border-gray-300 mx-2" />

              <Train size={18} color="#1E3A8A" />

              <View className="flex-1 border-t border-dashed border-gray-300 mx-2" />

              <Car size={18} color="#F4BE2A" />

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

            <View className="bg-[#F4BE2A] py-3 rounded-2xl items-center">
              <Pressable onPress={() => onOpenPickup?.({ label: 'Multimode Travel' })}>
                <Text className="font-semibold text-[#1E3A8A]">
                  Plan Smart Route →
                </Text>
              </Pressable>
            </View>

          </View>

      </ScrollView>
    </View>
  );
}

export default ServicesScreen;
