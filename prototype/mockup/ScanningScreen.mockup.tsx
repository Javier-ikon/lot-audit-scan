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
          <Text style={styles.lookupButtonText}>Look up</Text>
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
  container: { flex: 1, backgroundColor: '#f5f7fa' },

  // Header
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
  },
  headerRooftop: { fontSize: 15, fontWeight: '700', color: '#111' },
  headerTally: { fontSize: 13, color: '#555', marginTop: 2 },
  headerTallyException: { color: '#c0392b', fontWeight: '700' },

  // Auto-return banner
  autoReturnBanner: {
    backgroundColor: '#eaffea',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#b3ffb3',
  },
  autoReturnText: { fontSize: 13, color: '#1AAD1A', fontWeight: '600' },

  // Body
  body: { flex: 1, padding: 24 },
  title: { fontSize: 24, fontWeight: '700', color: '#111', marginBottom: 6 },
  subtitle: { fontSize: 15, color: '#666', marginBottom: 28 },

  // Input — box style
  input: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 16,
    fontSize: 18,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  inputError: { borderColor: '#c0392b' },
  errorText: { color: '#c0392b', fontSize: 13, marginBottom: 12 },

  // Look up button
  lookupButton: {
    backgroundColor: '#0066cc',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  lookupButtonDisabled: { backgroundColor: '#ccc' },
  lookupButtonText: { color: '#fff', fontSize: 17, fontWeight: '600' },

  // End audit
  endButton: {
    marginHorizontal: 20,
    marginBottom: 32,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  endButtonText: { color: '#555', fontSize: 16, fontWeight: '500' },
});
