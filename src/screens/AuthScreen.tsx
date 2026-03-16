import { Pressable, Text, TextInput, View } from 'react-native';
import { MOCK_TEST_OTP, MOCK_TEST_PHONE } from '../constants/mockAuth';

type AuthScreenProps = {
  mode: 'phone' | 'otp';
  phoneNumber: string;
  onChangePhone: (value: string) => void;
  onGetOtp: () => void;
  otp: string;
  onChangeOtp: (value: string) => void;
  onBack: () => void;
  onVerify: () => void;
  errorMessage: string;
};

export function AuthScreen({
  mode,
  phoneNumber,
  onChangePhone,
  onGetOtp,
  otp,
  onChangeOtp,
  onBack,
  onVerify,
  errorMessage,
}: AuthScreenProps) {
  const isOtp = mode === 'otp';

  return (
    <View className="flex-1 bg-[#F7F4EF]">
   
      <View className="flex-1 px-6 pt-14">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-syne-bold tracking-[1px] text-[#1C1F2A]">
              EVERRIDE
            </Text>
            <Text className="mt-1 font-raleway-medium text-[15px] text-[#6B7280]">
              Every ride, on time
            </Text>
          </View>
       
        </View>

       
      </View>

      <View className="rounded-t-[28px] bg-white px-6 pb-10 pt-6 shadow-2xl">
        <View className="mb-4 flex-row items-center justify-between">
          {isOtp ? (
            <Pressable onPress={onBack} className="h-8 w-8 items-center justify-center">
              <Text className="font-syne-semibold text-[18px] text-[#1C1F2A]">←</Text>
            </Pressable>
          ) : (
            <View className="h-8 w-8" />
          )}
          <Text className="font-syne-bold text-[28px] text-[#1C1F2A]">
            {isOtp ? 'OTP Verification' : 'Sign in / Sign up'}
          </Text>
          <View className="rounded-full border border-[#D7EFE6] bg-[#ECFDF3] px-3 py-1">
           
          </View>
        </View>

        {!isOtp ? (
          <>
            <View className="mb-4">
             
              <View className="flex-row items-center rounded-2xl border border-[#E7E1D6] bg-[#FFFCF7] px-3 py-3">
                <View className="mr-3 rounded-lg bg-[#F2E8DC] px-2 py-1">
                  
                </View>
                <Text className="mr-2 font-poppins-regular text-[16px] text-[#4B5563]">
                  +91
                </Text>
                <TextInput
                  placeholder="Enter phone number"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                  className="flex-1 font-poppins-regular text-[16px] text-[#111827]"
                  value={phoneNumber}
                  onChangeText={value =>
                    onChangePhone(value.replace(/\D/g, '').slice(0, 10))
                  }
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
                Continue
              </Text>
            </Pressable>

            <View className="mt-4 flex-row items-center justify-between">
              <Text className="font-poppins-light text-sm text-[#6B7280]">
                By continuing you agree to our Terms
              </Text>
              <Text className="font-poppins-medium text-sm text-[#0F766E]">Help</Text>
            </View>

            <View className="mt-5 rounded-xl border border-[#F1E6D8] bg-[#FFF7ED] p-3">
              <Text className="font-poppins-light text-sm text-[#6B5B4A]">
                Mock Test Data
              </Text>
              <Text className="font-poppins-regular text-sm text-[#8B6F4E]">
                Number: +91 {MOCK_TEST_PHONE}
              </Text>
              <Text className="font-poppins-regular text-sm text-[#8B6F4E]">
                OTP: {MOCK_TEST_OTP}
              </Text>
            </View>
          </>
        ) : (
          <>
            <View className="mb-2 flex-row justify-between gap-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <View
                  key={index}
                  className="h-12 flex-1 items-center justify-center rounded-xl border border-[#E7E1D6] bg-[#FFFCF7]">
                  <Text className="font-syne-semibold text-[18px] text-[#1C1F2A]">
                    {otp[index] ?? ''}
                  </Text>
                </View>
              ))}
            </View>

            <TextInput
              value={otp}
              onChangeText={value => onChangeOtp(value.replace(/\D/g, '').slice(0, 6))}
              keyboardType="number-pad"
              maxLength={6}
              className="h-0 w-0 opacity-0"
              autoFocus
            />

            <Text className="mt-3 text-center font-poppins-light text-[12px] text-[#8B6F4E]">
              OTP is sent to +91 {phoneNumber}
            </Text>
            <Text className="mt-1 text-center font-poppins-medium text-[12px] text-[#0F766E]">
              Resend in 00:56
            </Text>

            {errorMessage ? (
              <Text className="mt-3 text-center font-poppins-regular text-[12px] text-[#D14343]">
                {errorMessage}
              </Text>
            ) : null}

            <View className="mt-4 rounded-xl border border-[#F1E6D8] bg-[#FFF7ED] p-3">
              <Text className="mb-[6px] font-poppins-light text-[12px] text-[#6B5B4A]">
                Mock Test OTP
              </Text>
              <Text className="font-poppins-regular text-[14px] text-[#8B6F4E]">
                Use OTP: {MOCK_TEST_OTP}
              </Text>
            </View>

            <Pressable
              className={`mt-4 h-14 items-center justify-center rounded-2xl ${
                otp.length === 6 ? 'bg-[#0F766E]' : 'bg-[#D9D6D1]'
              }`}
              onPress={onVerify}>
              <Text
                className={`font-poppins-semibold text-[16px] ${
                  otp.length === 6 ? 'text-white' : 'text-[#6B7280]'
                }`}>
                Verify OTP
              </Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}
