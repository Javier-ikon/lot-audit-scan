import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useAppContext } from '../context/AppContext';
import { XANO_AUDIT_BASE } from '../constants';

type Props = NativeStackScreenProps<RootStackParamList, 'Scanning'>;

const VIN_LENGTH = 17;
const VIN_REGEX = /^[A-HJ-NPR-Z0-9]{17}$/;

export function ScanningScreen({ navigation, route }: Props) {
  const { authToken, sessionId } = useAppContext();
  const { scanCount: scanCountParam } = route.params;
  const [vin, setVin] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const scanCount = typeof scanCountParam === 'number' ? scanCountParam : 0;

  const isValidVin = VIN_REGEX.test(vin.replace(/\s/g, ''));

  const handleScan = async () => {
    if (!vin.trim()) return;
    const normalized = vin.trim().toUpperCase();
    setScanError(null);
    if (normalized.length !== VIN_LENGTH || !VIN_REGEX.test(normalized)) {
      setScanError('VIN must be 17 alphanumeric characters (no I, O, or Q).');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${XANO_AUDIT_BASE}/audit/scan-vin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          session_id: sessionId,
          vin: normalized,
          scan_method: 'manual',
        }),
      });
      const data = await res.json();
      const isXanoError = !res.ok || data?.statement === 'Throw Error';
      if (isXanoError) {
        setScanError(data?.payload ?? data?.message ?? 'Could not record this VIN. Please try again.');
        return;
      }
      navigation.replace('ScanResult', {
        vin: normalized,
        scanCount: scanCount + 1,
        scanData: data as Record<string, string>,
      });
    } catch {
      setScanError('Unable to connect. Check your network and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEndAudit = () => {
    navigation.replace('EndAuditConfirm');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          {/* Phase 1: group/rooftop names populated in Phase 2 from AppContext */}
          <Text style={styles.headerGroup}>Ikon Lot Audit</Text>
        </View>
        <Text style={styles.headerCounter}>Scans: {scanCount}</Text>
      </View>
      <Text style={styles.title}>Scan VIN</Text>
      <Text style={styles.subtitle}>Barcode/QR or manual entry</Text>

      <TextInput
        style={[styles.input, scanError ? styles.inputError : null]}
        placeholder="Enter 17-character VIN"
        placeholderTextColor="#999"
        value={vin}
        onChangeText={(text) => { setVin(text.toUpperCase()); setScanError(null); }}
        maxLength={VIN_LENGTH}
        autoCapitalize="characters"
        autoCorrect={false}
        editable={!loading}
        returnKeyType="done"
        onSubmitEditing={handleScan}
      />
      {scanError ? <Text style={styles.errorText}>{scanError}</Text> : null}

      <Pressable
        style={[styles.button, (!isValidVin || loading) && styles.buttonDisabled]}
        onPress={handleScan}
        disabled={!isValidVin || loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Look up</Text>
        )}
      </Pressable>

      <Pressable style={styles.endButton} onPress={handleEndAudit} disabled={loading}>
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
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingBottom: 12,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerInfo: {
    flexShrink: 1,
    paddingRight: 12,
  },
  headerGroup: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  headerRooftop: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  headerCounter: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0066cc',
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
    marginBottom: 8,
  },
  inputError: {
    borderColor: '#cc0000',
  },
  errorText: {
    color: '#cc0000',
    fontSize: 14,
    marginBottom: 12,
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
