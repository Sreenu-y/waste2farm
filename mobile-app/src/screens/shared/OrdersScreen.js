import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../theme';
import { AuthContext } from '../../context/AuthContext';
import { useContext } from 'react';
import Button from '../../components/Button';

const STATUS_ICON = { pending: 'hourglass', confirmed: 'checkmark-circle', picked_up: 'car', in_transit: 'navigate', delivered: 'checkmark-done-circle', cancelled: 'close-circle' };
const STATUS_COLOR = { pending: colors.warning, confirmed: colors.primary, picked_up: '#06b6d4', in_transit: '#8b5cf6', delivered: colors.success, cancelled: colors.error };

export default function OrdersScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('active');
  const orders = activeTab === 'active' ? demoActive : demoCompleted;

  if (!user) {
    return (
      <View style={styles.guestContainer}>
        <Ionicons name="receipt-outline" size={64} color={colors.primary} />
        <Text style={styles.guestTitle}>Your Orders</Text>
        <Text style={styles.guestText}>Login to track your active orders and see your purchase history.</Text>
        <Button 
          title="Login / Register" 
          onPress={() => navigation.navigate('Auth')} 
          style={{ width: '100%', marginTop: spacing.xl }} 
        />
      </View>
    );
  }

  const renderOrder = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <Text style={styles.orderId}>#{item.id.slice(-6)}</Text>
        <View style={[styles.statusBadge, { backgroundColor: (STATUS_COLOR[item.status] || colors.textMuted) + '20' }]}>
          <Ionicons name={STATUS_ICON[item.status] || 'ellipse'} size={12} color={STATUS_COLOR[item.status]} />
          <Text style={[styles.statusText, { color: STATUS_COLOR[item.status] }]}>{item.status.replace('_', ' ')}</Text>
        </View>
      </View>

      <Text style={styles.title}>{item.wasteType} Waste</Text>
      <Text style={styles.subtitle}>{item.quantity} kg • {item.counterparty}</Text>

      <View style={styles.cardBottom}>
        <Text style={styles.price}>₹{item.total}</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabRow}>
        <TouchableOpacity style={[styles.tab, activeTab === 'active' && styles.tabActive]} onPress={() => setActiveTab('active')}>
          <Text style={[styles.tabText, activeTab === 'active' && styles.tabTextActive]}>Active</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'completed' && styles.tabActive]} onPress={() => setActiveTab('completed')}>
          <Text style={[styles.tabText, activeTab === 'completed' && styles.tabTextActive]}>Completed</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrder}
        contentContainerStyle={{ padding: spacing.md }}
        ListEmptyComponent={
          <View style={styles.empty}><Ionicons name="receipt-outline" size={48} color={colors.textMuted} /><Text style={styles.emptyText}>No orders yet</Text></View>
        }
      />
    </View>
  );
}

const demoActive = [
  { id: 'ORD001A', wasteType: 'Vegetable', quantity: 50, total: 150, status: 'confirmed', counterparty: 'Green Farm', date: '10 min ago' },
  { id: 'ORD002B', wasteType: 'Fruit', quantity: 30, total: 60, status: 'in_transit', counterparty: 'Organic Hub', date: '1h ago' },
];
const demoCompleted = [
  { id: 'ORD003C', wasteType: 'Food', quantity: 100, total: 150, status: 'delivered', counterparty: 'Bio Plant', date: 'Yesterday' },
  { id: 'ORD004D', wasteType: 'Garden', quantity: 75, total: 187, status: 'delivered', counterparty: 'Compost Co', date: '3 days ago' },
  { id: 'ORD005E', wasteType: 'Dairy', quantity: 20, total: 80, status: 'cancelled', counterparty: 'Farm Fresh', date: '1 week ago' },
];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  tabRow: { flexDirection: 'row', margin: spacing.md, backgroundColor: colors.card, borderRadius: borderRadius.md, padding: 4 },
  tab: { flex: 1, paddingVertical: spacing.sm, alignItems: 'center', borderRadius: borderRadius.sm },
  tabActive: { backgroundColor: colors.primary },
  tabText: { fontSize: 14, fontWeight: '500', color: colors.textMuted },
  tabTextActive: { color: colors.background, fontWeight: '700' },
  card: { backgroundColor: colors.card, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  orderId: { fontSize: 12, fontWeight: '600', color: colors.textMuted },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.round },
  statusText: { fontSize: 11, fontWeight: '600', textTransform: 'capitalize' },
  title: { fontSize: 16, fontWeight: '600', color: colors.text },
  subtitle: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.md, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border },
  price: { fontSize: 18, fontWeight: '700', color: colors.primary },
  date: { fontSize: 12, color: colors.textMuted },
  empty: { alignItems: 'center', paddingVertical: spacing.xxl },
  emptyText: { color: colors.textMuted, marginTop: spacing.md },
  guestContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl, backgroundColor: colors.background },
  guestTitle: { fontSize: 24, fontWeight: '800', color: colors.text, marginTop: spacing.lg },
  guestText: { fontSize: 14, color: colors.textMuted, textAlign: 'center', marginTop: spacing.sm, lineHeight: 22 },
});
