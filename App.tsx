/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import { Alert, BackHandler, Platform, StatusBar, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MOCK_TEST_OTP, MOCK_TEST_PHONE } from './src/constants/mockAuth';
import { AuthScreen } from './src/screens/AuthScreen';
import { ProfileDetailsScreen } from './src/screens/ProfileDetailsScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { ServicesScreen } from './src/screens/ServicesScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import BottomBar from './src/components/BottomBar';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { SplashScreen } from './src/screens/SplashScreen';
import { ActivityScreen } from './src/screens/ActivityScreen';
import PickupScreen from './src/screens/PickupScreen';
import MultiTransportScreen from './src/screens/MultiTransportScreen';
import AboutUsScreen from './src/screens/AboutUsScreen';
import FavouritesScreen from './src/screens/FavouritesScreen';
import HelpSupportScreen from './src/screens/HelpSupportScreen';
import MyRidesScreen from './src/screens/MyRidesScreen';
import ComingSoonScreen from './src/screens/ComingSoonScreen';

type InitialAuth = {
  isLoggedIn: boolean;
  phoneNumber: string;
  profile: { fullName: string; email: string };
};

type AccountScreen =
  | 'profile'
  | 'about'
  | 'favourites'
  | 'help-support'
  | 'my-rides'
  | 'preferences'
  | 'transit-preferences'
  | 'share-with-friends'
  | 'safety'
  | 'app-language';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [screen, setScreen] = useState<'splash' | 'onboarding' | 'app'>('splash');
  const [splashDone, setSplashDone] = useState(false);
  const [initialAuth, setInitialAuth] = useState<InitialAuth | null>(null);

  useEffect(() => {
    let mounted = true;
    const timer = setTimeout(() => setSplashDone(true), 3000);

    (async () => {
      let profile = { fullName: '', email: '' };
      let isLoggedIn = false;
      let phoneNumber = '';

      try {
        const storedProfile = await AsyncStorage.getItem('@EverRide:profile');
        const storedLogged = await AsyncStorage.getItem('@EverRide:isLoggedIn');
        const storedPhone = await AsyncStorage.getItem('@EverRide:phoneNumber');

        if (storedProfile) profile = JSON.parse(storedProfile);
        if (storedPhone) phoneNumber = storedPhone;
        if (storedLogged === '1') isLoggedIn = true;
      } catch (e) {
        console.warn('Failed loading stored auth', e);
      }

      if (mounted) {
        setInitialAuth({ isLoggedIn, phoneNumber, profile });
      }
    })();

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!splashDone || !initialAuth) return;
    setScreen(initialAuth.isLoggedIn ? 'app' : 'onboarding');
  }, [splashDone, initialAuth]);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {screen === 'splash' && <SplashScreen />}
      {screen === 'onboarding' && (
        <OnboardingScreen onGetStarted={() => setScreen('app')} />
      )}
      {screen === 'app' && initialAuth && <AppContent initialAuth={initialAuth} />}
    </SafeAreaProvider>
  );
}

function AppContent({ initialAuth }: { initialAuth: InitialAuth }) {
  const [activeScreen, setActiveScreen] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState(initialAuth.phoneNumber);
  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [isLoggedIn, setIsLoggedIn] = useState(initialAuth.isLoggedIn);
  const [showProfile, setShowProfile] = useState(false);
  const [showPickup, setShowPickup] = useState(false);
  const [showMultiTransport, setShowMultiTransport] = useState(false);
  const [accountScreen, setAccountScreen] = useState<AccountScreen>('profile');
  const [selectedPickup, setSelectedPickup] = useState<{ label: string; center?: number[] } | null>(null);
  const [activeTab, setActiveTab] = useState<'Home' | 'Services' | 'Activity' | 'Account'>('Home');
  const [verified, setVerified] = useState(false);
  const [profile, setProfile] = useState(initialAuth.profile);

  useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }

    const onBackPress = () => {
      if (!isLoggedIn) {
        if (activeScreen === 'otp') {
          setOtp('');
          setErrorMessage('');
          setActiveScreen('phone');
          return true;
        }
        return false;
      }

      if (showProfile) {
        setShowProfile(false);
        return true;
      }

      if (showMultiTransport) {
        setShowMultiTransport(false);
        return true;
      }

      if (showPickup) {
        setShowPickup(false);
        return true;
      }

      if (activeTab === 'Account' && accountScreen !== 'profile') {
        setAccountScreen('profile');
        return true;
      }

      if (activeTab !== 'Home') {
        setActiveTab('Home');
        setAccountScreen('profile');
        return true;
      }

      return false;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [
    activeScreen,
    accountScreen,
    activeTab,
    isLoggedIn,
    showMultiTransport,
    showPickup,
    showProfile,
  ]);

  const handleGetOtp = () => {
    const normalizedPhone = phoneNumber.replace(/\D/g, '');

    if (normalizedPhone.length !== 10) {
      setErrorMessage('Enter a valid 10-digit phone number.');
      return;
    }

    if (normalizedPhone !== MOCK_TEST_PHONE) {
      setErrorMessage(`Use test number ${MOCK_TEST_PHONE} for mock OTP verification.`);
      return;
    }

    setErrorMessage('');
    setActiveScreen('otp');
  };

  const handleVerifyOtp = () => {
    console.log('handleVerifyOtp called, otp=', otp, 'profile=', profile);
    if (otp.length !== 6) {
      setErrorMessage('Enter 6-digit OTP.');
      return;
    }

    if (otp !== MOCK_TEST_OTP) {
      setErrorMessage('Invalid OTP. Use the test OTP shown below.');
      return;
    }

    setErrorMessage('');
    console.log('OTP matches mock, proceeding to verified flow');
    Alert.alert('OTP Verified', 'OTP matched. Proceeding.');
    setVerified(true);

    (async () => {
      try {
        await AsyncStorage.setItem('@EverRide:phoneNumber', phoneNumber || '');
        if (profile.fullName && profile.email) {
          await AsyncStorage.setItem('@EverRide:isLoggedIn', '1');
          setIsLoggedIn(true);
          setShowProfile(false);
        } else {
          setShowProfile(true);
        }
      } catch (e) {
        console.warn('Error saving login state', e);
      }
    })();
  };

  const handleSaveProfile = async ({ fullName, email }: { fullName: string; email: string }) => {
    try {
      await AsyncStorage.setItem('@EverRide:profile', JSON.stringify({ fullName, email }));
      await AsyncStorage.setItem('@EverRide:isLoggedIn', '1');
    } catch (e) {
      console.warn('Failed saving profile', e);
    }
    setProfile({ fullName, email });
    setIsLoggedIn(true);
    setShowProfile(false);
    setVerified(false);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('@EverRide:profile');
      await AsyncStorage.removeItem('@EverRide:isLoggedIn');
      await AsyncStorage.removeItem('@EverRide:phoneNumber');
    } catch (e) {
      console.warn('Failed clearing storage', e);
    }

    setIsLoggedIn(false);
    setShowProfile(false);
    setPhoneNumber('');
    setOtp('');
    setActiveScreen('phone');
    setProfile({ fullName: '', email: '' });
    setVerified(false);
    setAccountScreen('profile');
  };

  if (showProfile) {
    return (
      <ProfileDetailsScreen
        phoneNumber={phoneNumber}
        initialFullName={profile.fullName}
        initialEmail={profile.email}
        onClose={() => setShowProfile(false)}
        onSave={handleSaveProfile}
        onLogout={handleLogout}
      />
    );
  }

  if (isLoggedIn) {
    const renderActive = () => {
      if (activeTab === 'Account') {
        if (accountScreen === 'help-support') {
          return <HelpSupportScreen onBack={() => setAccountScreen('profile')} />;
        }

        if (accountScreen === 'favourites') {
          return <FavouritesScreen onBack={() => setAccountScreen('profile')} />;
        }

        if (accountScreen === 'about') {
          return <AboutUsScreen onBack={() => setAccountScreen('profile')} />;
        }

        if (accountScreen === 'my-rides') {
          return <MyRidesScreen onBack={() => setAccountScreen('profile')} />;
        }

        if (accountScreen === 'preferences') {
          return (
            <ComingSoonScreen
              title="Preferences"
              description="Personalized ride settings and smart defaults will be available soon."
              onBack={() => setAccountScreen('profile')}
            />
          );
        }

        if (accountScreen === 'transit-preferences') {
          return (
            <ComingSoonScreen
              title="Transit Preferences"
              description="Choose your preferred transit modes and route priorities in an upcoming update."
              onBack={() => setAccountScreen('profile')}
            />
          );
        }

        if (accountScreen === 'share-with-friends') {
          return (
            <ComingSoonScreen
              title="Share with Friends"
              description="Invite friends, share ride links, and earn referral rewards soon."
              onBack={() => setAccountScreen('profile')}
            />
          );
        }

        if (accountScreen === 'safety') {
          return (
            <ComingSoonScreen
              title="Safety"
              description="Emergency tools, trip sharing, and rider safety controls are coming soon."
              onBack={() => setAccountScreen('profile')}
            />
          );
        }

        if (accountScreen === 'app-language') {
          return (
            <ComingSoonScreen
              title="App Language"
              description="Multi-language support and language preferences will be available soon."
              onBack={() => setAccountScreen('profile')}
            />
          );
        }

        return (
          <ProfileScreen
            phoneNumber={phoneNumber}
            fullName={profile.fullName}
            email={profile.email}
            onViewProfile={() => setShowProfile(true)}
            onOpenAboutUs={() => setAccountScreen('about')}
            onOpenFavourites={() => setAccountScreen('favourites')}
            onOpenHelpSupport={() => setAccountScreen('help-support')}
            onOpenMyRides={() => setAccountScreen('my-rides')}
            onOpenPreferences={() => setAccountScreen('preferences')}
            onOpenTransitPreferences={() => setAccountScreen('transit-preferences')}
            onOpenShareWithFriends={() => setAccountScreen('share-with-friends')}
            onOpenSafety={() => setAccountScreen('safety')}
            onOpenAppLanguage={() => setAccountScreen('app-language')}
            onLogout={handleLogout}
          />
        );
      }
      if (activeTab === 'Services') {
        return (
          <ServicesScreen
            onOpenProfile={() => setActiveTab('Account')}
            onOpenPickup={(p) => {
              const isMultimode = p.label.toLowerCase().includes('multimode');
              if (isMultimode) {
                setShowPickup(false);
                setShowMultiTransport(true);
                return;
              }
              setSelectedPickup(p);
              setShowMultiTransport(false);
              setShowPickup(true);
            }}
          />
        );
      }
      if (activeTab === 'Activity') {
        return <ActivityScreen  />;
      }
      return (
        <HomeScreen
          onOpenProfile={() => setActiveTab('Account')}
          onOpenServices={() => setActiveTab('Services')}
          onOpenPickup={(p) => {
            const isMultimode = p.label.toLowerCase().includes('multimode');
            if (isMultimode) {
              setShowPickup(false);
              setShowMultiTransport(true);
              return;
            }
            setSelectedPickup(p);
            setShowMultiTransport(false);
            setShowPickup(true);
          }}
        />
      );
    };

    if (showMultiTransport) {
      return <MultiTransportScreen onClose={() => setShowMultiTransport(false)} />;
    }

    if (showPickup) {
      return <PickupScreen onClose={() => setShowPickup(false)} selectedPickup={selectedPickup} />;
    }

    return (
      <>
        {renderActive()}
        <BottomBar
          active={activeTab}
          onTabPress={(t) => {
            setActiveTab(t);
            if (t !== 'Account') {
              setAccountScreen('profile');
            }
          }}
          activeColor="#233F89"
          inactiveColor="#7c7c7c"
        />
      </>
    );
  }

  return (
    <AuthScreen
      mode={activeScreen}
      phoneNumber={phoneNumber}
      onChangePhone={setPhoneNumber}
      onGetOtp={handleGetOtp}
      otp={otp}
      onChangeOtp={setOtp}
      onBack={() => {
        setOtp('');
        setErrorMessage('');
        setActiveScreen('phone');
      }}
      onVerify={handleVerifyOtp}
      errorMessage={errorMessage}
    />
  );
}

export default App;
