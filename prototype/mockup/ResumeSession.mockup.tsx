/**
 * MOCKUP — ResumeSessionScreen
 * Epic E5: Resume Session Context Fix — Stories 5.1 + 5.2
 *
 * Changes from current:
 * - Shows ROOFTOP NAME instead of raw "Rooftop ID: 1"
 * - Shows pass + exception breakdown on the resume card (not just total scans)
 * - FSM has enough context to make a confident resume vs. start-new decision
 *
 * All data is hardcoded — no API calls, no AppContext.
 */

import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';

import { colors, fontColor, radius, spacing, typography } from './theme';

const MOCK_ROOFTOP_NAME = 'Friendly Chevrolet – Dallas';
const MOCK_STARTED_AT = 'April 28, 2026 · 9:42 AM';
const MOCK_TOTAL = 63;
const MOCK_PASS = 57;
const MOCK_EXCEPTIONS = 6;

export function ResumeSessionMockup() {
  return (
    <View style={styles.container}>

      <Text style={styles.title}>Unfinished Audit Found</Text>
      <Text style={styles.subtitle}>
        You have an audit in progress. Would you like to continue where you left off?
      </Text>

      {/* ── Session card with full context ── */}
      <View style={styles.card}>

        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Rooftop</Text>
          <Text style={styles.cardValue}>{MOCK_ROOFTOP_NAME}</Text>
        </View>

        <View style={styles.cardDivider} />

        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Started</Text>
          <Text style={styles.cardValue}>{MOCK_STARTED_AT}</Text>
        </View>

        <View style={styles.cardDivider} />

        {/* Scan breakdown — not just a flat total */}
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

      {/* ── Actions ── */}
      <Pressable style={styles.resumeButton}>
        <Text style={styles.resumeButtonText}>Resume audit</Text>
      </Pressable>

      <Pressable style={styles.newButton}>
        <Text style={styles.newButtonText}>Discard and start new audit</Text>
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
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.bodyLg,
    color: fontColor.secondary,
    marginBottom: spacing.lg + 4,
  },

  // Card
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.sm,
    padding: spacing.lg,
    marginBottom: spacing.lg + 4,
    borderWidth: 1,
    borderColor: colors.neutral1,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
  },
  cardDivider: { height: 1, backgroundColor: colors.neutral1 },
  cardLabel: { ...typography.labelSm, color: fontColor.tertiary },
  cardValue: {
    ...typography.bodyMd,
    fontWeight: '600',
    color: fontColor.primary,
    textAlign: 'right',
    flexShrink: 1,
    paddingLeft: spacing.sm + 4,
  },

  // Stats row
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: spacing.md,
  },
  statBlock: { alignItems: 'center', flex: 1 },
  statDivider: { width: 1, height: 36, backgroundColor: colors.neutral1 },
  statNumber: {
    ...typography.display,
    fontSize: 28,
    color: fontColor.primary,
  },
  statPass: { color: colors.primary1000 },
  statException: { color: colors.error },
  statLabel: { ...typography.labelSm, color: fontColor.tertiary, marginTop: spacing.xs },

  // Actions
  resumeButton: {
    backgroundColor: colors.primary1000,
    paddingVertical: spacing.md + 2,
    borderRadius: radius.sm,
    alignItems: 'center',
    marginBottom: spacing.sm + 4,
  },
  resumeButtonText: { ...typography.labelLg, color: colors.white },

  newButton: {
    paddingVertical: spacing.md,
    borderRadius: radius.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.error,
    backgroundColor: 'transparent',
  },
  newButtonText: { ...typography.labelLg, color: colors.error },
});
