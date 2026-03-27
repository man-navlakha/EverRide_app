import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, Alert } from 'react-native';
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
  phoneNumber: string;
  onLogout: () => void;
  onClose?: () => void;
  initialFullName?: string;
  initialEmail?: string;
  onSave?: (data: { fullName: string; email: string }) => void;
};

export function ProfileDetailsScreen({
  phoneNumber,
  onLogout,
  onClose,
  initialFullName = '',
  initialEmail = '',
  onSave,
}: Props) {
  // local state
  const [fullName, setFullName] = useState(initialFullName);
  const [email, setEmail] = useState(initialEmail);

  const handleSave = () => {
    if (!fullName.trim() || !email.trim()) {
      Alert.alert('Missing data', 'Please provide full name and email.');
      return;
    }

    if (onSave) {
      onSave({ fullName: fullName.trim(), email: email.trim() });
    }

    Alert.alert('Saved', 'Profile changes saved.');
  };
  return (
    <LinearGradient colors={[COLORS.gradientTop, COLORS.gradientBottom]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
    <View className="flex-1 px-6 py-8">
      <View className="flex-row items-center justify-between mb-4">
        <Pressable onPress={() => onClose && onClose()} className="py-1 px-2">
          <Text style={{ color: COLORS.navy }}>Back</Text>
        </Pressable>
        <Text className="text-2xl font-poppins-semibold" style={{ color: COLORS.navy }}>Profile</Text>
        <View style={{ width: 48 }} />
      </View>

      <View className="mb-4 rounded-lg p-4 shadow-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
        <Text className="text-sm" style={{ color: COLORS.textGray }}>Phone</Text>
        <Text className="mt-1 text-lg font-poppins-regular">{phoneNumber}</Text>
      </View>

      <View className="mb-4 rounded-lg p-4 shadow-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
        <Text className="text-sm" style={{ color: COLORS.textGray }}>Full Name</Text>
        <TextInput
          placeholder="Enter full name"
          placeholderTextColor="#9CA3AF"
          className="mt-1 text-lg font-poppins-regular text-[#111827] p-0"
          value={fullName}
          onChangeText={setFullName}
        />
      </View>

      <View className="mb-6 rounded-lg p-4 shadow-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
        <Text className="text-sm" style={{ color: COLORS.textGray }}>Email</Text>
        <TextInput
          placeholder="Enter email"
          placeholderTextColor="#9CA3AF"
          keyboardType="email-address"
          className="mt-1 text-lg font-poppins-regular text-[#111827] p-0"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
      </View>

      <Pressable
        onPress={() => handleSave()}
        className="mb-4 h-14 items-center justify-center rounded-2xl"
        style={{ backgroundColor: COLORS.navy }}>
        <Text className="font-poppins-semibold text-white">Save</Text>
      </Pressable>

      <Pressable
        onPress={() => onLogout && onLogout()}
        className="mt-auto h-14 items-center justify-center rounded-2xl"
        style={{ backgroundColor: COLORS.gold }}>
        <Text className="font-poppins-semibold text-[#111827]">Logout</Text>
      </Pressable>
    </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

export default ProfileDetailsScreen;
