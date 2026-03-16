import React from 'react';
import { View, Text, Pressable } from 'react-native';

type Tab = 'Home' | 'Passes' | 'Live' | 'Profile';

type Props = {
  active?: Tab;
  onTabPress?: (tab: Tab) => void;
  activeColor?: string;
  inactiveColor?: string;
};

export function BottomBar({ active = 'Home', onTabPress, activeColor = '#FFD400', inactiveColor = '#9B9B9B' }: Props) {
  const TabItem = ({ tab, label, icon }: { tab: Tab; label: string; icon: string }) => {
    const isActive = active === tab;
    const color = isActive ? activeColor : inactiveColor;
    return (
      <Pressable onPress={() => onTabPress && onTabPress(tab)} className="items-center">
        <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color }}>{icon}</Text>
        </View>
        <Text className="text-xs" style={{ color }}>{label}</Text>
      </Pressable>
    );
  };

  return (
    <View className="absolute left-0 right-0 bottom-0 bg-white border-t border-gray-200 h-16 flex-row items-center justify-around">
      <TabItem tab="Home" label="Home" icon="🏠" />
      <TabItem tab="Passes" label="Passes" icon="🎟️" />
      <TabItem tab="Live" label="Live" icon="📍" />
      <TabItem tab="Profile" label="Profile" icon="👤" />
    </View>
  );
}

export default BottomBar;
