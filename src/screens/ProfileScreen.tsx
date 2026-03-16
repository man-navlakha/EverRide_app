import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';

type Props = {
  phoneNumber?: string;
  onViewProfile?: () => void;
};

export function ProfileScreen({ phoneNumber = '', onViewProfile }: Props) {
  const Section = ({ children }: { children: React.ReactNode }) => (
    <View className="mb-4 rounded-lg bg-white p-4 shadow-sm">
      {children}
    </View>
  );

  return (
    <View className="flex-1 bg-[#F7F4EF]">
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
        <View className="px-6 pt-6">
          <View className="flex-row items-center mb-4">
            <View className="w-16 h-16 rounded-full bg-[#EF4444] mr-4" />
            <View>
              <Text className="text-[#4B5563]">{phoneNumber || '9913151805'}</Text>
              <Text className="text-[#4B5563]">{phoneNumber || '9913151805'}</Text>
              <Pressable onPress={onViewProfile} className="mt-1">
                <Text className="text-[#2563EB]">View Profile</Text>
              </Pressable>
            </View>
          </View>

          <Section>
            <Pressable className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center">
                <Text className="mr-3">🖤</Text>
                <Text className="text-base">Favourites</Text>
              </View>
              <Text>›</Text>
            </Pressable>
            <View className="h-[2px] bg-[#F3F4F6]" />
            <Pressable className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center">
                <Text className="mr-3">⚙️</Text>
                <Text className="text-base">Preferences</Text>
              </View>
              <Text>›</Text>
            </Pressable>
            <View className="h-[2px] bg-[#F3F4F6]" />
            <Pressable className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center">
                <Text className="mr-3">🚆</Text>
                <Text className="text-base">Transit Preferences</Text>
              </View>
              <Text>›</Text>
            </Pressable>
          </Section>

          <Section>
            <Pressable className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center">
                <Text className="mr-3">↪️</Text>
                <Text className="text-base">Share with Friends</Text>
              </View>
              <Text>›</Text>
            </Pressable>
            <View className="h-[2px] bg-[#F3F4F6]" />
            <Pressable className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center">
                <Text className="mr-3">🧾</Text>
                <Text className="text-base">My Rides</Text>
              </View>
              <Text>›</Text>
            </Pressable>
            <View className="h-[2px] bg-[#F3F4F6]" />
            <Pressable className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center">
                <Text className="mr-3">🎧</Text>
                <Text className="text-base">Help and Support</Text>
              </View>
              <Text>›</Text>
            </Pressable>
            <View className="h-[2px] bg-[#F3F4F6]" />
            <Pressable className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center">
                <Text className="mr-3">🔒</Text>
                <Text className="text-base">Safety</Text>
              </View>
              <Text>›</Text>
            </Pressable>
          </Section>

          <Section>
            <Pressable className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center">
                <Text className="mr-3">ℹ️</Text>
                <Text className="text-base">About Us</Text>
              </View>
              <Text>›</Text>
            </Pressable>
            <View className="h-[2px] bg-[#F3F4F6]" />
            <Pressable className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center">
                <Text className="mr-3">🄰</Text>
                <Text className="text-base">App Language</Text>
              </View>
              <Text>›</Text>
            </Pressable>
            <View className="h-[2px] bg-[#F3F4F6]" />
            <Pressable className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center">
                <Text className="mr-3">🚪</Text>
                <Text className="text-base">Logout</Text>
              </View>
              <Text>›</Text>
            </Pressable>
          </Section>
        </View>
      </ScrollView>

      {/* BottomBar rendered by App when logged in */}
    </View>
  );
}

export default ProfileScreen;
