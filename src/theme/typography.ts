import {MD3LightTheme} from 'react-native-paper';

export const typography = {
  // Font Families
  fontFamily: {
    regular: 'Poppins',
    medium: 'Poppins-Medium',
    bold: 'Poppins-SemiBold',
  },

  // Font Sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },

  // Font Weights
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    bold: '600' as const,
  },

  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};
