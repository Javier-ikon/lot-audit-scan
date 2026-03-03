import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'SessionComplete'>;

export function SessionCompleteScreen({ navigation }: Props) {
  const handleDownloadCsv = () => {
    // Placeholder: in a real app, trigger CSV download
  };

  const handleNewAudit = () => {
    navigation.replace('RooftopSelection');
  };

  const handleFinish = () => {
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Audit complete</Text>
      <Text style={styles.subtitle}>Report ready for download</Text>

      <Pressable style={styles.button} onPress={handleDownloadCsv}>
        <Text style={styles.buttonText}>Download CSV</Text>
      </Pressable>

      <Pressable style={styles.secondaryButton} onPress={handleNewAudit}>
        <Text style={styles.secondaryButtonText}>New audit</Text>
      </Pressable>

      <Pressable style={styles.tertiaryButton} onPress={handleFinish}>
        <Text style={styles.tertiaryButtonText}>Finish</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#0066cc',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#0066cc',
  },
  secondaryButtonText: {
    color: '#0066cc',
    fontSize: 18,
    fontWeight: '600',
  },
  tertiaryButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  tertiaryButtonText: {
    color: '#666',
    fontSize: 16,
  },
});
