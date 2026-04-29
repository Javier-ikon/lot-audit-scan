import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, Alert, ActivityIndicator, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { XANO_AUDIT_BASE } from '../constants';

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

      {/* ── Full-bleed status block ── */}
      <View style={[styles.statusBlock, isPass ? styles.statusBlockPass : isException ? styles.statusBlockException : styles.statusBlockRecorded]}>
        <Text style={styles.statusIcon}>{isPass ? '✓' : '✗'}</Text>
        <Text style={styles.statusLabel}>{isPass ? 'PASS' : isException ? 'EXCEPTION' : status.toUpperCase()}</Text>
        {!deviceFound && <Text style={styles.statusSubLabel}>Device not found in Planet X</Text>}
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>

        {/* ── Exception guidance card ── */}
        {isException && (
          <View style={styles.actionCard}>
            <Text style={styles.actionTitle}>ACTION REQUIRED</Text>
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
          <Pressable style={[styles.nextButton, isPass ? styles.nextButtonPass : styles.nextButtonException]} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Next vehicle</Text>
          </Pressable>
          <Pressable style={styles.endButton} onPress={handleEndAudit}>
            <Text style={styles.endButtonText}>End audit</Text>
          </Pressable>
          <Pressable style={styles.deleteButton} onPress={handleDelete} disabled={deleting}>
            {deleting
              ? <ActivityIndicator color="#aaa" />
              : <Text style={styles.deleteButtonText}>Delete this scan</Text>}
          </Pressable>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa' },

  // Full-bleed status block
  statusBlock: { paddingVertical: 36, alignItems: 'center', justifyContent: 'center' },
  statusBlockPass: { backgroundColor: '#1AAD1A' },
  statusBlockException: { backgroundColor: '#c0392b' },
  statusBlockRecorded: { backgroundColor: '#555' },
  statusIcon: { fontSize: 44, color: '#fff', marginBottom: 6 },
  statusLabel: { fontSize: 32, fontWeight: '900', color: '#fff', letterSpacing: 2 },
  statusSubLabel: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 6 },

  scroll: { flex: 1 },
  scrollContent: { padding: 16, gap: 14, paddingBottom: 40 },

  // Exception guidance card
  actionCard: { backgroundColor: '#fff5f5', borderLeftWidth: 4, borderLeftColor: '#c0392b', borderRadius: 8, padding: 16 },
  actionTitle: { fontSize: 11, fontWeight: '800', color: '#c0392b', letterSpacing: 1, marginBottom: 8 },
  actionText: { fontSize: 15, color: '#222', lineHeight: 22 },

  // Details card
  detailsCard: { backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 4 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  divider: { height: 1, backgroundColor: '#f0f0f0' },
  detailLabel: { fontSize: 13, color: '#888' },
  detailValue: { fontSize: 14, fontWeight: '600', color: '#111', flexShrink: 1, textAlign: 'right', paddingLeft: 12 },

  // Actions
  actions: { gap: 12 },
  nextButton: { paddingVertical: 18, borderRadius: 10, alignItems: 'center' },
  nextButtonPass: { backgroundColor: '#1AAD1A' },
  nextButtonException: { backgroundColor: '#c0392b' },
  nextButtonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  endButton: { paddingVertical: 14, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#ccc', backgroundColor: '#fff' },
  endButtonText: { color: '#555', fontSize: 16, fontWeight: '500' },
  deleteButton: { alignItems: 'center', paddingVertical: 8 },
  deleteButtonText: { color: '#aaa', fontSize: 13 },
});
