import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';

type Props = {
  onBack: () => void;
};

type Mode = 'main' | 'faq';

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

const faqCategories = [
  'Bus Pass',
  'About the app',
  'App Registration',
  'App Features',
  'Payment Related',
  'QR Code & Validation',
  'Journey Related',
  'Ticket Booking',
  'Security, Safety & Support',
];

const reportIssues = ['App Related', 'Pass Related', 'Report An Issue', 'Lost & Found'];

const faqItems: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'How do I download the EverRide app?',
    answer:
      'You can download EverRide for free from the Google Play Store (Android) and the Apple App Store (iOS). Just search for “EverRide”.',
  },
  {
    id: 'faq-2',
    question: 'How do I create an account on EverRide?',
    answer:
      'Open the app, tap Sign Up, enter your mobile number, verify OTP, and complete your profile details to create your account.',
  },
  {
    id: 'faq-3',
    question: 'Can I link family members under one account?',
    answer:
      'Yes, you can add family profiles in supported sections and manage rides/passes from one account where available.',
  },
  {
    id: 'faq-4',
    question: 'Do I need to create separate accounts in the UTS and CMRL apps?',
    answer:
      'No. A single registration on the EverRide app is sufficient to book both CMRL and suburban train tickets.',
  },
];

export function HelpSupportScreen({ onBack }: Props) {
  const [mode, setMode] = useState<Mode>('main');
  const [expandedIds, setExpandedIds] = useState<string[]>(['faq-1']);

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  if (mode === 'faq') {
    return (
      <View className="flex-1 bg-[#ecedff]">
        <View className="px-4 pt-5 pb-3 flex-row items-center justify-between border-b border-[#ffffff] bg-[#ecedff]">
          <View className="flex-row items-center">
            <Pressable onPress={() => setMode('main')} className="w-10 h-10 rounded-full bg-white items-center justify-center">
              <Text className="font-syne-bold text-[#111827] text-[18px]">←</Text>
            </Pressable>
            <Text className="ml-3 text-[#1E3A8A] font-syne-bold text-[16px]">Frequently Asked Questions</Text>
          </View>
          <View className="w-10 h-10" />
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
          <View className="px-4 pt-4">
            {faqItems.map((item) => {
              const expanded = expandedIds.includes(item.id);
              return (
                <View key={item.id} className="mb-3 rounded-3xl backdrop-blur-lg bg-[#ffffff] border-t border-[#ffffff]/80 overflow-hidden">
                  <Pressable
                    onPress={() => toggleExpanded(item.id)}
                    className="px-4 py-4 flex-row items-start justify-between bg-[#F3F4F6]"
                  >
                    <Text className="flex-1 pr-3 text-[#111827] text-[16px] leading-[24px] font-syne-bold">{item.question}</Text>
                    <Text className="text-[#6B7280] text-[20px]">{expanded ? '⌃' : '⌄'}</Text>
                  </Pressable>

                  {expanded ? (
                    <View className="px-4 py-4 bg-white">
                      <Text className="text-[#111827] text-[14px] leading-[22px] font-poppins-semibold">{item.answer}</Text>
                    </View>
                  ) : null}
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#ecedff]">
      <View className="px-4 pt-5 pb-3 flex-row items-center justify-between border-b border-[#ffffff] bg-[#ecedff]">
        <View className="flex-row items-center">
          <Pressable onPress={onBack} className="w-10 h-10 rounded-full bg-white items-center justify-center">
            <Text className="font-syne-bold text-[#111827] text-[18px]">←</Text>
          </Pressable>
          <Text className="ml-3 text-[#1E3A8A] font-syne-bold text-[16px]">Help and Support</Text>
        </View>
        <View className="w-10 h-10" />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="px-4 pt-4">
          <Text className="text-[#1E3A8A] text-[15px] font-syne-bold mb-3">Frequently Asked Questions</Text>

          <View className="rounded-3xl backdrop-blur-lg bg-[#ffffff] border-t border-[#ffffff]/80 overflow-hidden mb-6">
            {faqCategories.map((item, index) => (
              <Pressable
                key={item}
                onPress={() => setMode('faq')}
                className={`px-4 py-4 flex-row items-center justify-between ${index < faqCategories.length - 1 ? 'border-b border-[#F3F4F6]' : ''}`}
              >
                <View className="flex-row items-center flex-1 pr-3">
                  <Text className="text-[20px] mr-3">▦</Text>
                  <Text className="text-[#111827] text-[14px] font-poppins-semibold">{item}</Text>
                </View>
                <Text className="text-[#111827] text-[20px]">›</Text>
              </Pressable>
            ))}
          </View>

          <Text className="text-[#1E3A8A] text-[15px] font-syne-bold mb-3">Report an Issue</Text>

          <View className="rounded-3xl backdrop-blur-lg bg-[#ffffff] border-t border-[#ffffff]/80 overflow-hidden">
            {reportIssues.map((item, index) => (
              <Pressable
                key={item}
                className={`px-4 py-4 flex-row items-center justify-between ${index < reportIssues.length - 1 ? 'border-b border-[#F3F4F6]' : ''}`}
              >
                <View className="flex-row items-center flex-1 pr-3">
                  <Text className="text-[20px] mr-3">▦</Text>
                  <Text className="text-[#111827] text-[14px] font-poppins-semibold">{item}</Text>
                </View>
                <Text className="text-[#111827] text-[20px]">›</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default HelpSupportScreen;
