import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Alert,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Scanning'>;

const VIN_LENGTH = 17;
const VIN_REGEX = /^[A-HJ-NPR-Z0-9]{17}$/;

export function ScanningScreen({ navigation, route }: Props) {
  const { rooftopId } = route.params;
  const [vin, setVin] = useState('');

  const isValidVin = VIN_REGEX.test(vin.replace(/\s/g, ''));

  const handleScan = () => {
    if (!vin.trim()) return;
    const normalized = vin.trim().toUpperCase();
    if (normalized.length !== VIN_LENGTH || !VIN_REGEX.test(normalized)) {
      Alert.alert('Invalid VIN', 'VIN must be 17 alphanumeric characters.');
      return;
    }
    navigation.replace('ScanResult', { rooftopId, vin: normalized });
  };

  const handleEndAudit = () => {
    navigation.replace('EndAuditConfirm', { rooftopId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan VIN</Text>
      <Text style={styles.subtitle}>Barcode/QR or manual entry</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter 17-character VIN"
        placeholderTextColor="#999"
        value={vin}
        onChangeText={(text) => setVin(text.toUpperCase())}
        maxLength={VIN_LENGTH}
        autoCapitalize="characters"
        autoCorrect={false}
      />

      <Pressable
        style={[styles.button, !isValidVin && styles.buttonDisabled]}
        onPress={handleScan}
        disabled={!isValidVin}
      >
        <Text style={styles.buttonText}>Look up</Text>
      </Pressable>

      <Pressable style={styles.endButton} onPress={handleEndAudit}>
        <Text style={styles.endButtonText}>End audit</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  input: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 16,
    fontSize: 18,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#0066cc',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
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
