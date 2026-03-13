import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../theme';

export default function PickupRequestsScreen({ navigation }) {
  const [requests, setRequests] = useState(demoRequests);

  const handleAccept = (id) => {
    Alert.alert('Accepted!', 'Pickup request accepted. Navigate to pickup location.');
    setRequests(requests.filter(r => r.id !== id));
    navigation.navigate('Active Delivery');
  };

  const handleDecline = (id) => {
    setRequests(requests.filter(r => r.id !== id));
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.earningsBadge}>
          <Text style={styles.earningsText}>₹{item.earnings}</Text>
        </View>
        <Text style={styles.distance}>{item.distance} km away</Text>
      </View>

      <Text style={styles.title}>{item.wasteType} Waste Pickup</Text>
      <Text style={styles.subtitle}>{item.quantity} kg • {item.generator}</Text>

      <View style={styles.locationRow}>
        <View style={styles.locationItem}>
          <View style={[styles.dot, { backgroundColor: colors.primary }]} />
          <View>
            <Text style={styles.locationLabel}>Pickup</Text>
            <Text style={styles.locationAddr}>{item.pickupAddr}</Text>
          </View>
        </View>
        <View style={styles.dottedLine} />
        <View style={styles.locationItem}>
          <View style={[styles.dot, { backgroundColor: colors.warning }]} />
          <View>
            <Text style={styles.locationLabel}>Drop-off</Text>
            <Text style={styles.locationAddr}>{item.dropAddr}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.declineBtn} onPress={() => handleDecline(item.id)}>
          <Ionicons name="close" size={20} color={colors.error} />
          <Text style={styles.declineText}>Decline</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.acceptBtn} onPress={() => handleAccept(item.id)}>
          <Ionicons name="checkmark" size={20} color={colors.background} />
          <Text style={styles.acceptText}>Accept</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Pickup Requests</Text>
        <View style={styles.onlineBadge}><View style={styles.onlineDot} /><Text style={styles.onlineText}>Online</Text></View>
      </View>
      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: spacing.md }}
        ListEmptyComponent={
          <View style={styles.empty}><Ionicons name="car-outline" size={48} color={colors.textMuted} /><Text style={styles.emptyText}>No pickup requests right now</Text></View>
        }
      />
    </View>
  );
}

const demoRequests = [
  { id: '1', wasteType: 'Vegetable', quantity: 50, generator: 'Green Kitchen Restaurant', earnings: 150, distance: 2.3, pickupAddr: 'Jubilee Hills, Hyderabad', dropAddr: 'Shamshabad Farm, RR Dist' },
  { id: '2', wasteType: 'Fruit', quantity: 30, generator: 'FreshMart Supermarket', earnings: 100, distance: 4.1, pickupAddr: 'Banjara Hills, Hyderabad', dropAddr: 'Nagole Compost Unit' },
  { id: '3', wasteType: 'Food', quantity: 80, generator: 'Taj Hotel Kitchen', earnings: 250, distance: 1.5, pickupAddr: 'Madhapur, Hyderabad', dropAddr: 'Keesara Biogas Plant' },
];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.lg, paddingBottom: 0 },
  heading: { fontSize: 22, fontWeight: '800', color: colors.text },
  onlineBadge: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, backgroundColor: 'rgba(16,185,129,0.15)', paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.round },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.success },
  onlineText: { fontSize: 12, fontWeight: '600', color: colors.success },
  card: { backgroundColor: colors.card, borderRadius: borderRadius.xl, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  earningsBadge: { backgroundColor: 'rgba(16,185,129,0.15)', paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.round },
  earningsText: { fontSize: 16, fontWeight: '800', color: colors.primary },
  distance: { fontSize: 12, color: colors.textMuted },
  title: { fontSize: 17, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: 13, color: colors.textMuted, marginBottom: spacing.md },
  locationRow: { marginBottom: spacing.lg },
  locationItem: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, marginVertical: spacing.xs },
  dot: { width: 10, height: 10, borderRadius: 5, marginTop: 4 },
  locationLabel: { fontSize: 10, color: colors.textMuted, textTransform: 'uppercase', fontWeight: '600' },
  locationAddr: { fontSize: 13, color: colors.text },
  dottedLine: { width: 1, height: 16, borderLeftWidth: 1, borderColor: colors.border, borderStyle: 'dashed', marginLeft: 4 },
  actions: { flexDirection: 'row', gap: spacing.md },
  declineBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, padding: spacing.md, borderRadius: borderRadius.md, borderWidth: 1, borderColor: colors.error },
  declineText: { fontSize: 14, fontWeight: '600', color: colors.error },
  acceptBtn: { flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, padding: spacing.md, borderRadius: borderRadius.md, backgroundColor: colors.primary },
  acceptText: { fontSize: 14, fontWeight: '600', color: colors.background },
  empty: { alignItems: 'center', paddingVertical: spacing.xxl },
  emptyText: { color: colors.textMuted, marginTop: spacing.md },
});
