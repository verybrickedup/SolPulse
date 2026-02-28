/**
 * Alerts Screen — Manage price alerts, wallet watchers, and notification history
 */
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAlertStore } from '../../src/store/alertStore';
import { formatTimeAgo } from '../../src/utils/format';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '../../src/constants/theme';
import { Alert as AlertType } from '../../src/types/token';

type ViewMode = 'active' | 'history';

const ALERT_EMOJI: Record<string, string> = {
  price: '💰',
  wallet: '👁️',
  portfolio: '📊',
  defi: '🏦',
  whale: '🐋',
};

export default function AlertsScreen() {
  const [viewMode, setViewMode] = useState<ViewMode>('active');
  const { alerts, history, toggleAlert, deleteAlert } = useAlertStore();

  const activeAlerts = alerts.filter((a) => a.enabled);
  const inactiveAlerts = alerts.filter((a) => !a.enabled);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Alerts</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/alert-create')}>
          <Text style={styles.addBtnText}>+ New Alert</Text>
        </TouchableOpacity>
      </View>

      {/* View Mode Toggle */}
      <View style={styles.toggle}>
        <TouchableOpacity style={[styles.toggleBtn, viewMode === 'active' && styles.toggleActive]} onPress={() => setViewMode('active')}>
          <Text style={[styles.toggleText, viewMode === 'active' && styles.toggleTextActive]}>Active ({activeAlerts.length})</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.toggleBtn, viewMode === 'history' && styles.toggleActive]} onPress={() => setViewMode('history')}>
          <Text style={[styles.toggleText, viewMode === 'history' && styles.toggleTextActive]}>History</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.list}>
        {viewMode === 'active' ? (
          <>
            {alerts.length === 0 ? (
              <View style={styles.empty}>
                <Text style={{ fontSize: 48 }}>🔔</Text>
                <Text style={styles.emptyTitle}>No alerts yet</Text>
                <Text style={styles.emptySubtitle}>Create alerts to get notified about price changes, wallet activity, and more</Text>
                <TouchableOpacity style={styles.emptyBtn} onPress={() => router.push('/alert-create')}>
                  <Text style={styles.emptyBtnText}>Create Your First Alert</Text>
                </TouchableOpacity>
              </View>
            ) : (
              alerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} onToggle={() => toggleAlert(alert.id)} onDelete={() => deleteAlert(alert.id)} />
              ))
            )}
          </>
        ) : (
          <>
            {history.length === 0 ? (
              <View style={styles.empty}>
                <Text style={{ fontSize: 48 }}>📭</Text>
                <Text style={styles.emptyTitle}>No alert history</Text>
                <Text style={styles.emptySubtitle}>Triggered alerts will appear here</Text>
              </View>
            ) : (
              history.map((entry, i) => (
                <View key={i} style={styles.historyRow}>
                  <View style={styles.historyDot} />
                  <View style={styles.historyContent}>
                    <Text style={styles.historyName}>{entry.alertName}</Text>
                    <Text style={styles.historyMsg}>{entry.message}</Text>
                    <Text style={styles.historyTime}>{formatTimeAgo(entry.triggeredAt)}</Text>
                  </View>
                </View>
              ))
            )}
          </>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

function AlertCard({ alert, onToggle, onDelete }: { alert: AlertType; onToggle: () => void; onDelete: () => void }) {
  const emoji = ALERT_EMOJI[alert.type] || '🔔';
  const operatorLabel = alert.condition.operator === 'above' ? '≥' : alert.condition.operator === 'below' ? '≤' : '±';

  return (
    <View style={[styles.alertCard, !alert.enabled && styles.alertCardDisabled]}>
      <View style={styles.alertTop}>
        <View style={styles.alertInfo}>
          <Text style={styles.alertEmoji}>{emoji}</Text>
          <View>
            <Text style={styles.alertName}>{alert.name}</Text>
            <Text style={styles.alertCondition}>
              {operatorLabel} ${alert.condition.value.toLocaleString()}
            </Text>
          </View>
        </View>
        <Switch value={alert.enabled} onValueChange={onToggle} trackColor={{ false: Colors.dark.surfaceLight, true: Colors.primaryLight }} thumbColor={alert.enabled ? Colors.primary : Colors.dark.textTertiary} />
      </View>
      <View style={styles.alertBottom}>
        <Text style={styles.alertType}>{alert.type}</Text>
        {alert.lastTriggered && <Text style={styles.alertLast}>Last: {formatTimeAgo(alert.lastTriggered)}</Text>}
        <TouchableOpacity onPress={onDelete}><Text style={styles.deleteText}>Delete</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingTop: 60, paddingBottom: Spacing.md },
  title: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.dark.text },
  addBtn: { backgroundColor: Colors.primary, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: BorderRadius.full },
  addBtnText: { color: '#FFF', fontWeight: FontWeight.semibold, fontSize: FontSize.sm },
  toggle: { flexDirection: 'row', marginHorizontal: Spacing.lg, backgroundColor: Colors.dark.surface, borderRadius: BorderRadius.md, padding: 4 },
  toggleBtn: { flex: 1, paddingVertical: Spacing.sm, alignItems: 'center', borderRadius: BorderRadius.sm },
  toggleActive: { backgroundColor: Colors.dark.surfaceLight },
  toggleText: { fontSize: FontSize.sm, color: Colors.dark.textTertiary, fontWeight: FontWeight.medium },
  toggleTextActive: { color: Colors.primary, fontWeight: FontWeight.semibold },
  list: { flex: 1, marginTop: Spacing.md },
  alertCard: { marginHorizontal: Spacing.lg, marginBottom: Spacing.md, padding: Spacing.lg, backgroundColor: Colors.dark.surface, borderRadius: BorderRadius.lg, borderLeftWidth: 3, borderLeftColor: Colors.primary },
  alertCardDisabled: { opacity: 0.5, borderLeftColor: Colors.dark.textTertiary },
  alertTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  alertInfo: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  alertEmoji: { fontSize: 28 },
  alertName: { fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.dark.text },
  alertCondition: { fontSize: FontSize.sm, color: Colors.dark.textSecondary, marginTop: 2 },
  alertBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Spacing.md, paddingTop: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.dark.surfaceBorder },
  alertType: { fontSize: FontSize.xs, color: Colors.dark.textTertiary, textTransform: 'capitalize', backgroundColor: Colors.dark.surfaceLight, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  alertLast: { fontSize: FontSize.xs, color: Colors.dark.textTertiary },
  deleteText: { fontSize: FontSize.xs, color: Colors.error, fontWeight: FontWeight.medium },
  empty: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, paddingHorizontal: Spacing.xl },
  emptyTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.semibold, color: Colors.dark.text, marginTop: Spacing.md },
  emptySubtitle: { fontSize: FontSize.sm, color: Colors.dark.textTertiary, textAlign: 'center', marginTop: Spacing.sm },
  emptyBtn: { backgroundColor: Colors.primary, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderRadius: BorderRadius.full, marginTop: Spacing.xl },
  emptyBtnText: { color: '#FFF', fontWeight: FontWeight.semibold },
  historyRow: { flexDirection: 'row', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, gap: Spacing.md },
  historyDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary, marginTop: 6 },
  historyContent: { flex: 1 },
  historyName: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.dark.text },
  historyMsg: { fontSize: FontSize.sm, color: Colors.dark.textSecondary, marginTop: 2 },
  historyTime: { fontSize: FontSize.xs, color: Colors.dark.textTertiary, marginTop: 4 },
});
