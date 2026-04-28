/**
 * MOCKUP — SessionCompleteScreen
 * Epic E4: End Audit & Report Experience — Stories 4.2 + 4.3
 *
 * Changes from current:
 * - Audit summary (total, pass, exceptions) shown BEFORE download button
 * - "Download CSV" label clarified to set expectation of a file
 * - "New audit" and "Finish" remain as secondary actions
 *
 * All data is hardcoded — no API calls, no AppContext.
 */

import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';

const MOCK_ROOFTOP = 'Friendly Chevrolet – Dallas';
const MOCK_TOTAL = 127;
const MOCK_PASS = 109;
const MOCK_EXCEPTIONS = 18;
const MOCK_DATE = 'April 28, 2026 · 2:14 PM';

export function SessionCompleteMockup() {
  return (
    <View style={styles.container}>

      {/* ── Completion header ── */}
      <View style={styles.completionHeader}>
        <Text style={styles.checkmark}>✓</Text>
        <Text style={styles.title}>Audit Complete</Text>
        <Text style={styles.date}>{MOCK_DATE}</Text>
      </View>

      {/* ── Audit summary ── */}
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

      {/* ── Actions ── */}
      <View style={styles.actions}>

        <Pressable style={styles.downloadButton}>
          <Text style={styles.downloadIcon}>⬇</Text>
          <Text style={styles.downloadButtonText}>Download Report (.csv)</Text>
        </Pressable>

        <Pressable style={styles.newAuditButton}>
          <Text style={styles.newAuditButtonText}>Start new audit</Text>
        </Pressable>

        <Pressable style={styles.finishButton}>
          <Text style={styles.finishButtonText}>Finish</Text>
        </Pressable>

      </View>

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

  // Completion header
  completionHeader: { alignItems: 'center', marginBottom: 28 },
  checkmark: {
    fontSize: 48,
    color: '#1a7a4a',
    backgroundColor: '#d4f5e2',
    width: 80,
    height: 80,
    textAlign: 'center',
    lineHeight: 80,
    borderRadius: 40,
    marginBottom: 12,
    overflow: 'hidden',
  },
  title: { fontSize: 26, fontWeight: '800', color: '#111' },
  date: { fontSize: 13, color: '#888', marginTop: 4 },

  // Summary card
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    marginBottom: 28,
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
  statPass: { color: '#1a7a4a' },
  statException: { color: '#c0392b' },
  statLabel: { fontSize: 12, color: '#888', marginTop: 4 },

  // Actions
  actions: { gap: 12 },
  downloadButton: {
    backgroundColor: '#0066cc',
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  downloadIcon: { fontSize: 18, color: '#fff' },
  downloadButtonText: { color: '#fff', fontSize: 17, fontWeight: '700' },

  newAuditButton: {
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0066cc',
    backgroundColor: '#fff',
  },
  newAuditButtonText: { color: '#0066cc', fontSize: 16, fontWeight: '600' },

  finishButton: { paddingVertical: 12, alignItems: 'center' },
  finishButtonText: { color: '#888', fontSize: 15 },
});
