import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useAppContext } from '../context/AppContext';
import { XANO_AUTH_BASE, XANO_AUDIT_BASE } from '../constants';
import { logoUri, userIconUri, lockIconUri, eyeIconUri } from '../assets';
import { colors, fontColor, radius, spacing, typography } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const { setAuth } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = email.trim().length > 0 && password.length > 0 && !loading;

  const handleLogin = async () => {
    if (!canSubmit) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${XANO_AUTH_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), username: email.trim().toLowerCase(), password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.message ?? 'Invalid credentials. Please try again.');
        return;
      }
      // API returns { token, user: { id, email, name }, ... }
      const token = data.token;
      setAuth(token, data.user?.id);

      // Check for an existing in_progress session (non-blocking)
      try {
        const sessionRes = await fetch(`${XANO_AUDIT_BASE}/audit/active-session`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (sessionRes.ok) {
          const sessionData = await sessionRes.json();
          if (sessionData?.has_active_session) {
            navigation.replace('ResumeSession', {
              session: sessionData.session,
              scanCount: sessionData.scan_count ?? 0,
            });
            return;
          }
        }
      } catch {
        // Non-blocking — fall through to StartSession if check fails
      }
      navigation.replace('DealerGroupSelection');
    } catch {
      setError('Unable to connect. Check your network and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoWrap}>
          <Image source={{ uri: logoUri }} style={styles.logo} resizeMode="contain" />
        </View>

        <Text style={styles.heading}>Welcome Back</Text>

        <View style={styles.inputRow}>
          <Image source={{ uri: userIconUri }} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email or Username"
            placeholderTextColor={fontColor.tertiary}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoCorrect={false}
            returnKeyType="next"
            editable={!loading}
          />
        </View>

        <View style={styles.inputRow}>
          <Image source={{ uri: lockIconUri }} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={fontColor.tertiary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={handleLogin}
            editable={!loading}
          />
          <Pressable
            onPress={() => setShowPassword((v) => !v)}
            hitSlop={8}
            style={styles.inputIconRight}
            accessibilityRole="button"
            accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
          >
            <Image source={{ uri: eyeIconUri }} style={styles.inputIcon} />
          </Pressable>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable
          style={[styles.loginButton, !canSubmit && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={!canSubmit}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.loginButtonText}>LOGIN</Text>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const INPUT_HEIGHT = 52;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: colors.neutral0 },
  content: { padding: spacing.lg, paddingTop: spacing.xl + spacing.md },

  logoWrap: { alignItems: 'center', marginBottom: spacing.lg },
  logo: { width: 240, height: 144 },

  heading: {
    ...typography.headingLg,
    color: fontColor.primary,
    textAlign: 'center',
    marginBottom: spacing.lg + 4,
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.neutral1,
    paddingHorizontal: spacing.md,
    height: INPUT_HEIGHT,
    marginBottom: spacing.md,
  },
  inputIcon: { width: 20, height: 20 },
  inputIconRight: { paddingLeft: spacing.sm },
  input: {
    flex: 1,
    marginLeft: spacing.sm + 4,
    ...typography.bodyLg,
    color: fontColor.primary,
    paddingVertical: 0,
    // @ts-expect-error — web-only: kill default focus ring
    outlineStyle: 'none',
  },

  error: {
    ...typography.bodyMd,
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.md,
  },

  loginButton: {
    backgroundColor: colors.primary1000,
    height: INPUT_HEIGHT,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  loginButtonDisabled: { backgroundColor: colors.neutral2 },
  loginButtonText: { ...typography.labelLg, color: colors.white },
});
