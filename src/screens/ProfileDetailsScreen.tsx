import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, Alert } from 'react-native';

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
    <View className="flex-1 bg-[#F7F4EF] px-6 py-8">
      <View className="flex-row items-center justify-between mb-4">
        <Pressable onPress={() => onClose && onClose()} className="py-1 px-2">
          <Text className="text-[#0F766E]">Back</Text>
        </Pressable>
        <Text className="text-2xl font-poppins-semibold">Profile</Text>
        <View style={{ width: 48 }} />
      </View>

      <View className="mb-4 rounded-lg bg-white p-4 shadow-sm">
        <Text className="text-sm text-[#6B7280]">Phone</Text>
        <Text className="mt-1 text-lg font-poppins-regular">{phoneNumber}</Text>
      </View>

      <View className="mb-4 rounded-lg bg-white p-4 shadow-sm">
        <Text className="text-sm text-[#6B7280]">Full Name</Text>
        <TextInput
          placeholder="Enter full name"
          placeholderTextColor="#9CA3AF"
          className="mt-1 text-lg font-poppins-regular text-[#111827] p-0"
          value={fullName}
          onChangeText={setFullName}
        />
      </View>

      <View className="mb-6 rounded-lg bg-white p-4 shadow-sm">
        <Text className="text-sm text-[#6B7280]">Email</Text>
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
        className="mb-4 h-14 items-center justify-center rounded-2xl bg-[#0F766E]">
        <Text className="font-poppins-semibold text-white">Save</Text>
      </Pressable>

      <Pressable
        onPress={() => onLogout && onLogout()}
        className="mt-auto h-14 items-center justify-center rounded-2xl bg-[#111827]">
        <Text className="font-poppins-semibold text-white">Logout</Text>
      </Pressable>
    </View>
  );
}

export default ProfileDetailsScreen;
