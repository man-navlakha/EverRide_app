import { ActivityIndicator, Image, Text, View } from 'react-native';

export function SplashScreen() {
  return (
    <View className="flex-1 items-center justify-center">
       <Image
        source={require('../assets/logo.png')}
        style={{ width: 180, height: 48 }}
        resizeMode="contain"
      />
      <Text className="font-syne-bold text-[20px] tracking-[1px] text-[#1C1F2A]">
        EVERRIDE
      </Text>
      <ActivityIndicator size="small" color="#1C7ED6" style={{ marginTop: 16 }} />
    </View>
  );
}
