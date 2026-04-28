/**
 * MOCKUP — ScanningScreen
 * Epic E2: Auto-Submit & Ready State
 * Epic E3: Live Session Tally & Rooftop Context
 *
 * Changes from current:
 * - Header shows rooftop name + "X scanned · Y exceptions" instead of flat "Scans: N"
 * - "Ready to scan" visual state (scanner target area) replaces form-first layout
 * - "Look up" button demoted to secondary — primary action is the scanner
 * - "End audit" is a clearly styled secondary button, not a ghost text link
 *
 * All data is hardcoded — no API calls, no AppContext.
 */

import React, { useState } from 'react';
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

export function ScanningScreenMockup() {
  const [vin, setVin] = useState('');
  const [scanError, setScanError] = useState<string | null>(null);
  const isValidVin = VIN_REGEX.test(vin.replace(/\s/g, ''));

  return (
    <View style={styles.container}>

      {/* ── Header: rooftop + live tally ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerRooftop} numberOfLines={1}>{MOCK_ROOFTOP}</Text>
          <Text style={styles.headerTally}>
            {MOCK_SCAN_COUNT} scanned · {' '}
            <Text style={styles.headerTallyException}>{MOCK_EXCEPTION_COUNT} exceptions</Text>
          </Text>
        </View>
      </View>

      {/* ── Ready-to-scan zone ── */}
      <View style={styles.scanZone}>
        <View style={styles.scanTarget}>
          <Text style={styles.scanIcon}>▣</Text>
          <Text style={styles.scanReadyText}>Ready to scan</Text>
          <Text style={styles.scanHint}>Point scanner at windshield barcode</Text>
        </View>
      </View>

      {/* ── Manual entry fallback ── */}
      <Text style={styles.orLabel}>or enter manually</Text>
      <TextInput
        style={[styles.input, scanError ? styles.inputError : null]}
        placeholder="Enter 17-character VIN"
        placeholderTextColor="#999"
        value={vin}
        onChangeText={(text) => { setVin(text.toUpperCase()); setScanError(null); }}
        maxLength={VIN_LENGTH}
        autoCapitalize="characters"
        autoCorrect={false}
        returnKeyType="done"
      />
      {scanError ? <Text style={styles.errorText}>{scanError}</Text> : null}

      <Pressable
        style={[styles.lookupButton, !isValidVin && styles.lookupButtonDisabled]}
        disabled={!isValidVin}
      >
        <Text style={styles.lookupButtonText}>Look up VIN</Text>
      </Pressable>

      {/* ── End audit — clearly styled, not a ghost link ── */}
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
  headerLeft: { flexShrink: 1 },
  headerRooftop: { fontSize: 15, fontWeight: '700', color: '#111' },
  headerTally: { fontSize: 13, color: '#555', marginTop: 2 },
  headerTallyException: { color: '#c0392b', fontWeight: '700' },

  // Scan zone
  scanZone: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  scanTarget: {
    width: '100%',
    aspectRatio: 1.6,
    borderWidth: 2,
    borderColor: '#0066cc',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eaf2ff',
  },
  scanIcon: { fontSize: 48, color: '#0066cc', marginBottom: 12 },
  scanReadyText: { fontSize: 20, fontWeight: '700', color: '#0066cc' },
  scanHint: { fontSize: 13, color: '#555', marginTop: 6, textAlign: 'center' },

  // Manual entry
  orLabel: { textAlign: 'center', color: '#999', fontSize: 13, marginBottom: 8 },
  input: {
    marginHorizontal: 20,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 14,
    fontSize: 17,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  inputError: { borderColor: '#c0392b' },
  errorText: { color: '#c0392b', fontSize: 13, marginHorizontal: 20, marginBottom: 8 },
  lookupButton: {
    marginHorizontal: 20,
    backgroundColor: '#0066cc',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  lookupButtonDisabled: { backgroundColor: '#ccc' },
  lookupButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },

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
