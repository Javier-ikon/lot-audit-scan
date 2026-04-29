/**
 * MOCKUP — EndAuditConfirmScreen
 * Epic E4: End Audit & Report Experience — Story 4.1
 *
 * Changes from current:
 * - Shows full session summary BEFORE the FSM confirms ending
 * - Total scanned, pass count, exception count clearly visible
 * - Gives FSM the information they need to catch an accidental early end
 * - Confirm button still red/destructive — ending is irreversible
 *
 * All data is hardcoded — no API calls, no AppContext.
 */

import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';

const MOCK_ROOFTOP = 'Friendly Chevrolet – Dallas';
const MOCK_TOTAL = 127;
const MOCK_PASS = 109;
const MOCK_EXCEPTIONS = 18;

export function EndAuditConfirmMockup() {
  return (
    <View style={styles.container}>

      <Text style={styles.title}>End audit?</Text>
      <Text style={styles.subtitle}>Review your session before closing.</Text>

      {/* ── Session summary ── */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryRooftop}>{MOCK_ROOFTOP}</Text>

        <View style={styles.statsRow}>
          <View style={styles.statBlock}>
            <Text style={styles.statNumber}>{MOCK_TOTAL}</Text>
            <Text style={styles.statLabel}>Scanned</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBlock}>
            <Text style={[styles.statNumber, styles.statPass]}>{MOCK_PASS}</Text>
            <Text style={styles.statLabel}>Pass</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBlock}>
            <Text style={[styles.statNumber, styles.statException]}>{MOCK_EXCEPTIONS}</Text>
            <Text style={styles.statLabel}>Exceptions</Text>
          </View>
        </View>
      </View>

      <Text style={styles.confirmNote}>
        Once ended, the session is closed and your report will be generated.
      </Text>

      {/* ── Actions ── */}
      <Pressable style={styles.confirmButton}>
        <Text style={styles.confirmButtonText}>Yes, end audit</Text>
      </Pressable>

      <Pressable style={styles.cancelButton}>
        <Text style={styles.cancelButtonText}>Cancel — keep scanning</Text>
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    padding: 24,
    justifyContent: 'center',
  },

  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 28,
  },

  // Summary card
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    marginBottom: 20,
    elevation: 1,
  },
  summaryRooftop: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statBlock: { alignItems: 'center', flex: 1 },
  statDivider: { width: 1, height: 40, backgroundColor: '#eee' },
  statNumber: { fontSize: 32, fontWeight: '900', color: '#111' },
  statPass: { color: '#1AAD1A' },
  statException: { color: '#c0392b' },
  statLabel: { fontSize: 12, color: '#888', marginTop: 4 },

  confirmNote: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 18,
  },

  // Actions
  confirmButton: {
    backgroundColor: '#c0392b',
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  confirmButtonText: { color: '#fff', fontSize: 17, fontWeight: '700' },

  cancelButton: {
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  cancelButtonText: { color: '#0066cc', fontSize: 16, fontWeight: '500' },
});
