import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useAppContext } from '../context/AppContext';
import { XANO_AUDIT_BASE } from '../constants';
import { colors, fontColor, radius, spacing, typography } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'StartSession'>;

export function StartSessionScreen({ navigation }: Props) {
  const { authToken, rooftopId, dealerGroupId, setSessionId } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartAudit = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${XANO_AUDIT_BASE}/audit/start-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ rooftop_id: rooftopId, dealer_group_id: dealerGroupId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.message ?? 'Failed to start session. Please try again.');
        return;
      }
      // Store session ID in context so all downstream screens can access it
      setSessionId(data.session?.id ?? data.id);
      navigation.replace('Scanning', { scanCount: 0 });
    } catch {
      setError('Unable to connect. Check your network and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Decorative accent bar at top */}
      <View style={styles.accentBar} />

      <View style={styles.content}>
        {/* Icon / badge */}
        <View style={styles.iconBadge}>
          <Text style={styles.iconGlyph}>📋</Text>
        </View>

        <Text style={styles.title}>Ready to Audit</Text>
        <Text style={styles.subtitle}>
          A new session will start at your assigned rooftop.{'\n'}
          Tap below when you are on the lot.
        </Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleStartAudit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.buttonText}>Start Audit</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.neutral0 },

  // Thin primary accent line at top of screen
  accentBar: { height: 4, backgroundColor: colors.primary1000 },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },

  // Icon badge
  iconBadge: {
    width: 72,
    height: 72,
    borderRadius: radius.full,
    backgroundColor: colors.primary100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  iconGlyph: { fontSize: 32 },

  title: { ...typography.display, color: fontColor.primary, textAlign: 'center', marginBottom: spacing.sm },
  subtitle: {
    ...typography.bodyLg,
    color: fontColor.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl + 4,
  },

  error: { ...typography.bodyMd, color: colors.error, marginBottom: spacing.md, textAlign: 'center' },

  button: {
    width: '100%',
    backgroundColor: colors.primary1000,
    paddingVertical: spacing.md + 2,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  buttonDisabled: { backgroundColor: colors.primary300 },
  buttonText: { ...typography.labelLg, color: colors.white },
});
