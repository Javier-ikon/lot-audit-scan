/**
 * MOCKUP — ScanningScreen (updated)
 * Epic E3: Live Session Tally & Rooftop Context
 * Epic E2: Auto-return concept (countdown banner)
 *
 * Changes from current prototype:
 * - Header shows rooftop name + "47 scanned · 6 exceptions" instead of flat "Scans: N"
 * - Input box is front-and-center (correct for DataWedge — hardware trigger injects VIN as keystrokes)
 * - NO "ready to scan" camera-style zone — TC58 doesn't work that way
 * - Auto-return banner: after a scan result, a "Returning in 3s…" notice shows at top
 *   so FSM knows the app is coming back automatically (no tap needed)
 * - "End audit" is a proper bordered button, not a ghost text link
 *
 * All data is hardcoded — no API calls, no AppContext.
 */

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
} from 'react-native';

import { colors, fontColor, radius, spacing, typography } from './theme';

const MOCK_ROOFTOP = 'Friendly Chevrolet – Dallas';
const MOCK_SCAN_COUNT = 47;
const MOCK_EXCEPTION_COUNT = 6;
const VIN_LENGTH = 17;
const VIN_REGEX = /^[A-HJ-NPR-Z0-9]{17}$/;

// Toggle to true to preview the auto-return banner (simulates returning from a scan result)
const SHOW_AUTO_RETURN_BANNER = true;
const AUTO_RETURN_SECONDS = 3;

export function ScanningScreenMockup() {
  const [vin, setVin] = useState('');
  const [scanError, setScanError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(AUTO_RETURN_SECONDS);
  const isValidVin = VIN_REGEX.test(vin.replace(/\s/g, ''));

  // Simulate the countdown ticking down
  useEffect(() => {
    if (!SHOW_AUTO_RETURN_BANNER) return;
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  return (
    <View style={styles.container}>

      {/* ── Header: rooftop name + live pass/exception tally ── */}
      <View style={styles.header}>
        <Text style={styles.headerRooftop} numberOfLines={1}>{MOCK_ROOFTOP}</Text>
        <Text style={styles.headerTally}>
          {MOCK_SCAN_COUNT} scanned · {' '}
          <Text style={styles.headerTallyException}>{MOCK_EXCEPTION_COUNT} exceptions</Text>
        </Text>
      </View>

      {/* ── Auto-return banner (shown after navigating back from a scan result) ── */}
      {SHOW_AUTO_RETURN_BANNER && countdown > 0 && (
        <View style={styles.autoReturnBanner}>
          <Text style={styles.autoReturnText}>
            ✓ Scan recorded — ready for next vehicle in {countdown}s
          </Text>
        </View>
      )}

      {/* ── Title ── */}
      <View style={styles.body}>
        <Text style={styles.title}>Scan VIN</Text>
        <Text style={styles.subtitle}>
          Pull trigger to scan barcode, or type below
        </Text>

        {/* ── VIN input — DataWedge injects here on trigger pull ── */}
        <TextInput
          style={[styles.input, scanError ? styles.inputError : null]}
          placeholder="17-character VIN"
          placeholderTextColor="#999"
          value={vin}
          onChangeText={(text) => { setVin(text.toUpperCase()); setScanError(null); }}
          maxLength={VIN_LENGTH}
          autoCapitalize="characters"
          autoCorrect={false}
          autoFocus
          returnKeyType="done"
        />
        {scanError ? <Text style={styles.errorText}>{scanError}</Text> : null}

        <Pressable
          style={[styles.lookupButton, !isValidVin && styles.lookupButtonDisabled]}
          disabled={!isValidVin}
        >
          <Text style={[styles.lookupButtonText, !isValidVin && styles.lookupButtonTextDisabled]}>
            Look up
          </Text>
        </Pressable>
      </View>

      {/* ── End audit — bordered button, not a ghost link ── */}
      <Pressable style={styles.endButton}>
        <Text style={styles.endButtonText}>End audit</Text>
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.neutral0 },

  // Header
  header: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md - 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral1,
  },
  headerRooftop: { ...typography.headingSm, color: fontColor.primary },
  headerTally: { ...typography.bodySm, color: fontColor.secondary, marginTop: 2 },
  headerTallyException: { color: colors.error, fontWeight: '700' },

  // Auto-return banner
  autoReturnBanner: {
    backgroundColor: colors.primary100,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary200,
  },
  autoReturnText: {
    ...typography.labelMd,
    color: colors.secondary1000,
  },

  // Body
  body: { flex: 1, padding: spacing.lg },
  title: { ...typography.display, color: fontColor.primary, marginBottom: spacing.xs + 2 },
  subtitle: { ...typography.bodyLg, color: fontColor.secondary, marginBottom: spacing.lg + 4 },

  // Input — box style
  input: {
    borderWidth: 1,
    borderColor: colors.neutral1,
    borderRadius: radius.sm,
    padding: spacing.md,
    fontSize: 18,
    fontFamily: typography.fontFamily,
    color: fontColor.primary,
    backgroundColor: colors.white,
    marginBottom: spacing.sm,
  },
  inputError: { borderColor: colors.error, borderWidth: 2 },
  errorText: { ...typography.bodySm, color: colors.error, marginBottom: spacing.sm + 4 },

  // Look up button (primary)
  lookupButton: {
    backgroundColor: colors.primary1000,
    paddingVertical: spacing.md,
    borderRadius: radius.sm,
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  lookupButtonDisabled: { backgroundColor: colors.neutral1 },
  lookupButtonText: { ...typography.labelLg, color: colors.white },
  lookupButtonTextDisabled: { color: colors.neutral3 },

  // End audit (secondary outline)
  endButton: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    paddingVertical: spacing.md - 2,
    borderRadius: radius.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary1000,
    backgroundColor: 'transparent',
  },
  endButtonText: { ...typography.labelLg, color: colors.primary1000 },
});
