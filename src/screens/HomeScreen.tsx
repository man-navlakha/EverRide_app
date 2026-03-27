import React, { useMemo, useState } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';

// ─── Layout constants (from App.tsx) ───────────────────────────────────────────
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_GAP = 14;
const HORIZONTAL_PADDING = 20;
const CARD_WIDTH = (SCREEN_WIDTH - HORIZONTAL_PADDING * 2 - CARD_GAP) / 2;
const CARD_HEIGHT = CARD_WIDTH * 1.05;

// ─── Types (from HomeScreen) ────────────────────────────────────────────────────
type PickupInfo = { label: string; center?: number[] };

type Props = {
  onOpenProfile: () => void;
  onOpenServices?: () => void;
  onOpenPickup?: (place: PickupInfo) => void;
};

// ─── Colors (from App.tsx) ──────────────────────────────────────────────────────
const COLORS = {
  gradientTop: '#F8F4ED',
  gradientBottom: '#E8DFD1',
  navy: '#122C6F',
  gold: '#EDAB0C',
  textGray: '#8A8D9F',
};

// ─── Services (merged: App icon strings + HomeScreen structure) ─────────────────
const SERVICES = [
  {
    id: 'bus',
    label: 'Bus',
    subtitle: 'Eco-friendly',
    colors: ['rgba(255, 255, 255, 0.85)', 'rgba(215, 230, 195, 0.95)'] as [string, string],
    iconBg: '#5E8704',
    icon: '🚌',
  },
  {
    id: 'metro',
    label: 'Metro',
    subtitle: 'Fastest route',
    colors: ['rgba(255, 255, 255, 0.85)', 'rgba(205, 215, 235, 0.95)'] as [string, string],
    iconBg: '#122C6F',
    icon: '🚇',
  },
  {
    id: 'cab',
    label: 'Cab',
    subtitle: 'Door to door',
    colors: ['rgba(255, 255, 255, 0.85)', 'rgba(245, 220, 175, 0.95)'] as [string, string],
    iconBg: '#EDAB0C',
    icon: '🚕',
  },
  {
    id: 'multimode',
    label: 'Multimode',
    subtitle: 'Smart combo',
    colors: ['rgba(255, 255, 255, 0.85)', 'rgba(190, 230, 235, 0.95)'] as [string, string],
    iconBg: '#1E9EC0',
    icon: '🔀',
  },
];

// ─── SVG Icons (from HomeScreen) ───────────────────────────────────────────────
const PinIcon = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
      fill={color}
    />
    <Circle cx="12" cy="9" r="2.5" fill="white" />
  </Svg>
);

const MicIcon = ({ size = 20, color = COLORS.navy }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="9" y="2" width="6" height="11" rx="3" fill={color} />
    <Path
      d="M5 10a7 7 0 0014 0"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
    <Line x1="12" y1="19" x2="12" y2="22" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Line x1="9" y1="22" x2="15" y2="22" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

// ─── Bottom Tab (from App.tsx) ──────────────────────────────────────────────────
const BottomTab = ({ icon, label, active = false }: { icon: string; label: string; active?: boolean }) => (
  <TouchableOpacity style={styles.tabItem}>
    <Text style={{ fontSize: 22, opacity: active ? 1 : 0.5 }}>{icon}</Text>
    <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
  </TouchableOpacity>
);

// ─── Main Component ─────────────────────────────────────────────────────────────
export function HomeScreen({ onOpenProfile, onOpenServices, onOpenPickup }: Props) {
  // HomeScreen logic
  const [pickupQuery, setPickupQuery] = useState('');

  const queryLabel = useMemo(() => {
    const value = pickupQuery.trim();
    return value.length > 0 ? value : 'Current location';
  }, [pickupQuery]);

  const openPickup = (mode: string) => {
    onOpenPickup?.({ label: `${queryLabel} • ${mode}` });
  };

  return (
    <LinearGradient
      colors={[COLORS.gradientTop, COLORS.gradientBottom]}
      style={styles.gradientBackground}
    >
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER — HomeScreen props + App.tsx layout */}
          <View style={styles.headerRow}>
            <View style={styles.brandWrap}>
              <Image
                source={require('../assets/logo.png')}
                style={styles.brandLogo}
                resizeMode="contain"
              />
              <Text style={styles.title}>EVERRIDE</Text>
            </View>
            <Pressable onPress={onOpenProfile} style={styles.avatar}>
              <Text style={styles.avatarText}>A</Text>
            </Pressable>
          </View>

          {/* SEARCH BAR — HomeScreen SVG icons + App.tsx style */}
          <View style={styles.searchContainer}>
            <View style={styles.leftIconWrap}>
              <PinIcon color="#FFFFFF" />
            </View>
            <TextInput
              value={pickupQuery}
              onChangeText={setPickupQuery}
              style={styles.input}
              placeholder="Enter pickup location"
              placeholderTextColor={COLORS.textGray}
            />
            <Pressable onPress={() => openPickup('Search')} style={styles.micButton}>
              <MicIcon color={COLORS.navy} />
            </Pressable>
          </View>

          {/* OFFER CARD — App.tsx dark navy style + HomeScreen openPickup callback */}
          <View style={styles.offerCard}>
            <View style={styles.offerContent}>
              <Text style={styles.offerLabel}>OUR ADS & OFFERS</Text>
              <Text style={styles.offerTitle}>Get 30% off your{'\n'}first Metro ride 🚇</Text>
              <View style={styles.dotsRow}>
                <View style={[styles.dot, styles.dotActive]} />
                <View style={styles.dot} />
                <View style={styles.dot} />
              </View>
            </View>
            <Pressable onPress={() => openPickup('Claim Offer')} style={styles.claimBtn}>
              <Text style={styles.claimBtnText}>CLAIM NOW</Text>
            </Pressable>
          </View>

          {/* SECTION HEADER — HomeScreen onOpenServices callback */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Our Services</Text>
            <Pressable onPress={() => onOpenServices?.()}>
              <Text style={styles.viewAll}>View all →</Text>
            </Pressable>
          </View>

          {/* SERVICE GRID — App.tsx card sizing + HomeScreen openPickup */}
          <View style={styles.gridContainer}>
            {SERVICES.map((item) => (
              <Pressable
                key={item.id}
                style={styles.cardWrapper}
                onPress={() => openPickup(item.label)}
              >
                <LinearGradient
                  colors={item.colors}
                  style={styles.serviceCard}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.cardTopRow}>
                    <View
                      style={[
                        styles.iconBox,
                        { backgroundColor: item.iconBg, shadowColor: item.iconBg },
                      ]}
                    >
                      <Text style={styles.iconText}>{item.icon}</Text>
                    </View>
                    <Text style={[styles.tinyArrow, { color: item.iconBg }]}>↗</Text>
                  </View>

                  <View style={styles.cardBottomText}>
                    <Text style={styles.serviceLabel}>{item.label}</Text>
                    <Text style={[styles.serviceSubtitle, { color: item.iconBg }]}>
                      {item.subtitle}
                    </Text>
                  </View>
                </LinearGradient>
              </Pressable>
            ))}
          </View>

          {/* SECONDARY CARD — HomeScreen openPickup callback */}
          <Pressable
            style={styles.secondaryCard}
            onPress={() => openPickup('Book for Someone Else')}
          >
            <View style={styles.secondaryIconBox}>
              <Text style={styles.iconText}>👥</Text>
            </View>
            <View>
              <Text style={styles.secondaryTitle}>Book for Someone Else</Text>
              <Text style={styles.secondarySubtitle}>Plan a ride for family</Text>
            </View>
            <Text style={styles.arrowIcon}>→</Text>
          </Pressable>

          <View style={{ height: 120 }} />
        </ScrollView>
      </SafeAreaView>

      {/* BOTTOM NAV — from App.tsx */}
      <View style={styles.bottomNav}>
        <BottomTab icon="🏠" label="Home" active />
        <BottomTab icon="↗️" label="Services" />
        <View style={styles.fastRidesWrapper}>
          <TouchableOpacity style={styles.fastRidesBtn} activeOpacity={0.9}>
            <Text style={styles.fastRidesText}>Fast{'\n'}Rides</Text>
          </TouchableOpacity>
        </View>
        <BottomTab icon="🎁" label="Offers" />
        <BottomTab icon="👤" label="Profile" />
      </View>
    </LinearGradient>
  );
}

export default HomeScreen;

// ─── Styles (merged: App.tsx sizing constants + HomeScreen structure) ───────────
const styles = StyleSheet.create({
  gradientBackground: { flex: 1 },
  safeArea: { flex: 1 },
  container: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingBottom: 0,
    paddingTop:
      Platform.OS === 'android' ? (StatusBar.currentHeight ?? 20) + 10 : 10,
  },

  // Header
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  brandWrap: { flexDirection: 'row', alignItems: 'center' },
  brandLogo: { width: 34, height: 34, marginRight: 8 },
  title: {
    fontSize: 22,
    color: COLORS.navy,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.gold,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  avatarText: { fontSize: 20, fontWeight: '800', color: COLORS.navy },

  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F1EC',
    borderRadius: 30,
    padding: 6,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E8E4DC',
    shadowColor: '#CDC6B9',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
  },
  leftIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: COLORS.navy,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 52,
    fontSize: 16,
    color: COLORS.navy,
    fontWeight: '500',
    paddingHorizontal: 14,
  },
  micButton: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: COLORS.gold,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Offer card — App.tsx dark navy style
  offerCard: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#122C6F',
    borderRadius: 24,
    padding: 20,
    marginBottom: 28,
    borderWidth: 1,
    overflow: 'visible',
    shadowColor: COLORS.navy,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 20,
  },
  offerContent: { flex: 1 },
  offerLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.gold,
    letterSpacing: 1,
    marginBottom: 6,
  },
  offerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#ffffff',
    lineHeight: 24,
    marginBottom: 12,
  },
  dotsRow: { flexDirection: 'row', alignItems: 'center' },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(244, 176, 0, 0.3)',
    marginRight: 6,
  },
  dotActive: { width: 16, backgroundColor: COLORS.gold },
  claimBtn: {
    backgroundColor: COLORS.gold,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 17,
    elevation: 17,
  },
  claimBtnText: { color: '#000000', fontWeight: '800', fontSize: 12 },

  // Section header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 20, fontWeight: '900', color: COLORS.navy },
  viewAll: { fontSize: 14, fontWeight: '700', color: COLORS.gold },

  // Grid — App.tsx sizing constants
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: CARD_GAP,
    marginBottom: 20,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#ffffff',
    borderRadius: 28,
    shadowColor: 'rgba(0,0,0,0.63)',
    shadowOffset: { width: -6, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 6,
  },
  serviceCard: {
    flex: 1,
    borderRadius: 28,
    padding: 18,
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomWidth: 0.5,
    borderRightWidth: 0.5,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
    position: 'relative',
  },
  tinyArrow: {
    position: 'absolute',
    top: 0,
    right: 0,
    fontSize: 16,
    fontWeight: '900',
    opacity: 0.4,
  },
  iconBox: {
    width: CARD_WIDTH * 0.38,
    height: CARD_WIDTH * 0.38,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 8,
  },
  iconText: {
    fontSize: CARD_WIDTH * 0.16,
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  cardBottomText: { marginTop: 10, alignItems: 'flex-start' },
  serviceLabel: {
    fontSize: CARD_WIDTH * 0.12,
    fontWeight: '900',
    color: COLORS.navy,
    marginBottom: 2,
    textAlign: 'left',
  },
  serviceSubtitle: {
    fontSize: CARD_WIDTH * 0.075,
    fontWeight: '700',
    opacity: 0.8,
    textAlign: 'left',
  },

  // Secondary card
  secondaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(254, 248, 235, 0.85)',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
    shadowColor: '#E5D6B8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 3,
  },
  secondaryIconBox: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: COLORS.gold,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  secondaryTitle: { fontSize: 16, fontWeight: '900', color: COLORS.navy, marginBottom: 4 },
  secondarySubtitle: { fontSize: 13, fontWeight: '500', color: COLORS.textGray },
  arrowIcon: { marginLeft: 'auto', fontSize: 20, color: COLORS.gold, fontWeight: 'bold' },

  // Bottom nav — from App.tsx
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 12,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  tabItem: { alignItems: 'center', width: 60 },
  tabLabel: { fontSize: 10, fontWeight: '700', color: COLORS.textGray, marginTop: 4 },
  tabLabelActive: { color: COLORS.gold },
  fastRidesWrapper: { top: -20 },
  fastRidesBtn: {
    backgroundColor: COLORS.navy,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.navy,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  fastRidesText: { color: '#fff', fontSize: 11, fontWeight: '800', textAlign: 'center' },
});
