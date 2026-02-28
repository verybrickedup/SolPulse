/**
 * Helius API Client
 * Enhanced Solana RPC: token balances, parsed transactions, webhooks
 * Docs: https://docs.helius.dev
 */
import axios, { AxiosInstance } from 'axios';
import { TokenHolding, ParsedTransaction } from '../types/token';

export class HeliusClient {
  private api: AxiosInstance;
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.api = axios.create({
      baseURL: 'https://api.helius.xyz',
    });
  }

  /**
   * Get all token balances for a wallet (fungible tokens)
   * Uses Helius DAS API for enriched data
   */
  async getTokenBalances(walletAddress: string): Promise<TokenHolding[]> {
    const response = await this.api.post(`/v0/addresses/${walletAddress}/balances?api-key=${this.apiKey}`, {});

    const { tokens, nativeBalance } = response.data;

    const holdings: TokenHolding[] = [];

    // Add native SOL
    if (nativeBalance) {
      holdings.push({
        mint: 'So11111111111111111111111111111111111111112',
        symbol: 'SOL',
        name: 'Solana',
        logoUri: '',
        balance: nativeBalance / 1e9,
        decimals: 9,
        usdPrice: 0, // Enriched later
        usdValue: 0,
        priceChange24h: 0,
        isVerified: true,
      });
    }

    // Add SPL tokens
    for (const token of tokens || []) {
      holdings.push({
        mint: token.mint,
        symbol: token.symbol || 'UNKNOWN',
        name: token.name || 'Unknown Token',
        logoUri: token.logoURI || '',
        balance: token.amount / Math.pow(10, token.decimals),
        decimals: token.decimals,
        usdPrice: token.price || 0,
        usdValue: (token.amount / Math.pow(10, token.decimals)) * (token.price || 0),
        priceChange24h: 0,
        isVerified: token.verified || false,
      });
    }

    // Sort by USD value descending
    return holdings.sort((a, b) => b.usdValue - a.usdValue);
  }

  /**
   * Get parsed transaction history
   * Helius auto-categorizes transactions (SWAP, TRANSFER, NFT_SALE, etc.)
   */
  async getTransactionHistory(
    walletAddress: string,
    options: { limit?: number; before?: string; type?: string } = {}
  ): Promise<ParsedTransaction[]> {
    const params: Record<string, any> = {
      'api-key': this.apiKey,
    };
    if (options.limit) params.limit = options.limit;
    if (options.before) params.before = options.before;
    if (options.type) params.type = options.type;

    const response = await this.api.get(
      `/v0/addresses/${walletAddress}/transactions`,
      { params }
    );

    return response.data.map((tx: any) => ({
      signature: tx.signature,
      timestamp: tx.timestamp,
      type: tx.type || 'UNKNOWN',
      source: tx.source || '',
      description: tx.description || '',
      fee: tx.fee || 0,
      feePayer: tx.feePayer || '',
      nativeTransfers: tx.nativeTransfers || [],
      tokenTransfers: tx.tokenTransfers || [],
      accountData: tx.accountData || [],
    }));
  }

  /**
   * Create a webhook for real-time notifications
   * Used for whale tracking and wallet activity alerts
   */
  async createWebhook(config: {
    webhookURL: string;
    transactionTypes: string[];
    accountAddresses: string[];
  }) {
    const response = await this.api.post(
      `/v0/webhooks?api-key=${this.apiKey}`,
      {
        webhookURL: config.webhookURL,
        transactionTypes: config.transactionTypes,
        accountAddresses: config.accountAddresses,
        webhookType: 'enhanced',
      }
    );
    return response.data;
  }

  /**
   * Get all webhooks
   */
  async getWebhooks() {
    const response = await this.api.get(`/v0/webhooks?api-key=${this.apiKey}`);
    return response.data;
  }

  /**
   * Delete a webhook
   */
  async deleteWebhook(webhookId: string) {
    await this.api.delete(`/v0/webhooks/${webhookId}?api-key=${this.apiKey}`);
  }
}

export default HeliusClient;
