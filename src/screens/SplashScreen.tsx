import { ActivityIndicator, Image, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  gradientTop: '#F8F4ED',
  gradientBottom: '#E8DFD1',
  navy: '#0C1E5B',
  gold: '#F4B000',
};

export function SplashScreen() {
  return (
    <LinearGradient colors={[COLORS.gradientTop, COLORS.gradientBottom]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
    <View className="flex-1 items-center justify-center">
       <Image
        source={require('../assets/logo.png')}
        style={{ width: 180, height: 78 }}
        resizeMode="contain"
      />
      <Text className="font-syne-bold text-[25px] tracking-[3px]" style={{ color: COLORS.navy }}>
        EVERRIDE
      </Text>
      <ActivityIndicator size="small" color={COLORS.gold} style={{ marginTop: 16 }} />
    </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
