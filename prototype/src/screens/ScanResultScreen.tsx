import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, Alert, ActivityIndicator } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { XANO_AUDIT_BASE } from '../constants';

type Props = NativeStackScreenProps<RootStackParamList, 'ScanResult'>;

export function ScanResultScreen({ navigation, route }: Props) {
  const { vin, scanCount: scanCountParam, scanData } = route.params;
  const scanCount = typeof scanCountParam === 'number' ? scanCountParam : 0;
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
    navigation.replace('Scanning', { scanCount });
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

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.statusBadge,
          isPass ? styles.statusPass : isException ? styles.statusException : styles.statusRecorded,
        ]}
      >
        <Text
          style={[
            styles.statusText,
            isPass ? styles.statusTextPass : isException ? styles.statusTextException : styles.statusTextRecorded,
          ]}
        >
          {status.toUpperCase()}
        </Text>
      </View>

      <Text style={styles.label}>VIN</Text>
      <Text style={styles.value}>{vin}</Text>

      {!deviceFound && (
        <Text style={styles.notFound}>Device not found in Planet X</Text>
      )}

      <Text style={styles.label}>Serial</Text>
      <Text style={styles.value}>{serial}</Text>

      <Text style={styles.label}>Company</Text>
      <Text style={styles.value}>{company}</Text>

      <Text style={styles.label}>Group</Text>
      <Text style={styles.value}>{group}</Text>

      <Text style={styles.label}>Last Report</Text>
      <Text style={styles.value}>{lastReport}</Text>

      <Text style={styles.label}>Device Status</Text>
      <Text style={styles.value}>{deviceStatus}</Text>

      {isException && (
        <View style={styles.exceptionBlock}>
          <Text style={styles.exceptionTitle}>Reason</Text>
          <Text style={styles.exceptionValue}>{reason ?? 'Unknown'}</Text>
        </View>
      )}

      <View style={styles.actions}>
        <Pressable style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Next vehicle</Text>
        </Pressable>
        <Pressable style={styles.deleteButton} onPress={handleDelete} disabled={deleting}>
          {deleting
            ? <ActivityIndicator color="#cc0000" />
            : <Text style={styles.deleteButtonText}>Delete scan</Text>}
        </Pressable>
        <Pressable style={styles.endButton} onPress={handleEndAudit}>
          <Text style={styles.endButtonText}>End audit</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 24,
  },
  statusPass: {
    backgroundColor: '#d4edda',
  },
  statusException: {
    backgroundColor: '#f8d7da',
  },
  statusRecorded: {
    backgroundColor: '#e2e8f0',
  },
  statusTextPass: {
    color: '#155724',
  },
  statusTextException: {
    color: '#721c24',
  },
  statusTextRecorded: {
    color: '#444',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '700',
  },
  notFound: {
    marginTop: 8,
    marginBottom: 4,
    fontSize: 13,
    color: '#cc6600',
    fontStyle: 'italic',
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginTop: 16,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
  },
  actions: {
    marginTop: 32,
    gap: 12,
  },
  button: {
    backgroundColor: '#0066cc',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#cc0000',
    fontSize: 16,
    fontWeight: '600',
  },
  endButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  endButtonText: {
    color: '#666',
    fontSize: 16,
  },
  exceptionBlock: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#fff5f5',
    borderRadius: 8,
  },
  exceptionTitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  exceptionValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#cc0000',
    textTransform: 'capitalize',
  },
});
