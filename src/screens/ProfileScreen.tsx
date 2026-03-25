import React from 'react';
import { View, Text, Pressable, ScrollView, Image } from 'react-native';

type Props = {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  onViewProfile?: () => void;
  onOpenAboutUs?: () => void;
  onOpenFavourites?: () => void;
  onOpenHelpSupport?: () => void;
  onOpenPreferences?: () => void;
  onOpenTransitPreferences?: () => void;
  onOpenShareWithFriends?: () => void;
  onOpenMyRides?: () => void;
  onOpenSafety?: () => void;
  onOpenAppLanguage?: () => void;
  onLogout?: () => void;
};

export function ProfileScreen({
  fullName = '',
  email = '',
  phoneNumber = '',
  onViewProfile,
  onOpenAboutUs,
  onOpenFavourites,
  onOpenHelpSupport,
  onOpenPreferences,
  onOpenTransitPreferences,
  onOpenShareWithFriends,
  onOpenMyRides,
  onOpenSafety,
  onOpenAppLanguage,
  onLogout,
}: Props) {
  const Section = ({ children }: { children: React.ReactNode }) => (
    <View className="mb-4 rounded-lg bg-[#ffffff]/80 gap-1 border-t-2 border-[#ffffff]/80 backdrop-blur-lg p-4">
      {children}
    </View>
  );

  return (
    <View className="flex-1 bg-[#ecedff]">
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
        <View className="px-6 pt-6">
          <View className="flex-row items-center mb-4">
            <View className="w-16 h-16 flex-row items-center justify-center rounded-full bg-[#EDAB0C] mr-4" >
              <Image
                source={require('../assets/logo.png')}
                style={{ width: 84, height: 84, tintColor: '#FFFFFF', opacity: 0.35, marginBottom: -20 }}
                resizeMode="contain"
              />
            </View>
            <View>
              <Text className="text-[#000000] text-lg font-semibold">{fullName || '9913151805'}</Text>
              <Text className="text-[#4B5563]">{phoneNumber || '9913151805'}</Text>
              <Text className="text-[#4B5563]">{email || '9913151805'}</Text>
              <Pressable onPress={onViewProfile} className="mt-1">
                <Text className="text-[#2563EB]">View Profile</Text>
              </Pressable>
            </View>
          </View>

          <Section>

            <Pressable onPress={onOpenFavourites} className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Text className="mr-3">🖤</Text>
                <Text className="text-base">Favourites</Text>
              </View>
              <Text>›</Text>
            </Pressable>
            <View className="h-[2px] bg-[#F3F4F6]" />
            <Pressable onPress={onOpenPreferences} className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center">
                <Text className="mr-3">⚙️</Text>
                <Text className="text-base">Preferences</Text>
              </View>
              <Text>›</Text>
            </Pressable>
            <View className="h-[2px] bg-[#F3F4F6]" />
            <Pressable onPress={onOpenTransitPreferences} className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center">
                <Text className="mr-3">🚆</Text>
                <Text className="text-base">Transit Preferences</Text>
              </View>
              <Text>›</Text>
            </Pressable>
          </Section>

          <Section>
            <Pressable onPress={onOpenShareWithFriends} className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center">
                <Text className="mr-3">↪️</Text>
                <Text className="text-base">Share with Friends</Text>
              </View>
              <Text>›</Text>
            </Pressable>
            <View className="h-[2px] bg-[#F3F4F6]" />
            <Pressable onPress={onOpenMyRides} className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center">
                <Text className="mr-3">🧾</Text>
                <Text className="text-base">My Rides</Text>
              </View>
              <Text>›</Text>
            </Pressable>
            <View className="h-[2px] bg-[#F3F4F6]" />
            <Pressable onPress={onOpenHelpSupport} className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center">
                <Text className="mr-3">🎧</Text>
                <Text className="text-base">Help and Support</Text>
              </View>
              <Text>›</Text>
            </Pressable>
            <View className="h-[2px] bg-[#F3F4F6]" />
            <Pressable onPress={onOpenSafety} className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center">
                <Text className="mr-3">🔒</Text>
                <Text className="text-base">Safety</Text>
              </View>
              <Text>›</Text>
            </Pressable>
          </Section>

          <Section>
            <Pressable onPress={onOpenAboutUs} className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center">
                <Text className="mr-3">ℹ️</Text>
                <Text className="text-base">About Us</Text>
              </View>
              <Text>›</Text>
            </Pressable>
            <View className="h-[2px] bg-[#F3F4F6]" />
            <Pressable onPress={onOpenAppLanguage} className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center">
                <Text className="mr-3">🄰</Text>
                <Text className="text-base">App Language</Text>
              </View>
              <Text>›</Text>
            </Pressable>
            <View className="h-[2px] bg-[#F3F4F6]" />
            <Pressable onPress={onLogout} className="flex-row items-center justify-between py-3">
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
