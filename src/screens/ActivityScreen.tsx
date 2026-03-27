import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Platform, Image } from 'react-native';
import { Bus, Car, Clock3, MapPin, Repeat2, Sparkles, Train } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type RideStatus = 'Live' | 'Completed';

type RideItem = {
  id: string;
  routeName: string;
  from: string;
  to: string;
  fare: number;
  etaMinutes: number;
  updatedAt: string;
  status: RideStatus;
};

type Props = {
  onOpenProfile?: () => void;
};

const seededRides: RideItem[] = [
  { id: 'seed-1', routeName: 'Sector 62 → Connaught Place', from: 'Noida Sector 62', to: 'Connaught Place', fare: 185, etaMinutes: 34, updatedAt: '2 min ago', status: 'Live' },
  { id: 'seed-2', routeName: 'Huda City → Cyber Hub', from: 'Huda City', to: 'Cyber Hub', fare: 142, etaMinutes: 27, updatedAt: '1 min ago', status: 'Live' },
  { id: 'seed-3', routeName: 'Viman Nagar → Shivajinagar', from: 'Viman Nagar', to: 'Shivajinagar', fare: 126, etaMinutes: 23, updatedAt: 'Just now', status: 'Live' },
  { id: 'seed-4', routeName: 'Electronic City → MG Road', from: 'Electronic City', to: 'MG Road', fare: 198, etaMinutes: 38, updatedAt: '4 min ago', status: 'Live' },
  { id: 'seed-5', routeName: 'Salt Lake → Park Street', from: 'Salt Lake', to: 'Park Street', fare: 134, etaMinutes: 29, updatedAt: '3 min ago', status: 'Live' },
  { id: 'seed-6', routeName: 'Andheri East → BKC', from: 'Andheri East', to: 'BKC', fare: 156, etaMinutes: 31, updatedAt: '2 min ago', status: 'Live' },
  { id: 'seed-7', routeName: 'Kondapur → HiTech City', from: 'Kondapur', to: 'HiTech City', fare: 118, etaMinutes: 22, updatedAt: '5 min ago', status: 'Live' },
  { id: 'seed-8', routeName: 'Velachery → T Nagar', from: 'Velachery', to: 'T Nagar', fare: 121, etaMinutes: 25, updatedAt: '6 min ago', status: 'Live' },
  { id: 'seed-9', routeName: 'Paldi → CG Road', from: 'Paldi', to: 'CG Road', fare: 109, etaMinutes: 21, updatedAt: '8 min ago', status: 'Completed' },
  { id: 'seed-10', routeName: 'Alkapuri → Railway Station', from: 'Alkapuri', to: 'Railway Station', fare: 98, etaMinutes: 19, updatedAt: '11 min ago', status: 'Completed' },
  { id: 'seed-11', routeName: 'Gachibowli → Raidurg', from: 'Gachibowli', to: 'Raidurg', fare: 132, etaMinutes: 24, updatedAt: '7 min ago', status: 'Live' },
  { id: 'seed-12', routeName: 'Baner → Pune Station', from: 'Baner', to: 'Pune Station', fare: 149, etaMinutes: 33, updatedAt: '9 min ago', status: 'Live' },
];

const normalizeApiRides = (payload: any): RideItem[] => {
  const items = Array.isArray(payload) ? payload : payload?.data ?? payload?.items ?? [];
  if (!Array.isArray(items)) return [];

  return items
    .map((entry: any, index: number): RideItem => {
      const title = typeof entry?.title === 'string' ? entry.title : `Route ${index + 1}`;
      const amountRaw = Number(entry?.amount);
      const amount = Number.isFinite(amountRaw) && amountRaw > 0 ? amountRaw : 90 + ((index * 13) % 120);
      const etaRaw = Number(entry?.etaMinutes);
      const eta = Number.isFinite(etaRaw) && etaRaw > 0 ? etaRaw : 15 + (index % 20);
      const status = String(entry?.status ?? '').toLowerCase() === 'completed' ? 'Completed' : 'Live';

      return {
        id: String(entry?.id ?? `live-${index + 1}`),
        routeName: title,
        from: typeof entry?.from === 'string' ? entry.from : 'Pickup Point',
        to: typeof entry?.to === 'string' ? entry.to : 'Drop Point',
        fare: amount,
        etaMinutes: eta,
        updatedAt: typeof entry?.dateTime === 'string' ? entry.dateTime : 'Just now',
        status,
      };
    })
    .filter((item) => item.routeName.trim().length > 0);
};

const fetchJsonWithTimeout = async (url: string, timeoutMs = 4500) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
};

export function ActivityScreen({ onOpenProfile }: Props) {
  const [rides, setRides] = useState<RideItem[]>(seededRides);
  const [loading, setLoading] = useState(true);
  const [liveSource, setLiveSource] = useState<'remote' | 'local' | 'seed'>('seed');

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      const remoteUrl = 'http://10.0.2.2:3000/v1/home/page/activity';
      const localUrl = Platform.OS === 'android' ? 'http://10.0.2.2:3000/v1/home/page/activity' : 'http://localhost:3000/v1/home/page/activity';
      try {
        const json = await fetchJsonWithTimeout(remoteUrl, 4500);
        const liveRides = normalizeApiRides(json);
        if (mounted) {
          const merged = [...liveRides, ...seededRides].slice(0, 12);
          setRides(merged);
          setLiveSource(liveRides.length > 0 ? 'remote' : 'seed');
        }
      } catch (firstErr) {
        try {
          const json2 = await fetchJsonWithTimeout(localUrl, 3000);
          const liveRides2 = normalizeApiRides(json2);
          if (mounted) {
            const merged = [...liveRides2, ...seededRides].slice(0, 12);
            setRides(merged);
            setLiveSource(liveRides2.length > 0 ? 'local' : 'seed');
          }
        } catch {
          if (mounted) {
            setRides(seededRides);
            setLiveSource('seed');
          }
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View className="flex-1 justify-center items-center bg-[#ecedff]">
          <ActivityIndicator size="large" color="#233F89" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
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
        <View className="px-4 pt-4 pb-2 bg-[#ecedff]">
          <View className="rounded-3xl p-4 bg-[#233F89] mb-3">
            <View className="self-start px-3 py-1 rounded-full border border-[#6E83C3] bg-[#274A9E] mb-3 flex-row items-center" style={{ gap: 4 }}>
              <Sparkles size={11} color="#E8EDFF" />
              <Text className="text-[#E8EDFF] text-[10px] font-poppins-medium tracking-[0.3px]">ACTIVE RIDES</Text>
            </View>
            <Text className="text-white font-syne-bold text-[20px] leading-[26px]">Live Multitransport Journey Feed</Text>
            <Text className="text-[#D7E2FF] text-[12px] mt-1 font-poppins-medium">Showing {rides.length} rides · source: {liveSource}</Text>
          </View>

          <View className="flex-row">
            <View className="px-4 py-2 rounded-full mr-2 bg-[#233F89]">
              <Text className="font-poppins-semibold text-[14px] text-white">Active</Text>
            </View>
            <View className="px-4 py-2 rounded-full mr-2 bg-white">
              <Text className="font-poppins-semibold text-[14px] text-[#1E3A8A]">Past</Text>
            </View>
          </View>
        </View>

        {rides.map((ride) => (
          <View key={ride.id} className="bg-white rounded-2xl p-4 mb-4 mx-4 border border-[#E5E7EB]">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-[#1E3A8A] text-[16px] font-syne-bold flex-1" numberOfLines={1}>{ride.routeName}</Text>
              <View className={`px-2.5 py-1 rounded-full ${ride.status === 'Live' ? 'bg-[#DBEAFE]' : 'bg-[#E5E7EB]'}`}>
                <Text className={`text-[10px] font-poppins-semibold ${ride.status === 'Live' ? 'text-[#1E3A8A]' : 'text-[#4B5563]'}`}>{ride.status}</Text>
              </View>
            </View>

            <View className="flex-row items-center justify-between mt-1 mb-2">
              <MapPin size={16} color="#7C9A14" />
              <View className="flex-1 h-[1px] bg-[#BFDBFE] mx-2" />
              <Bus size={16} color="#7C9A14" />
              <View className="flex-1 h-[1px] bg-[#BFDBFE] mx-2" />
              <Train size={16} color="#1E3A8A" />
              <View className="flex-1 h-[1px] bg-[#BFDBFE] mx-2" />
              <Car size={16} color="#F4BE2A" />
              <View className="flex-1 h-[1px] bg-[#BFDBFE] mx-2" />
              <MapPin size={16} color="#1E3A8A" />
            </View>

            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-[#6B7280] text-[11px] font-poppins-medium flex-1" numberOfLines={1}>{ride.from}</Text>
              <Text className="text-[#6B7280] text-[11px] font-poppins-medium flex-1 text-right" numberOfLines={1}>{ride.to}</Text>
            </View>

            <View className="flex-row items-center justify-between mt-1">
              <Text className="text-[#1E3A8A] text-[14px] font-poppins-semibold">₹{ride.fare}</Text>
              <View className="flex-row items-center" style={{ gap: 4 }}>
                <Clock3 size={14} color="#6B7280" />
                <Text className="text-[#6B7280] text-[12px] font-poppins-medium">ETA {ride.etaMinutes} min · {ride.updatedAt}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
    </SafeAreaView>
  );
}

export default ActivityScreen;
