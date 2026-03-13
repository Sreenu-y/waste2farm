import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../theme';
import { AuthContext } from '../../context/AuthContext';
import { useContext } from 'react';
import Button from '../../components/Button';

const ICON_MAP = { order: 'cart', delivery: 'car', payment: 'card', system: 'notifications', sustainability: 'leaf' };
const COLOR_MAP = { order: '#3b82f6', delivery: '#8b5cf6', payment: '#f59e0b', system: colors.primary, sustainability: '#22c55e' };

export default function NotificationsScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState(demoNotifications);

  const markRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, !item.read && styles.cardUnread]}
      onPress={() => markRead(item.id)}
      activeOpacity={0.8}
    >
      <View style={[styles.iconCircle, { backgroundColor: (COLOR_MAP[item.type] || colors.primary) + '20' }]}>
        <Ionicons name={ICON_MAP[item.type] || 'notifications'} size={20} color={COLOR_MAP[item.type] || colors.primary} />
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, !item.read && styles.titleUnread]}>{item.title}</Text>
        <Text style={styles.body} numberOfLines={2}>{item.body}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
      {!item.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  if (!user) {
    return (
      <View style={styles.guestContainer}>
        <Ionicons name="notifications-off-outline" size={64} color={colors.primary} />
        <Text style={styles.guestTitle}>Notifications</Text>
        <Text style={styles.guestText}>Login to see updates about your orders, deliveries, and awards.</Text>
        <Button 
          title="Login / Register" 
          onPress={() => navigation.navigate('Auth')} 
          style={{ width: '100%', marginTop: spacing.xl }} 
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.heading}>Notifications</Text>
          <Text style={styles.subheading}>{unreadCount} unread</Text>
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity style={styles.markAllBtn} onPress={markAllRead}>
            <Ionicons name="checkmark-done" size={16} color={colors.primary} />
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: spacing.md, paddingTop: 0 }}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="notifications-off-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyText}>No notifications yet</Text>
          </View>
        }
      />
    </View>
  );
}

const demoNotifications = [
  { id: '1', type: 'order', title: 'Order Confirmed', body: 'Your order #ORD001A for 50kg of vegetable waste has been confirmed by Green Farm.', time: '2 min ago', read: false },
  { id: '2', type: 'delivery', title: 'Driver Assigned', body: 'Raju Kumar has been assigned to pick up your waste. ETA: 15 minutes.', time: '10 min ago', read: false },
  { id: '3', type: 'payment', title: 'Payment Received', body: 'You received ₹150 for order #ORD003C. Payment has been released to your wallet.', time: '1 hour ago', read: false },
  { id: '4', type: 'sustainability', title: '🎉 Badge Unlocked!', body: 'Congratulations! You earned the "Eco Warrior" badge for diverting 1,000+ kg of waste.', time: '3 hours ago', read: true },
  { id: '5', type: 'order', title: 'New Order Request', body: 'Bio Plant wants to purchase 80kg of food waste from your latest listing.', time: '5 hours ago', read: true },
  { id: '6', type: 'system', title: 'Welcome to Waste2Farm!', body: 'Start by posting your first waste listing or browse the marketplace to find organic waste near you.', time: '1 day ago', read: true },
  { id: '7', type: 'delivery', title: 'Delivery Completed', body: 'Order #ORD002B has been successfully delivered. Please rate your experience.', time: '2 days ago', read: true },
];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.lg },
  heading: { fontSize: 24, fontWeight: '800', color: colors.text },
  subheading: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  markAllBtn: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, backgroundColor: 'rgba(16,185,129,0.1)', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.round },
  markAllText: { fontSize: 12, fontWeight: '600', color: colors.primary },
  card: { flexDirection: 'row', backgroundColor: colors.card, borderRadius: borderRadius.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.border, gap: spacing.md, alignItems: 'flex-start' },
  cardUnread: { backgroundColor: 'rgba(16,185,129,0.04)', borderColor: colors.primary + '40' },
  iconCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1 },
  title: { fontSize: 14, fontWeight: '500', color: colors.text },
  titleUnread: { fontWeight: '700' },
  body: { fontSize: 12, color: colors.textMuted, marginTop: 2, lineHeight: 18 },
  time: { fontSize: 10, color: colors.textMuted, marginTop: spacing.xs },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, marginTop: 4 },
  empty: { alignItems: 'center', paddingVertical: spacing.xxl },
  emptyText: { color: colors.textMuted, marginTop: spacing.md },
  guestContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl, backgroundColor: colors.background },
  guestTitle: { fontSize: 24, fontWeight: '800', color: colors.text, marginTop: spacing.lg },
  guestText: { fontSize: 14, color: colors.textMuted, textAlign: 'center', marginTop: spacing.sm, lineHeight: 22 },
});
