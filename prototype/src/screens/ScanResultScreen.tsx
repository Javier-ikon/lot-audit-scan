import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
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
};

export function ScanResultScreen({ navigation, route }: Props) {
  const { rooftopId, vin } = route.params;
  const result = MOCK_RESULT;

  const handleNext = () => {
    navigation.replace('Scanning', { rooftopId });
  };

  const handleEndAudit = () => {
    navigation.replace('EndAuditConfirm', { rooftopId });
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

      <View style={styles.actions}>
        <Pressable style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Next vehicle</Text>
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
  endButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  endButtonText: {
    color: '#666',
    fontSize: 16,
  },
});
