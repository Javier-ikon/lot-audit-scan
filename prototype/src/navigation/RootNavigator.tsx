import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import { LoginScreen } from '../screens/LoginScreen';
// Phase 1: dormant — kept registered so Phase 2 can reactivate without nav changes
import { DealerGroupSelectionScreen } from '../screens/DealerGroupSelectionScreen';
import { RooftopSelectionScreen } from '../screens/RooftopSelectionScreen';
import { StartSessionScreen } from '../screens/StartSessionScreen';
import { ScanningScreen } from '../screens/ScanningScreen';
import { ScanResultScreen } from '../screens/ScanResultScreen';
import { EndAuditConfirmScreen } from '../screens/EndAuditConfirmScreen';
import { SessionCompleteScreen } from '../screens/SessionCompleteScreen';
import { ResumeSessionScreen } from '../screens/ResumeSessionScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: true }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        {/* Phase 1: dormant — not routed to until Phase 2 */}
        <Stack.Screen
          name="DealerGroupSelection"
          component={DealerGroupSelectionScreen}
          options={{ title: 'Company' }}
        />
        <Stack.Screen
          name="RooftopSelection"
          component={RooftopSelectionScreen}
          options={{ title: 'Dealer Group Selection' }}
        />
        <Stack.Screen
          name="ResumeSession"
          component={ResumeSessionScreen}
          options={{ title: 'Resume Audit', headerBackVisible: false }}
        />
        {/* Phase 1: entry point after login */}
        <Stack.Screen
          name="StartSession"
          component={StartSessionScreen}
          options={{ title: 'Start Audit', headerBackVisible: false }}
        />
        <Stack.Screen
          name="Scanning"
          component={ScanningScreen}
          options={{ title: 'Scan VIN' }}
        />
        <Stack.Screen
          name="ScanResult"
          component={ScanResultScreen}
          options={{ title: 'Scan Result' }}
        />
        <Stack.Screen
          name="EndAuditConfirm"
          component={EndAuditConfirmScreen}
          options={{ title: 'End Audit' }}
        />
        <Stack.Screen
          name="SessionComplete"
          component={SessionCompleteScreen}
          options={{ title: 'Complete', headerBackVisible: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
