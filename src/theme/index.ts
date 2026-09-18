import {MD3LightTheme, MD3DarkTheme} from 'react-native-paper';
import {colors, darkColors, gradients, darkGradients} from './colors';
import {typography} from './typography';
import {spacing, borderRadius} from './spacing';

// Valid MD3 theme for react-native-paper's PaperProvider.
export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.blue,
    secondary: colors.sky,
    tertiary: colors.navy,
    error: colors.error,
    background: colors.bg,
    surface: colors.white,
    surfaceVariant: colors.panel,
    onBackground: colors.ink,
    onSurface: colors.ink,
    onPrimary: colors.white,
    outline: colors.line,
  },
  roundness: 12,
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: darkColors.blue,
    secondary: darkColors.gold,
    tertiary: darkColors.navy,
    error: darkColors.error,
    background: darkColors.bg,
    surface: darkColors.panel,
    surfaceVariant: darkColors.panel2,
    onBackground: darkColors.ink,
    onSurface: darkColors.ink,
    onPrimary: darkColors.white,
    outline: darkColors.line,
  },
  roundness: 12,
};

export const getColors = (isDark: boolean) => ({
  colors: isDark ? darkColors : colors,
  gradients: isDark ? darkGradients : gradients,
});

export {colors, darkColors, gradients, darkGradients, typography, spacing, borderRadius};
