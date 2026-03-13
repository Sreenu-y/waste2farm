import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../theme';

const TYPE_COLORS = {
  vegetable: '#22c55e', fruit: '#f59e0b', food: '#ef4444',
  garden: '#06b6d4', dairy: '#a855f7', other: '#6b7280',
};

export default function WasteCard({ listing, onPress }) {
  const typeColor = TYPE_COLORS[listing.type?.toLowerCase()] || TYPE_COLORS.other;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.imageContainer}>
        <View style={[styles.imagePlaceholder, { backgroundColor: typeColor + '20' }]}>
          <Ionicons name="leaf" size={32} color={typeColor} />
        </View>
        <View style={[styles.typeBadge, { backgroundColor: typeColor }]}>
          <Text style={styles.typeBadgeText}>{listing.type || 'Waste'}</Text>
        </View>
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{listing.title || 'Organic Waste'}</Text>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="scale-outline" size={14} color={colors.textMuted} />
            <Text style={styles.metaText}>{listing.quantity || 0} kg</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="location-outline" size={14} color={colors.textMuted} />
            <Text style={styles.metaText}>{listing.distance ? `${listing.distance} km` : listing.city || 'Nearby'}</Text>
          </View>
        </View>
        <View style={styles.footer}>
          <Text style={styles.price}>₹{listing.price || 0}<Text style={styles.priceUnit}>/kg</Text></Text>
          <View style={[styles.statusDot, { backgroundColor: listing.status === 'available' ? colors.success : colors.warning }]} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card, borderRadius: borderRadius.lg, overflow: 'hidden',
    borderWidth: 1, borderColor: colors.border, marginBottom: spacing.md,
  },
  imageContainer: { height: 120, position: 'relative' },
  imagePlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  typeBadge: { position: 'absolute', top: spacing.sm, left: spacing.sm, paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.sm },
  typeBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  content: { padding: spacing.md },
  title: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: spacing.xs },
  metaRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.sm },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, color: colors.textMuted },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: 18, fontWeight: '700', color: colors.primary },
  priceUnit: { fontSize: 12, fontWeight: '400', color: colors.textMuted },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
});
