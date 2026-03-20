import { useState } from 'react';
import { Pressable, Text, View, Image } from 'react-native';

const slides = [
  {
    id: '1',
    bgColor: '#2D35E8',
    accentColor: '#4B54FF',
    darkColor: '#1A1F8A',
    emoji: '🌆',
    title: 'Navigating City is\nEasy Now!',
    subtitle:
      'Experience fastest, connected ways to travel with all your options in one place.',
  },
  {
    id: '2',
    bgColor: '#1A3BA8',
    accentColor: '#2D55CC',
    darkColor: '#0F2270',
    emoji: '🚗',
    title: 'Book Rides in\nSeconds!',
    subtitle:
      'Choose from autos, cabs and bikes. Get picked up exactly where you are.',
  },
  {
    id: '3',
    bgColor: '#0F2677',
    accentColor: '#1A3EAA',
    darkColor: '#071540',
    emoji: '📍',
    title: 'Track Every\nJourney Live!',
    subtitle:
      'Share your live location with loved ones and arrive safely every time.',
  },
];

type Props = {
  onGetStarted: () => void;
};

export function OnboardingScreen({ onGetStarted }: Props) {
  const [index, setIndex] = useState(0);
  const current = slides[index];
  const isLast = index === slides.length - 1;

  const handleNext = () => {
    if (!isLast) {
      setIndex(index + 1);
    } else {
      onGetStarted();
    }
  };

  return (
    <View className="flex-1" style={{ backgroundColor: current.bgColor }}>

      {/* ── Decorative background blobs ── */}
      <View
        style={{
          position: 'absolute',
          width: 340,
          height: 340,
          borderRadius: 170,
          backgroundColor: current.accentColor,
          opacity: 0.35,
          top: -100,
          right: -100,
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: 220,
          height: 220,
          borderRadius: 110,
          backgroundColor: current.darkColor,
          opacity: 0.5,
          bottom: 260,
          left: -70,
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: 120,
          height: 120,
          borderRadius: 60,
          backgroundColor: current.accentColor,
          opacity: 0.25,
          bottom: 320,
          right: 20,
        }}
      />

      {/* ── Top bar: progress segments + Skip ── */}
      <View
        className="absolute left-0 right-0 top-12 z-10 flex-row items-center px-6"
        style={{ gap: 6 }}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 3,
              backgroundColor:
                i <= index ? '#FFFFFF' : 'rgba(255,255,255,0.30)',
            }}
          />
        ))}
        <Pressable
          onPress={onGetStarted}
          className="ml-4 rounded-full px-4 py-1"
          style={{ backgroundColor: 'rgba(255,255,255,0.18)' }}>
          <Text className="font-poppins-medium text-[13px] text-white">
            Skip
          </Text>
        </Pressable>
      </View>

      <View className="absolute top-24 left-0 right-0 z-10 items-center">
        <Image
          source={require('../assets/logo.png')}
          style={{ width: 42, height: 42, tintColor: '#FFFFFF', opacity: 0.9 }}
          resizeMode="contain"
        />
      </View>

      {/* ── Illustration ── */}
      <View className="flex-1 items-center justify-center">
        {/* Outer glow ring */}
        <View
          style={{
            width: 240,
            height: 240,
            borderRadius: 120,
            backgroundColor: 'rgba(255,255,255,0.10)',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {/* Mid ring */}
          <View
            style={{
              width: 180,
              height: 180,
              borderRadius: 90,
              backgroundColor: 'rgba(255,255,255,0.14)',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {/* Inner circle */}
            <View
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: 'rgba(255,255,255,0.22)',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{ fontSize: 60, lineHeight: 72 }}>
                {current.emoji}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* ── Bottom white card ── */}
      <View
        className="rounded-t-[36px] bg-white px-7 pb-12 pt-8"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -6 },
          shadowOpacity: 0.08,
          shadowRadius: 20,
          elevation: 20,
        }}>

        {/* Slide counter */}
        <Text className="mb-2 font-poppins-medium text-[13px] text-[#9CA3AF]">
          {String(index + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
        </Text>

        {/* Title */}
        <Text className="mb-3 font-syne-bold text-[28px] leading-[38px] text-[#1E1F24]">
          {current.title}
        </Text>

        {/* Subtitle */}
        <Text className="mb-8 font-poppins-regular text-[15px] leading-[26px] text-[#6B7280]">
          {current.subtitle}
        </Text>

        {/* Dots + CTA row */}
        <View className="flex-row items-center justify-between">
          {/* Dots */}
          <View className="flex-row items-center" style={{ gap: 6 }}>
            {slides.map((_, i) => (
              <View
                key={i}
                style={{
                  height: 8,
                  width: i === index ? 28 : 8,
                  borderRadius: 4,
                  backgroundColor:
                    i === index ? current.bgColor : '#E5E7EB',
                }}
              />
            ))}
          </View>

          {/* Round arrow / check button */}
          <Pressable
            onPress={handleNext}
            style={{ backgroundColor: current.bgColor }}
            className="h-[56px] w-[56px] items-center justify-center rounded-full"
            android_ripple={{ color: 'rgba(255,255,255,0.25)', borderless: true }}>
            <Text style={{ fontSize: 22, color: '#FFFFFF' }}>
              {isLast ? '✓' : '→'}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
