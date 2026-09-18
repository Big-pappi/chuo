import React, {createContext, useContext, useState, ReactNode} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'light' | 'dark';
export type Accent = 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'pink';

interface ThemeContextType {
  theme: Theme;
  accent: Accent;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  setAccent: (accent: Accent) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@chuo_app_theme';
const ACCENT_STORAGE_KEY = '@chuo_app_accent';

export function ThemeProvider({children}: {children: ReactNode}) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [accent, setAccentState] = useState<Accent>('blue');

  const loadTheme = async () => {
    try {
      const [savedTheme, savedAccent] = await Promise.all([
        AsyncStorage.getItem(THEME_STORAGE_KEY),
        AsyncStorage.getItem(ACCENT_STORAGE_KEY),
      ]);
      if (savedTheme === 'light' || savedTheme === 'dark') setThemeState(savedTheme);
      if (savedAccent === 'blue' || savedAccent === 'green' || savedAccent === 'purple' || savedAccent === 'orange' || savedAccent === 'red' || savedAccent === 'pink') setAccentState(savedAccent);
    } catch (error) {
      // Ignore AsyncStorage errors in development
    }
  };

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    try { await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme); } catch (error) { console.error('Failed to save theme preference:', error); }
  };

  const setAccent = async (newAccent: Accent) => {
    setAccentState(newAccent);
    try { await AsyncStorage.setItem(ACCENT_STORAGE_KEY, newAccent); } catch (error) { console.error('Failed to save accent preference:', error); }
  };

  const isDark = theme === 'dark';

  React.useEffect(() => {
    loadTheme();
  }, []);

  return (
    <ThemeContext.Provider value={{theme, accent, isDark, setTheme, setAccent}}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
