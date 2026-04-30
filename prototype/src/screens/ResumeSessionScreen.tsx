import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, ActivityIndicator } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useAppContext } from '../context/AppContext';
import { XANO_AUDIT_BASE } from '../constants';
import { colors, fontColor, radius, spacing, typography } from '../theme';

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
  container: {
    flex: 1,
    backgroundColor: colors.neutral0,
    padding: spacing.lg,
    justifyContent: 'center',
  },

  title: { ...typography.display, color: fontColor.primary, marginBottom: spacing.sm },
  subtitle: { ...typography.bodyLg, color: fontColor.secondary, marginBottom: spacing.lg + 4 },

  // Card
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.sm,
    padding: spacing.lg,
    marginBottom: spacing.lg + 4,
    borderWidth: 1,
    borderColor: colors.neutral1,
  },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.sm + 2 },
  cardDivider: { height: 1, backgroundColor: colors.neutral1 },
  cardLabel: { ...typography.labelSm, color: fontColor.tertiary },
  cardValue: { ...typography.bodyMd, fontWeight: '600', color: fontColor.primary, textAlign: 'right', flexShrink: 1, paddingLeft: spacing.sm + 4 },

  // Stats row
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingTop: spacing.md },
  statBlock: { alignItems: 'center', flex: 1 },
  statDivider: { width: 1, height: 36, backgroundColor: colors.neutral1 },
  statNumber: { ...typography.display, fontSize: 28, color: fontColor.primary },
  statPass: { color: colors.primary1000 },
  statException: { color: colors.error },
  statLabel: { ...typography.labelSm, color: fontColor.tertiary, marginTop: spacing.xs },

  error: { ...typography.bodyMd, color: colors.error, marginBottom: spacing.md, textAlign: 'center' },

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
