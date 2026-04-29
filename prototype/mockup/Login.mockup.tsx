/**
 * MOCKUP — LoginScreen
 *
 * Entry point sign-in for the FSM. Shows the Toolbox Lot Audit wordmark,
 * username + password fields, terms acceptance, and primary / secondary
 * actions. All state is local + hardcoded — no auth API.
 */

import React, { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { logoUri, userIconUri, lockIconUri, eyeIconUri } from './assets';
import { colors, fontColor, radius, spacing, typography } from './theme';

export function LoginMockup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const canSubmit = username.length > 0 && password.length > 0 && acceptedTerms;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.logoWrap}>
        <Image source={{ uri: logoUri }} style={styles.logo} resizeMode="contain" />
      </View>

      <Text style={styles.heading}>Welcome Back</Text>

      {/* ── Username ── */}
      <View style={styles.inputRow}>
        <Image source={{ uri: userIconUri }} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Email or Username"
          placeholderTextColor={fontColor.tertiary}
          autoCapitalize="none"
          autoCorrect={false}
          value={username}
          onChangeText={setUsername}
        />
      </View>

      {/* ── Password ── */}
      <View style={styles.inputRow}>
        <Image source={{ uri: lockIconUri }} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={fontColor.tertiary}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoCorrect={false}
          value={password}
          onChangeText={setPassword}
        />
        <Pressable
          onPress={() => setShowPassword((v) => !v)}
          hitSlop={8}
          style={styles.inputIconRight}
        >
          <Image source={{ uri: eyeIconUri }} style={styles.inputIcon} />
        </Pressable>
      </View>

      {/* ── Terms ── */}
      <Pressable
        style={styles.termsRow}
        onPress={() => setAcceptedTerms((v) => !v)}
      >
        <View style={[styles.checkbox, acceptedTerms && styles.checkboxOn]}>
          {acceptedTerms && <Text style={styles.checkboxMark}>✓</Text>}
        </View>
        <Text style={styles.termsText}>
          I agree to the <Text style={styles.termsLink}>Terms & Conditions</Text> and{' '}
          <Text style={styles.termsLink}>Privacy Policy</Text>
        </Text>
      </Pressable>

      {/* ── Actions ── */}
      <Pressable
        disabled={!canSubmit}
        style={[styles.loginButton, !canSubmit && styles.loginButtonDisabled]}
      >
        <Text style={styles.loginButtonText}>LOGIN</Text>
      </Pressable>

      <Pressable style={styles.forgotButton}>
        <Text style={styles.forgotButtonText}>FORGOT PASSWORD?</Text>
      </Pressable>
    </ScrollView>
  );
}

const INPUT_HEIGHT = 52;

const styles = StyleSheet.create({
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

  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.neutral4,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm + 4,
    marginTop: 2,
  },
  checkboxOn: {
    backgroundColor: colors.primary1000,
    borderColor: colors.primary1000,
  },
  checkboxMark: { color: colors.white, fontSize: 13, fontWeight: '700' },
  termsText: { ...typography.bodyMd, color: fontColor.secondary, flex: 1 },
  termsLink: { color: colors.primary1000, fontWeight: '600' },

  loginButton: {
    backgroundColor: colors.primary1000,
    height: INPUT_HEIGHT,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  loginButtonDisabled: { backgroundColor: colors.neutral2 },
  loginButtonText: { ...typography.labelLg, color: colors.white },

  forgotButton: {
    height: INPUT_HEIGHT,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primary1000,
    backgroundColor: 'transparent',
  },
  forgotButtonText: { ...typography.labelLg, color: colors.primary1000 },
});
