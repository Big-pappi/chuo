// CHUO Brand Colors
export const colors = {
  // Primary Colors
  navy: '#06245E',
  blue: '#0B4FD8',
  blueDark: '#08379B',
  sky: '#3A82F6',

  // Accent Colors (used for icons / tinted tiles)
  green: '#10B981',
  greenDark: '#059669',
  orange: '#F59E0B',
  gold: '#F4C542',
  orangeDark: '#D97706',
  purple: '#7C3AED',
  red: '#EF4444',
  pink: '#EC4899',

  // Soft tint backgrounds
  blueSoft: '#EAF2FF',
  greenSoft: '#ECFDF5',
  orangeSoft: '#FFF7ED',
  purpleSoft: '#F5F3FF',
  redSoft: '#FEF2F2',
  pinkSoft: '#FDF2F8',

  // Neutral Colors
  ink: '#0F172A',
  slate: '#475569',
  muted: '#94A3B8',
  line: '#E2E8F0',
  panel: '#F1F4F9',
  panel2: '#EEF4FF',
  bg: '#F4F7FC',

  // Status Colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Base Colors
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

// Dark Mode Colors
export const darkColors = {
  // Primary Colors
  navy: '#1E3A8A',
  blue: '#3B82F6',
  blueDark: '#1E40AF',
  sky: '#60A5FA',

  // Accent Colors
  green: '#34D399',
  greenDark: '#10B981',
  orange: '#FBBF24',
  gold: '#FBBF24',
  orangeDark: '#F59E0B',
  purple: '#A78BFA',
  red: '#F87171',
  pink: '#F472B6',

  // Soft tint backgrounds (darker for dark mode)
  blueSoft: '#1E3A8A',
  greenSoft: '#064E3B',
  orangeSoft: '#78350F',
  purpleSoft: '#5B21B6',
  redSoft: '#7F1D1D',
  pinkSoft: '#831843',

  // Neutral Colors
  ink: '#F1F5F9',
  slate: '#CBD5E1',
  muted: '#94A3B8',
  line: '#334155',
  panel: '#1E293B',
  panel2: '#0F172A',
  bg: '#0F172A',

  // Status Colors
  success: '#34D399',
  warning: '#FBBF24',
  error: '#F87171',
  info: '#60A5FA',

  // Base Colors
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

// Gradients for hero cards / headers
export const gradients = {
  hero: ['#06245E', '#0B4FD8', '#3A82F6'] as const,
  heroDeep: ['#06245E', '#0B4FD8'] as const,
  purple: ['#08379B', '#3A82F6'] as const,
  card: ['#0B4FD8', '#3A82F6'] as const,
};

export const darkGradients = {
  hero: ['#1E3A8A', '#3B82F6', '#60A5FA'] as const,
  heroDeep: ['#1E3A8A', '#3B82F6'] as const,
  purple: ['#3B82F6', '#60A5FA'] as const,
  card: ['#3B82F6', '#60A5FA'] as const,
};

export type Colors = typeof colors;
