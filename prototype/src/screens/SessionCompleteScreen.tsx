import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Share,
  ActivityIndicator,
  Alert,
  FlatList,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useAppContext } from '../context/AppContext';
import { XANO_AUDIT_BASE, XANO_REPORTS_BASE } from '../constants';
import { colors, fontColor, radius, spacing, typography } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'SessionComplete'>;

type Filter = 'all' | 'pass' | 'exception';

// Display-ready scan record (E6-01 vehicle fields gracefully omitted if not yet on backend)
interface ScanRow {
  id: string;
  vin: string;
  status: 'pass' | 'exception';
  exceptionType?: string;
  make?: string | null;
  model?: string | null;
  year?: number | null;
}

/** Map DB device_status enum to a human-readable exception label */
function deviceStatusLabel(status?: string): string {
  switch (status) {
    case 'not_reporting':        return 'Not Reporting';
    case 'not_installed':        return 'Not Installed';
    case 'wrong_dealer':         return 'Wrong Dealer';
    case 'missing_device':       return 'Missing Device';
    case 'customer_linked':      return 'Customer Linked';
    case 'customer_registered':  return 'Customer Linked';
    default:                     return 'Exception';
  }
}

/** Transform a raw DB scan record into a ScanRow for display */
function transformScan(raw: Record<string, unknown>): ScanRow {
  const isException = raw.is_exception === true;
  return {
    id: String(raw.id),
    vin: String(raw.vin ?? ''),
    status: isException ? 'exception' : 'pass',
    exceptionType: isException ? deviceStatusLabel(raw.device_status as string | undefined) : undefined,
    // E6-01: populated once backend adds make/model/year fields to scan table
    make: (raw.make as string | null | undefined) ?? null,
    model: (raw.model as string | null | undefined) ?? null,
    year: (raw.year as number | null | undefined) ?? null,
  };
}

export function SessionCompleteScreen({ navigation, route }: Props) {
  const { authToken, userId, setSessionId } = useAppContext();

  // E6-03: sessionId passed from EndAuditConfirmScreen
  const sessionId = route.params?.sessionId ?? null;

  const [csvContent, setCsvContent] = useState<string | null>(null);
  const [loadingCsv, setLoadingCsv] = useState(true);
  const [csvError, setCsvError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [hintVisible, setHintVisible] = useState(true);

  // E6-03: Real scan list from server
  const [scans, setScans] = useState<ScanRow[]>([]);
  const [loadingScans, setLoadingScans] = useState(false);

  // E6-03: Fetch scan list from audit/summary with include_scans=1
  useEffect(() => {
    if (!sessionId || !authToken) return;
    setLoadingScans(true);
    fetch(`${XANO_AUDIT_BASE}/audit/summary?session_id=${sessionId}&include_scans=1`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then(r => r.json())
      .then(data => {
        if (data?.success && Array.isArray(data?.summary?.scans)) {
          setScans(data.summary.scans.map(transformScan));
        }
      })
      .catch(() => {/* list stays empty — non-blocking */})
      .finally(() => setLoadingScans(false));
  }, [sessionId, authToken]);

  // Fetch the CSV as soon as the screen mounts.
  // The sessionId has already been cleared from context by EndAuditConfirmScreen,
  // so we fetch using the user_id to get the most recently completed session's report.
  useEffect(() => {
    const fetchCsv = async () => {
      setLoadingCsv(true);
      setCsvError(null);
      try {
        const res = await fetch(
          `${XANO_REPORTS_BASE}/download-csv?user_id=${userId}`,
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        if (!res.ok) {
          const data = await res.json();
          setCsvError(data?.message ?? 'Report generation failed.');
          return;
        }
        const text = await res.text();
        setCsvContent(text);
      } catch {
        setCsvError('Unable to generate report. Check your network and try again.');
      } finally {
        setLoadingCsv(false);
      }
    };
    fetchCsv();
  }, [authToken, userId]);

  const handleDownloadCsv = async () => {
    if (!csvContent) return;
    try {
      await Share.share({
        title: 'Audit Report',
        message: csvContent,
      });
    } catch {
      Alert.alert('Error', 'Could not share the report.');
    }
  };

  const handleNewAudit = () => {
    setSessionId(null);
    navigation.replace('DealerGroupSelection');
  };

  const handleFinish = () => {
    setSessionId(null);
    navigation.replace('Login');
  };

  function handleFilter(f: Filter) {
    setFilter(f);
    setHintVisible(false);
  }

  const filtered = scans.filter(s => filter === 'all' ? true : s.status === filter);
  const totalCount = scans.length;
  const passCount = scans.filter(s => s.status === 'pass').length;
  const exceptionCount = scans.filter(s => s.status === 'exception').length;

  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <View style={styles.container}>

      {/* ── Completion header ── */}
      <View style={styles.completionHeader}>
        <Text style={styles.checkmark}>✓</Text>
        <Text style={styles.title}>Audit Complete</Text>
        <Text style={styles.rooftop}>Ikon Lot Audit</Text>
        <Text style={styles.date}>{today}</Text>
      </View>

      {/* ── Interactive stat/filter pills ── */}
      <View style={styles.pillSection}>
        <View style={styles.pillRow}>
          <Pressable
            style={[styles.pill, filter === 'all' ? styles.pillAllActive : styles.pillAllInactive]}
            onPress={() => handleFilter('all')}
          >
            <Text style={[styles.pillCount, filter === 'all' ? styles.pillTextActive : styles.pillAllInactiveText]}>{totalCount}</Text>
            <Text style={[styles.pillLabel, filter === 'all' ? styles.pillTextActive : styles.pillAllInactiveText]}>All</Text>
          </Pressable>
          <Pressable
            style={[styles.pill, filter === 'pass' ? styles.pillPassActive : styles.pillPassInactive]}
            onPress={() => handleFilter('pass')}
          >
            <Text style={[styles.pillCount, filter === 'pass' ? styles.pillTextActive : styles.pillPassInactiveText]}>{passCount}</Text>
            <Text style={[styles.pillLabel, filter === 'pass' ? styles.pillTextActive : styles.pillPassInactiveText]}>Pass</Text>
          </Pressable>
          <Pressable
            style={[styles.pill, filter === 'exception' ? styles.pillExcActive : styles.pillExcInactive]}
            onPress={() => handleFilter('exception')}
          >
            <Text style={[styles.pillCount, filter === 'exception' ? styles.pillTextActive : styles.pillExcInactiveText]}>{exceptionCount}</Text>
            <Text style={[styles.pillLabel, filter === 'exception' ? styles.pillTextActive : styles.pillExcInactiveText]}>Exceptions</Text>
          </Pressable>
        </View>
        {hintVisible && <Text style={styles.pillHint}>Tap to filter</Text>}
      </View>

      {/* ── Scan list — E6-03 real data, E6-01 vehicle descriptors ── */}
      {loadingScans ? (
        <View style={styles.emptyState}>
          <ActivityIndicator color={colors.primary1000} />
          <Text style={[styles.emptyStateText, { marginTop: spacing.sm }]}>Loading scans…</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          style={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No scans found for this session.</Text>
            </View>
          }
          renderItem={({ item }) => {
            // E6-01: build vehicle descriptor line when make/model/year available
            const vehicleParts = [item.year, item.make, item.model].filter(Boolean);
            const vehicleDescriptor = vehicleParts.length > 0 ? vehicleParts.join(' ') : null;
            return (
              <View style={styles.scanRow}>
                <View style={[styles.statusDot, item.status === 'pass' ? styles.dotPass : styles.dotException]} />
                <View style={styles.scanInfo}>
                  <Text style={styles.scanVin}>{item.vin}</Text>
                  {/* E6-01: vehicle descriptor (make/model/year) */}
                  {vehicleDescriptor && <Text style={styles.scanVehicle}>{vehicleDescriptor}</Text>}
                  {item.exceptionType && <Text style={styles.scanException}>{item.exceptionType}</Text>}
                </View>
                <Text style={[styles.scanBadge, item.status === 'pass' ? styles.badgePass : styles.badgeException]}>
                  {item.status === 'pass' ? '✓' : '✗'}
                </Text>
              </View>
            );
          }}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}

      {/* ── Actions ── */}
      <View style={styles.actions}>
        <Pressable
          style={[styles.downloadButton, (!csvContent || loadingCsv) && styles.downloadButtonDisabled]}
          onPress={handleDownloadCsv}
          disabled={!csvContent || loadingCsv}
        >
          {loadingCsv
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.downloadButtonText}>⬇  Download Report (.csv)</Text>}
        </Pressable>
        <Pressable style={styles.newAuditButton} onPress={handleNewAudit}>
          <Text style={styles.newAuditButtonText}>Start new audit</Text>
        </Pressable>
        <Pressable style={styles.finishButton} onPress={handleFinish}>
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

  // Interactive stat filter pills
  pillSection: {
    backgroundColor: colors.white,
    paddingVertical: spacing.md - 2,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral1,
    alignItems: 'center',
  },
  pillRow: { flexDirection: 'row', gap: spacing.sm + 2, alignSelf: 'stretch' },
  pill: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.sm + 2, borderRadius: radius.xl, gap: spacing.xs + 1 },
  pillCount: { ...typography.headingSm, fontSize: 18, fontWeight: '700' },
  pillLabel: { ...typography.labelMd },
  pillTextActive: { color: colors.white },
  pillAllActive: { backgroundColor: colors.tertiary },
  pillAllInactive: { backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.tertiary },
  pillAllInactiveText: { color: colors.tertiary },
  pillPassActive: { backgroundColor: colors.primary1000 },
  pillPassInactive: { backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.primary1000 },
  pillPassInactiveText: { color: colors.primary1000 },
  pillExcActive: { backgroundColor: colors.error },
  pillExcInactive: { backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.error },
  pillExcInactiveText: { color: colors.error },
  pillHint: { ...typography.bodySm, color: fontColor.tertiary, fontStyle: 'italic', marginTop: spacing.xs + 2 },

  // List
  list: { flex: 1 },
  emptyState: { padding: spacing.xl, alignItems: 'center' },
  emptyStateText: { ...typography.bodyMd, color: fontColor.tertiary, textAlign: 'center' },
  scanRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, paddingHorizontal: spacing.md, paddingVertical: spacing.sm + 4 },
  statusDot: { width: 10, height: 10, borderRadius: radius.full, marginRight: spacing.sm + 4, flexShrink: 0 },
  dotPass: { backgroundColor: colors.primary1000 },
  dotException: { backgroundColor: colors.error },
  scanInfo: { flex: 1 },
  scanVin: { ...typography.bodySm, color: fontColor.secondary, fontFamily: 'ui-monospace, SFMono-Regular, monospace' },
  scanVehicle: { ...typography.labelSm, color: fontColor.secondary, marginTop: 2 },
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
  downloadButton: { backgroundColor: colors.primary1000, paddingVertical: spacing.md, borderRadius: radius.sm, alignItems: 'center' },
  downloadButtonDisabled: { backgroundColor: colors.primary300 },
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
