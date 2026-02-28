/**
 * SolPulse Theme Constants
 * Colors, spacing, typography, and design tokens
 * Inspired by Solana's brand + modern fintech aesthetics
 */

export const Colors = {
  // Brand
  primary: '#9945FF',        // Solana purple
  primaryLight: '#B77FFF',
  primaryDark: '#7B2FCC',
  secondary: '#14F195',      // Solana green
  secondaryDark: '#0BC675',

  // Semantic
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Price changes
  gain: '#22C55E',
  loss: '#EF4444',
  neutral: '#9CA3AF',

  // Dark theme (default)
  dark: {
    background: '#0A0A0F',
    surface: '#141420',
    surfaceLight: '#1E1E30',
    surfaceBorder: '#2A2A3E',
    text: '#FFFFFF',
    textSecondary: '#9CA3AF',
    textTertiary: '#6B7280',
    inputBg: '#1A1A2E',
  },

  // Light theme
  light: {
    background: '#FFFFFF',
    surface: '#F8F8FC',
    surfaceLight: '#EFEFFA',
    surfaceBorder: '#E5E5F0',
    text: '#111827',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    inputBg: '#F3F4F6',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const FontSize = {
  xs: 11,
  sm: 13,
  base: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  display: 40,
};

export const FontWeight = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  glow: {
    shadowColor: '#9945FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
};

// Chart colors for multi-token views
export const ChartColors = [
  '#9945FF', // Solana purple
  '#14F195', // Solana green
  '#3B82F6', // Blue
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#8B5CF6', // Violet
];

export default {
  Colors,
  Spacing,
  BorderRadius,
  FontSize,
  FontWeight,
  Shadow,
  ChartColors,
};
