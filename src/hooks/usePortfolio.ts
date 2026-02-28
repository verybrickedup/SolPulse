/**
 * usePortfolio Hook
 * Fetches and manages portfolio data with auto-refresh
 */

import { useCallback, useEffect, useRef } from 'react';
import { usePortfolioStore } from '../store/portfolioStore';
import { HeliusClient } from '../services/helius';
import { JupiterClient } from '../services/jupiter';
import { useWallet } from './useWallet';

const REFRESH_INTERVAL = 30_000; // 30 seconds

export function usePortfolio() {
  const wallet = useWallet();
  const store = usePortfolioStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const heliusRef = useRef<HeliusClient | null>(null);
  const jupiterRef = useRef<JupiterClient | null>(null);

  // Initialize clients
  useEffect(() => {
    // TODO: Get API key from secure store
    heliusRef.current = new HeliusClient('YOUR_HELIUS_API_KEY');
    jupiterRef.current = new JupiterClient();
  }, []);

  /**
   * Fetch fresh portfolio data
   */
  const fetchPortfolio = useCallback(async (isRefresh = false) => {
    if (!wallet.address || !heliusRef.current) return;

    try {
      if (isRefresh) {
        store.setRefreshing(true);
      } else {
        store.setLoading(true);
      }
      store.setError(null);

      // Fetch token balances
      const holdings = await heliusRef.current.getTokenBalances(wallet.address);

      // Enrich with 24h price changes from Jupiter
      if (jupiterRef.current && holdings.length > 0) {
        const mints = holdings.map((h) => h.mint);
        try {
          const prices = await jupiterRef.current.getPrices(mints);
          // Note: Jupiter Price API v2 doesn't include 24h change directly
          // We'd need Birdeye for that — enrichment happens in a separate pass
        } catch (e) {
          console.warn('Price enrichment failed:', e);
        }
      }

      store.setHoldings(holdings);
    } catch (error: any) {
      store.setError(error.message || 'Failed to load portfolio');
      console.error('Portfolio fetch error:', error);
    } finally {
      store.setLoading(false);
      store.setRefreshing(false);
    }
  }, [wallet.address]);

  /**
   * Pull-to-refresh handler
   */
  const refresh = useCallback(() => {
    fetchPortfolio(true);
  }, [fetchPortfolio]);

  // Auto-fetch on mount and wallet change
  useEffect(() => {
    if (wallet.address) {
      fetchPortfolio();
    }
  }, [wallet.address]);

  // Auto-refresh interval
  useEffect(() => {
    if (wallet.address) {
      intervalRef.current = setInterval(() => {
        fetchPortfolio(true);
      }, REFRESH_INTERVAL);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [wallet.address]);

  return {
    ...store,
    refresh,
    summary: store.getSummary(),
  };
}

export default usePortfolio;
