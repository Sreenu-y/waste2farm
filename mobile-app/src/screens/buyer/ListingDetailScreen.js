import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../theme';
import Button from '../../components/Button';
import { AuthContext } from '../../context/AuthContext';

const TYPE_COLORS = {
  vegetable: '#22c55e', fruit: '#f59e0b', food: '#ef4444',
  garden: '#06b6d4', dairy: '#a855f7', other: '#6b7280',
};

export default function ListingDetailScreen({ route, navigation }) {
  const { user } = useContext(AuthContext);
  const listing = route?.params?.listing || demoListing;
  const typeColor = TYPE_COLORS[listing.type?.toLowerCase()] || TYPE_COLORS.other;

  const handleOrder = () => {
    if (!user) {
      Alert.alert(
        'Login Required',
        'Please login or register to place an order.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => navigation.navigate('Auth') }
        ]
      );
      return;
    }
    navigation.navigate('Checkout', { listing });
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        <ScrollView contentContainerStyle={styles.content}>
          {/* Back button */}
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>

          {/* Image hero */}
          <View style={[styles.hero, { backgroundColor: typeColor + '15' }]}>
            <Ionicons name="leaf" size={64} color={typeColor} />
            <View style={[styles.typeBadge, { backgroundColor: typeColor }]}>
              <Text style={styles.typeBadgeText}>{listing.type}</Text>
            </View>
          </View>

          {/* Title & Meta */}
          <Text style={styles.title}>{listing.title}</Text>
          <View style={styles.metaRow}>
            <View style={styles.metaChip}>
              <Ionicons name="location" size={14} color={colors.primary} />
              <Text style={styles.metaText}>{listing.city || 'Hyderabad'}</Text>
            </View>
            <View style={styles.metaChip}>
              <Ionicons name="time" size={14} color={colors.primary} />
              <Text style={styles.metaText}>{listing.freshness || '< 24 hrs'}</Text>
            </View>
            <View style={styles.metaChip}>
              <Ionicons name="eye" size={14} color={colors.primary} />
              <Text style={styles.metaText}>{listing.views || 24} views</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.desc}>
              {listing.description || 'Fresh organic waste collected daily from commercial kitchens. Ideal for composting, biogas production, or animal feed. Available for immediate pickup.'}
            </Text>
          </View>

          {/* Details grid */}
          <View style={styles.detailsGrid}>
            <View style={styles.detailCard}>
              <Ionicons name="scale-outline" size={20} color={colors.primary} />
              <Text style={styles.detailValue}>{listing.quantity} kg</Text>
              <Text style={styles.detailLabel}>Available</Text>
            </View>
            <View style={styles.detailCard}>
              <Ionicons name="pricetag-outline" size={20} color={colors.primary} />
              <Text style={styles.detailValue}>₹{listing.price}/kg</Text>
              <Text style={styles.detailLabel}>Price</Text>
            </View>
            <View style={styles.detailCard}>
              <Ionicons name="navigate-outline" size={20} color={colors.primary} />
              <Text style={styles.detailValue}>{listing.distance || '2.3'} km</Text>
              <Text style={styles.detailLabel}>Distance</Text>
            </View>
          </View>

          {/* Seller info */}
          <View style={styles.sellerCard}>
            <View style={styles.sellerAvatar}>
              <Text style={styles.sellerInitial}>{(listing.sellerName || 'G')[0]}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sellerName}>{listing.sellerName || 'Green Kitchen Restaurant'}</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={14} color="#f59e0b" />
                <Text style={styles.ratingText}>{listing.rating || '4.8'} ({listing.reviews || 32} reviews)</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.chatBtn}>
              <Ionicons name="chatbubble-outline" size={18} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Sustainability Impact */}
          <View style={styles.impactCard}>
            <Text style={styles.impactTitle}>🌱 Sustainability Impact</Text>
            <View style={styles.impactRow}>
              <View style={styles.impactItem}>
                <Text style={styles.impactValue}>{Math.round(listing.quantity * 0.38)}</Text>
                <Text style={styles.impactLabel}>kg CO₂ saved</Text>
              </View>
              <View style={styles.impactItem}>
                <Text style={styles.impactValue}>{Math.round(listing.quantity * 5.3)}</Text>
                <Text style={styles.impactLabel}>L water saved</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalPrice}>₹{listing.quantity * (listing.price || 3)}</Text>
        </View>
        <Button title="Place Order" onPress={handleOrder} style={{ flex: 1, marginLeft: spacing.md }} />
      </View>
    </View>
  );
}

const demoListing = {
  title: 'Fresh Vegetable Waste', type: 'Vegetable', quantity: 50,
  price: 3, city: 'Hyderabad', status: 'available',
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 100 },
  backBtn: { backgroundColor: colors.card, padding: spacing.sm, borderRadius: borderRadius.round, width: 40, height: 40, margin: spacing.md, justifyContent: 'center', alignItems: 'center' },
  hero: { height: 200, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  typeBadge: { position: 'absolute', top: spacing.md, right: spacing.md, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.round },
  typeBadgeText: { color: '#fff', fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  title: { fontSize: 24, fontWeight: '800', color: colors.text, paddingHorizontal: spacing.lg, marginTop: spacing.md },
  metaRow: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.lg, marginTop: spacing.sm },
  metaChip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.card, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: borderRadius.round },
  metaText: { fontSize: 11, color: colors.textMuted },
  section: { padding: spacing.lg },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  desc: { fontSize: 14, color: colors.textMuted, lineHeight: 22 },
  detailsGrid: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.lg },
  detailCard: { flex: 1, backgroundColor: colors.card, borderRadius: borderRadius.lg, padding: spacing.md, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  detailValue: { fontSize: 16, fontWeight: '700', color: colors.text, marginTop: spacing.xs },
  detailLabel: { fontSize: 10, color: colors.textMuted, marginTop: 2 },
  sellerCard: { flexDirection: 'row', alignItems: 'center', margin: spacing.lg, backgroundColor: colors.card, borderRadius: borderRadius.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.border, gap: spacing.md },
  sellerAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  sellerInitial: { fontSize: 18, fontWeight: '800', color: colors.background },
  sellerName: { fontSize: 14, fontWeight: '600', color: colors.text },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  ratingText: { fontSize: 12, color: colors.textMuted },
  chatBtn: { padding: spacing.sm, backgroundColor: 'rgba(16,185,129,0.1)', borderRadius: borderRadius.md },
  impactCard: { margin: spacing.lg, backgroundColor: 'rgba(16,185,129,0.08)', borderRadius: borderRadius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.primary },
  impactTitle: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  impactRow: { flexDirection: 'row', gap: spacing.lg },
  impactItem: { flex: 1, alignItems: 'center' },
  impactValue: { fontSize: 22, fontWeight: '800', color: colors.primary },
  impactLabel: { fontSize: 11, color: colors.textMuted },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, padding: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border },
  totalLabel: { fontSize: 11, color: colors.textMuted },
  totalPrice: { fontSize: 22, fontWeight: '800', color: colors.primary },
});
