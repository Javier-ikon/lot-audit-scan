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
import { XANO_REPORTS_BASE } from '../constants';

type Props = NativeStackScreenProps<RootStackParamList, 'SessionComplete'>;

type Filter = 'all' | 'pass' | 'exception';

export function SessionCompleteScreen({ navigation }: Props) {
  const { authToken, userId, setSessionId } = useAppContext();
  const [csvContent, setCsvContent] = useState<string | null>(null);
  const [loadingCsv, setLoadingCsv] = useState(true);
  const [csvError, setCsvError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [hintVisible, setHintVisible] = useState(true);

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

  function handleFilter(f: Filter) {
    setFilter(f);
    setHintVisible(false);
  }

  // Placeholder scan list — will be replaced by real data from backend (Epic E6)
  const scans: Array<{ id: string; vin: string; status: 'pass' | 'exception'; exceptionType?: string }> = [];

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

      {/* ── Scan list (empty until backend E6 is ready) ── */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        style={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              {loadingCsv ? 'Loading report…' : csvError ? csvError : 'Vehicle list available in a future update.'}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.scanRow}>
            <View style={[styles.statusDot, item.status === 'pass' ? styles.dotPass : styles.dotException]} />
            <View style={styles.scanInfo}>
              <Text style={styles.scanVin}>{item.vin}</Text>
              {item.exceptionType && <Text style={styles.scanException}>{item.exceptionType}</Text>}
            </View>
            <Text style={[styles.scanBadge, item.status === 'pass' ? styles.badgePass : styles.badgeException]}>
              {item.status === 'pass' ? '✓' : '✗'}
            </Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

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
  container: { flex: 1, backgroundColor: '#f5f7fa' },

  // Completion header
  completionHeader: { alignItems: 'center', paddingVertical: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  checkmark: { fontSize: 32, color: '#1AAD1A', backgroundColor: '#eaffea', width: 60, height: 60, textAlign: 'center', lineHeight: 60, borderRadius: 30, marginBottom: 8, overflow: 'hidden' },
  title: { fontSize: 22, fontWeight: '800', color: '#111' },
  rooftop: { fontSize: 13, fontWeight: '600', color: '#555', marginTop: 4 },
  date: { fontSize: 12, color: '#aaa', marginTop: 2 },

  // Interactive stat filter pills
  pillSection: { backgroundColor: '#fff', paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#eee', alignItems: 'center' },
  pillRow: { flexDirection: 'row', gap: 10, alignSelf: 'stretch' },
  pill: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 20, gap: 5 },
  pillCount: { fontSize: 18, fontWeight: '900' },
  pillLabel: { fontSize: 13, fontWeight: '600' },
  pillTextActive: { color: '#fff' },
  pillAllActive: { backgroundColor: '#333' },
  pillAllInactive: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#333' },
  pillAllInactiveText: { color: '#333' },
  pillPassActive: { backgroundColor: '#1AAD1A' },
  pillPassInactive: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#1AAD1A' },
  pillPassInactiveText: { color: '#1AAD1A' },
  pillExcActive: { backgroundColor: '#c0392b' },
  pillExcInactive: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#c0392b' },
  pillExcInactiveText: { color: '#c0392b' },
  pillHint: { fontSize: 11, color: '#aaa', fontStyle: 'italic', marginTop: 6 },

  // List
  list: { flex: 1 },
  emptyState: { padding: 32, alignItems: 'center' },
  emptyStateText: { fontSize: 14, color: '#aaa', textAlign: 'center', lineHeight: 22 },
  scanRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 12 },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginRight: 12, flexShrink: 0 },
  dotPass: { backgroundColor: '#1AAD1A' },
  dotException: { backgroundColor: '#c0392b' },
  scanInfo: { flex: 1 },
  scanVin: { fontSize: 13, color: '#555', fontFamily: 'monospace' },
  scanException: { fontSize: 12, color: '#c0392b', marginTop: 2, fontWeight: '600' },
  scanBadge: { fontSize: 16, fontWeight: '800', marginLeft: 8 },
  badgePass: { color: '#1AAD1A' },
  badgeException: { color: '#c0392b' },
  separator: { height: 1, backgroundColor: '#f0f0f0', marginLeft: 38 },

  // Actions
  actions: { padding: 16, gap: 10, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee' },
  downloadButton: { backgroundColor: '#0066cc', paddingVertical: 16, borderRadius: 10, alignItems: 'center' },
  downloadButtonDisabled: { backgroundColor: '#9ec5ff' },
  downloadButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  newAuditButton: { paddingVertical: 14, borderRadius: 10, alignItems: 'center', borderWidth: 2, borderColor: '#0066cc', backgroundColor: '#fff' },
  newAuditButtonText: { color: '#0066cc', fontSize: 15, fontWeight: '600' },
  finishButton: { paddingVertical: 10, alignItems: 'center' },
  finishButtonText: { color: '#aaa', fontSize: 14 },
});
