import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../theme';
import api from '../../services/api';

const STATUS_COLORS = { available: colors.success, sold: colors.warning, expired: colors.error };

export default function MyListingsScreen() {
  const [listings, setListings] = useState(demoListings);
  const [refreshing, setRefreshing] = useState(false);

  const fetchListings = async () => {
    try {
      const res = await api.get('/waste/my');
      if (res.data?.length) setListings(res.data);
    } catch { /* use demo */ }
  };

  useEffect(() => { fetchListings(); }, []);

  const onRefresh = async () => { setRefreshing(true); await fetchListings(); setRefreshing(false); };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.statusDot, { backgroundColor: STATUS_COLORS[item.status] || colors.textMuted }]} />
        <Text style={styles.statusText}>{item.status}</Text>
        <View style={{ flex: 1 }} />
        <Text style={styles.date}>{item.date || 'Today'}</Text>
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons name="cube-outline" size={14} color={colors.textMuted} />
          <Text style={styles.metaText}>{item.type}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="scale-outline" size={14} color={colors.textMuted} />
          <Text style={styles.metaText}>{item.quantity} kg</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.price}>₹{item.price}/kg</Text>
        </View>
      </View>
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Ionicons name="eye-outline" size={14} color={colors.textMuted} />
          <Text style={styles.statText}>{item.views || 0} views</Text>
        </View>
        <View style={styles.stat}>
          <Ionicons name="chatbubble-outline" size={14} color={colors.textMuted} />
          <Text style={styles.statText}>{item.inquiries || 0} inquiries</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <FlatList
        data={listings}
        keyExtractor={(item) => (item.id || item._id)?.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: spacing.md }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        ListEmptyComponent={
          <View style={styles.empty}><Ionicons name="leaf-outline" size={48} color={colors.textMuted} /><Text style={styles.emptyText}>No listings yet</Text></View>
        }
      />
    </SafeAreaView>
  );
}

const demoListings = [
  { id: '1', title: 'Fresh Vegetable Waste', type: 'Vegetable', quantity: 50, price: 3, status: 'available', views: 24, inquiries: 3, date: '2h ago' },
  { id: '2', title: 'Kitchen Scraps', type: 'Food', quantity: 30, price: 2, status: 'sold', views: 45, inquiries: 8, date: '1d ago' },
  { id: '3', title: 'Garden Trimmings', type: 'Garden', quantity: 100, price: 1.5, status: 'available', views: 12, inquiries: 1, date: '3h ago' },
];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  card: { backgroundColor: colors.card, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: spacing.xs },
  statusText: { fontSize: 11, fontWeight: '600', color: colors.textMuted, textTransform: 'uppercase' },
  date: { fontSize: 11, color: colors.textMuted },
  title: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: spacing.sm },
  metaRow: { flexDirection: 'row', gap: spacing.lg, marginBottom: spacing.sm },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, color: colors.textMuted },
  price: { fontSize: 14, fontWeight: '700', color: colors.primary },
  statsRow: { flexDirection: 'row', gap: spacing.lg, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statText: { fontSize: 11, color: colors.textMuted },
  empty: { alignItems: 'center', paddingVertical: spacing.xxl },
  emptyText: { color: colors.textMuted, fontSize: 14, marginTop: spacing.md },
});
