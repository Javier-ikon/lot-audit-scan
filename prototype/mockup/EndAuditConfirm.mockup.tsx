/**
 * MOCKUP — EndAuditConfirmScreen
 * Epic E4: End Audit & Report Experience — Story 4.1
 *
 * Changes from current:
 * - Shows full session summary BEFORE the FSM confirms ending
 * - Total scanned, pass count, exception count clearly visible
 * - Gives FSM the information they need to catch an accidental early end
 * - Confirm button still red/destructive — ending is irreversible
 *
 * All data is hardcoded — no API calls, no AppContext.
 */

import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';

import { colors, fontColor, radius, spacing, typography } from './theme';

const MOCK_ROOFTOP = 'Friendly Chevrolet – Dallas';
const MOCK_TOTAL = 127;
const MOCK_PASS = 109;
const MOCK_EXCEPTIONS = 18;

export function EndAuditConfirmMockup() {
  return (
    <View style={styles.container}>

      <Text style={styles.title}>End audit?</Text>
      <Text style={styles.subtitle}>Review your session before closing.</Text>

      {/* ── Session summary ── */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryRooftop}>{MOCK_ROOFTOP}</Text>

        <View style={styles.statsRow}>
          <View style={styles.statBlock}>
            <Text style={styles.statNumber}>{MOCK_TOTAL}</Text>
            <Text style={styles.statLabel}>Scanned</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBlock}>
            <Text style={[styles.statNumber, styles.statPass]}>{MOCK_PASS}</Text>
            <Text style={styles.statLabel}>Pass</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBlock}>
            <Text style={[styles.statNumber, styles.statException]}>{MOCK_EXCEPTIONS}</Text>
            <Text style={styles.statLabel}>Exceptions</Text>
          </View>
        </View>
      </View>

      <Text style={styles.confirmNote}>
        Once ended, the session is closed and your report will be generated.
      </Text>

      {/* ── Actions ── */}
      <Pressable style={styles.confirmButton}>
        <Text style={styles.confirmButtonText}>Yes, end audit</Text>
      </Pressable>

      <Pressable style={styles.cancelButton}>
        <Text style={styles.cancelButtonText}>Cancel — keep scanning</Text>
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral0,
    padding: spacing.lg,
    justifyContent: 'center',
  },

  title: {
    ...typography.display,
    color: fontColor.primary,
    textAlign: 'center',
    marginBottom: spacing.xs + 2,
  },
  subtitle: {
    ...typography.bodyLg,
    color: fontColor.secondary,
    textAlign: 'center',
    marginBottom: spacing.lg + 4,
  },

  // Summary card
  summaryCard: {
    backgroundColor: colors.white,
    borderRadius: radius.sm,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.neutral1,
  },
  summaryRooftop: {
    ...typography.labelMd,
    color: fontColor.primary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statBlock: { alignItems: 'center', flex: 1 },
  statDivider: { width: 1, height: 40, backgroundColor: colors.neutral1 },
  statNumber: {
    ...typography.display,
    fontSize: 32,
    color: fontColor.primary,
  },
  statPass: { color: colors.primary1000 },
  statException: { color: colors.error },
  statLabel: {
    ...typography.labelSm,
    color: fontColor.tertiary,
    marginTop: spacing.xs,
  },

  confirmNote: {
    ...typography.bodySm,
    color: fontColor.tertiary,
    textAlign: 'center',
    marginBottom: spacing.lg + 4,
  },

  // Actions
  confirmButton: {
    backgroundColor: colors.error,
    paddingVertical: spacing.md + 2,
    borderRadius: radius.sm,
    alignItems: 'center',
    marginBottom: spacing.sm + 4,
  },
  confirmButtonText: { ...typography.labelLg, color: colors.white },

  cancelButton: {
    paddingVertical: spacing.md,
    borderRadius: radius.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary1000,
    backgroundColor: 'transparent',
  },
  cancelButtonText: { ...typography.labelLg, color: colors.primary1000 },
});
