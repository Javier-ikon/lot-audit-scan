/**
 * MOCKUP — ScanResultScreen (EXCEPTION scenario)
 * Epic E1: Status-First Scan Result Screen — Story 1.2 Required Action per type
 * Epic E3: Live Session Tally in header
 *
 * Changes from current:
 * - Full-bleed red/amber status block with exception TYPE name (not generic "EXCEPTION")
 * - Required ACTION prominently shown — what the FSM must DO, not just what the status is
 * - Supporting device details collapsed below action
 * - Tally header persists and exception count increments
 * - Toggle MOCK_EXCEPTION_TYPE to preview all 5 exception states
 *
 * All data is hardcoded — no API calls, no AppContext.
 */

import React from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';

const MOCK_ROOFTOP = 'Friendly Chevrolet – Dallas';
const MOCK_SCAN_COUNT = 48;
const MOCK_EXCEPTION_COUNT = 7; // incremented after this scan

const MOCK_VIN = '3VWFE21C04M000001';
const MOCK_SERIAL = '016723009871234';
const MOCK_LAST_REPORT = '3 days ago';
const MOCK_COMPANY = 'John Smith';
const MOCK_GROUP = 'John Smith';

// Toggle this to preview each exception type
// Options: 'not_reporting' | 'wrong_dealer' | 'customer_linked' | 'not_installed' | 'missing_device'
const MOCK_EXCEPTION_TYPE = 'not_reporting';

const EXCEPTION_CONFIG: Record<string, { label: string; color: string; action: string }> = {
  not_reporting: {
    label: 'Not Reporting',
    color: '#c0392b',
    action: 'Note device as Not Reporting. Check antenna connection and cellular signal. Log in PlanetX.',
  },
  wrong_dealer: {
    label: 'Wrong Dealer',
    color: '#d35400',
    action: 'Device is assigned to a different rooftop. Note VIN and contact Field Support to reassign.',
  },
  customer_linked: {
    label: 'Customer Linked',
    color: '#8e44ad',
    action: 'Device is registered to an end customer. Note VIN — do not remove. Flag for Field Support review.',
  },
  not_installed: {
    label: 'Not Installed',
    color: '#c0392b',
    action: 'No device detected on this vehicle. Note VIN and schedule installation with the dealer.',
  },
  missing_device: {
    label: 'Missing Device',
    color: '#7f8c8d',
    action: 'Device is physically missing. Note VIN and report to Field Support immediately.',
  },
};

export function ScanResultExceptionMockup() {
  const exc = EXCEPTION_CONFIG[MOCK_EXCEPTION_TYPE];

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

      {/* ── Full-bleed EXCEPTION block ── */}
      <View style={[styles.statusBlock, { backgroundColor: exc.color }]}>
        <Text style={styles.statusIcon}>⚠</Text>
        <Text style={styles.statusLabel}>{exc.label.toUpperCase()}</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>

        {/* ── Required action — the most important thing ── */}
        <View style={styles.actionCard}>
          <Text style={styles.actionTitle}>REQUIRED ACTION</Text>
          <Text style={styles.actionText}>{exc.action}</Text>
        </View>

        {/* ── Supporting device details ── */}
        <View style={styles.detailsCard}>
          {[
            { label: 'VIN', value: MOCK_VIN },
            { label: 'Serial', value: MOCK_SERIAL },
            { label: 'Last Report', value: MOCK_LAST_REPORT },
            { label: 'Company', value: MOCK_COMPANY },
            { label: 'Group', value: MOCK_GROUP },
          ].map((row, i, arr) => (
            <View key={row.label}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{row.label}</Text>
                <Text style={styles.detailValue}>{row.value}</Text>
              </View>
              {i < arr.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        {/* ── Actions ── */}
        <View style={styles.actions}>
          <Pressable style={[styles.nextButton, { backgroundColor: exc.color }]}>
            <Text style={styles.nextButtonText}>Next vehicle →</Text>
          </Pressable>
          <Pressable style={styles.endButton}>
            <Text style={styles.endButtonText}>End audit</Text>
          </Pressable>
          <Pressable style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>Delete scan</Text>
          </Pressable>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa' },

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

  statusBlock: {
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIcon: { fontSize: 36, color: '#fff', marginBottom: 6 },
  statusLabel: { fontSize: 28, fontWeight: '900', color: '#fff', letterSpacing: 1 },

  scroll: { flex: 1 },
  scrollContent: { padding: 20, gap: 16, paddingBottom: 40 },

  actionCard: {
    backgroundColor: '#fff5f5',
    borderLeftWidth: 4,
    borderLeftColor: '#c0392b',
    borderRadius: 8,
    padding: 16,
  },
  actionTitle: { fontSize: 11, fontWeight: '800', color: '#c0392b', letterSpacing: 1, marginBottom: 8 },
  actionText: { fontSize: 15, color: '#222', lineHeight: 22 },

  detailsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  divider: { height: 1, backgroundColor: '#f0f0f0' },
  detailLabel: { fontSize: 13, color: '#888' },
  detailValue: { fontSize: 14, fontWeight: '600', color: '#111', flexShrink: 1, textAlign: 'right', paddingLeft: 12 },

  actions: { gap: 12 },
  nextButton: {
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
