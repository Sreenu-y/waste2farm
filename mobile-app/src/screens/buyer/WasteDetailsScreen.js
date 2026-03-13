import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../theme';
import Button from '../../components/Button';

export default function WasteDetailsScreen({ route, navigation }) {
  const { listing } = route.params;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this organic waste: ${listing.title} at ${listing.city} for ₹${listing.pricePerKg}/kg!`,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Image / Placeholder */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: listing.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image' }} 
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={handleShare}>
              <Ionicons name="share-outline" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.badgeContainer}>
            <View style={styles.typeBadge}>
              <Text style={styles.typeText}>{listing.wasteType}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: listing.status === 'available' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)' }]}>
              <Text style={[styles.statusText, { color: listing.status === 'available' ? colors.success : colors.error }]}>
                {listing.status === 'available' ? 'In Stock' : 'Sold Out'}
              </Text>
            </View>
          </View>

          <Text style={styles.title}>{listing.title}</Text>
          
          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{listing.pricePerKg}<Text style={styles.unit}>/kg</Text></Text>
            <Text style={styles.quantity}>{listing.quantity} kg available</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>
            {listing.description || "Fresh organic waste suitable for composting or biogas production. High nutrient content and collected within last 24 hours."}
          </Text>

          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={20} color={colors.primary} />
            <Text style={styles.locationText}>{listing.city || 'Hyderabad'}, India</Text>
          </View>

          <View style={styles.sellerCard}>
            <View style={styles.sellerInfo}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={24} color={colors.textMuted} />
              </View>
              <View>
                <Text style={styles.sellerName}>{listing.generator || 'Waste Generator'}</Text>
                <Text style={styles.sellerType}>Verified Seller</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.contactBtn}>
              <Ionicons name="chatbubble-outline" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button 
          title="Proceed to Buy" 
          onPress={() => navigation.navigate('Checkout', { listing })} 
          disabled={listing.status !== 'available'}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingBottom: 100 },
  imageContainer: { width: '100%', height: 300, backgroundColor: colors.card },
  image: { width: '100%', height: '100%' },
  headerActions: { 
    position: 'absolute', top: spacing.xl, left: spacing.md, right: spacing.md,
    flexDirection: 'row', justifyContent: 'space-between',
  },
  iconBtn: { 
    width: 40, height: 40, borderRadius: 20, 
    backgroundColor: 'rgba(255,255,255,0.8)', 
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2, shadowRadius: 4, elevation: 5
  },
  content: { padding: spacing.lg, marginTop: -20, backgroundColor: colors.background, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  badgeContainer: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  typeBadge: { backgroundColor: colors.primary, paddingHorizontal: spacing.md, paddingVertical: 4, borderRadius: borderRadius.sm },
  typeText: { color: colors.background, fontSize: 12, fontWeight: '700' },
  statusBadge: { paddingHorizontal: spacing.md, paddingVertical: 4, borderRadius: borderRadius.sm },
  statusText: { fontSize: 12, fontWeight: '700' },
  title: { fontSize: 24, fontWeight: '800', color: colors.text, marginBottom: spacing.sm },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: spacing.lg },
  price: { fontSize: 22, fontWeight: '800', color: colors.primary },
  unit: { fontSize: 14, fontWeight: '400', color: colors.textMuted },
  quantity: { fontSize: 14, color: colors.textMuted },
  divider: { height: 1, backgroundColor: colors.border, marginBottom: spacing.lg },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  description: { fontSize: 15, color: colors.textMuted, lineHeight: 22, marginBottom: spacing.xl },
  locationContainer: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xl },
  locationText: { fontSize: 15, color: colors.text },
  sellerCard: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: colors.card, padding: spacing.md, borderRadius: borderRadius.lg,
    borderWidth: 1, borderColor: colors.border
  },
  sellerInfo: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  sellerName: { fontSize: 16, fontWeight: '600', color: colors.text },
  sellerType: { fontSize: 12, color: colors.textMuted },
  contactBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  footer: { 
    position: 'absolute', bottom: 0, left: 0, right: 0, 
    padding: spacing.lg, backgroundColor: colors.background,
    borderTopWidth: 1, borderTopColor: colors.border,
    paddingBottom: spacing.xl
  }
});
