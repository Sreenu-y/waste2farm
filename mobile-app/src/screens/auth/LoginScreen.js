import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../../context/AuthContext";
import { colors, spacing, borderRadius } from "../../theme";
import Button from "../../components/Button";
import Input from "../../components/Input";

export default function LoginScreen({ navigation }) {
  const { login, isLoading, error, clearError } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      clearError();
    });
    return unsubscribe;
  }, [navigation]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing Fields", "Please enter both email and password.");
      return;
    }
    const success = await login(email, password);
    if (!success) {
      // Error is handled by context and displayed in the banner
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <View style={styles.logoCircle}>
            <Ionicons name="leaf" size={48} color={colors.primary} />
          </View>
          <Text style={styles.brandName}>Waste2Farm</Text>
          <Text style={styles.tagline}>Turn waste into wealth</Text>
        </View>

        {/* Form Section */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Welcome Back</Text>
          <Text style={styles.formSubtitle}>Sign in to continue</Text>

          {error && (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={18} color={colors.error} />
              <Text style={styles.errorBannerText}>{error}</Text>
            </View>
          )}

          <Input
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View>
            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color={colors.textMuted}
              />
            </TouchableOpacity>
          </View>

          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={isLoading}
            style={{ marginTop: spacing.md }}
          />

          <TouchableOpacity
            onPress={() => navigation.navigate("Register")}
            style={styles.switchAuth}
          >
            <Text style={styles.switchAuthText}>
              Don't have an account?{" "}
              <Text style={styles.switchAuthLink}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Demo Credentials */}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { flexGrow: 1, justifyContent: "center", padding: spacing.lg },
  logoSection: { alignItems: "center", marginBottom: spacing.xl },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.card,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.primary,
    marginBottom: spacing.md,
  },
  brandName: { fontSize: 32, fontWeight: "800", color: colors.text },
  tagline: { fontSize: 14, color: colors.textMuted, marginTop: spacing.xs },
  formCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  formSubtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: "rgba(239,68,68,0.1)",
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  errorBannerText: { color: colors.error, fontSize: 13, flex: 1 },
  eyeIcon: { position: "absolute", right: spacing.md, top: 38 },
  switchAuth: { alignItems: "center", marginTop: spacing.lg },
  switchAuthText: { color: colors.textMuted, fontSize: 14 },
  switchAuthLink: { color: colors.primary, fontWeight: "600" },
  demoCard: {
    backgroundColor: "rgba(16,185,129,0.1)",
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.primary,
  },
  demoTitle: { color: colors.primary, fontWeight: "600", fontSize: 13 },
  demoText: { color: colors.textMuted, fontSize: 12, marginTop: spacing.xs },
});
