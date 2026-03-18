import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, Animated, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Foundation from 'react-native-vector-icons/Foundation';
import { ReceiptIndianRupee, ReceiptText } from 'lucide-react-native';

type Tab = 'Home' | 'Services' | 'Activity' | 'Account';

type Props = {
  active?: Tab;
  onTabPress?: (tab: Tab) => void;
  activeColor?: string;
  inactiveColor?: string;
};

export function BottomBar({ active = 'Home', onTabPress, activeColor = '#EDAB0C', inactiveColor = '#7F8692' }: Props) {
  const tabs: Tab[] = ['Home', 'Services', 'Activity', 'Account'];
  const indicatorWidth = 64;
  const [barWidth, setBarWidth] = useState(Dimensions.get('window').width);
  const indicatorX = useRef(new Animated.Value(0)).current;

  const getIndicatorPosition = (tab: Tab, width: number) => {
    const index = tabs.indexOf(tab);
    const tabWidth = width / tabs.length;
    return index * tabWidth + (tabWidth - indicatorWidth) / 2;
  };

  useEffect(() => {
    Animated.spring(indicatorX, {
      toValue: getIndicatorPosition(active, barWidth),
      useNativeDriver: true,
      damping: 20,
      stiffness: 220,
      mass: 0.7,
    }).start();
  }, [active, barWidth, indicatorX]);

  const TabItem = ({
    tab,
    label,
    icon,
    showActiveDot = false,
  }: {
    tab: Tab;
    label: string;
    icon: (isActive: boolean, color: string) => React.ReactNode;
    showActiveDot?: boolean;
  }) => {
    const isActive = active === tab;
    const color = isActive ? activeColor : inactiveColor;
    return (
      <Pressable onPress={() => onTabPress && onTabPress(tab)} className="flex-1 h-full items-center justify-center relative">
        <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          {icon(isActive, color)}
          {showActiveDot && isActive ? (
            <View
              style={{
                position: 'absolute',
                top: 4,
                right: 0,
                width: 7,
                height: 7,
                borderRadius: 3.5,
                backgroundColor: '#2D8CFF',
              }}
            />
          ) : null}
        </View>
        <Text className="text-xs font-poppins-semibold mt-0.5" style={{ color }}>{label}</Text>
      </Pressable>
    );
  };

  return (
    <View
      onLayout={(event) => setBarWidth(event.nativeEvent.layout.width)}
      className="absolute left-0 right-0 bottom-0 backdrop-blur-lg bg-[#ecedff] border-t border-[#ffffff]/80 h-[82px] pb-3 shadow-lg flex-row items-stretch"
    >
      <Animated.View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 0,
          width: indicatorWidth,
          height: 4,
          borderRadius: 999,
          backgroundColor: '#EDAB0C',
          shadowColor: '#EDAB0C',
          shadowOpacity: 0.35,
          shadowRadius: 5,
          shadowOffset: { width: 0, height: 2 },
          elevation: 2,
          transform: [{ translateX: indicatorX }],
        }}
      />
      <TabItem
        tab="Home"
        label="Home"
        icon={(_, color) => <Foundation name="home" size={22} color={color} />}
      />
      <TabItem
        tab="Services"
        label="Services"
        icon={(_, color) => <Fontisto name="nav-icon-grid" size={18} color={color} />}
      />
      <TabItem
        tab="Activity"
        label="Activity"
        icon={(isActive, color) =>
          isActive ? (
            <ReceiptIndianRupee size={20} color={color} strokeWidth={2} />
          ) : (
            <ReceiptText size={20} color={color} strokeWidth={2} />
          )
        }
      />
      <TabItem
        tab="Account"
        label="Account"
        icon={(isActive, color) => (
          <Ionicons
            name={isActive ? 'person-circle' : 'person-circle-outline'}
            size={22}
            color={color}
          />
        )}
        showActiveDot
      />
    </View>
  );
}

export default BottomBar;
