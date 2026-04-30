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
import { colors, fontColor, radius, spacing, typography } from '../theme';

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

  return (
    <View style={styles.container}>

      {/* ── Header: rooftop name (stacked) + live tally ── */}
      <View style={styles.header}>
        <Text style={styles.headerRooftop} numberOfLines={1}>Ikon Lot Audit</Text>
        <Text style={styles.headerTally}>
          {scanCount} scanned · {' '}
          <Text style={styles.headerTallyException}>{exceptionCount} exceptions</Text>
        </Text>
      </View>

      {/* ── Auto-return success banner ── */}
      {bannerVisible && (
        <View style={styles.autoReturnBanner}>
          <Text style={styles.autoReturnText}>✓ Scan recorded — ready for next vehicle</Text>
        </View>
      )}

      {/* ── Body: title + VIN input ── */}
      <View style={styles.body}>
        <Text style={styles.title}>Scan VIN</Text>
        <Text style={styles.subtitle}>Pull trigger to scan barcode, or type below</Text>

        <TextInput
          ref={inputRef}
          style={[styles.input, scanError ? styles.inputError : null]}
          placeholder="17-character VIN"
          placeholderTextColor={fontColor.tertiary}
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
          style={[styles.lookupButton, (!isValidVin || loading) && styles.lookupButtonDisabled]}
          onPress={handleScan}
          disabled={!isValidVin || loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={[styles.lookupButtonText, (!isValidVin || loading) && styles.lookupButtonTextDisabled]}>
              Look up
            </Text>
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
  container: { flex: 1, backgroundColor: colors.neutral0 },

  // Header — stacked column layout matching mockup
  header: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md - 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral1,
  },
  headerRooftop: { ...typography.headingSm, color: fontColor.primary },
  headerTally: { ...typography.bodySm, color: fontColor.secondary, marginTop: 2 },
  headerTallyException: { color: colors.error, fontWeight: '700' },

  // Auto-return banner
  autoReturnBanner: {
    backgroundColor: colors.primary100,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary200,
  },
  autoReturnText: { ...typography.labelMd, color: colors.secondary1000 },

  // Body
  body: { flex: 1, padding: spacing.lg },
  title: { ...typography.display, color: fontColor.primary, marginBottom: spacing.xs + 2 },
  subtitle: { ...typography.bodyLg, color: fontColor.secondary, marginBottom: spacing.lg + 4 },

  input: {
    borderWidth: 1,
    borderColor: colors.neutral1,
    borderRadius: radius.sm,
    padding: spacing.md,
    fontSize: 18,
    fontFamily: typography.fontFamily,
    color: fontColor.primary,
    backgroundColor: colors.white,
    marginBottom: spacing.sm,
  },
  inputError: { borderColor: colors.error, borderWidth: 2 },
  errorText: { ...typography.bodySm, color: colors.error, marginBottom: spacing.sm + 4 },

  lookupButton: {
    backgroundColor: colors.primary1000,
    paddingVertical: spacing.md,
    borderRadius: radius.sm,
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  lookupButtonDisabled: { backgroundColor: colors.neutral1 },
  lookupButtonText: { ...typography.labelLg, color: colors.white },
  lookupButtonTextDisabled: { color: colors.neutral3 },

  // End audit — bordered outline button
  endButton: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    paddingVertical: spacing.md - 2,
    borderRadius: radius.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary1000,
    backgroundColor: 'transparent',
  },
  endButtonText: { ...typography.labelLg, color: colors.primary1000 },
});
