/**
 * Swap Modal — Token swap via Jupiter
 */
import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '../src/constants/theme';
import { formatPrice } from '../src/utils/format';

interface TokenSelection {
  symbol: string;
  mint: string;
  balance: number;
}

const SOL: TokenSelection = { symbol: 'SOL', mint: 'So11111111111111111111111111111111111111112', balance: 0 };
const USDC: TokenSelection = { symbol: 'USDC', mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', balance: 0 };

export default function SwapScreen() {
  const [inputToken, setInputToken] = useState<TokenSelection>(SOL);
  const [outputToken, setOutputToken] = useState<TokenSelection>(USDC);
  const [inputAmount, setInputAmount] = useState('');
  const [outputAmount, setOutputAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [priceImpact, setPriceImpact] = useState<number | null>(null);

  const flipTokens = () => {
    setInputToken(outputToken);
    setOutputToken(inputToken);
    setInputAmount(outputAmount);
    setOutputAmount(inputAmount);
  };

  const getQuote = useCallback(async () => {
    if (!inputAmount || parseFloat(inputAmount) <= 0) return;
    setLoading(true);
    try {
      // TODO: Call Jupiter quote API
      // const quote = await jupiterClient.getQuote(inputToken.mint, outputToken.mint, parseFloat(inputAmount));
      // setOutputAmount(quote.outAmount);
      // setPriceImpact(quote.priceImpactPct);
      setOutputAmount('150.23'); // Placeholder
      setPriceImpact(0.12);
    } catch (e) {
      console.error('Quote error:', e);
    } finally {
      setLoading(false);
    }
  }, [inputAmount, inputToken, outputToken]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.closeBtn}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Swap</Text>
        <TouchableOpacity><Text style={styles.settingsBtn}>⚙️</Text></TouchableOpacity>
      </View>

      {/* Input Token */}
      <View style={styles.tokenCard}>
        <View style={styles.tokenCardTop}>
          <Text style={styles.cardLabel}>You pay</Text>
          <Text style={styles.balanceText}>Balance: {inputToken.balance}</Text>
        </View>
        <View style={styles.tokenCardMain}>
          <TextInput
            style={styles.amountInput}
            placeholder="0.00"
            placeholderTextColor={Colors.dark.textTertiary}
            keyboardType="decimal-pad"
            value={inputAmount}
            onChangeText={(v) => { setInputAmount(v); }}
            onEndEditing={getQuote}
          />
          <TouchableOpacity style={styles.tokenSelector}>
            <Text style={styles.tokenSymbol}>{inputToken.symbol}</Text>
            <Text style={styles.chevron}>▼</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.quickAmounts}>
          {['25%', '50%', '75%', 'MAX'].map((pct) => (
            <TouchableOpacity key={pct} style={styles.quickBtn}>
              <Text style={styles.quickBtnText}>{pct}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Flip Button */}
      <TouchableOpacity style={styles.flipBtn} onPress={flipTokens}>
        <Text style={styles.flipIcon}>⇅</Text>
      </TouchableOpacity>

      {/* Output Token */}
      <View style={styles.tokenCard}>
        <View style={styles.tokenCardTop}>
          <Text style={styles.cardLabel}>You receive</Text>
        </View>
        <View style={styles.tokenCardMain}>
          {loading ? (
            <ActivityIndicator color={Colors.primary} />
          ) : (
            <Text style={[styles.amountOutput, !outputAmount && { color: Colors.dark.textTertiary }]}>
              {outputAmount || '0.00'}
            </Text>
          )}
          <TouchableOpacity style={styles.tokenSelector}>
            <Text style={styles.tokenSymbol}>{outputToken.symbol}</Text>
            <Text style={styles.chevron}>▼</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Quote Details */}
      {priceImpact !== null && (
        <View style={styles.quoteDetails}>
          <View style={styles.quoteRow}>
            <Text style={styles.quoteLabel}>Price Impact</Text>
            <Text style={[styles.quoteValue, { color: priceImpact > 1 ? Colors.warning : Colors.success }]}>
              {priceImpact.toFixed(2)}%
            </Text>
          </View>
          <View style={styles.quoteRow}>
            <Text style={styles.quoteLabel}>Route</Text>
            <Text style={styles.quoteValue}>Jupiter</Text>
          </View>
          <View style={styles.quoteRow}>
            <Text style={styles.quoteLabel}>Slippage</Text>
            <Text style={styles.quoteValue}>1.0%</Text>
          </View>
        </View>
      )}

      {/* Swap Button */}
      <TouchableOpacity
        style={[styles.swapButton, (!inputAmount || loading) && styles.swapButtonDisabled]}
        disabled={!inputAmount || loading}
      >
        <Text style={styles.swapButtonText}>
          {loading ? 'Getting Quote...' : inputAmount ? 'Swap' : 'Enter an amount'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.poweredBy}>Powered by Jupiter ⚡</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.background, paddingHorizontal: Spacing.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 56, paddingBottom: Spacing.lg },
  closeBtn: { fontSize: 24, color: Colors.dark.textSecondary, padding: 4 },
  title: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.dark.text },
  settingsBtn: { fontSize: 22, padding: 4 },
  tokenCard: { backgroundColor: Colors.dark.surface, borderRadius: BorderRadius.lg, padding: Spacing.lg, marginBottom: 4 },
  tokenCardTop: { flexDirection: 'row', justifyContent: 'space-between' },
  cardLabel: { fontSize: FontSize.xs, color: Colors.dark.textTertiary, fontWeight: FontWeight.medium },
  balanceText: { fontSize: FontSize.xs, color: Colors.dark.textTertiary },
  tokenCardMain: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Spacing.md },
  amountInput: { flex: 1, fontSize: FontSize.xxxl, fontWeight: FontWeight.bold, color: Colors.dark.text },
  amountOutput: { flex: 1, fontSize: FontSize.xxxl, fontWeight: FontWeight.bold, color: Colors.dark.text },
  tokenSelector: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.dark.surfaceLight, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.full },
  tokenSymbol: { fontSize: FontSize.base, fontWeight: FontWeight.bold, color: Colors.dark.text },
  chevron: { fontSize: 10, color: Colors.dark.textTertiary },
  quickAmounts: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md },
  quickBtn: { backgroundColor: Colors.dark.surfaceLight, paddingHorizontal: Spacing.md, paddingVertical: 4, borderRadius: BorderRadius.full },
  quickBtnText: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: FontWeight.medium },
  flipBtn: { alignSelf: 'center', width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.dark.surface, justifyContent: 'center', alignItems: 'center', marginVertical: -18, zIndex: 10, borderWidth: 3, borderColor: Colors.dark.background },
  flipIcon: { fontSize: 20, color: Colors.primary },
  quoteDetails: { backgroundColor: Colors.dark.surface, borderRadius: BorderRadius.md, padding: Spacing.md, marginTop: Spacing.lg },
  quoteRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  quoteLabel: { fontSize: FontSize.sm, color: Colors.dark.textSecondary },
  quoteValue: { fontSize: FontSize.sm, color: Colors.dark.text, fontWeight: FontWeight.medium },
  swapButton: { backgroundColor: Colors.primary, paddingVertical: Spacing.lg, borderRadius: BorderRadius.md, alignItems: 'center', marginTop: Spacing.xl },
  swapButtonDisabled: { opacity: 0.4 },
  swapButtonText: { color: '#FFF', fontSize: FontSize.lg, fontWeight: FontWeight.bold },
  poweredBy: { textAlign: 'center', fontSize: FontSize.xs, color: Colors.dark.textTertiary, marginTop: Spacing.md },
});
