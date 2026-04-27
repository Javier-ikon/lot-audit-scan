import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Share,
  ActivityIndicator,
  Alert,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useAppContext } from '../context/AppContext';
import { XANO_REPORTS_BASE } from '../constants';

type Props = NativeStackScreenProps<RootStackParamList, 'SessionComplete'>;

export function SessionCompleteScreen({ navigation }: Props) {
  const { authToken, userId, setSessionId } = useAppContext();
  const [csvContent, setCsvContent] = useState<string | null>(null);
  const [loadingCsv, setLoadingCsv] = useState(true);
  const [csvError, setCsvError] = useState<string | null>(null);

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
    // Phase 1: go back to StartSession. Phase 2: route to DealerGroupSelection.
    setSessionId(null);
    navigation.replace('StartSession');
  };

  const handleFinish = () => {
    setSessionId(null);
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Audit complete</Text>
      <Text style={styles.subtitle}>
        {loadingCsv ? 'Generating report…' : csvError ? csvError : 'Report ready for download'}
      </Text>

      <Pressable
        style={[styles.button, (!csvContent || loadingCsv) && styles.buttonDisabled]}
        onPress={handleDownloadCsv}
        disabled={!csvContent || loadingCsv}
      >
        {loadingCsv ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Download CSV</Text>
        )}
      </Pressable>

      <Pressable style={styles.secondaryButton} onPress={handleNewAudit}>
        <Text style={styles.secondaryButtonText}>New audit</Text>
      </Pressable>

      <Pressable style={styles.tertiaryButton} onPress={handleFinish}>
        <Text style={styles.tertiaryButtonText}>Finish</Text>
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
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#0066cc',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonDisabled: {
    backgroundColor: '#9ec5ff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#0066cc',
  },
  secondaryButtonText: {
    color: '#0066cc',
    fontSize: 18,
    fontWeight: '600',
  },
  tertiaryButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  tertiaryButtonText: {
    color: '#666',
    fontSize: 16,
  },
});
