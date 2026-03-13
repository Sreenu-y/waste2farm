import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../theme';
import WasteCard from '../../components/WasteCard';
import api from '../../services/api';

const WASTE_TYPES = ['All', 'Vegetables', 'Fruits', 'Food', 'Garden', 'Dairy'];

export default function MarketplaceScreen({ navigation }) {
  const [listings, setListings] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => { fetchListings(); }, []);

  const fetchListings = async () => {
    try {
      const res = await api.get('/waste');
      setListings(res.data || demoListings);
    } catch {
      setListings(demoListings);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchListings();
    setRefreshing(false);
  };

  const filtered = listings.filter((l) => {
    const matchType = activeFilter === 'All' || 
      (l.type?.toLowerCase() === activeFilter.toLowerCase()) ||
      (activeFilter === 'Vegetables' && l.type?.toLowerCase() === 'vegetable') ||
      (activeFilter === 'Fruits' && l.type?.toLowerCase() === 'fruit');
    const matchSearch = !search || l.title?.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Fixed Header Content */}
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search listings..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
            autoCorrect={false}
            autoCapitalize="none"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.filterContainer}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={WASTE_TYPES}
            keyExtractor={(item) => item}
            contentContainerStyle={styles.filterRow}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.chip, activeFilter === item && styles.chipActive]}
                onPress={() => setActiveFilter(item)}
              >
                <Text style={[styles.chipText, activeFilter === item && styles.chipTextActive]}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>

      {/* Listings */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => (item._id || item.id)?.toString()}
        contentContainerStyle={{ padding: spacing.md }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        renderItem={({ item }) => (
          <WasteCard 
            listing={item} 
            onPress={() => navigation.navigate('ListingDetail', { listing: item })} 
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="leaf-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyText}>No listings found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const demoListings = [
  { id: '1', title: 'Fresh Vegetable Waste', type: 'Vegetable', quantity: 50, price: 3, city: 'Hyderabad', status: 'available' },
  { id: '2', title: 'Fruit Peels & Pulp', type: 'Fruit', quantity: 30, price: 2, city: 'Bangalore', status: 'available' },
  { id: '3', title: 'Restaurant Food Waste', type: 'Food', quantity: 100, price: 1.5, city: 'Mumbai', status: 'available' },
  { id: '4', title: 'Garden Trimmings', type: 'Garden', quantity: 75, price: 2.5, city: 'Delhi', status: 'available' },
  { id: '5', title: 'Dairy Farm Waste', type: 'Dairy', quantity: 40, price: 4, city: 'Pune', status: 'available' },
  { id: '6', title: 'Hotel Kitchen Scraps', type: 'Food', quantity: 120, price: 1, city: 'Chennai', status: 'available' },
];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.background, zIndex: 10 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.card, margin: spacing.md, marginBottom: spacing.sm,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm, 
    borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.border,
    height: 50,
  },
  searchInput: { flex: 1, color: colors.text, fontSize: 16, paddingVertical: 0 },
  filterContainer: { height: 60 },
  filterRow: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, gap: spacing.sm },
  chip: { 
    paddingHorizontal: spacing.lg, paddingVertical: spacing.xs, 
    borderRadius: borderRadius.round, backgroundColor: colors.card, 
    borderWidth: 1, borderColor: colors.border,
    justifyContent: 'center', alignItems: 'center',
    height: 36,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 13, fontWeight: '600', color: colors.textMuted },
  chipTextActive: { color: '#ffffff', fontWeight: '700' },
  empty: { alignItems: 'center', paddingVertical: spacing.xxl },
  emptyText: { color: colors.textMuted, marginTop: spacing.md, fontSize: 14 },
});
