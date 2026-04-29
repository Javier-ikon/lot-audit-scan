/**
 * MockupNavigator — FSM UX Mockup Viewer
 *
 * Simple home list + stack navigation across all mockup screens.
 * No auth, no backend, no AppContext — pure UI review.
 *
 * To activate: swap App.tsx to import MockupNavigator instead of RootNavigator.
 * To deactivate: revert App.tsx back to RootNavigator.
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  FlatList,
  SafeAreaView,
} from 'react-native';

import { ScanningScreenMockup } from './ScanningScreen.mockup';
import { ScanResultPassMockup } from './ScanResultPass.mockup';
import { ScanResultExceptionMockup } from './ScanResultException.mockup';
import { EndAuditConfirmMockup } from './EndAuditConfirm.mockup';
import { SessionCompleteMockup } from './SessionComplete.mockup';
import { ResumeSessionMockup } from './ResumeSession.mockup';

type RootParamList = {
  MockupHome: undefined;
  ScanningScreen: undefined;
  ScanResultPass: undefined;
  ScanResultException: undefined;
  EndAuditConfirm: undefined;
  SessionComplete: undefined;
  ResumeSession: undefined;
};

const Stack = createNativeStackNavigator<RootParamList>();

const MOCKUPS = [
  {
    key: 'ScanningScreen',
    label: 'Scanning Screen',
    epic: 'E2 + E3',
    description: 'Tally header · ready-to-scan zone · rooftop context',
  },
  {
    key: 'ScanResultPass',
    label: 'Scan Result — Pass',
    epic: 'E1 + E3',
    description: 'Full-bleed green · minimal layout · tally updated',
  },
  {
    key: 'ScanResultException',
    label: 'Scan Result — Exception',
    epic: 'E1 + E3',
    description: 'Full-bleed status · required action · all 5 types',
  },
  {
    key: 'EndAuditConfirm',
    label: 'End Audit Confirm',
    epic: 'E4',
    description: 'Session summary before FSM confirms ending',
  },
  {
    key: 'SessionComplete',
    label: 'Session Complete',
    epic: 'E4',
    description: 'Audit summary + proper CSV file download CTA',
  },
  {
    key: 'ResumeSession',
    label: 'Resume Session',
    epic: 'E5',
    description: 'Rooftop name + pass/exception count on resume card',
  },
];

function MockupHomeScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.homeContainer}>
      <View style={styles.homeBanner}>
        <Text style={styles.homeBannerTitle}>🧪 UX Mockups</Text>
        <Text style={styles.homeBannerSub}>FSM Scanning Experience · Epics E1–E5</Text>
        <Text style={styles.homeBannerNote}>All screens use hardcoded data — no backend</Text>
      </View>
      <FlatList
        data={MOCKUPS}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.homeList}
        renderItem={({ item }) => (
          <Pressable
            style={styles.homeItem}
            onPress={() => navigation.navigate(item.key as keyof RootParamList)}
          >
            <View style={styles.homeItemLeft}>
              <Text style={styles.homeItemLabel}>{item.label}</Text>
              <Text style={styles.homeItemDescription}>{item.description}</Text>
            </View>
            <View style={styles.homeItemRight}>
              <Text style={styles.homeItemEpic}>{item.epic}</Text>
              <Text style={styles.homeItemChevron}>›</Text>
            </View>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

export function MockupNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="MockupHome"
          component={MockupHomeScreen}
          options={{ title: 'UX Mockups', headerLargeTitle: true }}
        />
        <Stack.Screen name="ScanningScreen" component={ScanningScreenMockup} options={{ title: 'Scanning Screen' }} />
        <Stack.Screen name="ScanResultPass" component={ScanResultPassMockup} options={{ title: 'Scan Result — Pass' }} />
        <Stack.Screen name="ScanResultException" component={ScanResultExceptionMockup} options={{ title: 'Scan Result — Exception' }} />
        <Stack.Screen name="EndAuditConfirm" component={EndAuditConfirmMockup} options={{ title: 'End Audit Confirm' }} />
        <Stack.Screen name="SessionComplete" component={SessionCompleteMockup} options={{ title: 'Session Complete' }} />
        <Stack.Screen name="ResumeSession" component={ResumeSessionMockup} options={{ title: 'Resume Session' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  homeContainer: { flex: 1, backgroundColor: '#f5f7fa' },

  homeBanner: {
    backgroundColor: '#0066cc',
    padding: 20,
    paddingBottom: 24,
  },
  homeBannerTitle: { fontSize: 20, fontWeight: '800', color: '#fff' },
  homeBannerSub: { fontSize: 14, color: '#a8d0f8', marginTop: 4 },
  homeBannerNote: {
    fontSize: 12,
    color: '#7ab8f5',
    marginTop: 8,
    fontStyle: 'italic',
  },

  homeList: { padding: 16, gap: 10 },

  homeItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 1,
  },
  homeItemLeft: { flex: 1, paddingRight: 12 },
  homeItemLabel: { fontSize: 15, fontWeight: '700', color: '#111' },
  homeItemDescription: { fontSize: 12, color: '#888', marginTop: 4, lineHeight: 18 },
  homeItemRight: { alignItems: 'center', gap: 4 },
  homeItemEpic: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0066cc',
    backgroundColor: '#eaf2ff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  homeItemChevron: { fontSize: 22, color: '#ccc' },
});
