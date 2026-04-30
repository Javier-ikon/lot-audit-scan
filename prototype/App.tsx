import React from 'react';
import { View, StyleSheet } from 'react-native';

import { MockupNavigator } from './mockup/MockupNavigator';
import { RootNavigator } from './src/navigation/RootNavigator';
import { AppProvider } from './src/context/AppContext';
import { ViewModeToggle, useViewMode } from './src/devtools/ViewModeToggle';

export default function App() {
  const [mode, setMode] = useViewMode();

  return (
    <View style={styles.root}>
      {mode === 'mockup' ? (
        <MockupNavigator />
      ) : (
        <AppProvider>
          <RootNavigator />
        </AppProvider>
      )}
      <ViewModeToggle mode={mode} onToggle={setMode} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
