import React from 'react';
import { StyleSheet, Text, View, Pressable, Alert } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import type { ScanResult } from '../types/scan';

type Props = NativeStackScreenProps<RootStackParamList, 'ScanResult'>;

// Mock scan result for prototype
const MOCK_RESULT: ScanResult = {
  Serial: '016723002393428',
  Activated: '2025-12-29 13:21',
  LastReportDate: '2026-02-24 16:10',
  Company: 'Friendly Chevrolet',
  Group: 'Friendly Chevrolet',
  Notes: '',
  status: 'pass',
  // reason: 'wrong_rooftop', // uncomment to preview exception UI
};

export function ScanResultScreen({ navigation, route }: Props) {
  const { rooftopId, vin, scanCount: scanCountParam } = route.params;
  const scanCount = typeof scanCountParam === 'number' ? scanCountParam : 0;
  const result = MOCK_RESULT;

  const handleNext = () => {
    // Counter already incremented when navigating to Scan Result
    navigation.replace('Scanning', { rooftopId, scanCount });
  };

  const handleEndAudit = () => {
    navigation.replace('EndAuditConfirm', { rooftopId });
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
          onPress: () => {
            // Decrement count on delete (min 0)
            const nextCount = Math.max(0, scanCount - 1);
            navigation.replace('Scanning', { rooftopId, scanCount: nextCount });
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
          result.status === 'pass' ? styles.statusPass : styles.statusException,
        ]}
      >
        <Text
          style={[
            styles.statusText,
            result.status === 'pass'
              ? styles.statusTextPass
              : styles.statusTextException,
          ]}
        >
          {result.status.toUpperCase()}
        </Text>
      </View>

      <Text style={styles.label}>VIN</Text>
      <Text style={styles.value}>{vin}</Text>

      <Text style={styles.label}>Serial</Text>
      <Text style={styles.value}>{result.Serial}</Text>

      <Text style={styles.label}>Company</Text>
      <Text style={styles.value}>{result.Company}</Text>

      <Text style={styles.label}>Last Report</Text>
      <Text style={styles.value}>{result.LastReportDate}</Text>

      {result.status === 'exception' && (
        <View style={styles.exceptionBlock}>
          <Text style={styles.exceptionTitle}>Reason</Text>
          <Text style={styles.exceptionValue}>{result.reason ?? 'Unknown'}</Text>
        </View>
      )}

      <View style={styles.actions}>
        <Pressable style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Next vehicle</Text>
        </Pressable>
        <Pressable style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>Delete scan</Text>
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
  statusTextPass: {
    color: '#155724',
  },
  statusTextException: {
    color: '#721c24',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '700',
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
