/**
 * Birdeye API Client
 * Price history (OHLCV), token overview, and market data
 * Docs: https://docs.birdeye.so
 */

import axios, { AxiosInstance } from 'axios';
import { OHLCVData, TokenOverview } from '../types/token';

const BIRDEYE_BASE = 'https://public-api.birdeye.so';

export class BirdeyeClient {
  private api: AxiosInstance;

  constructor(apiKey: string) {
    this.api = axios.create({
      baseURL: BIRDEYE_BASE,
      headers: {
        'X-API-KEY': apiKey,
        'x-chain': 'solana',
      },
    });
  }

  /**
   * Get OHLCV price history for charts
   * @param mint Token mint address
   * @param timeframe '1m' | '5m' | '15m' | '1H' | '4H' | '1D' | '1W'
   * @param timeFrom Unix timestamp start
   * @param timeTo Unix timestamp end
   */
  async getOHLCV(
    mint: string,
    timeframe: string = '1H',
    timeFrom: number,
    timeTo: number
  ): Promise<OHLCVData[]> {
    const response = await this.api.get('/defi/ohlcv', {
      params: {
        address: mint,
        type: timeframe,
        time_from: timeFrom,
        time_to: timeTo,
      },
    });

    return (response.data.data?.items || []).map((item: any) => ({
      timestamp: item.unixTime,
      open: item.o,
      high: item.h,
      low: item.l,
      close: item.c,
      volume: item.v,
    }));
  }

  /**
   * Get token overview with market data
   * Includes price, market cap, volume, supply, price changes
   */
  async getTokenOverview(mint: string): Promise<TokenOverview> {
    const response = await this.api.get('/defi/token_overview', {
      params: { address: mint },
    });

    const data = response.data.data;
    return {
      mint: data.address,
      symbol: data.symbol,
      name: data.name,
      logoUri: data.logoURI,
      price: data.price,
      priceChange1h: data.priceChange1hPercent,
      priceChange24h: data.priceChange24hPercent,
      priceChange7d: data.priceChange7dPercent,
      priceChange30d: data.priceChange30dPercent,
      marketCap: data.mc,
      volume24h: data.v24hUSD,
      supply: data.supply,
      holders: data.holder,
      liquidity: data.liquidity,
    };
  }

  /**
   * Get price at a specific time (for PnL calculation)
   */
  async getHistoricalPrice(mint: string, timestamp: number): Promise<number> {
    const response = await this.api.get('/defi/history_price', {
      params: {
        address: mint,
        address_type: 'token',
        type: '1H',
        time_from: timestamp - 3600,
        time_to: timestamp,
      },
    });

    const items = response.data.data?.items || [];
    if (items.length === 0) return 0;
    return items[items.length - 1].value;
  }

  /**
   * Get trending tokens on Solana
   */
  async getTrending(limit: number = 20) {
    const response = await this.api.get('/defi/token_trending', {
      params: {
        sort_by: 'rank',
        sort_type: 'asc',
        offset: 0,
        limit,
      },
    });

    return response.data.data?.tokens || [];
  }

  /**
   * Get token security info (for safety checks)
   */
  async getTokenSecurity(mint: string) {
    const response = await this.api.get('/defi/token_security', {
      params: { address: mint },
    });
    return response.data.data;
  }
}

export default BirdeyeClient;
