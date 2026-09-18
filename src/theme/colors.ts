// CHUO Brand Colors
export const colors = {
  // Primary Colors
  navy: '#142B63',
  blue: '#1E3A8A',
  blueDark: '#173475',
  sky: '#2563EB',

  // Accent Colors (used for icons / tinted tiles)
  green: '#10B981',
  greenDark: '#059669',
  orange: '#F59E0B',
  gold: '#F4C542',
  orangeDark: '#D97706',
  purple: '#7C3AED',
  red: '#EF4444',
  pink: '#EC4899',
  slate: '#64748B',

  // Soft tint backgrounds
  blueSoft: '#EEF4FF',
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
  bg: '#F7F9FD',

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
  slate: '#94A3B8',

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
  hero: ['#142B63', '#1E3A8A', '#2563EB'] as const,
  heroDeep: ['#142B63', '#1E3A8A'] as const,
  purple: ['#1E3A8A', '#2563EB'] as const,
  card: ['#1E3A8A', '#2563EB'] as const,
};

export const darkGradients = {
  hero: ['#1E3A8A', '#3B82F6', '#60A5FA'] as const,
  heroDeep: ['#1E3A8A', '#3B82F6'] as const,
  purple: ['#3B82F6', '#60A5FA'] as const,
  card: ['#3B82F6', '#60A5FA'] as const,
};

export type Colors = typeof colors;
