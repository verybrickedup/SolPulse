/**
 * Dashboard Screen — SolPulse Home
 * Shows portfolio value, top holdings, active alerts, and DeFi positions
 */

import React, { useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { usePortfolio } from '../../src/hooks/usePortfolio';
import { formatUSD, formatPercent, formatBalance, getChangeColor, formatTimeAgo } from '../../src/utils/format';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight, Shadow } from '../../src/constants/theme';
import { TokenHolding } from '../../src/types/token';
// import PortfolioChart from '../../src/components/charts/PortfolioChart';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function DashboardScreen() {
  const { summary, isRefreshing, refresh, lastUpdated } = usePortfolio();

  const navigateToToken = (mint: string) => {
    router.push(`/token/${mint}`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appName}>SolPulse</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => router.push('/alerts')}>
            <Text style={styles.headerIcon}>🔔</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/settings')}>
            <Text style={styles.headerIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
      >
        {/* Portfolio Value Card */}
        <View style={styles.portfolioCard}>
          <Text style={styles.portfolioLabel}>Total Portfolio Value</Text>
          <Text style={styles.portfolioValue}>{formatUSD(summary.totalValue)}</Text>
          <View style={styles.changeRow}>
            <Text
              style={[
                styles.changeText,
                { color: getChangeColor(summary.totalChange24h) },
              ]}
            >
              {summary.totalChange24h >= 0 ? '▲' : '▼'}{' '}
              {formatUSD(Math.abs(summary.totalChange24h))} (
              {formatPercent(summary.totalChangePercent24h)})
            </Text>
            <Text style={styles.timeframeText}>24h</Text>
          </View>

          {/* Portfolio Chart Placeholder */}
          <View style={styles.chartPlaceholder}>
            <Text style={styles.chartPlaceholderText}>📈 7D Portfolio Chart</Text>
            {/* <PortfolioChart data={portfolioHistory} /> */}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickActionBtn}>
            <Text style={styles.quickActionIcon}>🔄</Text>
            <Text style={styles.quickActionLabel}>Swap</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionBtn}>
            <Text style={styles.quickActionIcon}>📤</Text>
            <Text style={styles.quickActionLabel}>Send</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionBtn}>
            <Text style={styles.quickActionIcon}>⚡</Text>
            <Text style={styles.quickActionLabel}>Stake</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionBtn}>
            <Text style={styles.quickActionIcon}>📥</Text>
            <Text style={styles.quickActionLabel}>Receive</Text>
          </TouchableOpacity>
        </View>

        {/* Top Holdings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Holdings</Text>
            <TouchableOpacity onPress={() => router.push('/portfolio')}>
              <Text style={styles.seeAll}>See All →</Text>
            </TouchableOpacity>
          </View>

          {summary.holdings.slice(0, 5).map((token) => (
            <TokenRow
              key={token.mint}
              token={token}
              onPress={() => navigateToToken(token.mint)}
            />
          ))}
        </View>

        {/* DeFi Positions Summary */}
        {summary.defiPositions.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>DeFi Positions</Text>
              <TouchableOpacity onPress={() => router.push('/portfolio')}>
                <Text style={styles.seeAll}>See All →</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.defiSummaryCard}>
              <Text style={styles.defiTotalLabel}>Total DeFi Value</Text>
              <Text style={styles.defiTotalValue}>
                {formatUSD(summary.defiTotalValue)}
              </Text>
              {summary.defiPositions.slice(0, 3).map((pos) => (
                <View key={pos.id} style={styles.defiRow}>
                  <View>
                    <Text style={styles.defiProtocol}>{pos.protocol}</Text>
                    <Text style={styles.defiLabel}>{pos.label}</Text>
                  </View>
                  <View style={styles.defiRight}>
                    <Text style={styles.defiValue}>
                      {formatUSD(pos.currentValue)}
                    </Text>
                    <Text style={styles.defiApy}>{pos.apy.toFixed(1)}% APY</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Last Updated */}
        {lastUpdated && (
          <Text style={styles.lastUpdated}>
            Updated {formatTimeAgo(lastUpdated)}
          </Text>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

// ─── Token Row Component ────────────────────────────────────

interface TokenRowProps {
  token: TokenHolding;
  onPress: () => void;
}

function TokenRow({ token, onPress }: TokenRowProps) {
  return (
    <TouchableOpacity style={styles.tokenRow} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.tokenLeft}>
        <View style={styles.tokenIconPlaceholder}>
          <Text style={styles.tokenIconText}>{token.symbol.charAt(0)}</Text>
        </View>
        <View>
          <Text style={styles.tokenSymbol}>{token.symbol}</Text>
          <Text style={styles.tokenBalance}>
            {formatBalance(token.balance)} {token.symbol}
          </Text>
        </View>
      </View>
      <View style={styles.tokenRight}>
        <Text style={styles.tokenValue}>{formatUSD(token.usdValue)}</Text>
        <Text
          style={[
            styles.tokenChange,
            { color: getChangeColor(token.priceChange24h) },
          ]}
        >
          {formatPercent(token.priceChange24h)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── Styles ─────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: 60,
    paddingBottom: Spacing.md,
  },
  appName: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  headerIcon: {
    fontSize: 22,
  },
  scrollView: {
    flex: 1,
  },

  // Portfolio Card
  portfolioCard: {
    marginHorizontal: Spacing.lg,
    padding: Spacing.xl,
    backgroundColor: Colors.dark.surface,
    borderRadius: BorderRadius.lg,
    ...Shadow.md,
  },
  portfolioLabel: {
    fontSize: FontSize.sm,
    color: Colors.dark.textSecondary,
    fontWeight: FontWeight.medium,
  },
  portfolioValue: {
    fontSize: FontSize.display,
    fontWeight: FontWeight.extrabold,
    color: Colors.dark.text,
    marginTop: Spacing.xs,
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  changeText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
  },
  timeframeText: {
    fontSize: FontSize.xs,
    color: Colors.dark.textTertiary,
    backgroundColor: Colors.dark.surfaceLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  chartPlaceholder: {
    height: 120,
    marginTop: Spacing.lg,
    backgroundColor: Colors.dark.surfaceLight,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartPlaceholderText: {
    color: Colors.dark.textTertiary,
    fontSize: FontSize.sm,
  },

  // Quick Actions
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    padding: Spacing.md,
    backgroundColor: Colors.dark.surface,
    borderRadius: BorderRadius.lg,
  },
  quickActionBtn: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  quickActionIcon: {
    fontSize: 24,
  },
  quickActionLabel: {
    fontSize: FontSize.xs,
    color: Colors.dark.textSecondary,
    fontWeight: FontWeight.medium,
  },

  // Sections
  section: {
    marginTop: Spacing.xl,
    marginHorizontal: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.dark.text,
  },
  seeAll: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: FontWeight.medium,
  },

  // Token Row
  tokenRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.surfaceBorder,
  },
  tokenLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  tokenIconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.dark.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tokenIconText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  tokenSymbol: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.dark.text,
  },
  tokenBalance: {
    fontSize: FontSize.xs,
    color: Colors.dark.textSecondary,
    marginTop: 2,
  },
  tokenRight: {
    alignItems: 'flex-end',
  },
  tokenValue: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.dark.text,
  },
  tokenChange: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    marginTop: 2,
  },

  // DeFi
  defiSummaryCard: {
    backgroundColor: Colors.dark.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  defiTotalLabel: {
    fontSize: FontSize.sm,
    color: Colors.dark.textSecondary,
  },
  defiTotalValue: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.dark.text,
    marginBottom: Spacing.md,
  },
  defiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.surfaceBorder,
  },
  defiProtocol: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.secondary,
    textTransform: 'capitalize',
  },
  defiLabel: {
    fontSize: FontSize.xs,
    color: Colors.dark.textSecondary,
  },
  defiRight: {
    alignItems: 'flex-end',
  },
  defiValue: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.dark.text,
  },
  defiApy: {
    fontSize: FontSize.xs,
    color: Colors.secondary,
    fontWeight: FontWeight.medium,
  },

  // Footer
  lastUpdated: {
    textAlign: 'center',
    fontSize: FontSize.xs,
    color: Colors.dark.textTertiary,
    marginTop: Spacing.xl,
  },
});
