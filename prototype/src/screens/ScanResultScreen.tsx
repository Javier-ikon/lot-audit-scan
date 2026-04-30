import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, Alert, ActivityIndicator, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { XANO_AUDIT_BASE } from '../constants';
import { colors, fontColor, radius, spacing, typography } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ScanResult'>;

export function ScanResultScreen({ navigation, route }: Props) {
  const { vin, scanCount: scanCountParam, exceptionCount: exceptionCountParam, scanData } = route.params;
  const scanCount = typeof scanCountParam === 'number' ? scanCountParam : 0;
  const exceptionCount = typeof exceptionCountParam === 'number' ? exceptionCountParam : 0;
  const [deleting, setDeleting] = useState(false);

  // API returns { success, scan: { device_found, device: {...} } }
  const scan = scanData?.scan as Record<string, unknown> | null | undefined;
  const device = scan?.device as Record<string, string> | null | undefined;
  const deviceFound = scan?.device_found !== false;
  const status = scanData?.status ?? 'recorded';
  const serial = device?.serial ?? '—';
  const company = device?.company ?? '—';
  const group = device?.group ?? '—';
  const lastReport = device?.last_report ?? '—';
  const deviceStatus = device?.device_status ?? '—';
  const reason = scanData?.reason;

  const isPass = status === 'pass';
  const isException = status === 'exception';

  const handleNext = () => {
    const nextExceptionCount = isException ? exceptionCount + 1 : exceptionCount;
    navigation.replace('Scanning', {
      scanCount,
      exceptionCount: nextExceptionCount,
      lastScanStatus: isPass ? 'pass' : 'exception',
    });
  };

  const handleEndAudit = () => {
    navigation.replace('EndAuditConfirm');
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete scan',
      'Are you sure you want to delete this scan?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const scanId = (scan as Record<string, unknown>)?.id;
            if (!scanId) {
              Alert.alert('Error', 'Unable to identify scan record.');
              return;
            }
            const token = (global as Record<string, unknown>).__authToken as string | undefined;
            setDeleting(true);
            try {
              const res = await fetch(`${XANO_AUDIT_BASE}/audit/delete-scan`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ scan_id: scanId }),
              });
              if (!res.ok) {
                Alert.alert('Error', 'Failed to delete scan. Please try again.');
                return;
              }
              const nextCount = Math.max(0, scanCount - 1);
              navigation.replace('Scanning', { scanCount: nextCount });
            } catch {
              Alert.alert('Error', 'Failed to delete scan. Please try again.');
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  const EXCEPTION_GUIDANCE: Record<string, string> = {
    'not_reporting': 'Device has not reported in over 7 days. Flag for service inspection.',
    'wrong_dealer': 'VIN is registered to a different rooftop. Verify with manager before proceeding.',
    'customer_registered': 'Device is linked to a customer account. Do not remove — escalate to manager.',
    'not_installed': 'No device found for this VIN. Verify the vehicle and log for installation.',
  };
  const guidanceKey = (reason ?? '').toLowerCase().replace(/\s+/g, '_');
  const guidanceText = EXCEPTION_GUIDANCE[guidanceKey] ?? 'Review this vehicle before proceeding.';

  return (
    <View style={styles.container}>

      {/* ── Persistent header: rooftop + running tally ── */}
      <View style={styles.header}>
        <Text style={styles.headerRooftop} numberOfLines={1}>Ikon Lot Audit</Text>
        <Text style={styles.headerTally}>
          {scanCount} scanned ·{' '}
          <Text style={styles.headerTallyException}>{exceptionCount} exceptions</Text>
        </Text>
      </View>

      {/* ── Full-bleed status block ── */}
      <View style={[styles.statusBlock, isPass ? styles.statusBlockPass : isException ? styles.statusBlockException : styles.statusBlockRecorded]}>
        <Text style={styles.statusIcon}>{isPass ? '✓' : isException ? '⚠' : '—'}</Text>
        <Text style={styles.statusLabel}>{isPass ? 'PASS' : isException ? 'EXCEPTION' : status.toUpperCase()}</Text>
        {!deviceFound && <Text style={styles.statusSubLabel}>Device not found in Planet X</Text>}
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>

        {/* ── Exception guidance card ── */}
        {isException && (
          <View style={styles.actionCard}>
            <Text style={styles.actionTitle}>Action Required</Text>
            <Text style={styles.actionText}>{reason ? `${reason} — ` : ''}{guidanceText}</Text>
          </View>
        )}

        {/* ── Details card ── */}
        <View style={styles.detailsCard}>
          {[
            { label: 'VIN', value: vin },
            { label: 'Serial', value: serial },
            { label: 'Company', value: company },
            { label: 'Group', value: group },
            { label: 'Last Report', value: lastReport },
            { label: 'Device Status', value: deviceStatus },
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
          <Pressable
            style={[styles.nextButton, isPass ? styles.nextButtonPass : styles.nextButtonException]}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>Next vehicle →</Text>
          </Pressable>
          <Pressable style={styles.endButton} onPress={handleEndAudit}>
            <Text style={styles.endButtonText}>End audit</Text>
          </Pressable>
          <Pressable style={styles.deleteButton} onPress={handleDelete} disabled={deleting}>
            {deleting
              ? <ActivityIndicator color={fontColor.tertiary} />
              : <Text style={styles.deleteButtonText}>Delete this scan</Text>}
          </Pressable>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.neutral0 },

  // Persistent header
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

  // Full-bleed status block
  statusBlock: { paddingVertical: spacing.xl + 4, alignItems: 'center', justifyContent: 'center' },
  statusBlockPass: { backgroundColor: colors.primary1000 },
  statusBlockException: { backgroundColor: colors.error },
  statusBlockRecorded: { backgroundColor: colors.neutral7 },
  statusIcon: { fontSize: 44, color: colors.white, marginBottom: spacing.sm - 2 },
  statusLabel: { ...typography.display, fontSize: 32, color: colors.white, letterSpacing: 2 },
  statusSubLabel: { ...typography.bodySm, color: 'rgba(255,255,255,0.8)', marginTop: spacing.sm - 2 },

  scroll: { flex: 1 },
  scrollContent: { padding: spacing.md, gap: spacing.sm + 6, paddingBottom: spacing.xxl - 24 },

  // Exception guidance card
  actionCard: {
    backgroundColor: colors.error25,
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
    borderRadius: radius.sm,
    padding: spacing.md,
  },
  actionTitle: { ...typography.labelSm, color: colors.error, marginBottom: spacing.sm },
  actionText: { ...typography.bodyLg, color: fontColor.primary },

  // Details card
  detailsCard: {
    backgroundColor: colors.white,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.neutral1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.sm + 4 },
  divider: { height: 1, backgroundColor: colors.neutral1 },
  detailLabel: { ...typography.labelSm, color: fontColor.tertiary },
  detailValue: { ...typography.bodyMd, fontWeight: '600', color: fontColor.primary, flexShrink: 1, textAlign: 'right', paddingLeft: spacing.sm + 4 },

  // Actions
  actions: { gap: spacing.sm + 4 },
  nextButton: { paddingVertical: spacing.md + 2, borderRadius: radius.sm, alignItems: 'center' },
  nextButtonPass: { backgroundColor: colors.primary1000 },
  nextButtonException: { backgroundColor: colors.error },
  nextButtonText: { ...typography.labelLg, color: colors.white },
  endButton: {
    paddingVertical: spacing.md - 2,
    borderRadius: radius.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary1000,
    backgroundColor: colors.white,
  },
  endButtonText: { ...typography.labelLg, color: colors.primary1000 },
  deleteButton: { alignItems: 'center', paddingVertical: spacing.sm },
  deleteButtonText: { ...typography.bodySm, color: fontColor.tertiary },
});
