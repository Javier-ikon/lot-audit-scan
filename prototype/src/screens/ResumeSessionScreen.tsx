import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, ActivityIndicator } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useAppContext } from '../context/AppContext';
import { XANO_AUDIT_BASE } from '../constants';

type Props = NativeStackScreenProps<RootStackParamList, 'ResumeSession'>;

export function ResumeSessionScreen({ navigation, route }: Props) {
  const { session, scanCount } = route.params;
  const { authToken, setSessionId } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startedAt = session?.started_at
    ? new Date(session.started_at as string).toLocaleString()
    : '—';

  const handleResume = () => {
    setSessionId(session.id as number);
    navigation.replace('Scanning', { scanCount });
  };

  const handleStartNew = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${XANO_AUDIT_BASE}/audit/abandon-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ session_id: session.id }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data?.payload ?? 'Failed to close previous session. Please try again.');
        return;
      }
      setSessionId(null);
      navigation.replace('StartSession');
    } catch {
      setError('Unable to connect. Check your network and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Derive pass/exception counts from session data if available
  const exceptionCount = typeof (session as Record<string, unknown>)?.exception_count === 'number'
    ? (session as Record<string, unknown>).exception_count as number
    : 0;
  const passCount = scanCount - exceptionCount;

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
          <Text style={styles.cardValue}>{String(session?.rooftop_id ?? '—')}</Text>
        </View>
        <View style={styles.cardDivider} />
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Started</Text>
          <Text style={styles.cardValue}>{startedAt}</Text>
        </View>
        <View style={styles.cardDivider} />
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

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable style={styles.resumeButton} onPress={handleResume} disabled={loading}>
        <Text style={styles.resumeButtonText}>Resume audit</Text>
      </Pressable>

      <Pressable style={styles.newButton} onPress={handleStartNew} disabled={loading}>
        {loading
          ? <ActivityIndicator color="#c0392b" />
          : <Text style={styles.newButtonText}>Discard and start new audit</Text>}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa', padding: 24, justifyContent: 'center' },

  title: { fontSize: 24, fontWeight: '800', color: '#111', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#555', lineHeight: 22, marginBottom: 28 },

  // Card
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 20, marginBottom: 28 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  cardDivider: { height: 1, backgroundColor: '#f0f0f0' },
  cardLabel: { fontSize: 13, color: '#888' },
  cardValue: { fontSize: 14, fontWeight: '600', color: '#111', textAlign: 'right', flexShrink: 1, paddingLeft: 12 },

  // Stats row
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingTop: 16 },
  statBlock: { alignItems: 'center', flex: 1 },
  statDivider: { width: 1, height: 36, backgroundColor: '#eee' },
  statNumber: { fontSize: 28, fontWeight: '900', color: '#111' },
  statPass: { color: '#1AAD1A' },
  statException: { color: '#c0392b' },
  statLabel: { fontSize: 12, color: '#888', marginTop: 4 },

  error: { color: '#c0392b', fontSize: 14, marginBottom: 12, textAlign: 'center' },

  resumeButton: { backgroundColor: '#0066cc', paddingVertical: 18, borderRadius: 10, alignItems: 'center', marginBottom: 12 },
  resumeButtonText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  newButton: { paddingVertical: 16, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#e0e0e0', backgroundColor: '#fff' },
  newButtonText: { color: '#c0392b', fontSize: 15, fontWeight: '500' },
});
