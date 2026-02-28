/**
 * Jupiter API Client
 * DEX aggregator: token prices, swap quotes, route optimization
 * Docs: https://station.jup.ag/docs
 */
import axios, { AxiosInstance } from 'axios';
import { TokenPrice, SwapQuote } from '../types/token';

const JUPITER_PRICE_API = 'https://api.jup.ag/price/v2';
const JUPITER_QUOTE_API = 'https://quote-api.jup.ag/v6';
const JUPITER_TOKEN_API = 'https://tokens.jup.ag';

export class JupiterClient {
  private priceApi: AxiosInstance;
  private quoteApi: AxiosInstance;

  constructor() {
    this.priceApi = axios.create({ baseURL: JUPITER_PRICE_API });
    this.quoteApi = axios.create({ baseURL: JUPITER_QUOTE_API });
  }

  /**
   * Get prices for multiple tokens at once
   * @param mints Array of token mint addresses
   * @param vsToken Quote currency mint (default: USDC)
   */
  async getPrices(
    mints: string[],
    vsToken: string = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
  ): Promise<Record<string, TokenPrice>> {
    const ids = mints.join(',');
    const response = await this.priceApi.get('/', {
      params: { ids, vsToken },
    });

    const prices: Record<string, TokenPrice> = {};
    const data = response.data.data || {};

    for (const [mint, info] of Object.entries(data) as any[]) {
      prices[mint] = {
        mint,
        price: parseFloat(info.price),
        vsToken: info.vsToken || vsToken,
        confidence: info.confidence || 'high',
      };
    }

    return prices;
  }

  /**
   * Get a swap quote
   * Shows expected output without executing
   */
  async getQuote(
    inputMint: string,
    outputMint: string,
    amount: number,
    inputDecimals: number = 9,
    slippageBps: number = 100
  ): Promise<SwapQuote> {
    const lamports = Math.floor(amount * Math.pow(10, inputDecimals));

    const response = await this.quoteApi.get('/quote', {
      params: {
        inputMint,
        outputMint,
        amount: lamports.toString(),
        slippageBps,
        onlyDirectRoutes: false,
        asLegacyTransaction: false,
      },
    });

    const data = response.data;

    return {
      inputMint: data.inputMint,
      outputMint: data.outputMint,
      inAmount: data.inAmount,
      outAmount: data.outAmount,
      priceImpactPct: parseFloat(data.priceImpactPct),
      routePlan: data.routePlan || [],
      otherAmountThreshold: data.otherAmountThreshold,
      swapMode: data.swapMode,
      contextSlot: data.contextSlot,
      raw: data,
    };
  }

  /**
   * Search for tokens by name or symbol
   */
  async searchTokens(query: string, limit: number = 10) {
    const response = await axios.get(`${JUPITER_TOKEN_API}/tokens/search`, {
      params: { query, limit },
    });
    return response.data || [];
  }

  /**
   * Get verified token list
   */
  async getVerifiedTokens() {
    const response = await axios.get(`${JUPITER_TOKEN_API}/tokens?tags=verified`);
    return response.data || [];
  }
}

export default JupiterClient;
