import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useAppContext } from '../context/AppContext';
import { XANO_AUDIT_BASE } from '../constants';
import { colors, fontColor, radius, spacing, typography } from '../theme';

type Rooftop = { id: number; name: string; dealer_group_id: number };
type Props = NativeStackScreenProps<RootStackParamList, 'RooftopSelection'>;

export function RooftopSelectionScreen({ navigation, route }: Props) {
  const { dealerGroupId } = route.params;
  const { authToken, setRooftopId, setDealerGroupId } = useAppContext();
  const [rooftops, setRooftops] = useState<Rooftop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRooftops = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${XANO_AUDIT_BASE}/audit/rooftops?dealer_group_id=${dealerGroupId}`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data?.message ?? 'Failed to load rooftops.');
        return;
      }
      setRooftops(Array.isArray(data) ? data : []);
    } catch {
      setError('Unable to connect. Check your network and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRooftops(); }, []);

  const handleSelect = (rooftop: Rooftop) => {
    setDealerGroupId(dealerGroupId);
    setRooftopId(rooftop.id);
    navigation.navigate('StartSession');
  };

  const renderItem: ListRenderItem<Rooftop> = ({ item }) => (
    <Pressable style={styles.item} onPress={() => handleSelect(item)}>
      <Text style={styles.itemText}>{item.name}</Text>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Rooftop</Text>
      <Text style={styles.subtitle}>Choose the location you are auditing</Text>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary1000} style={styles.spinner} />
      ) : error ? (
        <View style={styles.errorState}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={fetchRooftops}>
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      ) : rooftops.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No rooftops found</Text>
          <Text style={styles.emptyBody}>
            This company has no active locations. Contact your administrator.
          </Text>
        </View>
      ) : (
        <FlatList
          data={rooftops}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.neutral0, padding: spacing.gutter },
  title: { ...typography.display, color: fontColor.primary, marginBottom: spacing.sm },
  subtitle: { ...typography.bodyLg, color: fontColor.secondary, marginBottom: spacing.md },
  spinner: { marginTop: spacing.xl },
  list: { paddingVertical: spacing.sm },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.neutral1,
    borderRadius: radius.sm,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  itemText: { ...typography.headingSm, color: fontColor.primary },
  chevron: { fontSize: 20, color: fontColor.tertiary },
  emptyState: { paddingVertical: spacing.xl },
  emptyTitle: { ...typography.headingMd, color: fontColor.primary, marginBottom: spacing.sm },
  emptyBody: { ...typography.bodyMd, color: fontColor.secondary },
  errorState: { paddingVertical: spacing.xl, alignItems: 'center' },
  errorText: { ...typography.bodyMd, color: colors.error, marginBottom: spacing.md, textAlign: 'center' },
  retryButton: {
    borderWidth: 1,
    borderColor: colors.primary1000,
    borderRadius: radius.sm,
    height: 52,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryText: { ...typography.labelLg, color: colors.primary1000 },
});
