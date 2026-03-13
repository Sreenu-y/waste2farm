import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../theme';
import { AuthContext } from '../../context/AuthContext';

const { width } = Dimensions.get('window');

const STATS = [
  { icon: 'leaf', label: 'Waste Diverted', value: '2,340', unit: 'kg', color: '#22c55e', trend: '+18%' },
  { icon: 'water', label: 'Water Saved', value: '12,500', unit: 'L', color: '#3b82f6', trend: '+12%' },
  { icon: 'cloud', label: 'CO₂ Reduced', value: '890', unit: 'kg', color: '#8b5cf6', trend: '+25%' },
  { icon: 'flash', label: 'Energy Saved', value: '450', unit: 'kWh', color: '#f59e0b', trend: '+9%' },
];

const BADGES = [
  { icon: 'trophy', title: 'Eco Warrior', desc: 'Diverted 1,000+ kg', earned: true, color: '#f59e0b' },
  { icon: 'star', title: 'Top Seller', desc: '50+ listings sold', earned: true, color: '#22c55e' },
  { icon: 'ribbon', title: 'Carbon Hero', desc: '500 kg CO₂ saved', earned: true, color: '#8b5cf6' },
  { icon: 'diamond', title: 'Diamond Member', desc: '10,000 kg milestone', earned: false, color: '#6b7280' },
];

const MONTHLY = [
  { month: 'Oct', value: 180 }, { month: 'Nov', value: 220 },
  { month: 'Dec', value: 310 }, { month: 'Jan', value: 280 },
  { month: 'Feb', value: 420 }, { month: 'Mar', value: 490 },
];

export default function SustainabilityScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [animValues] = useState(STATS.map(() => new Animated.Value(0)));

  useEffect(() => {
    Animated.stagger(150, animValues.map(v =>
      Animated.spring(v, { toValue: 1, useNativeDriver: true, tension: 60, friction: 8 })
    )).start();
  }, []);

  const maxVal = Math.max(...MONTHLY.map(m => m.value));

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Guest Banner */}
        {!user && (
          <View style={styles.guestBanner}>
            <Text style={styles.guestBannerText}>Viewing Demo Impact</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Auth')}>
              <Text style={styles.guestLink}>Login to track your own</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Header */}
        <Text style={styles.heading}>🌍 Your Impact</Text>
        <Text style={styles.subheading}>Making the planet greener, one pickup at a time</Text>

        {/* Stat Cards */}
        <View style={styles.statsGrid}>
          {STATS.map((stat, i) => (
            <Animated.View
              key={stat.label}
              style={[styles.statCard, { transform: [{ scale: animValues[i] }] }]}
            >
              <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                <Ionicons name={stat.icon} size={22} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statUnit}>{stat.unit}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={[styles.statTrend, { color: stat.color }]}>{stat.trend}</Text>
            </Animated.View>
          ))}
        </View>

        {/* Monthly Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Monthly Waste Diverted (kg)</Text>
          <View style={styles.chartContainer}>
            {MONTHLY.map((m) => (
              <View key={m.month} style={styles.barGroup}>
                <Text style={styles.barValue}>{m.value}</Text>
                <View style={styles.barTrack}>
                  <View style={[styles.bar, { height: `${(m.value / maxVal) * 100}%` }]} />
                </View>
                <Text style={styles.barLabel}>{m.month}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Badges */}
        <Text style={styles.sectionTitle}>🏆 Eco Badges</Text>
        <View style={styles.badgeGrid}>
          {BADGES.map((badge) => (
            <View key={badge.title} style={[styles.badgeCard, !badge.earned && styles.badgeLocked]}>
              <View style={[styles.badgeIcon, { backgroundColor: badge.earned ? badge.color + '20' : colors.border }]}>
                <Ionicons name={badge.icon} size={24} color={badge.earned ? badge.color : colors.textMuted} />
              </View>
              <Text style={[styles.badgeTitle, !badge.earned && { color: colors.textMuted }]}>{badge.title}</Text>
              <Text style={styles.badgeDesc}>{badge.desc}</Text>
              {!badge.earned && <Text style={styles.badgeLock}>🔒 Locked</Text>}
            </View>
          ))}
        </View>

        {/* Impact summary */}
        <View style={styles.impactCard}>
          <Ionicons name="earth" size={32} color={colors.primary} />
          <Text style={styles.impactTitle}>Equivalent Impact</Text>
          <Text style={styles.impactText}>
            Your contributions are equivalent to planting <Text style={{ color: colors.primary, fontWeight: '800' }}>47 trees</Text> and saving <Text style={{ color: '#3b82f6', fontWeight: '800' }}>12,500L of water</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  heading: { fontSize: 26, fontWeight: '800', color: colors.text },
  subheading: { fontSize: 13, color: colors.textMuted, marginBottom: spacing.lg },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  statCard: {
    width: (width - spacing.lg * 2 - spacing.sm) / 2, backgroundColor: colors.card,
    borderRadius: borderRadius.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.border,
  },
  statIcon: { width: 40, height: 40, borderRadius: borderRadius.md, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.sm },
  statValue: { fontSize: 24, fontWeight: '800', color: colors.text },
  statUnit: { fontSize: 12, color: colors.textMuted, marginTop: -2 },
  statLabel: { fontSize: 11, color: colors.textMuted, marginTop: spacing.xs },
  statTrend: { fontSize: 12, fontWeight: '700', marginTop: spacing.xs },
  chartCard: { backgroundColor: colors.card, borderRadius: borderRadius.lg, padding: spacing.lg, marginTop: spacing.lg, borderWidth: 1, borderColor: colors.border },
  chartTitle: { fontSize: 15, fontWeight: '600', color: colors.text, marginBottom: spacing.lg },
  chartContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 140 },
  barGroup: { alignItems: 'center', flex: 1 },
  barValue: { fontSize: 10, color: colors.textMuted, marginBottom: 4 },
  barTrack: { width: 24, height: 100, backgroundColor: colors.border, borderRadius: borderRadius.sm, justifyContent: 'flex-end', overflow: 'hidden' },
  bar: { width: '100%', backgroundColor: colors.primary, borderRadius: borderRadius.sm },
  barLabel: { fontSize: 11, color: colors.textMuted, marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginTop: spacing.xl, marginBottom: spacing.md },
  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  badgeCard: {
    width: (width - spacing.lg * 2 - spacing.sm) / 2, backgroundColor: colors.card,
    borderRadius: borderRadius.lg, padding: spacing.md, alignItems: 'center', borderWidth: 1, borderColor: colors.border,
  },
  badgeLocked: { opacity: 0.5 },
  badgeIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.sm },
  badgeTitle: { fontSize: 13, fontWeight: '700', color: colors.text },
  badgeDesc: { fontSize: 10, color: colors.textMuted, textAlign: 'center', marginTop: 2 },
  badgeLock: { fontSize: 10, color: colors.textMuted, marginTop: spacing.xs },
  impactCard: {
    backgroundColor: 'rgba(16,185,129,0.08)', borderRadius: borderRadius.xl, padding: spacing.lg,
    alignItems: 'center', marginTop: spacing.xl, borderWidth: 1, borderColor: colors.primary,
  },
  impactTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginTop: spacing.sm },
  impactText: { fontSize: 13, color: colors.textMuted, textAlign: 'center', marginTop: spacing.sm, lineHeight: 20 },
  guestBanner: { backgroundColor: colors.primary, flexDirection: 'row', justifyContent: 'space-between', padding: spacing.sm, borderRadius: borderRadius.md, marginBottom: spacing.lg, alignItems: 'center' },
  guestBannerText: { color: colors.background, fontSize: 12, fontWeight: '700' },
  guestLink: { color: colors.background, fontSize: 12, fontWeight: '800', textDecorationLine: 'underline' },
});
