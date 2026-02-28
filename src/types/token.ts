/**
 * Core type definitions for SolPulse
 */

// ─── Token & Holdings ───────────────────────────────────────

export interface TokenHolding {
  mint: string;
  symbol: string;
  name: string;
  logoUri: string;
  balance: number;
  decimals: number;
  usdPrice: number;
  usdValue: number;
  priceChange24h: number;
  isVerified: boolean;
}

export interface TokenPrice {
  mint: string;
  price: number;
  vsToken: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface TokenOverview {
  mint: string;
  symbol: string;
  name: string;
  logoUri: string;
  price: number;
  priceChange1h: number;
  priceChange24h: number;
  priceChange7d: number;
  priceChange30d: number;
  marketCap: number;
  volume24h: number;
  supply: number;
  holders: number;
  liquidity: number;
}

// ─── Charts ─────────────────────────────────────────────────

export interface OHLCVData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// ─── Swaps ──────────────────────────────────────────────────

export interface SwapQuote {
  inputMint: string;
  outputMint: string;
  inAmount: string;
  outAmount: string;
  priceImpactPct: number;
  routePlan: RoutePlanStep[];
  otherAmountThreshold: string;
  swapMode: string;
  contextSlot: number;
  raw: any;
}

export interface RoutePlanStep {
  swapInfo: {
    ammKey: string;
    label: string;
    inputMint: string;
    outputMint: string;
    inAmount: string;
    outAmount: string;
    feeAmount: string;
    feeMint: string;
  };
  percent: number;
}

// ─── Transactions ───────────────────────────────────────────

export interface ParsedTransaction {
  signature: string;
  timestamp: number;
  type: TransactionType;
  source: string;
  description: string;
  fee: number;
  feePayer: string;
  nativeTransfers: NativeTransfer[];
  tokenTransfers: TokenTransfer[];
  accountData: any[];
}

export type TransactionType =
  | 'SWAP'
  | 'TRANSFER'
  | 'STAKE'
  | 'UNSTAKE'
  | 'NFT_SALE'
  | 'NFT_MINT'
  | 'COMPRESSED_NFT_MINT'
  | 'TOKEN_MINT'
  | 'BURN'
  | 'UNKNOWN';

export interface NativeTransfer {
  fromUserAccount: string;
  toUserAccount: string;
  amount: number;
}

export interface TokenTransfer {
  fromUserAccount: string;
  toUserAccount: string;
  fromTokenAccount: string;
  toTokenAccount: string;
  tokenAmount: number;
  mint: string;
  tokenStandard: string;
}

// ─── DeFi Positions ─────────────────────────────────────────

export type ProtocolName = 'marinade' | 'raydium' | 'kamino' | 'drift' | 'jito';
export type PositionType = 'stake' | 'lp' | 'lend' | 'borrow' | 'perp';

export interface DeFiPosition {
  id: string;
  protocol: ProtocolName;
  type: PositionType;
  label: string;
  depositedValue: number;
  currentValue: number;
  apy: number;
  rewardsEarned: number;
  healthFactor?: number;
  metadata: Record<string, any>;
}

// ─── Alerts ─────────────────────────────────────────────────

export type AlertType = 'price' | 'wallet' | 'portfolio' | 'defi' | 'whale';
export type AlertOperator = 'above' | 'below' | 'change' | 'any_activity';

export interface Alert {
  id: string;
  type: AlertType;
  name: string;
  enabled: boolean;
  condition: {
    target: string;
    operator: AlertOperator;
    value: number;
    timeframe?: string;
  };
  lastTriggered?: number;
  createdAt: number;
}

// ─── Whale Tracking ─────────────────────────────────────────

export interface WhaleWatch {
  address: string;
  label: string;
  addedAt: number;
  lastActivity?: {
    signature: string;
    type: string;
    summary: string;
    timestamp: number;
  };
}

// ─── Portfolio ──────────────────────────────────────────────

export interface PortfolioSummary {
  totalValue: number;
  totalChange24h: number;
  totalChangePercent24h: number;
  holdings: TokenHolding[];
  defiPositions: DeFiPosition[];
  defiTotalValue: number;
  topGainer: TokenHolding | null;
  topLoser: TokenHolding | null;
}
