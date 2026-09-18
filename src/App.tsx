import React from 'react';
import {View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StatusBar} from 'expo-status-bar';
import {Provider} from 'react-redux';
import {PaperProvider} from 'react-native-paper';
import RootNavigator from '@/navigation/RootNavigator';
import {store} from '@/store/store';
import {theme, darkTheme} from '@/theme';
import {ThemeProvider, useTheme} from '@/context/ThemeContext';
import {colors, darkColors} from '@/theme';

function AppContent(): React.JSX.Element {
  const {isDark} = useTheme();
  const currentTheme = isDark ? darkTheme : theme;
  const statusBarColor = isDark ? darkColors.bg : colors.bg;

  return (
    <PaperProvider theme={currentTheme}>
      <SafeAreaProvider>
        <View style={{flex: 1, backgroundColor: statusBarColor}}>
          <StatusBar style={isDark ? 'light' : 'dark'} />
          <RootNavigator />
        </View>
      </SafeAreaProvider>
    </PaperProvider>
  );
}

export default function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Provider store={store}>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
