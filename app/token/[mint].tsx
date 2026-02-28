/**
 * Token Detail Screen — Full token view with chart, stats, and actions
 */
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { formatUSD, formatPrice, formatPercent, formatCompact, getChangeColor, formatBalance } from '../../src/utils/format';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight, Shadow } from '../../src/constants/theme';
import { TokenOverview } from '../../src/types/token';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
type Timeframe = '1H' | '1D' | '1W' | '1M' | 'ALL';

export default function TokenDetailScreen() {
  const { mint } = useLocalSearchParams<{ mint: string }>();
  const [token, setToken] = useState<TokenOverview | null>(null);
  const [timeframe, setTimeframe] = useState<Timeframe>('1D');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch from Birdeye API
    setLoading(false);
    setToken({
      mint: mint || '',
      symbol: 'SOL',
      name: 'Solana',
      logoUri: '',
      price: 148.52,
      priceChange1h: 0.34,
      priceChange24h: 2.15,
      priceChange7d: -1.82,
      priceChange30d: 12.45,
      marketCap: 68_200_000_000,
      volume24h: 3_450_000_000,
      supply: 459_300_000,
      holders: 2_340_000,
      liquidity: 890_000_000,
    });
  }, [mint]);

  if (loading || !token) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const timeframes: Timeframe[] = ['1H', '1D', '1W', '1M', 'ALL'];
  const getChangeForTf = (tf: Timeframe) => {
    switch (tf) {
      case '1H': return token.priceChange1h;
      case '1D': return token.priceChange24h;
      case '1W': return token.priceChange7d;
      case '1M': return token.priceChange30d;
      default: return token.priceChange24h;
    }
  };

  const currentChange = getChangeForTf(timeframe);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{token.symbol}</Text>
        <TouchableOpacity><Text style={styles.headerAction}>★</Text></TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Price Section */}
        <View style={styles.priceSection}>
          <Text style={styles.tokenName}>{token.name}</Text>
          <Text style={styles.price}>{formatPrice(token.price)}</Text>
          <Text style={[styles.change, { color: getChangeColor(currentChange) }]}>
            {currentChange >= 0 ? '▲' : '▼'} {formatPercent(currentChange)}
          </Text>
        </View>

        {/* Chart Placeholder */}
        <View style={styles.chartArea}>
          <View style={styles.chartPlaceholder}>
            <Text style={styles.chartText}>📈 {timeframe} Price Chart</Text>
            <Text style={styles.chartSubtext}>Victory Charts integration pending</Text>
          </View>
        </View>

        {/* Timeframe Selector */}
        <View style={styles.tfRow}>
          {timeframes.map((tf) => (
            <TouchableOpacity key={tf} style={[styles.tfBtn, timeframe === tf && styles.tfBtnActive]} onPress={() => setTimeframe(tf)}>
              <Text style={[styles.tfText, timeframe === tf && styles.tfTextActive]}>{tf}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatBox label="Market Cap" value={`$${formatCompact(token.marketCap)}`} />
          <StatBox label="24h Volume" value={`$${formatCompact(token.volume24h)}`} />
          <StatBox label="Supply" value={formatCompact(token.supply)} />
          <StatBox label="Holders" value={formatCompact(token.holders)} />
          <StatBox label="Liquidity" value={`$${formatCompact(token.liquidity)}`} />
          <StatBox label="Vol/MCap" value={`${((token.volume24h / token.marketCap) * 100).toFixed(1)}%`} />
        </View>

        {/* Price Changes */}
        <View style={styles.changesCard}>
          <Text style={styles.changesTitle}>Price Performance</Text>
          <ChangeRow label="1 Hour" value={token.priceChange1h} />
          <ChangeRow label="24 Hours" value={token.priceChange24h} />
          <ChangeRow label="7 Days" value={token.priceChange7d} />
          <ChangeRow label="30 Days" value={token.priceChange30d} />
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.swapBtn} onPress={() => router.push('/swap')}>
            <Text style={styles.swapBtnText}>🔄 Swap</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.alertBtn} onPress={() => router.push('/alert-create')}>
            <Text style={styles.alertBtnText}>🔔 Set Alert</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

function ChangeRow({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.changeRow}>
      <Text style={styles.changeLabel}>{label}</Text>
      <Text style={[styles.changeValue, { color: getChangeColor(value) }]}>{formatPercent(value)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.background },
  center: { justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingTop: 56, paddingBottom: Spacing.md },
  backBtn: { padding: 4 },
  backText: { fontSize: FontSize.base, color: Colors.primary, fontWeight: FontWeight.medium },
  headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.dark.text },
  headerAction: { fontSize: 24, color: Colors.dark.textTertiary },
  priceSection: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm },
  tokenName: { fontSize: FontSize.sm, color: Colors.dark.textSecondary },
  price: { fontSize: FontSize.display, fontWeight: FontWeight.extrabold, color: Colors.dark.text, marginTop: 4 },
  change: { fontSize: FontSize.lg, fontWeight: FontWeight.semibold, marginTop: 4 },
  chartArea: { marginTop: Spacing.xl, marginHorizontal: Spacing.lg },
  chartPlaceholder: { height: 200, backgroundColor: Colors.dark.surface, borderRadius: BorderRadius.lg, justifyContent: 'center', alignItems: 'center' },
  chartText: { fontSize: FontSize.lg, color: Colors.dark.textTertiary },
  chartSubtext: { fontSize: FontSize.xs, color: Colors.dark.textTertiary, marginTop: 4 },
  tfRow: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.sm, marginTop: Spacing.lg, paddingHorizontal: Spacing.lg },
  tfBtn: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: BorderRadius.full },
  tfBtnActive: { backgroundColor: Colors.primary },
  tfText: { fontSize: FontSize.sm, color: Colors.dark.textTertiary, fontWeight: FontWeight.medium },
  tfTextActive: { color: '#FFF', fontWeight: FontWeight.semibold },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: Spacing.lg, marginTop: Spacing.xl, gap: Spacing.md },
  statBox: { width: (SCREEN_WIDTH - Spacing.lg * 2 - Spacing.md * 2) / 3, backgroundColor: Colors.dark.surface, borderRadius: BorderRadius.md, padding: Spacing.md },
  statLabel: { fontSize: FontSize.xs, color: Colors.dark.textTertiary },
  statValue: { fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.dark.text, marginTop: 4 },
  changesCard: { marginHorizontal: Spacing.lg, marginTop: Spacing.xl, backgroundColor: Colors.dark.surface, borderRadius: BorderRadius.lg, padding: Spacing.lg },
  changesTitle: { fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.dark.text, marginBottom: Spacing.md },
  changeRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.dark.surfaceBorder },
  changeLabel: { fontSize: FontSize.sm, color: Colors.dark.textSecondary },
  changeValue: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
  actions: { flexDirection: 'row', gap: Spacing.md, marginHorizontal: Spacing.lg, marginTop: Spacing.xl },
  swapBtn: { flex: 1, backgroundColor: Colors.primary, paddingVertical: Spacing.lg, borderRadius: BorderRadius.md, alignItems: 'center' },
  swapBtnText: { color: '#FFF', fontWeight: FontWeight.bold, fontSize: FontSize.base },
  alertBtn: { flex: 1, backgroundColor: Colors.dark.surface, paddingVertical: Spacing.lg, borderRadius: BorderRadius.md, alignItems: 'center', borderWidth: 1, borderColor: Colors.dark.surfaceBorder },
  alertBtnText: { color: Colors.dark.text, fontWeight: FontWeight.bold, fontSize: FontSize.base },
});
