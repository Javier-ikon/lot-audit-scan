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

import { colors, fontColor, radius, spacing, typography } from './theme';

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
    color: colors.error,
    action: 'Note device as Not Reporting. Check antenna connection and cellular signal. Log in PlanetX.',
  },
  wrong_dealer: {
    label: 'Wrong Dealer',
    color: colors.warning,
    action: 'Device is assigned to a different rooftop. Note VIN and contact Field Support to reassign.',
  },
  customer_linked: {
    label: 'Customer Linked',
    color: colors.purple100,
    action: 'Device is registered to an end customer. Note VIN — do not remove. Flag for Field Support review.',
  },
  not_installed: {
    label: 'Not Installed',
    color: colors.error,
    action: 'No device detected on this vehicle. Note VIN and schedule installation with the dealer.',
  },
  missing_device: {
    label: 'Missing Device',
    color: colors.neutral8,
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

  statusBlock: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIcon: { fontSize: 36, color: colors.white, marginBottom: spacing.xs + 2 },
  statusLabel: {
    ...typography.headingLg,
    color: colors.white,
    fontSize: 28,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },

  scroll: { flex: 1 },
  scrollContent: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xl + spacing.sm },

  actionCard: {
    backgroundColor: colors.error25,
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
    borderRadius: radius.sm,
    padding: spacing.md,
  },
  actionTitle: { ...typography.labelMd, color: colors.error, marginBottom: spacing.sm },
  actionText: { ...typography.bodyLg, color: fontColor.primary },

  detailsCard: {
    backgroundColor: colors.white,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.neutral1,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm + 4,
  },
  divider: { height: 1, backgroundColor: colors.neutral1 },
  detailLabel: { ...typography.labelSm, color: fontColor.tertiary },
  detailValue: {
    ...typography.bodyMd,
    fontWeight: '600',
    color: fontColor.primary,
    flexShrink: 1,
    textAlign: 'right',
    paddingLeft: spacing.sm + 4,
  },

  actions: { gap: spacing.sm + 4 },
  nextButton: {
    paddingVertical: spacing.md + 2,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  nextButtonText: { ...typography.labelLg, fontSize: 16, color: colors.white },
  endButton: {
    paddingVertical: spacing.md - 2,
    borderRadius: radius.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary1000,
    backgroundColor: 'transparent',
  },
  endButtonText: { ...typography.labelLg, color: colors.primary1000 },
  deleteButton: { alignItems: 'center', paddingVertical: spacing.sm },
  deleteButtonText: { ...typography.labelSm, color: fontColor.tertiary },
});
