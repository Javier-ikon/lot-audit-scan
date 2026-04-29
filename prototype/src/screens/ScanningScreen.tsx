import React, { useState, useEffect, useRef } from 'react';
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
  const { scanCount: scanCountParam, exceptionCount: exceptionCountParam, lastScanStatus } = route.params;
  const [vin, setVin] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [bannerVisible, setBannerVisible] = useState(lastScanStatus === 'pass');
  const inputRef = useRef<TextInput>(null);

  const scanCount = typeof scanCountParam === 'number' ? scanCountParam : 0;
  const exceptionCount = typeof exceptionCountParam === 'number' ? exceptionCountParam : 0;

  // Auto-dismiss the success banner after 3 seconds
  useEffect(() => {
    if (!bannerVisible) return;
    const t = setTimeout(() => setBannerVisible(false), 3000);
    return () => clearTimeout(t);
  }, [bannerVisible]);

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
        exceptionCount,
        scanData: data as Record<string, string>,
      });
    } catch {
      setScanError('Unable to connect. Check your network and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEndAudit = () => {
    navigation.replace('EndAuditConfirm', { scanCount, exceptionCount });
  };

  const tallyText = exceptionCount > 0
    ? `${scanCount} scanned · ${exceptionCount} exceptions`
    : `${scanCount} scanned`;

  return (
    <View style={styles.container}>

      {/* ── Header: rooftop + live tally ── */}
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <Text style={styles.headerRooftop}>Ikon Lot Audit</Text>
        </View>
        <Text style={[styles.headerTally, exceptionCount > 0 && styles.headerTallyException]}>
          {tallyText}
        </Text>
      </View>

      {/* ── Auto-return success banner ── */}
      {bannerVisible && (
        <View style={styles.autoReturnBanner}>
          <Text style={styles.autoReturnText}>✓ Last scan passed — ready for next vehicle</Text>
        </View>
      )}

      {/* ── Ready to scan zone ── */}
      <View style={styles.scanZone}>
        <Text style={styles.scanZoneLabel}>Ready to Scan</Text>
        <Text style={styles.scanZoneSub}>Point scanner at barcode or type VIN below</Text>

        <TextInput
          ref={inputRef}
          style={[styles.input, scanError ? styles.inputError : null]}
          placeholder="VIN (17 characters)"
          placeholderTextColor="#aaa"
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
      </View>

      <Pressable style={styles.endButton} onPress={handleEndAudit} disabled={loading}>
        <Text style={styles.endButtonText}>End audit</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa' },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
  },
  headerInfo: { flexShrink: 1, paddingRight: 12 },
  headerRooftop: { fontSize: 15, fontWeight: '700', color: '#111' },
  headerTally: { fontSize: 13, color: '#555', fontWeight: '500' },
  headerTallyException: { color: '#c0392b', fontWeight: '700' },

  // Auto-return success banner
  autoReturnBanner: {
    backgroundColor: '#eaffea',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#b3ffb3',
  },
  autoReturnText: { fontSize: 13, color: '#1AAD1A', fontWeight: '600' },

  // Scan zone
  scanZone: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  scanZoneLabel: { fontSize: 22, fontWeight: '800', color: '#111', marginBottom: 6, textAlign: 'center' },
  scanZoneSub: { fontSize: 14, color: '#888', marginBottom: 28, textAlign: 'center' },

  input: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 16,
    fontSize: 18,
    marginBottom: 8,
    backgroundColor: '#fff',
    textAlign: 'center',
    letterSpacing: 1,
  },
  inputError: { borderColor: '#c0392b' },
  errorText: { color: '#c0392b', fontSize: 14, marginBottom: 12, textAlign: 'center' },

  button: {
    backgroundColor: '#0066cc',
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonDisabled: { backgroundColor: '#ccc' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '700' },

  endButton: { paddingVertical: 20, alignItems: 'center' },
  endButtonText: { color: '#888', fontSize: 15 },
});
