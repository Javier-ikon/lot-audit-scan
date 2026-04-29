/**
 * MOCKUP — SessionCompleteScreen (updated)
 * Epic E4: End Audit & Report Experience
 *
 * Changes from previous mockup:
 * - Filterable VIN list (All / Pass / Exceptions) so FSM can review before leaving the lot
 * - Each row shows Make/Model/Year — helps FSM visually match list to physical car
 * - Lat/Long captured silently in data but NOT shown in UI (V2 map feature)
 * - UI-11A: Merged stats row + filter tabs into single interactive pill row
 *   Pills show count + label, are color-coded (green/red/dark), and include a
 *   one-time "Tap to filter" hint that disappears on first interaction.
 *
 * All data is hardcoded — no API calls, no AppContext.
 */

// Story UI-11A: Interactive Stat Filter Pills (merged stats + filter into one row)
import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, FlatList } from 'react-native';

import { colors, fontColor, radius, spacing, typography } from './theme';

const MOCK_ROOFTOP = 'Friendly Chevrolet – Dallas';
const MOCK_DATE = 'April 28, 2026 · 2:14 PM';

type ScanRecord = {
  id: string;
  vin: string;
  vehicle: string;
  status: 'pass' | 'exception';
  exceptionType?: string;
};

const MOCK_SCANS: ScanRecord[] = [
  { id: '1',  vin: '1HGCM82633A123456', vehicle: '2019 Honda Accord',        status: 'pass' },
  { id: '2',  vin: '3VWFE21C04M000001', vehicle: '2021 VW Jetta',            status: 'exception', exceptionType: 'Not Reporting' },
  { id: '3',  vin: '2T1BURHE0JC058769', vehicle: '2018 Toyota Corolla',      status: 'pass' },
  { id: '4',  vin: '1FTFW1ET5DFC10312', vehicle: '2020 Ford F-150',          status: 'exception', exceptionType: 'Wrong Dealer' },
  { id: '5',  vin: '5NPE24AF8GH123456', vehicle: '2016 Hyundai Sonata',      status: 'pass' },
  { id: '6',  vin: '1G1ZD5ST0JF123456', vehicle: '2018 Chevrolet Malibu',    status: 'exception', exceptionType: 'Customer Linked' },
  { id: '7',  vin: 'KNMAT2MT7JP123456', vehicle: '2018 Nissan Rogue',        status: 'pass' },
  { id: '8',  vin: '3FA6P0HR5ER123456', vehicle: '2014 Ford Fusion',         status: 'pass' },
  { id: '9',  vin: '1C4RJFAG0EC123456', vehicle: '2014 Jeep Grand Cherokee', status: 'exception', exceptionType: 'Not Installed' },
  { id: '10', vin: '2HGFC2F59GH123456', vehicle: '2016 Honda Civic',         status: 'pass' },
];

const MOCK_TOTAL = MOCK_SCANS.length;
const MOCK_PASS = MOCK_SCANS.filter(s => s.status === 'pass').length;
const MOCK_EXCEPTIONS = MOCK_SCANS.filter(s => s.status === 'exception').length;

type Filter = 'all' | 'pass' | 'exception';

export function SessionCompleteMockup() {
  const [filter, setFilter] = useState<Filter>('all');
  const [hintVisible, setHintVisible] = useState(true);

  const filtered = MOCK_SCANS.filter(s =>
    filter === 'all' ? true : s.status === filter
  );

  function handleFilter(f: Filter) {
    setFilter(f);
    setHintVisible(false);
  }

  return (
    <View style={styles.container}>

      {/* ── Completion header ── */}
      <View style={styles.completionHeader}>
        <Text style={styles.checkmark}>✓</Text>
        <Text style={styles.title}>Audit Complete</Text>
        <Text style={styles.rooftop}>{MOCK_ROOFTOP}</Text>
        <Text style={styles.date}>{MOCK_DATE}</Text>
      </View>

      {/* ── Interactive stat filter pills (UI-11A) ── */}
      <View style={styles.pillSection}>
        <View style={styles.pillRow}>
          {/* All */}
          <Pressable
            style={[styles.pill, filter === 'all' ? styles.pillAllActive : styles.pillAllInactive]}
            onPress={() => handleFilter('all')}
          >
            <Text style={[styles.pillCount, filter === 'all' ? styles.pillTextActive : styles.pillAllInactiveText]}>{MOCK_TOTAL}</Text>
            <Text style={[styles.pillLabel, filter === 'all' ? styles.pillTextActive : styles.pillAllInactiveText]}>All</Text>
          </Pressable>

          {/* Pass */}
          <Pressable
            style={[styles.pill, filter === 'pass' ? styles.pillPassActive : styles.pillPassInactive]}
            onPress={() => handleFilter('pass')}
          >
            <Text style={[styles.pillCount, filter === 'pass' ? styles.pillTextActive : styles.pillPassInactiveText]}>{MOCK_PASS}</Text>
            <Text style={[styles.pillLabel, filter === 'pass' ? styles.pillTextActive : styles.pillPassInactiveText]}>Pass</Text>
          </Pressable>

          {/* Exceptions */}
          <Pressable
            style={[styles.pill, filter === 'exception' ? styles.pillExcActive : styles.pillExcInactive]}
            onPress={() => handleFilter('exception')}
          >
            <Text style={[styles.pillCount, filter === 'exception' ? styles.pillTextActive : styles.pillExcInactiveText]}>{MOCK_EXCEPTIONS}</Text>
            <Text style={[styles.pillLabel, filter === 'exception' ? styles.pillTextActive : styles.pillExcInactiveText]}>Exceptions</Text>
          </Pressable>
        </View>
        {hintVisible && (
          <Text style={styles.pillHint}>Tap to filter</Text>
        )}
      </View>

      {/* ── Scan list ── */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        style={styles.list}
        renderItem={({ item }) => (
          <View style={styles.scanRow}>
            <View style={[styles.statusDot, item.status === 'pass' ? styles.dotPass : styles.dotException]} />
            <View style={styles.scanInfo}>
              <Text style={styles.scanVehicle}>{item.vehicle}</Text>
              <Text style={styles.scanVin}>{item.vin}</Text>
              {item.exceptionType && (
                <Text style={styles.scanException}>{item.exceptionType}</Text>
              )}
            </View>
            <Text style={[styles.scanBadge, item.status === 'pass' ? styles.badgePass : styles.badgeException]}>
              {item.status === 'pass' ? '✓' : '✗'}
            </Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {/* ── Actions ── */}
      <View style={styles.actions}>
        <Pressable style={styles.downloadButton}>
          <Text style={styles.downloadButtonText}>⬇  Download Report (.csv)</Text>
        </Pressable>
        <Pressable style={styles.newAuditButton}>
          <Text style={styles.newAuditButtonText}>Start new audit</Text>
        </Pressable>
        <Pressable style={styles.finishButton}>
          <Text style={styles.finishButtonText}>Finish</Text>
        </Pressable>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.neutral0 },

  // Completion header
  completionHeader: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral1,
  },
  checkmark: {
    fontSize: 32,
    color: colors.white,
    backgroundColor: colors.primary1000,
    width: 60,
    height: 60,
    textAlign: 'center',
    lineHeight: 60,
    borderRadius: radius.full,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  title: { ...typography.headingLg, color: fontColor.primary },
  rooftop: { ...typography.labelMd, color: fontColor.secondary, marginTop: spacing.xs },
  date: { ...typography.bodySm, color: fontColor.tertiary, marginTop: 2 },

  // Interactive stat filter pills (UI-11A)
  pillSection: {
    backgroundColor: colors.white,
    paddingVertical: spacing.md - 2,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral1,
    alignItems: 'center',
  },
  pillRow: { flexDirection: 'row', gap: spacing.sm + 2, alignSelf: 'stretch' },
  pill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.xl,
    gap: spacing.xs + 1,
  },
  pillCount: { ...typography.headingSm, fontSize: 18, fontWeight: '700' },
  pillLabel: { ...typography.labelMd },
  pillTextActive: { color: colors.white },
  // All pill — neutral / dark anchor
  pillAllActive: { backgroundColor: colors.tertiary },
  pillAllInactive: { backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.tertiary },
  pillAllInactiveText: { color: colors.tertiary },
  // Pass pill — brand primary
  pillPassActive: { backgroundColor: colors.primary1000 },
  pillPassInactive: { backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.primary1000 },
  pillPassInactiveText: { color: colors.primary1000 },
  // Exceptions pill — error
  pillExcActive: { backgroundColor: colors.error },
  pillExcInactive: { backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.error },
  pillExcInactiveText: { color: colors.error },
  // Hint
  pillHint: { ...typography.bodySm, color: fontColor.tertiary, fontStyle: 'italic', marginTop: spacing.xs + 2 },

  // Scan list
  list: { flex: 1 },
  scanRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
  },
  statusDot: { width: 10, height: 10, borderRadius: radius.full, marginRight: spacing.sm + 4, flexShrink: 0 },
  dotPass: { backgroundColor: colors.primary1000 },
  dotException: { backgroundColor: colors.error },
  scanInfo: { flex: 1 },
  scanVehicle: { ...typography.bodyMd, fontWeight: '600', color: fontColor.primary },
  scanVin: { ...typography.bodySm, color: fontColor.tertiary, marginTop: 2, fontFamily: 'ui-monospace, SFMono-Regular, monospace' },
  scanException: { ...typography.labelSm, color: colors.error, marginTop: 2 },
  scanBadge: { fontSize: 16, fontWeight: '800', marginLeft: spacing.sm },
  badgePass: { color: colors.primary1000 },
  badgeException: { color: colors.error },
  separator: { height: 1, backgroundColor: colors.neutral1, marginLeft: 38 },

  // Actions
  actions: {
    padding: spacing.md,
    gap: spacing.sm + 2,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.neutral1,
  },
  downloadButton: {
    backgroundColor: colors.primary1000,
    paddingVertical: spacing.md,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  downloadButtonText: { ...typography.labelLg, color: colors.white },
  newAuditButton: {
    paddingVertical: spacing.md - 2,
    borderRadius: radius.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary1000,
    backgroundColor: 'transparent',
  },
  newAuditButtonText: { ...typography.labelLg, color: colors.primary1000 },
  finishButton: { paddingVertical: spacing.sm + 2, alignItems: 'center' },
  finishButtonText: { ...typography.labelMd, color: fontColor.tertiary },
});
