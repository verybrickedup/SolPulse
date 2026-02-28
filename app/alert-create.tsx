/**
 * Create Alert Modal — Configure a new price/wallet/portfolio alert
 */
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAlertStore } from '../src/store/alertStore';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '../src/constants/theme';
import { AlertType, AlertOperator } from '../src/types/token';

const ALERT_TYPES: { type: AlertType; emoji: string; label: string; desc: string }[] = [
  { type: 'price', emoji: '💰', label: 'Price Alert', desc: 'When a token hits a price target' },
  { type: 'wallet', emoji: '👁️', label: 'Wallet Watch', desc: 'When a wallet has new activity' },
  { type: 'portfolio', emoji: '📊', label: 'Portfolio Alert', desc: 'When portfolio value changes by %' },
];

const OPERATORS: { op: AlertOperator; label: string }[] = [
  { op: 'above', label: 'Goes above' },
  { op: 'below', label: 'Drops below' },
  { op: 'change', label: 'Changes by %' },
];

export default function AlertCreateScreen() {
  const { addAlert } = useAlertStore();
  const [alertType, setAlertType] = useState<AlertType>('price');
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [operator, setOperator] = useState<AlertOperator>('above');
  const [value, setValue] = useState('');

  const handleCreate = () => {
    if (!name || !target || !value) return;

    addAlert({
      type: alertType,
      name,
      enabled: true,
      condition: {
        target,
        operator,
        value: parseFloat(value),
      },
    });

    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.closeBtn}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.title}>New Alert</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView style={styles.scroll}>
        {/* Alert Type Selection */}
        <Text style={styles.label}>Alert Type</Text>
        <View style={styles.typeGrid}>
          {ALERT_TYPES.map((item) => (
            <TouchableOpacity
              key={item.type}
              style={[styles.typeCard, alertType === item.type && styles.typeCardActive]}
              onPress={() => setAlertType(item.type)}
            >
              <Text style={styles.typeEmoji}>{item.emoji}</Text>
              <Text style={styles.typeLabel}>{item.label}</Text>
              <Text style={styles.typeDesc}>{item.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Alert Name */}
        <Text style={styles.label}>Alert Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. SOL hits $200"
          placeholderTextColor={Colors.dark.textTertiary}
          value={name}
          onChangeText={setName}
        />

        {/* Target */}
        <Text style={styles.label}>
          {alertType === 'price' ? 'Token (mint address or symbol)' : alertType === 'wallet' ? 'Wallet Address' : 'Portfolio'}
        </Text>
        <TextInput
          style={styles.input}
          placeholder={alertType === 'price' ? 'SOL or mint address' : alertType === 'wallet' ? 'Paste wallet address' : 'Your portfolio'}
          placeholderTextColor={Colors.dark.textTertiary}
          value={target}
          onChangeText={setTarget}
          autoCapitalize="none"
        />

        {/* Condition */}
        <Text style={styles.label}>Condition</Text>
        <View style={styles.opRow}>
          {OPERATORS.filter(o => alertType === 'portfolio' ? o.op === 'change' : true).map((item) => (
            <TouchableOpacity
              key={item.op}
              style={[styles.opBtn, operator === item.op && styles.opBtnActive]}
              onPress={() => setOperator(item.op)}
            >
              <Text style={[styles.opText, operator === item.op && styles.opTextActive]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Value */}
        <Text style={styles.label}>{operator === 'change' ? 'Change %' : 'Price ($)'}</Text>
        <TextInput
          style={styles.input}
          placeholder={operator === 'change' ? '5' : '200.00'}
          placeholderTextColor={Colors.dark.textTertiary}
          keyboardType="decimal-pad"
          value={value}
          onChangeText={setValue}
        />

        {/* Create Button */}
        <TouchableOpacity
          style={[styles.createBtn, (!name || !target || !value) && styles.createBtnDisabled]}
          onPress={handleCreate}
          disabled={!name || !target || !value}
        >
          <Text style={styles.createBtnText}>Create Alert 🔔</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingTop: 56, paddingBottom: Spacing.md },
  closeBtn: { fontSize: 24, color: Colors.dark.textSecondary, padding: 4 },
  title: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.dark.text },
  scroll: { flex: 1, paddingHorizontal: Spacing.lg },
  label: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.dark.textSecondary, marginTop: Spacing.xl, marginBottom: Spacing.sm },
  input: { backgroundColor: Colors.dark.inputBg, borderRadius: BorderRadius.md, padding: Spacing.lg, color: Colors.dark.text, fontSize: FontSize.base, borderWidth: 1, borderColor: Colors.dark.surfaceBorder },
  typeGrid: { gap: Spacing.md },
  typeCard: { backgroundColor: Colors.dark.surface, borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 2, borderColor: 'transparent' },
  typeCardActive: { borderColor: Colors.primary, backgroundColor: Colors.dark.surfaceLight },
  typeEmoji: { fontSize: 28 },
  typeLabel: { fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.dark.text, marginTop: Spacing.sm },
  typeDesc: { fontSize: FontSize.xs, color: Colors.dark.textSecondary, marginTop: 2 },
  opRow: { flexDirection: 'row', gap: Spacing.sm },
  opBtn: { flex: 1, paddingVertical: Spacing.md, backgroundColor: Colors.dark.surface, borderRadius: BorderRadius.md, alignItems: 'center', borderWidth: 1, borderColor: Colors.dark.surfaceBorder },
  opBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  opText: { fontSize: FontSize.sm, color: Colors.dark.textSecondary, fontWeight: FontWeight.medium },
  opTextActive: { color: '#FFF', fontWeight: FontWeight.semibold },
  createBtn: { backgroundColor: Colors.primary, paddingVertical: Spacing.lg, borderRadius: BorderRadius.md, alignItems: 'center', marginTop: Spacing.xxl },
  createBtnDisabled: { opacity: 0.4 },
  createBtnText: { color: '#FFF', fontSize: FontSize.lg, fontWeight: FontWeight.bold },
});
