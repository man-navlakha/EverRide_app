import React from 'react';
import { View, Text, Pressable, ScrollView, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  gradientTop: '#F8F4ED',
  gradientBottom: '#E8DFD1',
  navy: '#0C1E5B',
  gold: '#F4B000',
  textGray: '#8A8D9F',
};

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
    <View className="mb-4 rounded-lg gap-1 backdrop-blur-lg p-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.82)', borderTopWidth: 2, borderTopColor: 'rgba(255, 255, 255, 0.9)' }}>
      {children}
    </View>
  );

  return (
    <LinearGradient colors={[COLORS.gradientTop, COLORS.gradientBottom]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
    <View className="flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
        <View className="px-6 pt-6">
          <View className="flex-row items-center mb-4">
            <View className="w-16 h-16 flex-row items-center justify-center rounded-full mr-4" style={{ backgroundColor: COLORS.gold }}>
              <Image
                source={require('../assets/logo.png')}
                style={{ width: 84, height: 84, tintColor: '#FFFFFF', opacity: 0.35, marginBottom: -20 }}
                resizeMode="contain"
              />
            </View>
            <View>
              <Text className="text-lg font-semibold" style={{ color: COLORS.navy }}>{fullName || '9913151805'}</Text>
              <Text style={{ color: COLORS.textGray }}>{phoneNumber || '9913151805'}</Text>
              <Text style={{ color: COLORS.textGray }}>{email || '9913151805'}</Text>
              <Pressable onPress={onViewProfile} className="mt-1">
                <Text style={{ color: COLORS.navy }}>View Profile</Text>
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
            <View className="h-[2px]" style={{ backgroundColor: 'rgba(12, 30, 91, 0.08)' }} />
            <Pressable onPress={onOpenPreferences} className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center">
                <Text className="mr-3">⚙️</Text>
                <Text className="text-base">Preferences</Text>
              </View>
              <Text>›</Text>
            </Pressable>
            <View className="h-[2px]" style={{ backgroundColor: 'rgba(12, 30, 91, 0.08)' }} />
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
            <View className="h-[2px]" style={{ backgroundColor: 'rgba(12, 30, 91, 0.08)' }} />
            <Pressable onPress={onOpenMyRides} className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center">
                <Text className="mr-3">🧾</Text>
                <Text className="text-base">My Rides</Text>
              </View>
              <Text>›</Text>
            </Pressable>
            <View className="h-[2px]" style={{ backgroundColor: 'rgba(12, 30, 91, 0.08)' }} />
            <Pressable onPress={onOpenHelpSupport} className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center">
                <Text className="mr-3">🎧</Text>
                <Text className="text-base">Help and Support</Text>
              </View>
              <Text>›</Text>
            </Pressable>
            <View className="h-[2px]" style={{ backgroundColor: 'rgba(12, 30, 91, 0.08)' }} />
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
            <View className="h-[2px]" style={{ backgroundColor: 'rgba(12, 30, 91, 0.08)' }} />
            <Pressable onPress={onOpenAppLanguage} className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center">
                <Text className="mr-3">🄰</Text>
                <Text className="text-base">App Language</Text>
              </View>
              <Text>›</Text>
            </Pressable>
            <View className="h-[2px]" style={{ backgroundColor: 'rgba(12, 30, 91, 0.08)' }} />
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
      </SafeAreaView>
    </LinearGradient>
  );
}

export default ProfileScreen;
