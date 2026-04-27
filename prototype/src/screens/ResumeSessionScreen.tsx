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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Unfinished Audit Found</Text>
      <Text style={styles.subtitle}>
        You have an audit session that was not completed.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Started</Text>
        <Text style={styles.cardValue}>{startedAt}</Text>

        <Text style={styles.cardLabel}>Scans recorded</Text>
        <Text style={styles.cardValue}>{scanCount}</Text>

        <Text style={styles.cardLabel}>Rooftop ID</Text>
        <Text style={styles.cardValue}>{String(session?.rooftop_id ?? '—')}</Text>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable style={styles.resumeButton} onPress={handleResume} disabled={loading}>
        <Text style={styles.resumeButtonText}>Resume audit</Text>
      </Pressable>

      <Pressable style={styles.newButton} onPress={handleStartNew} disabled={loading}>
        {loading
          ? <ActivityIndicator color="#cc0000" />
          : <Text style={styles.newButtonText}>Start new audit</Text>}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#555',
    marginBottom: 32,
    lineHeight: 22,
  },
  card: {
    backgroundColor: '#f4f7fb',
    borderRadius: 10,
    padding: 20,
    marginBottom: 32,
    gap: 8,
  },
  cardLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  error: {
    color: '#cc0000',
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
  resumeButton: {
    backgroundColor: '#0066cc',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  resumeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  newButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  newButtonText: {
    color: '#cc0000',
    fontSize: 16,
    fontWeight: '600',
  },
});
