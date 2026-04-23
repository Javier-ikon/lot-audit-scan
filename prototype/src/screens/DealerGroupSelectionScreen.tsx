import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  FlatList,
  ListRenderItem,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { MOCK_DEALER_GROUPS } from '../constants';

type Props = NativeStackScreenProps<RootStackParamList, 'DealerGroupSelection'>;

export function DealerGroupSelectionScreen({ navigation }: Props) {
  const renderItem: ListRenderItem<{ id: string; name: string }> = ({ item }) => (
    <Pressable
      style={styles.item}
      onPress={() => navigation.navigate('RooftopSelection', { dealerGroupId: item.id })}
    >
      <Text style={styles.itemText}>{item.name}</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Dealer</Text>
      <Text style={styles.subtitle}>Choose a company to view its rooftops</Text>
      {MOCK_DEALER_GROUPS.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No companies found</Text>
          <Text style={styles.emptyBody}>
            You don’t have access to any companies yet. Please contact your
            administrator to be assigned to a company.
          </Text>
        </View>
      ) : (
        <FlatList
          data={MOCK_DEALER_GROUPS}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
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
    marginBottom: 16,
  },
  list: {
    paddingVertical: 8,
  },
  emptyState: {
    paddingVertical: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyBody: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  item: {
    padding: 16,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  itemText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
