import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import { colors, spacing, borderRadius } from '../../theme';
import Button from '../../components/Button';
import Input from '../../components/Input';

const ROLES = [
  { id: 'Generator', label: 'Waste Generator', icon: 'restaurant', desc: 'Hotels, markets, households' },
  { id: 'Buyer', label: 'Buyer', icon: 'storefront', desc: 'Farmers, compost, biogas' },
  { id: 'Driver', label: 'Driver', icon: 'car', desc: 'Pickup & delivery partner' },
];

export default function RegisterScreen({ navigation }) {
  const { register, isLoading, error, clearError } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      clearError();
    });
    return unsubscribe;
  }, [navigation]);

  const handleRegister = async () => {
    if (!name || !email || !password || !selectedRole || !city) {
      Alert.alert('Missing Fields', 'Please fill in all required fields and select a role.');
      return;
    }
    
    // Backend expects lowercase roles
    const normalizedRole = selectedRole.toLowerCase();
    
    const success = await register({ 
      name, 
      email, 
      password, 
      phone, 
      city,
      role: normalizedRole 
    });

    if (success) {
      Alert.alert('Success', 'Account created successfully!');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Account</Text>
          <Text style={styles.headerSub}>Join the circular economy</Text>
        </View>

        <View style={styles.formCard}>
          {error && (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={18} color={colors.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <Input label="Full Name" placeholder="John Doe" value={name} onChangeText={setName} />
          <Input label="Email" placeholder="you@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          <Input label="Phone" placeholder="+91 9876543210" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          <Input label="City" placeholder="Hyderabad" value={city} onChangeText={setCity} />
          <Input label="Password" placeholder="Min 6 characters" value={password} onChangeText={setPassword} secureTextEntry />

          <Text style={styles.roleLabel}>I am a...</Text>
          <View style={styles.roleContainer}>
            {ROLES.map((role) => (
              <TouchableOpacity
                key={role.id}
                style={[styles.roleCard, selectedRole === role.id && styles.roleCardActive]}
                onPress={() => setSelectedRole(role.id)}
              >
                <View style={[styles.roleIcon, selectedRole === role.id && styles.roleIconActive]}>
                  <Ionicons name={role.icon} size={22} color={selectedRole === role.id ? colors.background : colors.primary} />
                </View>
                <Text style={[styles.roleText, selectedRole === role.id && styles.roleTextActive]}>{role.label}</Text>
                <Text style={styles.roleDesc}>{role.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Button title="Create Account" onPress={handleRegister} loading={isLoading} disabled={!selectedRole || !city} style={{ marginTop: spacing.lg }} />

          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.switchAuth}>
            <Text style={styles.switchText}>Already have an account? <Text style={styles.switchLink}>Sign In</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { flexGrow: 1, padding: spacing.lg },
  header: { marginBottom: spacing.lg, marginTop: spacing.xl },
  backBtn: { marginBottom: spacing.md },
  headerTitle: { fontSize: 28, fontWeight: '800', color: colors.text },
  headerSub: { fontSize: 14, color: colors.textMuted, marginTop: spacing.xs },
  formCard: { backgroundColor: colors.card, borderRadius: borderRadius.xl, padding: spacing.lg, borderWidth: 1, borderColor: colors.border },
  errorBanner: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: 'rgba(239,68,68,0.1)', padding: spacing.md, borderRadius: borderRadius.md, marginBottom: spacing.md },
  errorText: { color: colors.error, fontSize: 13, flex: 1 },
  roleLabel: { fontSize: 14, fontWeight: '500', color: colors.text, marginBottom: spacing.sm, marginTop: spacing.sm },
  roleContainer: { flexDirection: 'row', gap: spacing.sm },
  roleCard: {
    flex: 1, backgroundColor: colors.background, borderRadius: borderRadius.lg,
    padding: spacing.md, alignItems: 'center', borderWidth: 1, borderColor: colors.border,
  },
  roleCardActive: { borderColor: colors.primary, backgroundColor: 'rgba(16,185,129,0.08)' },
  roleIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(16,185,129,0.15)', justifyContent: 'center', alignItems: 'center', marginBottom: spacing.xs },
  roleIconActive: { backgroundColor: colors.primary },
  roleText: { fontSize: 12, fontWeight: '600', color: colors.text, textAlign: 'center' },
  roleTextActive: { color: colors.primary },
  roleDesc: { fontSize: 9, color: colors.textMuted, textAlign: 'center', marginTop: 2 },
  switchAuth: { alignItems: 'center', marginTop: spacing.lg },
  switchText: { color: colors.textMuted, fontSize: 14 },
  switchLink: { color: colors.primary, fontWeight: '600' },
});
