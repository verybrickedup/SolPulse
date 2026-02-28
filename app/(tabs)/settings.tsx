/**
 * Settings Screen — API keys, wallet, preferences
 */
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Linking, Alert } from 'react-native';
import { useWallet } from '../../src/hooks/useWallet';
import { truncateAddress } from '../../src/utils/format';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '../../src/constants/theme';

interface SettingRow {
  icon: string;
  title: string;
  subtitle?: string;
  action?: () => void;
  value?: string;
  destructive?: boolean;
}

export default function SettingsScreen() {
  const wallet = useWallet();
  const [heliusKey, setHeliusKey] = useState('');
  const [birdeyeKey, setBirdeyeKey] = useState('');
  const [showKeys, setShowKeys] = useState(false);

  const walletSection: SettingRow[] = [
    {
      icon: wallet.isConnected ? '🟢' : '🔴',
      title: wallet.isConnected ? 'Wallet Connected' : 'Connect Wallet',
      subtitle: wallet.address ? truncateAddress(wallet.address, 8, 8) : 'Tap to connect your Seeker wallet',
      action: wallet.isConnected ? wallet.disconnect : wallet.connect,
    },
  ];

  const linkSection: SettingRow[] = [
    { icon: '🌐', title: 'Helius Dashboard', subtitle: 'Manage your Helius API', action: () => Linking.openURL('https://dashboard.helius.dev') },
    { icon: '🦅', title: 'Birdeye', subtitle: 'Token analytics', action: () => Linking.openURL('https://birdeye.so') },
    { icon: '🪐', title: 'Jupiter', subtitle: 'DEX aggregator', action: () => Linking.openURL('https://jup.ag') },
  ];

  const aboutSection: SettingRow[] = [
    { icon: '📱', title: 'Version', subtitle: '1.0.0 (Build 1)' },
    { icon: '📄', title: 'Open Source Licenses', action: () => {} },
    { icon: '🐛', title: 'Report a Bug', action: () => Linking.openURL('https://github.com/solpulse/issues') },
  ];

  const dangerSection: SettingRow[] = [
    { icon: '🗑️', title: 'Clear Alert History', subtitle: 'Remove all triggered alert logs', action: () => Alert.alert('Clear History', 'Are you sure?', [{ text: 'Cancel' }, { text: 'Clear', style: 'destructive' }]), destructive: true },
    { icon: '🔌', title: 'Disconnect Wallet', subtitle: 'Remove wallet connection', action: wallet.disconnect, destructive: true },
  ];

  const renderSection = (title: string, rows: SettingRow[]) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {rows.map((row, i) => (
        <TouchableOpacity key={i} style={styles.row} onPress={row.action} disabled={!row.action} activeOpacity={row.action ? 0.7 : 1}>
          <Text style={styles.rowIcon}>{row.icon}</Text>
          <View style={styles.rowContent}>
            <Text style={[styles.rowTitle, row.destructive && { color: Colors.error }]}>{row.title}</Text>
            {row.subtitle && <Text style={styles.rowSubtitle}>{row.subtitle}</Text>}
          </View>
          {row.action && <Text style={styles.rowChevron}>›</Text>}
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.scroll}>
        {renderSection('Wallet', walletSection)}

        {/* API Keys Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>API Keys</Text>
            <TouchableOpacity onPress={() => setShowKeys(!showKeys)}>
              <Text style={styles.toggleShow}>{showKeys ? 'Hide' : 'Show'}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Helius API Key</Text>
            <TextInput style={styles.input} placeholder="Enter your Helius key" placeholderTextColor={Colors.dark.textTertiary} value={heliusKey} onChangeText={setHeliusKey} secureTextEntry={!showKeys} autoCapitalize="none" />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Birdeye API Key</Text>
            <TextInput style={styles.input} placeholder="Enter your Birdeye key" placeholderTextColor={Colors.dark.textTertiary} value={birdeyeKey} onChangeText={setBirdeyeKey} secureTextEntry={!showKeys} autoCapitalize="none" />
          </View>
          <TouchableOpacity style={styles.saveBtn}>
            <Text style={styles.saveBtnText}>Save Keys</Text>
          </TouchableOpacity>
        </View>

        {renderSection('Resources', linkSection)}
        {renderSection('About', aboutSection)}
        {renderSection('Danger Zone', dangerSection)}

        <Text style={styles.footer}>Built with 💜 for Solana Seeker</Text>
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.background },
  header: { paddingHorizontal: Spacing.lg, paddingTop: 60, paddingBottom: Spacing.md },
  title: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.dark.text },
  scroll: { flex: 1 },
  section: { marginTop: Spacing.xl, paddingHorizontal: Spacing.lg },
  sectionTitle: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.dark.textTertiary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: Spacing.sm },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  toggleShow: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: FontWeight.medium },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.dark.surfaceBorder, gap: Spacing.md },
  rowIcon: { fontSize: 20 },
  rowContent: { flex: 1 },
  rowTitle: { fontSize: FontSize.base, color: Colors.dark.text, fontWeight: FontWeight.medium },
  rowSubtitle: { fontSize: FontSize.xs, color: Colors.dark.textSecondary, marginTop: 2 },
  rowChevron: { fontSize: FontSize.xl, color: Colors.dark.textTertiary },
  inputGroup: { marginBottom: Spacing.md },
  inputLabel: { fontSize: FontSize.xs, color: Colors.dark.textSecondary, fontWeight: FontWeight.medium, marginBottom: 4 },
  input: { backgroundColor: Colors.dark.inputBg, borderRadius: BorderRadius.sm, padding: Spacing.md, color: Colors.dark.text, fontSize: FontSize.sm, borderWidth: 1, borderColor: Colors.dark.surfaceBorder },
  saveBtn: { backgroundColor: Colors.primary, paddingVertical: Spacing.md, borderRadius: BorderRadius.md, alignItems: 'center', marginTop: Spacing.sm },
  saveBtnText: { color: '#FFF', fontWeight: FontWeight.semibold },
  footer: { textAlign: 'center', fontSize: FontSize.xs, color: Colors.dark.textTertiary, marginTop: Spacing.xxl, marginBottom: Spacing.lg },
});
