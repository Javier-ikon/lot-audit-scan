import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  FlatList,
  ListRenderItem,
  Modal,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { MOCK_ROOFTOPS } from '../constants';

type Props = NativeStackScreenProps<RootStackParamList, 'RooftopSelection'>;

export function RooftopSelectionScreen({ navigation, route }: Props) {
  const { dealerGroupId } = route.params;
  const [selectedId, setSelectedId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  const rooftops = MOCK_ROOFTOPS.filter((r: any) => r.dealerGroupId === dealerGroupId);

  const selectedName =
    rooftops.find((r: any) => r.id === selectedId)?.name ??
    (rooftops.length ? 'Tap to select a dealer group...' : 'No dealer groups found for this group');

  const handleStartAudit = () => {
    if (!selectedId) return;
    navigation.replace('Scanning', { rooftopId: selectedId });
  };

  const renderItem: ListRenderItem<{ id: string; name: string }> = ({
    item,
  }) => (
    <Pressable
      style={[styles.dropdownItem, selectedId === item.id && styles.dropdownItemSelected]}
      onPress={() => {
        setSelectedId(item.id);
        setIsOpen(false);
      }}
    >
      <Text
        style={[
          styles.dropdownItemText,
          selectedId === item.id && styles.dropdownItemTextSelected,
        ]}
      >
        {item.name}
      </Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Dealer Group</Text>
      <Text style={styles.subtitle}>Tap to choose a dealer group</Text>
      {rooftops.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No dealer groups found</Text>
          <Text style={styles.emptyBody}>
            This dealer group has no locations assigned to your account.
          </Text>
        </View>
      ) : (
        <View style={styles.dropdown}>
          <Pressable
            style={styles.dropdownTrigger}
            onPress={() => setIsOpen(!isOpen)}
          >
            <Text
              style={[
                styles.dropdownTriggerText,
                !selectedId && styles.dropdownTriggerPlaceholder,
              ]}
            >
              {selectedName}
            </Text>
            <Text style={styles.dropdownChevron}>{isOpen ? '▲' : '▼'}</Text>
          </Pressable>
          <Modal
            visible={isOpen}
            transparent
            animationType="fade"
            onRequestClose={() => setIsOpen(false)}
          >
            <Pressable
              style={styles.modalOverlay}
              onPress={() => setIsOpen(false)}
            >
              <Pressable
                style={styles.modalContent}
                onPress={(e) => e.stopPropagation()}
              >
                <Text style={styles.modalTitle}>Select a dealer group</Text>
                <FlatList
                  data={rooftops}
                  keyExtractor={(item) => item.id}
                  renderItem={renderItem}
                  style={styles.modalList}
                />
                <Pressable
                  style={styles.modalCloseButton}
                  onPress={() => setIsOpen(false)}
                >
                  <Text style={styles.modalCloseText}>Close</Text>
                </Pressable>
              </Pressable>
            </Pressable>
          </Modal>
        </View>
      )}
      <Pressable
        style={[styles.button, !selectedId && styles.buttonDisabled]}
        onPress={handleStartAudit}
        disabled={!selectedId}
      >
        <Text style={styles.buttonText}>Start audit</Text>
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
    marginBottom: 24,
  },
  dropdown: {
    marginBottom: 24,
  },
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#fff',
  },
  dropdownTriggerText: {
    fontSize: 16,
  },
  dropdownTriggerPlaceholder: {
    color: '#999',
  },
  dropdownChevron: {
    fontSize: 12,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    maxHeight: 360,
    paddingBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalList: {
    maxHeight: 240,
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
  modalCloseButton: {
    padding: 16,
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    color: '#0066cc',
    fontWeight: '600',
  },
  dropdownItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownItemSelected: {
    backgroundColor: '#e6f2ff',
  },
  dropdownItemText: {
    fontSize: 16,
  },
  dropdownItemTextSelected: {
    fontWeight: '600',
    color: '#0066cc',
  },
  button: {
    backgroundColor: '#0066cc',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
