import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import { colors, spacing, borderRadius } from '../../theme';
import Button from '../../components/Button';

const MENU_ITEMS = [
  { icon: 'leaf', label: 'Sustainability', color: colors.primary },
  { icon: 'notifications-outline', label: 'Notifications', color: '#f59e0b' },
  { icon: 'card-outline', label: 'Payments', color: '#8b5cf6' },
  { icon: 'shield-checkmark-outline', label: 'Privacy', color: '#06b6d4' },
  { icon: 'help-circle-outline', label: 'Help & Support', color: '#6b7280' },
];

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useContext(AuthContext);
  const displayName = user?.name || 'Waste2Farm User';
  const displayEmail = user?.email || 'user@waste2farm.in';
  const displayRole = user?.role || 'Buyer';

  const ROLE_COLORS = { Generator: '#22c55e', Buyer: '#3b82f6', Driver: '#f59e0b', Admin: '#ef4444' };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  if (!user) {
    return (
      <View style={styles.guestContainer}>
        <Ionicons name="person-circle-outline" size={80} color={colors.primary} />
        <Text style={styles.guestTitle}>Your Profile</Text>
        <Text style={styles.guestText}>Login to manage your listings, track orders, and view your sustainability impact.</Text>
        <Button 
          title="Login / Register" 
          onPress={() => navigation.navigate('Auth')} 
          style={{ width: '100%', marginTop: spacing.xl }} 
        />
        <Text style={styles.version}>Waste2Farm v1.0.0</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{displayName.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.name}>{displayName}</Text>
        <Text style={styles.email}>{displayEmail}</Text>
        <View style={[styles.roleBadge, { backgroundColor: (ROLE_COLORS[displayRole] || colors.primary) + '20' }]}>
          <Text style={[styles.roleText, { color: ROLE_COLORS[displayRole] || colors.primary }]}>{displayRole}</Text>
        </View>
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>12</Text>
          <Text style={styles.statLabel}>Orders</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>156</Text>
          <Text style={styles.statLabel}>kg Saved</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>4.8</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
      </View>

      {/* Menu */}
      <View style={styles.menuCard}>
        {MENU_ITEMS.map((item, i) => (
          <TouchableOpacity key={item.label} style={[styles.menuItem, i < MENU_ITEMS.length - 1 && styles.menuBorder]}>
            <View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
              <Ionicons name={item.icon} size={20} color={item.color} />
            </View>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color={colors.error} />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Waste2Farm v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  profileCard: { backgroundColor: colors.card, borderRadius: borderRadius.xl, padding: spacing.lg, alignItems: 'center', borderWidth: 1, borderColor: colors.border, marginBottom: spacing.lg },
  avatarCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.md },
  avatarText: { fontSize: 28, fontWeight: '800', color: colors.background },
  name: { fontSize: 20, fontWeight: '700', color: colors.text },
  email: { fontSize: 13, color: colors.textMuted, marginTop: spacing.xs },
  roleBadge: { marginTop: spacing.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.round },
  roleText: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  statsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  statCard: { flex: 1, backgroundColor: colors.card, borderRadius: borderRadius.lg, padding: spacing.md, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  statNum: { fontSize: 22, fontWeight: '800', color: colors.text },
  statLabel: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  menuCard: { backgroundColor: colors.card, borderRadius: borderRadius.xl, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.lg },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, gap: spacing.md },
  menuBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  menuIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  menuLabel: { flex: 1, fontSize: 14, fontWeight: '500', color: colors.text },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, padding: spacing.md, backgroundColor: 'rgba(239,68,68,0.1)', borderRadius: borderRadius.md, borderWidth: 1, borderColor: colors.error, marginBottom: spacing.md },
  logoutText: { fontSize: 14, fontWeight: '600', color: colors.error },
  guestContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl, backgroundColor: colors.background },
  guestTitle: { fontSize: 24, fontWeight: '800', color: colors.text, marginTop: spacing.lg },
  guestText: { fontSize: 14, color: colors.textMuted, textAlign: 'center', marginTop: spacing.sm, lineHeight: 22 },
  version: { textAlign: 'center', fontSize: 11, color: colors.textMuted, marginBottom: spacing.xxl, marginTop: 'auto' },
});
