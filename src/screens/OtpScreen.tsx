import { Pressable, Text, TextInput, View } from 'react-native';
import { MOCK_TEST_OTP } from '../constants/mockAuth';

type OtpScreenProps = {
  otp: string;
  onChangeOtp: (value: string) => void;
  onBack: () => void;
  onVerify: () => void;
  phoneNumber: string;
  errorMessage: string;
};

export function OtpScreen({
  otp,
  onChangeOtp,
  onBack,
  onVerify,
  phoneNumber,
  errorMessage,
}: OtpScreenProps) {
  return (
    <View className="flex-1 bg-[#F7F4EF]">
 
      <View className="flex-1 px-6 pt-14">
        <View className="flex-row items-center justify-between">
       
          <Text className="font-syne-bold text-[20px] tracking-[1px] text-[#1C1F2A]">
            EVERRIDE
          </Text>
          <View className="h-10 w-10" />
        </View>

      </View>

      <View className="rounded-t-[28px] bg-white px-6 pb-10 pt-6 shadow-2xl">
          <View className="rounded-full border border-[#D7EFE6] bg-[#ECFDF3] px-3 py-1">
             <Pressable onPress={onBack} className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
            <Text className="font-syne-semibold text-[18px] text-[#1C1F2A]">←</Text>
          </Pressable>
          </View>
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="font-syne-semibold text-[18px] text-[#1C1F2A]">
            Enter OTP
          </Text>
        </View>

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
      </View>
    </View>
  );
}
