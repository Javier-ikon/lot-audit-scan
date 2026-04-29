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

import { colors, fontColor, radius, spacing, typography } from './theme';

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

  // Pass status block — uses primary brand green
  statusBlock: {
    backgroundColor: colors.primary1000,
    paddingVertical: spacing.xl + spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIcon: { fontSize: 48, color: colors.white, marginBottom: spacing.sm },
  statusLabel: {
    ...typography.display,
    color: colors.white,
    fontSize: 36,
    letterSpacing: 2,
  },
  statusSubLabel: {
    ...typography.labelMd,
    color: colors.primary200,
    marginTop: spacing.sm - 2,
  },

  // Details card
  detailsCard: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
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
    paddingVertical: spacing.md - 2,
  },
  divider: { height: 1, backgroundColor: colors.neutral1 },
  detailLabel: { ...typography.labelSm, color: fontColor.tertiary },
  detailValue: { ...typography.bodyMd, fontWeight: '600', color: fontColor.primary },

  // Actions
  actions: {
    paddingHorizontal: spacing.lg,
    marginTop: 'auto',
    paddingBottom: spacing.xl,
    gap: spacing.sm + 4,
  },
  nextButton: {
    backgroundColor: colors.primary1000,
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
