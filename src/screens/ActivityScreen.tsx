import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, ActivityIndicator, Platform } from 'react-native';

// Define types for our SDUI components
interface HeaderProps {
  title: string;
}

interface TabsProps {
  tabs: string[];
}

interface CardProps {
  hasMap?: boolean;
  icon?: string;
  title: string;
  dateTime: string;
  amount: string;
  currency?: string;
  status?: string;
}

interface JsonComponent {
  type: 'header' | 'tabs' | 'card';
  id?: string | number;
  title?: string;
  tabs?: string[];
  hasMap?: boolean;
  icon?: string;
  dateTime?: string;
  amount?: string;
  currency?: string;
  status?: string;
}

// This is a simplified SDUI component mapping.
// In a real app, these would be more complex and might be in separate files.
const componentMap: { [key: string]: React.FC<any> } = {
  header: ({ title }: HeaderProps) => (
    <View className="px-4 pt-5 pb-3 flex-row items-center justify-between border-b border-[#ffffff] bg-[#ecedff]">
      <Text className="ml-2 text-black font-syne-bold text-[22px]">{title}</Text>
      <Pressable className="w-10 h-10 rounded-full bg-white items-center justify-center">
        <Text className="font-syne-bold text-[#111827] text-[18px]">🔄</Text>
      </Pressable>
    </View>
  ),
  tabs: ({ tabs }: TabsProps) => (
    <View className="flex-row px-4 pt-4 pb-2 bg-[#ecedff]">
      {tabs.map((tab: string, index: number) => (
        <Pressable
          key={index}
          className={`px-4 py-2 rounded-full mr-2 ${
            tab === 'Past' ? 'bg-[#233F89]' : 'bg-white'
          }`}
        >
          <Text
            className={`font-poppins-semibold text-[14px] ${
              tab === 'Past' ? 'text-white' : 'text-[#1E3A8A]'
            }`}
          >
            {tab}
          </Text>
        </Pressable>
      ))}
    </View>
  ),
  card: ({ hasMap, icon, title, dateTime, amount, currency, status }: CardProps) => (
    <View className="bg-white rounded-2xl p-4 mb-4 mx-4">
      {hasMap && (
        <View className="mb-3">
          <Image
            // use bundled logo as a fallback placeholder (map image not present)
            source={require('../assets/logo.png')}
            className="w-full h-24 rounded-lg"
            resizeMode="cover"
          />
        </View>
      )}
      <View className="flex-row justify-between items-start">
        <View className="flex-row">
          {icon && (
            <View className="w-12 h-12 rounded-2xl bg-[#F4BE2A] items-center justify-center mr-4">
              <Text className="text-[22px]">{icon}</Text>
            </View>
          )}
          <View>
            <Text className="text-[#1E3A8A] text-[16px] font-syne-bold">{title}</Text>
            <Text className="text-gray-500 text-[12px] font-poppins-regular mt-1">{dateTime}</Text>
            <Text className="text-[#1E3A8A] text-[14px] font-poppins-semibold mt-1">
              {currency}{amount} {status && <Text className="text-red-500">· {status}</Text>}
            </Text>
          </View>
        </View>
        <Pressable className="self-center ml-2">
          <View className="px-4 py-2 rounded-full bg-[#ecedff]">
            <Text className="text-[#1E3A8A] font-poppins-semibold text-[12px]">Rebook</Text>
          </View>
        </Pressable>
      </View>
    </View>
  ),
};

const JsonRenderer = ({ json }: { json: JsonComponent }) => {
  const Component = componentMap[json.type];
  if (!Component) {
    return null;
  }
  return <Component {...json} />;
};

export function ActivityScreen() {
  const [activityData, setActivityData] = useState<JsonComponent[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      const remoteUrl = 'http://10.0.2.2:3000/v1/home/page/activity';
      const localUrl = Platform.OS === 'android' ? 'http://10.0.2.2:3000/v1/home/page/activity' : 'http://localhost:3000/v1/home/page/activity';
      try {
        // try remote first
        const res = await fetch(remoteUrl);
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const json = await res.json();
        const items = Array.isArray(json) ? json : json?.data ?? json?.items ?? [];
        if (mounted) setActivityData(items as JsonComponent[]);
      } catch (firstErr) {
        // on network failure try local development server (useful when running emulator)
        try {
          const res2 = await fetch(localUrl);
          if (!res2.ok) throw new Error(`${res2.status} ${res2.statusText}`);
          const json2 = await res2.json();
          const items2 = Array.isArray(json2) ? json2 : json2?.data ?? json2?.items ?? [];
          if (mounted) setActivityData(items2 as JsonComponent[]);
        } catch (secondErr: any) {
          if (mounted) setError(`Remote: ${String(firstErr)}; Local: ${String(secondErr)}`);
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
      <View className="flex-1 justify-center items-center bg-[#ecedff]">
        <ActivityIndicator size="large" color="#233F89" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-[#ecedff]">
        <Text className="text-red-500">Failed to load activity: {error}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#ecedff]">
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {(activityData ?? []).map((item, index) => (
          <JsonRenderer key={(item && (item.id ?? index)) as any} json={item as JsonComponent} />
        ))}
      </ScrollView>
    </View>
  );
}

export default ActivityScreen;
