/**
 * MOCKUP — ScanResultScreen (PASS scenario)
 * Epic E1: Status-First Scan Result Screen
 * Epic E3: Live Session Tally in header
 *
 * Changes from current:
 * - Full-bleed green status block dominates top ~40% of screen
 * - Pass layout is minimal: VIN + serial only — no flat data dump
 * - Tally header persists (same as ScanningScreen)
 * - "Next vehicle" is large and the only primary action
 * - "Delete scan" is demoted to small secondary text
 * - "End audit" is a clearly styled secondary button
 *
 * All data is hardcoded — no API calls, no AppContext.
 */

import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';

const MOCK_ROOFTOP = 'Friendly Chevrolet – Dallas';
const MOCK_SCAN_COUNT = 48;
const MOCK_EXCEPTION_COUNT = 6;

const MOCK_VIN = '1HGCM82633A123456';
const MOCK_SERIAL = '016723002393428';

export function ScanResultPassMockup() {
  return (
    <View style={styles.container}>

      {/* ── Persistent header: rooftop + tally ── */}
      <View style={styles.header}>
        <Text style={styles.headerRooftop} numberOfLines={1}>{MOCK_ROOFTOP}</Text>
        <Text style={styles.headerTally}>
          {MOCK_SCAN_COUNT} scanned · {' '}
          <Text style={styles.headerTallyException}>{MOCK_EXCEPTION_COUNT} exceptions</Text>
        </Text>
      </View>

      {/* ── Full-bleed PASS block ── */}
      <View style={styles.statusBlock}>
        <Text style={styles.statusIcon}>✓</Text>
        <Text style={styles.statusLabel}>PASS</Text>
        <Text style={styles.statusSubLabel}>Installed · Reporting</Text>
      </View>

      {/* ── Minimal vehicle details ── */}
      <View style={styles.detailsCard}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>VIN</Text>
          <Text style={styles.detailValue}>{MOCK_VIN}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Serial</Text>
          <Text style={styles.detailValue}>{MOCK_SERIAL}</Text>
        </View>
      </View>

      {/* ── Actions ── */}
      <View style={styles.actions}>
        <Pressable style={styles.nextButton}>
          <Text style={styles.nextButtonText}>Next vehicle →</Text>
        </Pressable>

        <Pressable style={styles.endButton}>
          <Text style={styles.endButtonText}>End audit</Text>
        </Pressable>

        {/* Delete is demoted — small, at the bottom */}
        <Pressable style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Delete scan</Text>
        </Pressable>
      </View>

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

  // Pass status block
  statusBlock: {
    backgroundColor: '#1a7a4a',
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIcon: { fontSize: 48, color: '#fff', marginBottom: 8 },
  statusLabel: { fontSize: 36, fontWeight: '900', color: '#fff', letterSpacing: 2 },
  statusSubLabel: { fontSize: 15, color: '#a8e6c3', marginTop: 6 },

  // Details card
  detailsCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    elevation: 1,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  divider: { height: 1, backgroundColor: '#f0f0f0' },
  detailLabel: { fontSize: 13, color: '#888' },
  detailValue: { fontSize: 15, fontWeight: '600', color: '#111' },

  // Actions
  actions: { paddingHorizontal: 20, marginTop: 'auto', paddingBottom: 32, gap: 12 },
  nextButton: {
    backgroundColor: '#1a7a4a',
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: 'center',
  },
  nextButtonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  endButton: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  endButtonText: { color: '#555', fontSize: 16, fontWeight: '500' },
  deleteButton: { alignItems: 'center', paddingVertical: 8 },
  deleteButtonText: { color: '#aaa', fontSize: 13 },
});
