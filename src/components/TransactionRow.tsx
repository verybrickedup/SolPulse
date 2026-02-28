/**
 * TransactionRow — Display a parsed transaction in a feed
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { ParsedTransaction } from '../types/token';
import { formatTimeAgo, formatUSD, truncateAddress } from '../utils/format';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '../constants/theme';

const TX_ICONS: Record<string, string> = {
  SWAP: '🔄',
  TRANSFER: '📤',
  STAKE: '⚡',
  UNSTAKE: '🔓',
  NFT_SALE: '🖼️',
  NFT_MINT: '🎨',
  TOKEN_MINT: '🪙',
  BURN: '🔥',
  UNKNOWN: '📋',
};

const TX_COLORS: Record<string, string> = {
  SWAP: '#3B82F6',
  TRANSFER: '#F59E0B',
  STAKE: '#22C55E',
  UNSTAKE: '#EC4899',
  NFT_SALE: '#8B5CF6',
  BURN: '#EF4444',
};

interface TransactionRowProps {
  transaction: ParsedTransaction;
}

export function TransactionRow({ transaction }: TransactionRowProps) {
  const icon = TX_ICONS[transaction.type] || TX_ICONS.UNKNOWN;
  const accentColor = TX_COLORS[transaction.type] || Colors.dark.textSecondary;

  const openExplorer = () => {
    Linking.openURL(`https://solscan.io/tx/${transaction.signature}`);
  };

  // Calculate net value from transfers
  const netValue = transaction.tokenTransfers.reduce((sum, t) => {
    return sum + (t.tokenAmount || 0);
  }, 0);

  return (
    <TouchableOpacity style={styles.container} onPress={openExplorer} activeOpacity={0.7}>
      <View style={[styles.iconContainer, { backgroundColor: accentColor + '20' }]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={[styles.type, { color: accentColor }]}>{transaction.type}</Text>
          <Text style={styles.time}>{formatTimeAgo(transaction.timestamp * 1000)}</Text>
        </View>

        <Text style={styles.description} numberOfLines={1}>
          {transaction.description || `${transaction.type} via ${transaction.source}`}
        </Text>

        {transaction.tokenTransfers.length > 0 && (
          <View style={styles.transfers}>
            {transaction.tokenTransfers.slice(0, 2).map((t, i) => (
              <Text key={i} style={styles.transferText} numberOfLines={1}>
                {t.tokenAmount > 0 ? '+' : ''}{t.tokenAmount.toFixed(4)} → {truncateAddress(t.toUserAccount || '', 4, 4)}
              </Text>
            ))}
          </View>
        )}
      </View>

      <Text style={styles.explorer}>↗</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.surfaceBorder,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: { fontSize: 20 },
  content: { flex: 1 },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  type: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    textTransform: 'uppercase',
  },
  time: {
    fontSize: FontSize.xs,
    color: Colors.dark.textTertiary,
  },
  description: {
    fontSize: FontSize.sm,
    color: Colors.dark.textSecondary,
    marginTop: 2,
  },
  transfers: { marginTop: 4 },
  transferText: {
    fontSize: FontSize.xs,
    color: Colors.dark.textTertiary,
    fontFamily: 'monospace',
  },
  explorer: {
    fontSize: FontSize.lg,
    color: Colors.dark.textTertiary,
  },
});

export default TransactionRow;
