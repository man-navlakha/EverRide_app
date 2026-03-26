import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Bus, Car, MapPin, Mic, Repeat2, Train } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

type PickupInfo = { label: string; center?: number[] };

type Props = {
  onOpenProfile: () => void;
  onOpenServices?: () => void;
  onOpenPickup?: (place: PickupInfo) => void;
};

const V5 = {
  cream: '#FBF8F2',
  cream2: '#F0EADC',
  navy: '#122C6F',
  navy2: '#1A3A8A',
  navy3: '#2E4C97',
  amber: '#EDAB0C',
  peach: '#FFC87D',
  cyan: '#1E9EC0',
  olive: '#5E8704',
  text2: '#3A4060',
};

const SHADOWS = {
  glass: {
    shadowColor: '#122C6F',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  offer: {
    shadowColor: '#122C6F',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  tile: {
    shadowColor: '#122C6F',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 4,
  },
  icon: {
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 6,
    elevation: 4,
  },
};

export function HomeScreen({ onOpenProfile, onOpenServices, onOpenPickup }: Props) {
  const [pickupQuery, setPickupQuery] = useState('');

  const queryLabel = useMemo(() => {
    const value = pickupQuery.trim();
    return value.length > 0 ? value : 'Current location';
  }, [pickupQuery]);

  const openPickup = (mode: string) => {
    onOpenPickup?.({ label: `${queryLabel} • ${mode}` });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: V5.cream2 }} edges={['top']}>
      <LinearGradient colors={[V5.cream, V5.cream2]} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120, paddingTop: 6 }}>
        <View className="px-4" style={{ paddingTop: 10 }}>
          <View className="mt-2 flex-row justify-between items-start mb-5">
            <View>
              <Text className="text-[10px] font-poppins-semibold tracking-[1.2px]" style={{ color: V5.amber }}>
                Good morning ☀️
              </Text>
              <Text className="mt-1 font-syne-bold text-[31px] leading-[34px]" style={{ color: V5.navy }}>
                Where are you{`\n`}
                <Text style={{ color: V5.amber }}>headed today?</Text>
              </Text>
            </View>

            <Pressable onPress={onOpenProfile} className="relative">
              <LinearGradient
                colors={[V5.peach, V5.amber]}
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 26,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: V5.amber,
                  shadowColor: V5.amber,
                  shadowOpacity: 0.45,
                  shadowRadius: 14,
                  elevation: 8,
                }}
              >
                <Text className="font-syne-bold text-[20px]" style={{ color: '#0A0600' }}>A</Text>
              </LinearGradient>
              <View
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full items-center justify-center border"
                style={{ backgroundColor: '#EF4444', borderColor: V5.cream, borderWidth: 1.5 }}
              >
                <Text className="text-[8px] font-syne-bold text-white">2</Text>
              </View>
            </Pressable>
          </View>

          <View
            className="flex-row items-center rounded-2xl px-3"
            style={{
              height: 62,
              backgroundColor: 'rgba(251,248,242,0.9)',
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.95)',
              ...SHADOWS.glass,
            }}
          >
            <View style={{ width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center', backgroundColor: V5.navy2 }}>
              <MapPin size={14} color="#fff" />
            </View>
            <TextInput
              value={pickupQuery}
              onChangeText={setPickupQuery}
              placeholder="Enter pickup location"
              placeholderTextColor="#BBBBBB"
              className="flex-1 ml-3 text-[13px] font-poppins-medium"
              style={{ color: V5.navy }}
            />
            <Pressable onPress={() => openPickup('Search')}>
              <LinearGradient
                colors={[V5.peach, V5.amber]}
                style={{ width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center' }}
              >
                <Mic size={14} color="#0A0600" />
              </LinearGradient>
            </Pressable>
          </View>

          <View
            className="rounded-3xl px-4 py-4 mt-5"
            style={{ backgroundColor: '#F4EFD8', borderWidth: 1, borderColor: '#FFFFFFB0' }}
          >
            <Text className="text-[11px] font-poppins-semibold tracking-[1.2px]" style={{ color: '#D7A20C' }}>
              OUR ADS & OFFERS
            </Text>
            <View className="mt-2 flex-row items-center justify-between">
              <Text className="font-syne-bold text-[37px] leading-[39px]" style={{ color: V5.navy, flex: 1, paddingRight: 12 }}>
                Get 30% off your{`\n`}first Metro ride 🚇
              </Text>
              <Pressable
                onPress={() => openPickup('Claim Offer')}
                className="rounded-full px-4 py-3"
                style={{ backgroundColor: V5.navy }}
              >
                <Text className="text-[13px] font-syne-bold text-white">CLAIM NOW</Text>
              </Pressable>
            </View>
            <View className="flex-row items-center mt-3">
              <View className="w-4 h-1 rounded-full mr-1" style={{ backgroundColor: V5.amber }} />
              <View className="w-1.5 h-1.5 rounded-full mr-1" style={{ backgroundColor: '#E7D8A3' }} />
              <View className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#E7D8A3' }} />
            </View>
          </View>

          <View className="flex-row items-center justify-between" style={{ paddingHorizontal: 4, paddingTop: 14, paddingBottom: 10 }}>
            <Text className="font-syne-bold text-[17px]" style={{ color: V5.navy }}>Our Services</Text>
            <Pressable onPress={() => onOpenServices?.()}>
              <Text className="text-[11px] font-poppins-semibold" style={{ color: V5.amber }}>View all →</Text>
            </Pressable>
          </View>

          <View className="flex-row flex-wrap justify-between">
            <Pressable
              onPress={() => openPickup('Bus')}
              className="w-[48.6%] mb-3 rounded-2xl p-3 overflow-hidden"
              style={{ backgroundColor: '#EDF4E6', aspectRatio: 1, ...SHADOWS.tile }}
            >
              <Text className="absolute right-3 top-2 text-[10px]" style={{ color: '#BFD6A0' }}>↗</Text>
              <LinearGradient colors={[V5.olive, '#729E06']} className="w-12 h-12 rounded-2xl items-center justify-center mb-4 self-center" style={{ shadowColor: V5.olive, ...SHADOWS.icon }}>
                <Bus size={19} color="#FFFFFF" />
              </LinearGradient>
              <Text className="font-syne-bold text-[17px] leading-[20px] text-center" style={{ color: V5.navy }}>Bus</Text>
              <Text className="text-[12px] font-poppins-medium mt-1 text-center" style={{ color: V5.olive }}>Eco-friendly</Text>
            </Pressable>

            <Pressable
              onPress={() => openPickup('Metro')}
              className="w-[48.6%] mb-3 rounded-2xl p-3 overflow-hidden"
              style={{ backgroundColor: '#ECEFF8', aspectRatio: 1, ...SHADOWS.tile }}
            >
              <Text className="absolute right-3 top-2 text-[10px]" style={{ color: '#BFC8E8' }}>↗</Text>
              <LinearGradient colors={[V5.navy, V5.navy2]} className="w-12 h-12 rounded-2xl items-center justify-center mb-4 self-center" style={{ shadowColor: V5.navy2, ...SHADOWS.icon }}>
                <Train size={20} color="#FFFFFF" />
              </LinearGradient>
              <Text className="font-syne-bold text-[17px] leading-[20px] text-center" style={{ color: V5.navy }}>Metro</Text>
              <Text className="text-[12px] font-poppins-medium mt-1 text-center" style={{ color: V5.text2 }}>Fastest route</Text>
            </Pressable>

            <Pressable
              onPress={() => openPickup('Cab')}
              className="w-[48.6%] mb-3 rounded-2xl p-3 overflow-hidden"
              style={{ backgroundColor: '#F9F1DE', aspectRatio: 1, ...SHADOWS.tile }}
            >
              <Text className="absolute right-3 top-2 text-[10px]" style={{ color: '#EFD8A0' }}>↗</Text>
              <LinearGradient colors={[V5.peach, V5.amber]} className="w-12 h-12 rounded-2xl items-center justify-center mb-4 self-center" style={{ shadowColor: V5.amber, ...SHADOWS.icon }}>
                <Car size={19} color="#0A0600" />
              </LinearGradient>
              <Text className="font-syne-bold text-[17px] leading-[20px] text-center" style={{ color: V5.navy }}>Cab</Text>
              <Text className="text-[12px] font-poppins-medium mt-1 text-center" style={{ color: '#D39A11' }}>Door to door</Text>
            </Pressable>

            <Pressable
              onPress={() => openPickup('Multimode')}
              className="w-[48.6%] mb-3 rounded-2xl p-3 overflow-hidden"
              style={{ backgroundColor: '#E7F5FA', aspectRatio: 1, ...SHADOWS.tile }}
            >
              <Text className="absolute right-3 top-2 text-[10px]" style={{ color: '#9FD8E7' }}>↗</Text>
              <LinearGradient colors={[V5.cyan, '#28B4D8']} className="w-12 h-12 rounded-2xl items-center justify-center mb-4 self-center" style={{ shadowColor: V5.cyan, ...SHADOWS.icon }}>
                <Repeat2 size={19} color="#FFFFFF" />
              </LinearGradient>
              <Text className="font-syne-bold text-[17px] leading-[20px] text-center" style={{ color: V5.navy }}>Multimode</Text>
              <Text className="text-[12px] font-poppins-medium mt-1 text-center" style={{ color: V5.cyan }}>Smart combo</Text>
            </Pressable>
          </View>

          <Pressable
            onPress={() => openPickup('Book for Someone Else')}
            className="rounded-2xl px-3 py-3 mt-1 flex-row items-center"
            style={{ backgroundColor: 'rgba(251,248,242,0.45)', borderWidth: 1, borderColor: '#FFFFFF99' }}
          >
            <View className="w-[34px] h-[34px] rounded-[11px] items-center justify-center" style={{ backgroundColor: V5.amber }}>
              <Text className="text-[15px]">👥</Text>
            </View>
            <View className="ml-3 flex-1">
              <Text className="font-syne-bold text-[13px]" style={{ color: V5.navy }}>Book for Someone Else</Text>
              <Text className="text-[10px] font-poppins-medium text-[#AAAAAA]">Plan a ride for family</Text>
            </View>
            <View className="w-[26px] h-[26px] rounded-lg items-center justify-center" style={{ backgroundColor: '#122C6F14' }}>
              <Text className="text-[12px] font-syne-bold" style={{ color: V5.amber }}>→</Text>
            </View>
          </Pressable>

          <View className="h-6" />
        </View>
      </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

export default HomeScreen;
