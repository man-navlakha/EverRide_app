import React from 'react';
import { View, Text, Pressable, ScrollView, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  onBack: () => void;
};

export function AboutUsScreen({ onBack }: Props) {
  const versions = {
    common: 'EverRide 1.0.0',
    android: 'Android 1.0.0',
    ios: 'iOS 1.0.0',
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
    <View className="flex-1 bg-[#ecedff]">
      <View className="px-4 pt-5 pb-3 flex-row items-center justify-between border-b border-[#ffffff] bg-[#ecedff]">
        <View className="flex-row items-center justify-between">
          <Pressable onPress={onBack} className="w-10 h-10 rounded-full bg-white items-center justify-center">
            <Text className="font-syne-bold text-[#111827] text-[18px]">←</Text>
          </Pressable>
          <Text className="ml-3 text-[#1E3A8A] font-syne-bold text-[22px]">About Us</Text>
        </View>

        <View className="w-10 h-10" />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 160 }}>
        <View className="px-4 pt-4">
             <View className="flex items-center justify-center my-4">
          <Image source={require('../assets/logo.png')} style={{ width: 56, height: 56 }} resizeMode="contain" />
          <Text className="ml-2 text-black font-syne-bold text-[35px]">Ever Ride</Text>
        </View>
          <View className="rounded-3xl p-4 bg-[#233F89] mb-4">
            <View className="self-start px-3 py-1 rounded-full border border-[#6E83C3] bg-[#274A9E] mb-3">
              <Text className="text-[#E8EDFF] text-[10px] font-poppins-medium tracking-[0.3px]">ABOUT US</Text>
            </View>
            <Text className="text-white font-syne-bold text-[22px] leading-[28px]">Move smarter with EverRide</Text>
            <Text className="text-[#E8EDFF] mt-2 text-[13px] leading-[20px] font-poppins-medium">
              EverRide helps commuters discover multimodal routes with better speed, cost, and convenience across city transport options.
            </Text>
          </View>

          <View className="rounded-3xl backdrop-blur-lg bg-[#ffffff] border-t border-[#ffffff]/80 p-4 mb-3">
            <Text className="text-[#1E3A8A] text-[16px] font-syne-bold mb-1">What we do</Text>
            <Text className="text-[#4B5563] text-[13px] leading-[20px] font-poppins-medium">
              We combine pickup, destination, and transport choices into simple route options so your daily travel becomes easier to plan.
            </Text>
          </View>

          <View className="rounded-3xl backdrop-blur-lg bg-[#ffffff] border-t border-[#ffffff]/80 p-4 mb-3">
            <Text className="text-[#1E3A8A] text-[16px] font-syne-bold mb-1">Our promise</Text>
            <Text className="text-[#4B5563] text-[13px] leading-[20px] font-poppins-medium">
              Reliable route guidance, transparent fares, and continuously improving local transit experiences for every rider.
            </Text>
          </View>

          <View className="rounded-3xl backdrop-blur-lg bg-[#ffffff] border-t border-[#ffffff]/80 p-4 mb-6">
            <Text className="text-[#1E3A8A] text-[16px] font-syne-bold mb-2">Version Information</Text>
            <View className="flex-row items-center justify-between py-1">
              <Text className="text-[#6B7280] text-[13px] font-poppins-medium">Common Version</Text>
              <Text className="text-[#111827] text-[13px] font-poppins-semibold">{versions.common}</Text>
            </View>
            <View className="flex-row items-center justify-between py-1">
              <Text className="text-[#6B7280] text-[13px] font-poppins-medium">Android Version</Text>
              <Text className="text-[#111827] text-[13px] font-poppins-semibold">{versions.android}</Text>
            </View>
            <View className="flex-row items-center justify-between py-1">
              <Text className="text-[#6B7280] text-[13px] font-poppins-medium">iOS Version</Text>
              <Text className="text-[#111827] text-[13px] font-poppins-semibold">{versions.ios}</Text>
            </View>
            <View className="flex-row items-center justify-between py-1">
              <Text className="text-[#6B7280] text-[13px] font-poppins-medium">Current Device</Text>
              <Text className="text-[#111827] text-[13px] font-poppins-semibold">{Platform.OS === 'ios' ? 'iOS' : 'Android'}</Text>
            </View>
          </View>

          <View className="items-center justify-center mt-1">
            <View className="flex-row items-center">
              <Image
                source={require('../assets/logo.png')}
                style={{ width: 82, height: 82, tintColor: '#000000', opacity: 0.08 }}
                resizeMode="contain"
              />
              {/* <Image
                source={require('../assets/logo.png')}
                style={{ width: 82, height: 82, tintColor: '#FFFFFF', opacity: 0.35, marginLeft: -20 }}
                resizeMode="contain"
              /> */}
            </View>
            <Text className="text-[#9CA3AF] text-[11px] mt-1 font-poppins-medium">{versions.common} | {Platform.OS === 'ios' ? 'iOS' : 'Android'}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
    </SafeAreaView>
  );
}

export default AboutUsScreen;
