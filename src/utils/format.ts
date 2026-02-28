/**
 * Formatting utilities for SolPulse
 * Currency, numbers, percentages, addresses, and time
 */

/**
 * Format USD value
 * $1,234.56 for large values, $0.001234 for small values
 */
export function formatUSD(value: number): string {
  if (value === 0) return '$0.00';

  if (Math.abs(value) >= 1) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }

  // For very small values, show more decimals
  if (Math.abs(value) < 0.01) {
    return `$${value.toFixed(6)}`;
  }

  return `$${value.toFixed(4)}`;
}

/**
 * Format token price
 * Shows appropriate precision based on magnitude
 */
export function formatPrice(price: number): string {
  if (price === 0) return '$0';
  if (price >= 1000) return `$${price.toFixed(2)}`;
  if (price >= 1) return `$${price.toFixed(4)}`;
  if (price >= 0.001) return `$${price.toFixed(6)}`;
  
  // For extremely small prices (memecoins), use subscript notation
  const str = price.toFixed(20);
  const match = str.match(/^0\.(0+)/);
  if (match) {
    const zeros = match[1].length;
    const significant = price.toFixed(zeros + 4).slice(zeros + 2);
    return `$0.0₍${zeros}₎${significant}`;
  }
  
  return `$${price.toFixed(10)}`;
}

/**
 * Format large numbers with abbreviations
 * 1.5K, 2.3M, 1.2B, 500T
 */
export function formatCompact(value: number): string {
  if (value === 0) return '0';

  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (absValue >= 1e12) return `${sign}${(absValue / 1e12).toFixed(1)}T`;
  if (absValue >= 1e9) return `${sign}${(absValue / 1e9).toFixed(1)}B`;
  if (absValue >= 1e6) return `${sign}${(absValue / 1e6).toFixed(1)}M`;
  if (absValue >= 1e3) return `${sign}${(absValue / 1e3).toFixed(1)}K`;
  
  return `${sign}${absValue.toFixed(2)}`;
}

/**
 * Format token balance
 * Shows appropriate decimals based on value
 */
export function formatBalance(balance: number, decimals: number = 4): string {
  if (balance === 0) return '0';
  if (balance >= 1e9) return formatCompact(balance);
  if (balance >= 1e6) return formatCompact(balance);
  if (balance >= 1000) return balance.toLocaleString('en-US', { maximumFractionDigits: 2 });
  if (balance >= 1) return balance.toFixed(Math.min(decimals, 4));
  
  return balance.toFixed(Math.min(decimals, 6));
}

/**
 * Format percentage change
 * +2.34% or -5.67% with color indicator
 */
export function formatPercent(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

/**
 * Get color for percentage change
 */
export function getChangeColor(value: number): string {
  if (value > 0) return '#22C55E'; // Green
  if (value < 0) return '#EF4444'; // Red
  return '#9CA3AF'; // Gray
}

/**
 * Truncate a Solana address
 * 8MLA...3piE
 */
export function truncateAddress(address: string, start: number = 4, end: number = 4): string {
  if (address.length <= start + end + 3) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}

/**
 * Format relative time
 * "2m ago", "1h ago", "3d ago"
 */
export function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format a full date/time
 */
export function formatDateTime(timestamp: number): string {
  return new Date(timestamp).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
