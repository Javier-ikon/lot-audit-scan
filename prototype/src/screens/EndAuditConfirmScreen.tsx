import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, Alert, ActivityIndicator } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useAppContext } from '../context/AppContext';
import { XANO_AUDIT_BASE } from '../constants';
import { colors, fontColor, radius, spacing, typography } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'EndAuditConfirm'>;

export function EndAuditConfirmScreen({ navigation, route }: Props) {
  const { authToken, sessionId, setSessionId } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);

  // Pull tally from route params (client-side fallback from ScanningScreen)
  const params = (route.params ?? {}) as { scanCount?: number; exceptionCount?: number };
  const clientScanCount = typeof params.scanCount === 'number' ? params.scanCount : 0;
  const clientExceptionCount = typeof params.exceptionCount === 'number' ? params.exceptionCount : 0;

  // E6-02: server-authoritative counts (fetched on mount)
  const [serverScanCount, setServerScanCount] = useState<number | null>(null);
  const [serverPassCount, setServerPassCount] = useState<number | null>(null);
  const [serverExceptionCount, setServerExceptionCount] = useState<number | null>(null);

  // Prefer server counts; fall back to client-derived values
  const scanCount = serverScanCount ?? clientScanCount;
  const exceptionCount = serverExceptionCount ?? clientExceptionCount;
  const passCount = serverPassCount ?? (scanCount - exceptionCount);

  // E6-02: Fetch server summary on mount while session is still active
  useEffect(() => {
    if (!sessionId || !authToken) return;
    setSummaryLoading(true);
    fetch(`${XANO_AUDIT_BASE}/audit/summary?session_id=${sessionId}&include_scans=0`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then(r => r.json())
      .then(data => {
        if (data?.success && data?.summary) {
          const s = data.summary;
          setServerScanCount(s.total_scans ?? null);
          setServerPassCount(s.total_passes ?? null);
          setServerExceptionCount(s.total_exceptions ?? null);
        }
      })
      .catch(() => {/* fallback to client counts silently */})
      .finally(() => setSummaryLoading(false));
  }, [sessionId, authToken]);

  const handleConfirm = async () => {
    // Capture sessionId before clearing from context
    const capturedSessionId = sessionId;
    setLoading(true);
    try {
      const res = await fetch(`${XANO_AUDIT_BASE}/audit/end-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ session_id: capturedSessionId }),
      });
      const data = await res.json();
      if (!res.ok) {
        Alert.alert('Error', data?.message ?? 'Failed to end session. Please try again.');
        return;
      }
      setSessionId(null);
      navigation.replace('SessionComplete', { sessionId: capturedSessionId });
    } catch {
      Alert.alert('Network error', 'Unable to connect. Check your network and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>End audit?</Text>
      <Text style={styles.subtitle}>Review your session before closing.</Text>

      {/* ── Session summary card ── */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryRooftop}>Ikon Lot Audit</Text>
        {summaryLoading ? (
          <ActivityIndicator color={colors.primary1000} style={{ paddingVertical: spacing.md }} />
        ) : (
          <View style={styles.statsRow}>
            <View style={styles.statBlock}>
              <Text style={styles.statNumber}>{scanCount}</Text>
              <Text style={styles.statLabel}>Scanned</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBlock}>
              <Text style={[styles.statNumber, styles.statPass]}>{passCount}</Text>
              <Text style={styles.statLabel}>Pass</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBlock}>
              <Text style={[styles.statNumber, styles.statException]}>{exceptionCount}</Text>
              <Text style={styles.statLabel}>Exceptions</Text>
            </View>
          </View>
        )}
      </View>

      <Text style={styles.confirmNote}>
        Once ended, the session is closed and your report will be generated.
      </Text>

      <Pressable
        style={[styles.confirmButton, loading && styles.buttonDisabled]}
        onPress={handleConfirm}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.confirmButtonText}>Yes, end audit</Text>
        )}
      </Pressable>
      <Pressable style={styles.cancelButton} onPress={handleCancel} disabled={loading}>
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

  title: { ...typography.display, color: fontColor.primary, textAlign: 'center', marginBottom: spacing.xs + 2 },
  subtitle: { ...typography.bodyLg, color: fontColor.secondary, textAlign: 'center', marginBottom: spacing.lg + 4 },

  // Summary card
  summaryCard: {
    backgroundColor: colors.white,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.neutral1,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  summaryRooftop: { ...typography.labelMd, color: fontColor.secondary, textAlign: 'center', marginBottom: spacing.lg },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  statBlock: { alignItems: 'center', flex: 1 },
  statDivider: { width: 1, height: 40, backgroundColor: colors.neutral1 },
  statNumber: { ...typography.display, fontSize: 32, color: fontColor.primary },
  statPass: { color: colors.primary1000 },
  statException: { color: colors.error },
  statLabel: { ...typography.labelSm, color: fontColor.tertiary, marginTop: spacing.xs },

  confirmNote: { ...typography.bodySm, color: fontColor.tertiary, textAlign: 'center', marginBottom: spacing.lg + 4 },

  buttonDisabled: { backgroundColor: colors.error50 },
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
