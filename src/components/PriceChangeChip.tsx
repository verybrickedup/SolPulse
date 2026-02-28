/**
 * PriceChangeChip — Compact percentage change indicator
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getChangeColor, formatPercent } from '../utils/format';
import { Colors, BorderRadius, FontSize, FontWeight, Spacing } from '../constants/theme';

interface PriceChangeChipProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
}

export function PriceChangeChip({ value, size = 'md' }: PriceChangeChipProps) {
  const color = getChangeColor(value);
  const bgColor = value > 0 ? '#22C55E20' : value < 0 ? '#EF444420' : '#9CA3AF20';
  const arrow = value > 0 ? '▲' : value < 0 ? '▼' : '—';

  const fontSize = size === 'sm' ? FontSize.xs : size === 'lg' ? FontSize.base : FontSize.sm;
  const padding = size === 'sm' ? 4 : size === 'lg' ? 10 : 6;

  return (
    <View style={[styles.chip, { backgroundColor: bgColor, paddingVertical: padding, paddingHorizontal: padding * 2 }]}>
      <Text style={[styles.text, { color, fontSize }]}>
        {arrow} {formatPercent(value)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: FontWeight.semibold,
  },
});

export default PriceChangeChip;
