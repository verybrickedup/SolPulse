/**
 * Add Whale Modal — Add a wallet to track
 */
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { useWhaleStore } from '../src/store/whaleStore';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '../src/constants/theme';

const POPULAR_WHALES = [
  { label: 'Justin Sun', address: '3DuMSmSHYdJRkwYmSFq5CjGAqbv1JKFNRmJdNbLsXJry' },
  { label: 'Alameda Research', address: '9we6kjtbcZ2ber5RnNmR22MSNGqNbWfbSwAHRcy5j4pc' },
  { label: 'Jump Trading', address: 'CYvXBPHpwNR9JGNKmiJqBP1yyYYNrAVPAKGhWJEAp2TK' },
];

export default function WhaleAddScreen() {
  const { addWhale } = useWhaleStore();
  const [label, setLabel] = useState('');
  const [address, setAddress] = useState('');

  const handleAdd = () => {
    if (!label.trim() || !address.trim()) return;
    if (address.length < 32 || address.length > 44) {
      Alert.alert('Invalid Address', 'Please enter a valid Solana address');
      return;
    }
    addWhale(address.trim(), label.trim());
    router.back();
  };

  const selectPopular = (whale: typeof POPULAR_WHALES[0]) => {
    setLabel(whale.label);
    setAddress(whale.address);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.closeBtn}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Track Wallet</Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>
          Add a wallet address to monitor. You'll get notified when it makes transactions.
        </Text>

        <Text style={styles.label}>Label</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Smart Money Whale"
          placeholderTextColor={Colors.dark.textTertiary}
          value={label}
          onChangeText={setLabel}
        />

        <Text style={styles.label}>Wallet Address</Text>
        <TextInput
          style={[styles.input, styles.addressInput]}
          placeholder="Paste Solana address..."
          placeholderTextColor={Colors.dark.textTertiary}
          value={address}
          onChangeText={setAddress}
          autoCapitalize="none"
          multiline
        />

        {/* Popular Whales */}
        <Text style={styles.sectionLabel}>🔥 Popular Wallets</Text>
        {POPULAR_WHALES.map((whale) => (
          <TouchableOpacity
            key={whale.address}
            style={styles.popularRow}
            onPress={() => selectPopular(whale)}
          >
            <View style={styles.popularAvatar}>
              <Text style={styles.popularAvatarText}>{whale.label.charAt(0)}</Text>
            </View>
            <View style={styles.popularInfo}>
              <Text style={styles.popularLabel}>{whale.label}</Text>
              <Text style={styles.popularAddress} numberOfLines={1}>
                {whale.address}
              </Text>
            </View>
            <Text style={styles.addIcon}>+</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[styles.trackBtn, (!label || !address) && styles.trackBtnDisabled]}
          onPress={handleAdd}
          disabled={!label || !address}
        >
          <Text style={styles.trackBtnText}>🐋 Start Tracking</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingTop: 56, paddingBottom: Spacing.md },
  closeBtn: { fontSize: 24, color: Colors.dark.textSecondary, padding: 4 },
  title: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.dark.text },
  content: { flex: 1, paddingHorizontal: Spacing.lg },
  subtitle: { fontSize: FontSize.sm, color: Colors.dark.textSecondary, lineHeight: 20, marginBottom: Spacing.xl },
  label: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.dark.textSecondary, marginTop: Spacing.lg, marginBottom: Spacing.sm },
  input: { backgroundColor: Colors.dark.inputBg, borderRadius: BorderRadius.md, padding: Spacing.lg, color: Colors.dark.text, fontSize: FontSize.base, borderWidth: 1, borderColor: Colors.dark.surfaceBorder },
  addressInput: { fontFamily: 'monospace', fontSize: FontSize.sm },
  sectionLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.dark.text, marginTop: Spacing.xxl, marginBottom: Spacing.md },
  popularRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.dark.surfaceBorder, gap: Spacing.md },
  popularAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.dark.surfaceLight, justifyContent: 'center', alignItems: 'center' },
  popularAvatarText: { fontSize: FontSize.base, fontWeight: FontWeight.bold, color: Colors.secondary },
  popularInfo: { flex: 1 },
  popularLabel: { fontSize: FontSize.base, fontWeight: FontWeight.medium, color: Colors.dark.text },
  popularAddress: { fontSize: FontSize.xs, color: Colors.dark.textTertiary, fontFamily: 'monospace', marginTop: 2 },
  addIcon: { fontSize: FontSize.xl, color: Colors.primary, fontWeight: FontWeight.bold },
  trackBtn: { backgroundColor: Colors.primary, paddingVertical: Spacing.lg, borderRadius: BorderRadius.md, alignItems: 'center', marginTop: Spacing.xxl },
  trackBtnDisabled: { opacity: 0.4 },
  trackBtnText: { color: '#FFF', fontSize: FontSize.lg, fontWeight: FontWeight.bold },
});
