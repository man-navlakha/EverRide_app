import { Pressable, Text, TextInput, View } from 'react-native';
import { MOCK_TEST_OTP, MOCK_TEST_PHONE } from '../constants/mockAuth';

type LoginScreenProps = {
  phoneNumber: string;
  onChangePhone: (value: string) => void;
  onGetOtp: () => void;
  errorMessage: string;
};

export function LoginScreen({
  phoneNumber,
  onChangePhone,
  onGetOtp,
  errorMessage,
}: LoginScreenProps) {
  return (
    <View className="flex-1 bg-[#F7F4EF]">
    
      <View className="flex-1 px-6 pt-14">
        <View className="flex-row items-center justify-center">
          <View>
            <Text className="text-3xl font-black font-syne tracking-[1px] text-[#1C1F2A]">
              EVERRIDE
            </Text>
            <Text className="mt-1 font-raleway-medium text-[15px] text-[#6B7280]">
              Every ride, on time
            </Text>
          </View>
          
        </View>

       
      </View>

      <View className="rounded-t-[48px] bg-white px-6 pb-10 pt-6 shadow-2xl">
        <View className="my-6 flex-row items-center justify-center">
          <Text className="font-syne-bold text-[18px] text-[#1C1F2A]">
            Sign in / Sign up
          </Text>
        
        </View>

        <View className="mb-4">
         
          <View className="flex-row items-center rounded-2xl border border-[#E7E1D6] bg-[#FFFCF7] px-3 py-3">
          
            <Text className="mr-2 font-poppins-regular text-[16px] text-[#4B5563]">+91</Text>
            <TextInput
              placeholder="Enter phone number"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
              className="flex-1 font-poppins-regular text-[16px] text-[#111827]"
              value={phoneNumber}
              onChangeText={value => onChangePhone(value.replace(/\D/g, '').slice(0, 10))}
              maxLength={10}
            />
          </View>
        </View>

        {errorMessage ? (
          <Text className="mb-3 text-center text-sm font-poppins-regular text-[#D14343]">
            {errorMessage}
          </Text>
        ) : null}

        <Pressable
          onPress={onGetOtp}
          className={`h-14 items-center justify-center rounded-2xl ${
            phoneNumber.length === 10 ? 'bg-[#0F766E]' : 'bg-[#D9D6D1]'
          }`}>
          <Text
            className={`font-poppins-semibold text-[16px] ${
              phoneNumber.length === 10 ? 'text-white' : 'text-[#6B7280]'
            }`}>
            Get OTP
          </Text>
        </Pressable>

        <View className="mt-4 flex-row items-center justify-between">
          <Text className="font-poppins-light text-sm text-[#6B7280]">
            By continuing you agree to our Terms
          </Text>
          <Text className="font-poppins-medium text-sm text-[#0F766E]">Help</Text>
        </View>

        <View className="mt-5 rounded-xl border border-[#F1E6D8] bg-[#FFF7ED] p-3">
          <Text className="font-poppins-light text-sm text-[#6B5B4A]">Mock Test Data</Text>
          <Text className="font-poppins-regular text-sm text-[#8B6F4E]">
            Number: +91 {MOCK_TEST_PHONE}
          </Text>
          <Text className="font-poppins-regular text-sm text-[#8B6F4E]">
            OTP: {MOCK_TEST_OTP}
          </Text>
        </View>
      </View>
    </View>
  );
}

