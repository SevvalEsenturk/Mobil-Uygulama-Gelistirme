/**
 * KilitReactNative - Ebeveyn Kontrol Uygulaması
 * Flutter'dan React Native'e taşındı
 */

import React from 'react';
import {StatusBar, useColorScheme, Platform, View} from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  if (Platform.OS === 'web') {
    return (
      <View style={{flex: 1}}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <AppNavigator />
      </View>
    );
  }

  // Native platforms
  const {SafeAreaProvider} = require('react-native-safe-area-context');
  const {GestureHandlerRootView} = require('react-native-gesture-handler');

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <AppNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
