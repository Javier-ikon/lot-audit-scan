/**
 * MOCKUP — ResumeSessionScreen
 * Epic E5: Resume Session Context Fix — Stories 5.1 + 5.2
 *
 * Changes from current:
 * - Shows ROOFTOP NAME instead of raw "Rooftop ID: 1"
 * - Shows pass + exception breakdown on the resume card (not just total scans)
 * - FSM has enough context to make a confident resume vs. start-new decision
 *
 * All data is hardcoded — no API calls, no AppContext.
 */

import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';

const MOCK_ROOFTOP_NAME = 'Friendly Chevrolet – Dallas';
const MOCK_STARTED_AT = 'April 28, 2026 · 9:42 AM';
const MOCK_TOTAL = 63;
const MOCK_PASS = 57;
const MOCK_EXCEPTIONS = 6;

export function ResumeSessionMockup() {
  return (
    <View style={styles.container}>

      <Text style={styles.title}>Unfinished Audit Found</Text>
      <Text style={styles.subtitle}>
        You have an audit in progress. Would you like to continue where you left off?
      </Text>

      {/* ── Session card with full context ── */}
      <View style={styles.card}>

        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Rooftop</Text>
          <Text style={styles.cardValue}>{MOCK_ROOFTOP_NAME}</Text>
        </View>

        <View style={styles.cardDivider} />

        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Started</Text>
          <Text style={styles.cardValue}>{MOCK_STARTED_AT}</Text>
        </View>

        <View style={styles.cardDivider} />

        {/* Scan breakdown — not just a flat total */}
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
      <Pressable style={styles.resumeButton}>
        <Text style={styles.resumeButtonText}>Resume audit</Text>
      </Pressable>

      <Pressable style={styles.newButton}>
        <Text style={styles.newButtonText}>Discard and start new audit</Text>
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

  title: { fontSize: 24, fontWeight: '800', color: '#111', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#555', lineHeight: 22, marginBottom: 28 },

  // Card
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    marginBottom: 28,
    elevation: 1,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  cardDivider: { height: 1, backgroundColor: '#f0f0f0' },
  cardLabel: { fontSize: 13, color: '#888' },
  cardValue: { fontSize: 14, fontWeight: '600', color: '#111', textAlign: 'right', flexShrink: 1, paddingLeft: 12 },

  // Stats row
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 16,
  },
  statBlock: { alignItems: 'center', flex: 1 },
  statDivider: { width: 1, height: 36, backgroundColor: '#eee' },
  statNumber: { fontSize: 28, fontWeight: '900', color: '#111' },
  statPass: { color: '#1a7a4a' },
  statException: { color: '#c0392b' },
  statLabel: { fontSize: 12, color: '#888', marginTop: 4 },

  // Actions
  resumeButton: {
    backgroundColor: '#0066cc',
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  resumeButtonText: { color: '#fff', fontSize: 17, fontWeight: '700' },

  newButton: {
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  newButtonText: { color: '#c0392b', fontSize: 15, fontWeight: '500' },
});
