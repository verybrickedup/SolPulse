/**
 * Portfolio Store — Zustand state management
 * Manages token holdings, portfolio value, and DeFi positions
 */

import { create } from 'zustand';
import { TokenHolding, DeFiPosition, PortfolioSummary } from '../types/token';

interface PortfolioState {
  // Data
  holdings: TokenHolding[];
  defiPositions: DeFiPosition[];
  totalValue: number;
  totalChange24h: number;
  totalChangePercent24h: number;

  // Loading states
  isLoading: boolean;
  isRefreshing: boolean;
  lastUpdated: number | null;
  error: string | null;

  // Actions
  setHoldings: (holdings: TokenHolding[]) => void;
  setDeFiPositions: (positions: DeFiPosition[]) => void;
  setLoading: (loading: boolean) => void;
  setRefreshing: (refreshing: boolean) => void;
  setError: (error: string | null) => void;
  calculateTotals: () => void;
  getSummary: () => PortfolioSummary;
}

export const usePortfolioStore = create<PortfolioState>((set, get) => ({
  // Initial state
  holdings: [],
  defiPositions: [],
  totalValue: 0,
  totalChange24h: 0,
  totalChangePercent24h: 0,
  isLoading: false,
  isRefreshing: false,
  lastUpdated: null,
  error: null,

  // Actions
  setHoldings: (holdings) => {
    set({ holdings, lastUpdated: Date.now() });
    get().calculateTotals();
  },

  setDeFiPositions: (defiPositions) => {
    set({ defiPositions });
    get().calculateTotals();
  },

  setLoading: (isLoading) => set({ isLoading }),
  setRefreshing: (isRefreshing) => set({ isRefreshing }),
  setError: (error) => set({ error }),

  calculateTotals: () => {
    const { holdings, defiPositions } = get();

    const holdingsValue = holdings.reduce((sum, h) => sum + h.usdValue, 0);
    const defiValue = defiPositions.reduce((sum, p) => sum + p.currentValue, 0);
    const totalValue = holdingsValue + defiValue;

    // Calculate 24h change from holdings
    const totalChange24h = holdings.reduce((sum, h) => {
      const previousValue = h.usdValue / (1 + h.priceChange24h / 100);
      return sum + (h.usdValue - previousValue);
    }, 0);

    const previousTotal = totalValue - totalChange24h;
    const totalChangePercent24h = previousTotal > 0
      ? (totalChange24h / previousTotal) * 100
      : 0;

    set({ totalValue, totalChange24h, totalChangePercent24h });
  },

  getSummary: () => {
    const state = get();
    const sortedByChange = [...state.holdings].sort(
      (a, b) => b.priceChange24h - a.priceChange24h
    );

    return {
      totalValue: state.totalValue,
      totalChange24h: state.totalChange24h,
      totalChangePercent24h: state.totalChangePercent24h,
      holdings: state.holdings,
      defiPositions: state.defiPositions,
      defiTotalValue: state.defiPositions.reduce((sum, p) => sum + p.currentValue, 0),
      topGainer: sortedByChange.length > 0 ? sortedByChange[0] : null,
      topLoser: sortedByChange.length > 0 ? sortedByChange[sortedByChange.length - 1] : null,
    };
  },
}));

export default usePortfolioStore;
