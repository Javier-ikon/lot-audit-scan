import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, Alert, ActivityIndicator } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useAppContext } from '../context/AppContext';
import { XANO_AUDIT_BASE } from '../constants';

type Props = NativeStackScreenProps<RootStackParamList, 'EndAuditConfirm'>;

export function EndAuditConfirmScreen({ navigation, route }: Props) {
  const { authToken, sessionId, setSessionId } = useAppContext();
  const [loading, setLoading] = useState(false);

  // Pull tally from route params if navigated from ScanningScreen
  const params = (route.params ?? {}) as { scanCount?: number; exceptionCount?: number };
  const scanCount = typeof params.scanCount === 'number' ? params.scanCount : 0;
  const exceptionCount = typeof params.exceptionCount === 'number' ? params.exceptionCount : 0;
  const passCount = scanCount - exceptionCount;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${XANO_AUDIT_BASE}/audit/end-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ session_id: sessionId }),
      });
      const data = await res.json();
      if (!res.ok) {
        Alert.alert('Error', data?.message ?? 'Failed to end session. Please try again.');
        return;
      }
      setSessionId(null);
      navigation.replace('SessionComplete');
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
  container: { flex: 1, backgroundColor: '#f5f7fa', padding: 24, justifyContent: 'center' },

  title: { fontSize: 26, fontWeight: '800', color: '#111', textAlign: 'center', marginBottom: 6 },
  subtitle: { fontSize: 15, color: '#666', textAlign: 'center', marginBottom: 28 },

  // Summary card
  summaryCard: { backgroundColor: '#fff', borderRadius: 14, padding: 20, marginBottom: 20 },
  summaryRooftop: { fontSize: 14, fontWeight: '700', color: '#333', textAlign: 'center', marginBottom: 20 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  statBlock: { alignItems: 'center', flex: 1 },
  statDivider: { width: 1, height: 40, backgroundColor: '#eee' },
  statNumber: { fontSize: 32, fontWeight: '900', color: '#111' },
  statPass: { color: '#1AAD1A' },
  statException: { color: '#c0392b' },
  statLabel: { fontSize: 12, color: '#888', marginTop: 4 },

  confirmNote: { fontSize: 13, color: '#888', textAlign: 'center', marginBottom: 28, lineHeight: 18 },

  buttonDisabled: { backgroundColor: '#e8a0a8' },
  confirmButton: { backgroundColor: '#c0392b', paddingVertical: 18, borderRadius: 10, alignItems: 'center', marginBottom: 12 },
  confirmButtonText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  cancelButton: { paddingVertical: 16, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#ccc', backgroundColor: '#fff' },
  cancelButtonText: { color: '#0066cc', fontSize: 16, fontWeight: '500' },
});
