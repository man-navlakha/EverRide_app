import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import Svg, { Rect, Circle, Path, Line } from 'react-native-svg';

type Props = {
  onBack: () => void;
};

function EmptyRideIllustration() {
  return (
    <Svg width={220} height={150} viewBox="0 0 220 150" fill="none">
      <Rect x="18" y="22" width="184" height="102" rx="20" fill="#EEF2FF" />
      <Rect x="36" y="38" width="148" height="68" rx="12" fill="#FFFFFF" />
      <Rect x="48" y="50" width="54" height="8" rx="4" fill="#DBEAFE" />
      <Rect x="48" y="64" width="84" height="8" rx="4" fill="#E5E7EB" />
      <Rect x="48" y="78" width="68" height="8" rx="4" fill="#E5E7EB" />
      <Rect x="144" y="52" width="26" height="34" rx="6" fill="#1E3A8A" opacity="0.12" />
      <Path d="M149 84H165L163 95H151L149 84Z" fill="#1E3A8A" opacity="0.2" />
      <Circle cx="70" cy="124" r="10" fill="#F4BE2A" />
      <Circle cx="150" cy="124" r="10" fill="#F4BE2A" />
      <Line x1="56" y1="124" x2="164" y2="124" stroke="#9CA3AF" strokeWidth="4" strokeLinecap="round" />
      <Circle cx="184" cy="34" r="16" fill="#1E3A8A" />
      <Path d="M177 34H191" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
      <Path d="M184 27V41" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
    </Svg>
  );
}

export function MyRidesScreen({ onBack }: Props) {
  return (
    <View className="flex-1 bg-[#ecedff]">
      <View className="px-4 pt-5 pb-3 flex-row items-center justify-between border-b border-[#ffffff] bg-[#ecedff]">
        <View className="flex-row items-center">
          <Pressable onPress={onBack} className="w-10 h-10 rounded-full bg-white items-center justify-center">
            <Text className="font-syne-bold text-[#111827] text-[18px]">←</Text>
          </Pressable>
          <Text className="ml-3 text-[#1E3A8A] font-syne-bold text-[20px]">My Rides</Text>
        </View>
        <View className="w-10 h-10" />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="px-4 pt-6">
          <View className="rounded-3xl backdrop-blur-lg bg-[#ffffff] border-t border-[#ffffff]/80 p-6 items-center">
            <EmptyRideIllustration />
            <Text className="mt-2 text-[#1E3A8A] text-[20px] font-syne-bold">Create your first booking</Text>
            <Text className="mt-2 text-center text-[#6B7280] text-[13px] leading-[20px] font-poppins-medium px-3">
              Your completed and upcoming rides will appear here once you book your first trip.
            </Text>

            <Pressable className="mt-5 h-11 px-6 rounded-full bg-[#1F2430] items-center justify-center">
              <Text className="text-[#FF4B4B] text-[13px] font-syne-bold">Book a Ride</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default MyRidesScreen;
