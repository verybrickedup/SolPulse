/**
 * Alert Engine
 * Background service that checks alert conditions and triggers notifications
 * Designed to run via expo-background-fetch for always-on monitoring
 */

import { Alert, AlertType } from '../types/token';
import { JupiterClient } from './jupiter';
import { HeliusClient } from './helius';
import * as Notifications from 'expo-notifications';

// Known token mint addresses for symbol resolution
const KNOWN_MINTS: Record<string, string> = {
  SOL: 'So11111111111111111111111111111111111111112',
  USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  JUP: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',
  BONK: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
  RAY: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
  ORCA: 'orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE',
  MSOL: 'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So',
  JITOSOL: 'J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn',
};

export class AlertEngine {
  private jupiterClient: JupiterClient;
  private heliusClient: HeliusClient;
  private lastPrices: Map<string, number> = new Map();

  constructor(heliusApiKey: string) {
    this.jupiterClient = new JupiterClient();
    this.heliusClient = new HeliusClient(heliusApiKey);
  }

  /**
   * Check all active alerts against current conditions
   * Called periodically by background fetch
   */
  async checkAlerts(alerts: Alert[]): Promise<Alert[]> {
    const activeAlerts = alerts.filter((a) => a.enabled);
    const triggeredAlerts: Alert[] = [];

    // Group price alerts to batch price fetches
    const priceAlerts = activeAlerts.filter((a) => a.type === 'price');
    const walletAlerts = activeAlerts.filter((a) => a.type === 'wallet');
    const portfolioAlerts = activeAlerts.filter((a) => a.type === 'portfolio');

    // Check price alerts
    if (priceAlerts.length > 0) {
      const mints = [...new Set(priceAlerts.map((a) => a.condition.target))];
      try {
        const prices = await this.jupiterClient.getPrices(mints);

        for (const alert of priceAlerts) {
          const priceData = prices[alert.condition.target];
          if (!priceData) continue;

          const currentPrice = priceData.price;
          const isTriggered = this.evaluateCondition(
            currentPrice,
            alert.condition.operator,
            alert.condition.value
          );

          if (isTriggered) {
            triggeredAlerts.push(alert);
            await this.sendNotification(
              `🚨 ${alert.name}`,
              `${this.getMintSymbol(alert.condition.target)} is now $${currentPrice.toFixed(4)} (${alert.condition.operator} $${alert.condition.value})`
            );
          }

          this.lastPrices.set(alert.condition.target, currentPrice);
        }
      } catch (error) {
        console.error('Price alert check failed:', error);
      }
    }

    // Check wallet activity alerts
    for (const alert of walletAlerts) {
      try {
        const recentTxs = await this.heliusClient.getTransactionHistory(
          alert.condition.target,
          { limit: 5 }
        );

        // Check if there are new transactions since last check
        const lastCheck = alert.lastTriggered || alert.createdAt;
        const newTxs = recentTxs.filter((tx) => tx.timestamp * 1000 > lastCheck);

        if (newTxs.length > 0) {
          triggeredAlerts.push(alert);
          const latestTx = newTxs[0];
          await this.sendNotification(
            `👁️ ${alert.name}`,
            `New activity: ${latestTx.type} — ${latestTx.description || 'View details'}`
          );
        }
      } catch (error) {
        console.error('Wallet alert check failed:', error);
      }
    }

    return triggeredAlerts;
  }

  /**
   * Evaluate an alert condition
   */
  private evaluateCondition(
    currentValue: number,
    operator: string,
    targetValue: number
  ): boolean {
    switch (operator) {
      case 'above':
        return currentValue >= targetValue;
      case 'below':
        return currentValue <= targetValue;
      case 'change':
        // For percentage change alerts
        const lastPrice = this.lastPrices.get(String(targetValue));
        if (!lastPrice) return false;
        const changePercent = ((currentValue - lastPrice) / lastPrice) * 100;
        return Math.abs(changePercent) >= targetValue;
      default:
        return false;
    }
  }

  /**
   * Send a push notification
   */
  private async sendNotification(title: string, body: string) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: 'default',
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: null, // Immediate
    });
  }

  /**
   * Get symbol for a mint address
   */
  private getMintSymbol(mint: string): string {
    for (const [symbol, address] of Object.entries(KNOWN_MINTS)) {
      if (address === mint) return symbol;
    }
    return mint.slice(0, 8) + '...';
  }
}

/**
 * Setup notification channel and permissions
 */
export async function setupNotifications() {
  // Request permission
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    console.warn('Notification permission not granted');
    return false;
  }

  // Configure notification channel (Android)
  await Notifications.setNotificationChannelAsync('solpulse-alerts', {
    name: 'SolPulse Alerts',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#9945FF',
    sound: 'default',
  });

  // Configure notification handler
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  return true;
}

export default AlertEngine;
