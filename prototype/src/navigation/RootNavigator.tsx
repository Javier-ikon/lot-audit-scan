import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import { LoginScreen } from '../screens/LoginScreen';
import { DealerGroupSelectionScreen } from '../screens/DealerGroupSelectionScreen';
import { RooftopSelectionScreen } from '../screens/RooftopSelectionScreen';
import { ScanningScreen } from '../screens/ScanningScreen';
import { ScanResultScreen } from '../screens/ScanResultScreen';
import { EndAuditConfirmScreen } from '../screens/EndAuditConfirmScreen';
import { SessionCompleteScreen } from '../screens/SessionCompleteScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: true }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
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
