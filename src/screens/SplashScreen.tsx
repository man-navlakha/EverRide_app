import { Text, View } from 'react-native';
import Spinner from 'react-native-spinkit';

export function SplashScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="font-syne-bold text-[20px] tracking-[1px] text-[#1C1F2A]">
        EVERRIDE
      </Text>
      {/* <Spinner type="Circle" size={50} color="#1C7ED6" /> */}
    </View>
  );
}
