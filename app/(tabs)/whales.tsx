/**
 * Whales Screen — Track whale wallets and their activity
 */
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { truncateAddress, formatTimeAgo } from '../../src/utils/format';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '../../src/constants/theme';
import { useWhaleStore } from '../../src/store/whaleStore';

export default function WhalesScreen() {
  const { whales, removeWhale } = useWhaleStore();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Whale Tracker</Text>
          <Text style={styles.subtitle}>Monitor wallets for activity</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/whale-add')}>
          <Text style={styles.addBtnText}>+ Track</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.list}>
        {whales.length === 0 ? (
          <View style={styles.empty}>
            <Text style={{ fontSize: 56 }}>🐋</Text>
            <Text style={styles.emptyTitle}>No wallets tracked</Text>
            <Text style={styles.emptySubtitle}>
              Add whale wallets to get notified when they make moves
            </Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={() => router.push('/whale-add')}>
              <Text style={styles.emptyBtnText}>Add Your First Whale</Text>
            </TouchableOpacity>
          </View>
        ) : (
          whales.map((whale) => (
            <View key={whale.address} style={styles.whaleCard}>
              <View style={styles.whaleTop}>
                <View style={styles.whaleAvatar}>
                  <Text style={styles.whaleAvatarText}>
                    {whale.label.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.whaleInfo}>
                  <Text style={styles.whaleLabel}>{whale.label}</Text>
                  <Text style={styles.whaleAddress}>
                    {truncateAddress(whale.address, 6, 6)}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => removeWhale(whale.address)}>
                  <Text style={styles.removeText}>✕</Text>
                </TouchableOpacity>
              </View>

              {whale.lastActivity ? (
                <View style={styles.activityRow}>
                  <View style={styles.activityDot} />
                  <View style={styles.activityContent}>
                    <Text style={styles.activityType}>{whale.lastActivity.type}</Text>
                    <Text style={styles.activitySummary}>{whale.lastActivity.summary}</Text>
                    <Text style={styles.activityTime}>
                      {formatTimeAgo(whale.lastActivity.timestamp * 1000)}
                    </Text>
                  </View>
                </View>
              ) : (
                <Text style={styles.noActivity}>No recent activity detected</Text>
              )}
            </View>
          ))
        )}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: Spacing.lg, paddingTop: 60, paddingBottom: Spacing.md },
  title: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.dark.text },
  subtitle: { fontSize: FontSize.sm, color: Colors.dark.textSecondary, marginTop: 2 },
  addBtn: { backgroundColor: Colors.primary, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: BorderRadius.full },
  addBtnText: { color: '#FFF', fontWeight: FontWeight.semibold, fontSize: FontSize.sm },
  list: { flex: 1, marginTop: Spacing.md },
  whaleCard: { marginHorizontal: Spacing.lg, marginBottom: Spacing.md, padding: Spacing.lg, backgroundColor: Colors.dark.surface, borderRadius: BorderRadius.lg },
  whaleTop: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  whaleAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#1a3a5c', justifyContent: 'center', alignItems: 'center' },
  whaleAvatarText: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: '#14F195' },
  whaleInfo: { flex: 1 },
  whaleLabel: { fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.dark.text },
  whaleAddress: { fontSize: FontSize.xs, color: Colors.dark.textTertiary, fontFamily: 'monospace', marginTop: 2 },
  removeText: { fontSize: FontSize.lg, color: Colors.dark.textTertiary, padding: 8 },
  activityRow: { flexDirection: 'row', marginTop: Spacing.md, paddingTop: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.dark.surfaceBorder, gap: Spacing.sm },
  activityDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.secondary, marginTop: 4 },
  activityContent: { flex: 1 },
  activityType: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.secondary, textTransform: 'uppercase' },
  activitySummary: { fontSize: FontSize.sm, color: Colors.dark.textSecondary, marginTop: 2 },
  activityTime: { fontSize: FontSize.xs, color: Colors.dark.textTertiary, marginTop: 4 },
  noActivity: { fontSize: FontSize.sm, color: Colors.dark.textTertiary, marginTop: Spacing.md, fontStyle: 'italic' },
  empty: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, paddingHorizontal: Spacing.xl },
  emptyTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.semibold, color: Colors.dark.text, marginTop: Spacing.md },
  emptySubtitle: { fontSize: FontSize.sm, color: Colors.dark.textTertiary, textAlign: 'center', marginTop: Spacing.sm },
  emptyBtn: { backgroundColor: Colors.primary, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderRadius: BorderRadius.full, marginTop: Spacing.xl },
  emptyBtnText: { color: '#FFF', fontWeight: FontWeight.semibold },
});
