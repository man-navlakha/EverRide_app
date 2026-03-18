import React from 'react';
import { ScrollView, Text, View } from 'react-native';

type ServiceItem = {
  label: string;
  icon: string;
  badge?: string;
  wide?: boolean;
};

const topServices: ServiceItem[] = [
  { label: 'Reserve', icon: '🗓️', badge: 'Promo', wide: true },
  { label: 'Trip', icon: '🚗', badge: '25%', wide: true },
];

const quickServices: ServiceItem[] = [
  { label: 'Auto', icon: '🛺' },
  { label: 'Bike', icon: '🏍️', badge: '₹9' },
  { label: 'Rentals', icon: '🚘', badge: '20%' },
  { label: 'Intercity buses', icon: '🚌' },
  { label: 'Intercity', icon: '🚕' },
  { label: 'Group ride', icon: '🚙' },
  { label: 'Seniors', icon: '🧓' },
  { label: 'Teens', icon: '🧍' },
];

const courierServices: ServiceItem[] = [
  { label: 'Send parcels', icon: '📦', badge: '25%', wide: true },
  { label: 'Store pick-up', icon: '🛍️', wide: true },
];

function Badge({ value }: { value: string }) {
  return (
    <View className="absolute top-[-10px] left-3 bg-[#F2391E] rounded-[10px] px-3 py-1">
      <Text className="text-white font-poppins-bold text-[12px]">{value}</Text>
    </View>
  );
}

function ServiceCard({ label, icon, badge, wide }: ServiceItem) {
  return (
    <View className={`${wide ? 'w-[48%] h-[125px]' : 'w-[23%] h-[125px]'} rounded-[18px] bg-[#ffffff]/60 backdrop-blur-lg border-2 border-white/80  px-3 pb-3 pt-5 mb-3 shadow-lg justify-between`}>
      {badge ? <Badge value={badge} /> : null}
      <Text className="text-[30px] text-center mt-2">{icon}</Text>
      <Text className="text-[#000000] font-poppins-semibold text-[11px] leading-[14px]">{label}</Text>
    </View>
  );
}

export function ServicesScreen() {
  return (
    <View className="flex-1 bg-[#ecedff]">
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="px-5 pt-8">
          <Text className="text-black font-syne-bold text-[48px] leading-[52px]">Services</Text>
          <Text className="text-[#d9d9d9] font-syne-semibold text-[23px] leading-[31px] mt-3 mb-5">
            Go anywhere, get anything
          </Text>

          <View className="flex-row justify-between">
            {topServices.map((item) => (
              <ServiceCard key={item.label} {...item} />
            ))}
          </View>

          <View className="flex-row flex-wrap justify-between">
            {quickServices.map((item) => (
              <ServiceCard key={item.label} {...item} />
            ))}
          </View>
        </View>

        <View className="h-[1px] bg-[#1D1F25] mt-3 mb-5" />

        <View className="px-5">
          <Text className="text-white font-syne-bold text-[42px] leading-[46px] mb-4">Get Courier to help</Text>
          <View className="flex-row justify-between">
            {courierServices.map((item) => (
              <ServiceCard key={item.label} {...item} />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default ServicesScreen;
