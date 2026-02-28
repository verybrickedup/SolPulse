/**
 * Portfolio Screen — Full holdings breakdown with DeFi positions
 */
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { usePortfolio } from '../../src/hooks/usePortfolio';
import { formatUSD, formatPercent, formatBalance, getChangeColor } from '../../src/utils/format';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '../../src/constants/theme';

type TabType = 'tokens' | 'defi' | 'nfts';

export default function PortfolioScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('tokens');
  const { summary, isRefreshing, refresh } = usePortfolio();

  return (
    <View style={styles.container}>
      {/* Header with total value */}
      <View style={styles.header}>
        <Text style={styles.title}>Portfolio</Text>
        <Text style={styles.totalValue}>{formatUSD(summary.totalValue)}</Text>
        <Text style={[styles.totalChange, { color: getChangeColor(summary.totalChangePercent24h) }]}>
          {formatPercent(summary.totalChangePercent24h)} today
        </Text>
      </View>

      {/* Allocation Bar — visual breakdown of holdings */}
      <View style={styles.allocationBar}>
        {summary.holdings.slice(0, 5).map((token, i) => {
          const pct = summary.totalValue > 0 ? (token.usdValue / summary.totalValue) * 100 : 0;
          const colors = ['#9945FF', '#14F195', '#3B82F6', '#F59E0B', '#EC4899'];
          return (
            <View key={token.mint} style={[styles.allocSegment, { flex: Math.max(pct, 1), backgroundColor: colors[i % colors.length] }]} />
          );
        })}
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabs}>
        {(['tokens', 'defi', 'nfts'] as TabType[]).map((tab) => (
          <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.tabActive]} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === 'tokens' ? 'Tokens' : tab === 'defi' ? 'DeFi' : 'NFTs'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.list} refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refresh} tintColor={Colors.primary} />}>
        {/* Token List */}
        {activeTab === 'tokens' && summary.holdings.map((token) => (
          <TouchableOpacity key={token.mint} style={styles.tokenRow} onPress={() => router.push(`/token/${token.mint}`)}>
            <View style={styles.tokenLeft}>
              <View style={styles.tokenIcon}><Text style={styles.tokenIconChar}>{token.symbol.charAt(0)}</Text></View>
              <View>
                <Text style={styles.tokenSymbol}>{token.symbol}</Text>
                <Text style={styles.tokenName}>{token.name}</Text>
              </View>
            </View>
            <View style={styles.tokenRight}>
              <Text style={styles.tokenValue}>{formatUSD(token.usdValue)}</Text>
              <Text style={styles.tokenBal}>{formatBalance(token.balance)} {token.symbol}</Text>
              <Text style={[styles.tokenChg, { color: getChangeColor(token.priceChange24h) }]}>{formatPercent(token.priceChange24h)}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* DeFi Positions */}
        {activeTab === 'defi' && summary.defiPositions.map((pos) => (
          <View key={pos.id} style={styles.defiCard}>
            <View style={styles.defiHeader}>
              <Text style={styles.defiProtocol}>{pos.protocol.toUpperCase()}</Text>
              <Text style={styles.defiType}>{pos.type}</Text>
            </View>
            <Text style={styles.defiLabel}>{pos.label}</Text>
            <View style={styles.defiStats}>
              <View><Text style={styles.statLabel}>Value</Text><Text style={styles.statVal}>{formatUSD(pos.currentValue)}</Text></View>
              <View><Text style={styles.statLabel}>APY</Text><Text style={[styles.statVal, { color: Colors.secondary }]}>{pos.apy.toFixed(1)}%</Text></View>
              <View><Text style={styles.statLabel}>Rewards</Text><Text style={styles.statVal}>{formatUSD(pos.rewardsEarned)}</Text></View>
            </View>
          </View>
        ))}

        {/* NFTs placeholder */}
        {activeTab === 'nfts' && (
          <View style={styles.empty}><Text style={{ fontSize: 48 }}>🖼️</Text><Text style={styles.emptyText}>NFT tracking coming soon</Text></View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.background },
  header: { paddingHorizontal: Spacing.lg, paddingTop: 60, paddingBottom: Spacing.lg },
  title: { fontSize: FontSize.sm, color: Colors.dark.textSecondary, fontWeight: FontWeight.medium },
  totalValue: { fontSize: FontSize.xxxl, fontWeight: FontWeight.extrabold, color: Colors.dark.text, marginTop: 4 },
  totalChange: { fontSize: FontSize.base, fontWeight: FontWeight.semibold, marginTop: 4 },
  allocationBar: { flexDirection: 'row', height: 6, marginHorizontal: Spacing.lg, borderRadius: 3, overflow: 'hidden', gap: 2 },
  allocSegment: { borderRadius: 3 },
  tabs: { flexDirection: 'row', marginHorizontal: Spacing.lg, marginTop: Spacing.xl, backgroundColor: Colors.dark.surface, borderRadius: BorderRadius.md, padding: 4 },
  tab: { flex: 1, paddingVertical: Spacing.sm, alignItems: 'center', borderRadius: BorderRadius.sm },
  tabActive: { backgroundColor: Colors.dark.surfaceLight },
  tabText: { fontSize: FontSize.sm, color: Colors.dark.textTertiary, fontWeight: FontWeight.medium },
  tabTextActive: { color: Colors.primary, fontWeight: FontWeight.semibold },
  list: { flex: 1, marginTop: Spacing.md },
  tokenRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg, borderBottomWidth: 1, borderBottomColor: Colors.dark.surfaceBorder },
  tokenLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  tokenIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.dark.surfaceLight, justifyContent: 'center', alignItems: 'center' },
  tokenIconChar: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.primary },
  tokenSymbol: { fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.dark.text },
  tokenName: { fontSize: FontSize.xs, color: Colors.dark.textSecondary, marginTop: 2 },
  tokenRight: { alignItems: 'flex-end' },
  tokenValue: { fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.dark.text },
  tokenBal: { fontSize: FontSize.xs, color: Colors.dark.textSecondary, marginTop: 2 },
  tokenChg: { fontSize: FontSize.xs, fontWeight: FontWeight.medium, marginTop: 2 },
  defiCard: { marginHorizontal: Spacing.lg, marginBottom: Spacing.md, padding: Spacing.lg, backgroundColor: Colors.dark.surface, borderRadius: BorderRadius.lg },
  defiHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  defiProtocol: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.secondary },
  defiType: { fontSize: FontSize.xs, color: Colors.dark.textTertiary, backgroundColor: Colors.dark.surfaceLight, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  defiLabel: { fontSize: FontSize.base, color: Colors.dark.text, fontWeight: FontWeight.medium, marginTop: Spacing.sm },
  defiStats: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.md, paddingTop: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.dark.surfaceBorder },
  statLabel: { fontSize: FontSize.xs, color: Colors.dark.textTertiary },
  statVal: { fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.dark.text, marginTop: 2 },
  empty: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyText: { fontSize: FontSize.base, color: Colors.dark.textTertiary, marginTop: Spacing.md },
});
