import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../theme';
import Button from '../../components/Button';

const STATUSES = ['Heading to Pickup', 'At Pickup', 'In Transit', 'Delivered'];

export default function ActiveDeliveryScreen({ navigation }) {
  const [currentStep, setCurrentStep] = useState(0);

  const advanceStatus = () => {
    if (currentStep < STATUSES.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      {/* Map placeholder */}
      <View style={styles.mapPlaceholder}>
        <Ionicons name="map" size={64} color={colors.primary} />
        <Text style={styles.mapText}>Live Map View</Text>
        <Text style={styles.mapSubtext}>GPS tracking active</Text>
      </View>

      {/* Bottom sheet */}
      <View style={styles.sheet}>
        <View style={styles.handle} />

        <View style={styles.orderInfo}>
          <Text style={styles.orderTitle}>Vegetable Waste Pickup</Text>
          <Text style={styles.orderSub}>50 kg • Green Kitchen Restaurant</Text>
        </View>

        {/* Status stepper */}
        <View style={styles.stepper}>
          {STATUSES.map((status, i) => (
            <View key={status} style={styles.stepRow}>
              <View style={styles.stepIndicator}>
                <View style={[styles.stepCircle, i <= currentStep && styles.stepCircleActive]}>
                  {i < currentStep ? (
                    <Ionicons name="checkmark" size={12} color={colors.background} />
                  ) : i === currentStep ? (
                    <View style={styles.stepPulse} />
                  ) : null}
                </View>
                {i < STATUSES.length - 1 && <View style={[styles.stepLine, i < currentStep && styles.stepLineActive]} />}
              </View>
              <Text style={[styles.stepText, i <= currentStep && styles.stepTextActive]}>{status}</Text>
            </View>
          ))}
        </View>

        <View style={styles.contactRow}>
          <TouchableOpacity style={styles.contactBtn}>
            <Ionicons name="call" size={20} color={colors.primary} />
            <Text style={styles.contactText}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactBtn}>
            <Ionicons name="chatbubble" size={20} color={colors.primary} />
            <Text style={styles.contactText}>Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactBtn}>
            <Ionicons name="navigate" size={20} color={colors.primary} />
            <Text style={styles.contactText}>Navigate</Text>
          </TouchableOpacity>
        </View>

        <Button
          title={currentStep < STATUSES.length - 1 ? `Confirm: ${STATUSES[currentStep + 1]}` : 'Complete Delivery'}
          onPress={advanceStatus}
          style={{ marginTop: spacing.md }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  mapPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.card },
  mapText: { fontSize: 18, fontWeight: '700', color: colors.text, marginTop: spacing.md },
  mapSubtext: { fontSize: 12, color: colors.textMuted },
  sheet: { backgroundColor: colors.card, borderTopLeftRadius: borderRadius.xl, borderTopRightRadius: borderRadius.xl, padding: spacing.lg, borderTopWidth: 1, borderColor: colors.border },
  handle: { width: 40, height: 4, backgroundColor: colors.border, borderRadius: 2, alignSelf: 'center', marginBottom: spacing.md },
  orderInfo: { marginBottom: spacing.lg },
  orderTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  orderSub: { fontSize: 13, color: colors.textMuted, marginTop: spacing.xs },
  stepper: { marginBottom: spacing.md },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  stepIndicator: { alignItems: 'center', width: 20 },
  stepCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.border, justifyContent: 'center', alignItems: 'center' },
  stepCircleActive: { borderColor: colors.primary, backgroundColor: colors.primary },
  stepPulse: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.background },
  stepLine: { width: 2, height: 24, backgroundColor: colors.border },
  stepLineActive: { backgroundColor: colors.primary },
  stepText: { fontSize: 13, color: colors.textMuted, paddingTop: 2 },
  stepTextActive: { color: colors.text, fontWeight: '600' },
  contactRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm },
  contactBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, padding: spacing.md, borderRadius: borderRadius.md, backgroundColor: 'rgba(16,185,129,0.1)', borderWidth: 1, borderColor: colors.primary },
  contactText: { fontSize: 13, fontWeight: '600', color: colors.primary },
});
