import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, borderRadius } from '../../theme';
import Button from '../../components/Button';
import Input from '../../components/Input';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

const WASTE_TYPES = ['Vegetable', 'Fruit', 'Food', 'Garden', 'Dairy', 'Other'];

export default function PostWasteScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [wasteType, setWasteType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [pricePerKg, setPricePerKg] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const handleSubmit = async () => {
    if (!title || !wasteType || !quantity || !pricePerKg) {
      Alert.alert('Missing Fields', 'Please fill in all required fields.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/waste', {
        title, 
        description, 
        type: wasteType.toLowerCase(), 
        quantity: Number(quantity),
        unit: 'kg',
        price: Number(pricePerKg),
        city: user?.city || 'Hyderabad',
        pickupTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        location: { type: 'Point', coordinates: [78.4867, 17.3850] },
      });
      Alert.alert('Success!', 'Your waste listing has been posted.');
      setTitle(''); setDescription(''); setWasteType(''); setQuantity(''); setPricePerKg(''); setImage(null);
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.guestContainer}>
        <Ionicons name="lock-closed-outline" size={64} color={colors.primary} />
        <Text style={styles.guestTitle}>Login Required</Text>
        <Text style={styles.guestText}>You need to be logged in as a Generator to post waste listings.</Text>
        <Button 
          title="Login / Register" 
          onPress={() => navigation.navigate('Auth')} 
          style={{ width: '100%', marginTop: spacing.xl }} 
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.heading}>Post Waste Listing</Text>
        <Text style={styles.subheading}>Help farmers get organic waste</Text>

        {/* Image picker */}
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {image ? (
            <View style={styles.imagePreview}>
              <Ionicons name="checkmark-circle" size={32} color={colors.success} />
              <Text style={styles.imageText}>Photo selected</Text>
            </View>
          ) : (
            <>
              <Ionicons name="camera-outline" size={36} color={colors.primary} />
              <Text style={styles.imageText}>Add Photo</Text>
            </>
          )}
        </TouchableOpacity>

        <Input label="Title *" placeholder="e.g., Fresh vegetable peels" value={title} onChangeText={setTitle} />
        <Input label="Description" placeholder="Describe the waste..." value={description} onChangeText={setDescription} multiline numberOfLines={3} />

        <Text style={styles.sectionLabel}>Waste Type *</Text>
        <View style={styles.typeGrid}>
          {WASTE_TYPES.map((t) => (
            <TouchableOpacity key={t} style={[styles.typeChip, wasteType === t && styles.typeChipActive]} onPress={() => setWasteType(t)}>
              <Text style={[styles.typeText, wasteType === t && styles.typeTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Input label="Quantity (kg) *" placeholder="50" value={quantity} onChangeText={setQuantity} keyboardType="numeric" />
          </View>
          <View style={{ flex: 1 }}>
            <Input label="Price (₹/kg) *" placeholder="3" value={pricePerKg} onChangeText={setPricePerKg} keyboardType="numeric" />
          </View>
        </View>

        <Button title="Post Listing" onPress={handleSubmit} loading={loading} style={{ marginTop: spacing.md, marginBottom: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  heading: { fontSize: 24, fontWeight: '800', color: colors.text },
  subheading: { fontSize: 14, color: colors.textMuted, marginBottom: spacing.lg },
  imagePicker: {
    height: 140, backgroundColor: colors.card, borderRadius: borderRadius.lg,
    borderWidth: 2, borderColor: colors.border, borderStyle: 'dashed',
    justifyContent: 'center', alignItems: 'center', marginBottom: spacing.lg,
  },
  imagePreview: { alignItems: 'center' },
  imageText: { color: colors.textMuted, marginTop: spacing.sm, fontSize: 13 },
  sectionLabel: { fontSize: 14, fontWeight: '500', color: colors.text, marginBottom: spacing.sm },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  typeChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, backgroundColor: colors.card, borderRadius: borderRadius.round, borderWidth: 1, borderColor: colors.border },
  typeChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  typeText: { fontSize: 13, color: colors.textMuted },
  typeTextActive: { color: colors.background, fontWeight: '700' },
  row: { flexDirection: 'row', gap: spacing.md },
  guestContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl, backgroundColor: colors.background },
  guestTitle: { fontSize: 24, fontWeight: '800', color: colors.text, marginTop: spacing.lg },
  guestText: { fontSize: 14, color: colors.textMuted, textAlign: 'center', marginTop: spacing.sm, lineHeight: 22 },
});
