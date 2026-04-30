/**
 * ViewModeToggle — dev-only floating pill that flips between
 * the production prototype UI and the mockup UI.
 *
 * Persists the choice in localStorage on web; falls back to
 * in-memory state on native (Expo Go).
 *
 * Intentionally lives outside src/screens — this is tooling, not product.
 */

import React, { useEffect, useState, useCallback } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '../../mockup/theme';

export type ViewMode = 'prototype' | 'mockup';

const STORAGE_KEY = 'ikon.viewMode';

function readInitialMode(): ViewMode {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === 'prototype' || stored === 'mockup') return stored;
    } catch {
      // localStorage unavailable — fall through
    }
  }
  return 'prototype';
}

function persistMode(mode: ViewMode) {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // ignore
    }
  }
}

type Props = {
  mode: ViewMode;
  onToggle: (next: ViewMode) => void;
};

export function ViewModeToggle({ mode, onToggle }: Props) {
  const isMockup = mode === 'mockup';
  const next: ViewMode = isMockup ? 'prototype' : 'mockup';

  return (
    <View pointerEvents="box-none" style={styles.container}>
      <Pressable
        onPress={() => onToggle(next)}
        style={[styles.pill, isMockup ? styles.pillMockup : styles.pillPrototype]}
        accessibilityLabel={`Switch to ${next} view`}
      >
        <View style={[styles.dot, isMockup ? styles.dotMockup : styles.dotPrototype]} />
        <Text style={[styles.label, isMockup ? styles.labelMockup : styles.labelPrototype]}>
          {isMockup ? 'MOCKUP' : 'PROTOTYPE'}
        </Text>
      </Pressable>
    </View>
  );
}

export function useViewMode() {
  const [mode, setMode] = useState<ViewMode>(readInitialMode);

  const setAndPersist = useCallback((next: ViewMode) => {
    setMode(next);
    persistMode(next);
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && (e.newValue === 'prototype' || e.newValue === 'mockup')) {
        setMode(e.newValue);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return [mode, setAndPersist] as const;
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.md,
    zIndex: 9999,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    borderWidth: 1,
    shadowColor: colors.neutralBlack,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  pillPrototype: {
    backgroundColor: colors.white,
    borderColor: colors.primary1000,
  },
  pillMockup: {
    backgroundColor: colors.neutral9,
    borderColor: colors.neutral9,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs,
  },
  dotPrototype: {
    backgroundColor: colors.primary1000,
  },
  dotMockup: {
    backgroundColor: colors.warning,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  labelPrototype: {
    color: colors.primary1000,
  },
  labelMockup: {
    color: colors.white,
  },
});
