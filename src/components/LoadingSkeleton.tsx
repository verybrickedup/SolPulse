/**
 * Loading Skeleton — Shimmer effect placeholder for loading states
 */
import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';
import { Colors, BorderRadius } from '../constants/theme';

interface SkeletonProps {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({ width, height, borderRadius = BorderRadius.sm, style }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <Animated.View
      style={[{ width: width as any, height, borderRadius, backgroundColor: Colors.dark.surfaceLight, opacity }, style]}
    />
  );
}

export function TokenRowSkeleton() {
  return (
    <View style={skStyles.row}>
      <View style={skStyles.left}>
        <Skeleton width={44} height={44} borderRadius={22} />
        <View style={skStyles.textCol}>
          <Skeleton width={60} height={14} />
          <Skeleton width={90} height={12} style={{ marginTop: 6 }} />
        </View>
      </View>
      <View style={skStyles.right}>
        <Skeleton width={70} height={14} />
        <Skeleton width={50} height={12} style={{ marginTop: 6 }} />
      </View>
    </View>
  );
}

export function DashboardSkeleton() {
  return (
    <View style={skStyles.dashboard}>
      <Skeleton width="100%" height={200} borderRadius={BorderRadius.lg} />
      <View style={{ marginTop: 16 }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <TokenRowSkeleton key={i} />
        ))}
      </View>
    </View>
  );
}

const skStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  textCol: { gap: 2 },
  right: { alignItems: 'flex-end' },
  dashboard: { paddingHorizontal: 16, paddingTop: 20 },
});

export default Skeleton;
