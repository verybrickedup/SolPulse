/**
 * Tab Layout — Bottom tab navigation
 * Dashboard | Portfolio | Alerts | Whales | Settings
 */

import React from 'react';
import { Tabs } from 'expo-router';
import { Text, View, StyleSheet } from 'react-native';
import { Colors, FontSize, FontWeight } from '../../src/constants/theme';
import { useAlertStore } from '../../src/store/alertStore';

interface TabIconProps {
  emoji: string;
  label: string;
  focused: boolean;
  badge?: number;
}

function TabIcon({ emoji, label, focused, badge }: TabIconProps) {
  return (
    <View style={styles.tabIcon}>
      <Text style={[styles.emoji, focused && styles.emojiFocused]}>{emoji}</Text>
      {badge && badge > 0 ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge > 9 ? '9+' : badge}</Text>
        </View>
      ) : null}
      <Text style={[styles.label, focused && styles.labelFocused]}>{label}</Text>
    </View>
  );
}

export default function TabLayout() {
  const activeAlertCount = useAlertStore((s) => s.getActiveAlerts().length);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.dark.textTertiary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="📊" label="Dashboard" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="portfolio"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="💼" label="Portfolio" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🔔" label="Alerts" focused={focused} badge={activeAlertCount} />
          ),
        }}
      />
      <Tabs.Screen
        name="whales"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🐋" label="Whales" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="⚙️" label="Settings" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.dark.surface,
    borderTopColor: Colors.dark.surfaceBorder,
    borderTopWidth: 1,
    height: 80,
    paddingTop: 8,
    paddingBottom: 20,
    elevation: 0,
  },
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  emoji: {
    fontSize: 22,
    opacity: 0.5,
  },
  emojiFocused: {
    opacity: 1,
  },
  label: {
    fontSize: FontSize.xs,
    color: Colors.dark.textTertiary,
    marginTop: 2,
    fontWeight: FontWeight.medium,
  },
  labelFocused: {
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: Colors.error,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    color: '#FFF',
    fontWeight: FontWeight.bold,
  },
});
