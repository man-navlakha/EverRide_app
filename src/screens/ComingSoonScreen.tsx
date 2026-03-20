import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

type Props = {
  onBack: () => void;
  title: string;
  description?: string;
};

function ComingSoonIllustration() {
  return (
    <Svg width={180} height={120} viewBox="0 0 180 120" fill="none">
      <Circle cx="38" cy="24" r="4" fill="#F4BE2A" />
      <Circle cx="154" cy="18" r="3" fill="#1E3A8A" opacity="0.5" />
      <Rect x="22" y="56" width="136" height="20" rx="10" fill="#E5E7EB" />
      <Path d="M84 24C87 19 93 19 96 24L116 56H64L84 24Z" fill="#1E3A8A" />
      <Path d="M79 56H101V73C101 79 96 84 90 84C84 84 79 79 79 73V56Z" fill="#F4BE2A" />
      <Circle cx="90" cy="67" r="4" fill="#1F2937" />
      <Path d="M76 84L68 98H80L84 90L76 84Z" fill="#1E3A8A" />
      <Path d="M104 84L112 98H100L96 90L104 84Z" fill="#1E3A8A" />
    </Svg>
  );
}

export function ComingSoonScreen({ onBack, title, description }: Props) {
  return (
    <View className="flex-1 bg-[#ecedff]">
      <View className="px-4 pt-5 pb-3 flex-row items-center justify-between border-b border-[#ffffff] bg-[#ecedff]">
        <View className="flex-row items-center">
          <Pressable onPress={onBack} className="w-10 h-10 rounded-full bg-white items-center justify-center">
            <Text className="font-syne-bold text-[#111827] text-[18px]">←</Text>
          </Pressable>
          <Text className="ml-3 text-[#1E3A8A] font-syne-bold text-[20px]">{title}</Text>
        </View>
        <View className="w-10 h-10" />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="px-4 pt-6">
          <View className="rounded-3xl backdrop-blur-lg bg-[#ffffff] border-t border-[#ffffff]/80 p-6 items-center">
            <ComingSoonIllustration />
            <Text className="mt-2 text-[#1E3A8A] text-[20px] font-syne-bold">Coming Soon</Text>
            <Text className="mt-2 text-center text-[#6B7280] text-[13px] leading-[20px] font-poppins-medium px-2">
              {description ?? 'We are building this section and it will be available in an upcoming update.'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default ComingSoonScreen;
