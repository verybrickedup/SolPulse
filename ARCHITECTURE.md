# SolPulse — Solana DeFi Dashboard & Alerts Hub
### Your Solana DeFi Command Center 🏆

---

## 🎯 Vision

SolPulse is the app every Seeker owner opens first thing in the morning. It gives you a complete, real-time view of your Solana DeFi portfolio — positions, yields, alerts, whale activity — all in one beautiful, mobile-native experience.

---

## 🏗️ Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Framework** | React Native (Expo) | Cross-platform, huge ecosystem, fast iteration |
| **Language** | TypeScript | Type safety, better DX, fewer bugs |
| **State** | Zustand | Lightweight, simple, perfect for React Native |
| **Navigation** | React Navigation v7 | Industry standard for RN |
| **Charts** | Victory Native / react-native-wagmi-charts | Beautiful, performant financial charts |
| **Storage** | MMKV + SQLite (expo-sqlite) | Fast local cache + structured data |
| **Notifications** | expo-notifications + background tasks | Push alerts even when app is closed |
| **Wallet** | @solana/web3.js + Seeker wallet adapter | Native Seeker wallet integration |
| **Styling** | Nativewind (Tailwind for RN) | Rapid UI development |

---

## 🔌 API Integrations

### Primary APIs
1. **Helius RPC & DAS API** (Enhanced Solana RPC)
   - Token balances with metadata
   - Transaction history with parsed instructions
   - Webhook support for real-time notifications
   - Free tier: 100K requests/day

2. **Jupiter API** (Pricing & Swaps)
   - Real-time token prices
   - Swap quotes & execution
   - Token list with verification status
   - Free, no key required for basic use

3. **Birdeye API** (Market Data)
   - OHLCV price history (charts)
   - Token overview & stats
   - Trending tokens
   - Free tier: 1,000 requests/day

### Protocol-Specific
4. **Marinade Finance** — Liquid staking positions (mSOL)
5. **Raydium** — LP positions, concentrated liquidity
6. **Drift Protocol** — Perp positions, margin accounts
7. **Kamino Finance** — Lending/borrowing positions
8. **Jito** — MEV staking (jitoSOL)

---

## 📱 Screen Architecture

### 1. 🏠 Dashboard (Home)
```
┌─────────────────────────────┐
│  SolPulse          ⚙️  🔔   │
├─────────────────────────────┤
│                             │
│   Total Portfolio Value     │
│      $12,483.52             │
│      ▲ +$342.18 (2.8%)     │
│   ┌───────────────────┐    │
│   │  📈 7D Chart      │    │
│   └───────────────────┘    │
│                             │
│  ── Quick Actions ────────  │
│  [Swap] [Send] [Stake]     │
│                             │
│  ── Top Holdings ─────────  │
│  SOL      45.2    $6,780   │
│  USDC     2,100   $2,100   │
│  JUP      1,500   $1,245   │
│  BONK     50M     $890     │
│                             │
│  ── Active Alerts (3) ───  │
│  🔴 SOL < $130 (now $149) │
│  🟢 JUP > $1.00 (now $0.83)│
│  👁️ Whale moved 10K SOL   │
│                             │
│  ── DeFi Positions ──────  │
│  Marinade  12 mSOL  $1,800 │
│  Kamino   $500 USDC  8.2%  │
│                             │
├─────────────────────────────┤
│ 🏠  📊  🔔  👁️  ⚙️        │
└─────────────────────────────┘
```

### 2. 📊 Token Detail
- Interactive price chart (1H, 4H, 1D, 1W, 1M, ALL)
- Your holdings & average buy price
- Quick swap button
- Token info (market cap, volume, supply)
- Recent transactions for this token

### 3. 🏦 DeFi Positions
- Staking: SOL staked, validator info, rewards earned
- Liquidity Pools: Pool pair, your share, fees earned, IL tracker
- Lending: Supplied/borrowed amounts, interest rates, health factor
- Yield summary: Total yield across all positions

### 4. 🔔 Alerts Manager
- **Price Alerts:** Token above/below price threshold
- **Wallet Alerts:** Monitor any address for activity
- **Portfolio Alerts:** Total value above/below threshold
- **DeFi Alerts:** Health factor warnings, reward claimable
- **Whale Alerts:** Track known whale wallets
- Toggle on/off, edit, delete, history of triggered alerts

### 5. 👁️ Whale Tracker
- Add wallet addresses to monitor
- Real-time activity feed
- Label wallets (e.g., "Smart Money #1", "VC Fund")
- Filter by transaction type (swaps, transfers, DeFi)

### 6. 📜 Transaction History
- All transactions, parsed and categorized
- Filter: Swaps, Transfers, DeFi, NFTs, Unknown
- Search by token, address, or date
- Export to CSV

### 7. ⚙️ Settings
- RPC endpoint configuration
- Notification preferences
- Theme (dark/light/auto)
- Currency display (USD, EUR, BTC)
- Connected wallet management

---

## 📂 Project Structure

```
solpulse/
├── app/                          # Expo Router screens
│   ├── (tabs)/
│   │   ├── index.tsx             # Dashboard
│   │   ├── portfolio.tsx         # DeFi Positions
│   │   ├── alerts.tsx            # Alerts Manager
│   │   ├── whale.tsx             # Whale Tracker
│   │   └── settings.tsx          # Settings
│   ├── token/[mint].tsx          # Token Detail
│   ├── transaction/[sig].tsx     # Transaction Detail
│   └── _layout.tsx               # Root layout
│
├── src/
│   ├── components/
│   │   ├── ui/                   # Reusable UI (Button, Card, Badge...)
│   │   ├── charts/               # Price charts, portfolio chart
│   │   ├── portfolio/            # Holdings list, position cards
│   │   ├── alerts/               # Alert cards, create alert form
│   │   └── whale/                # Whale activity feed items
│   │
│   ├── hooks/
│   │   ├── usePortfolio.ts       # Portfolio data fetching
│   │   ├── useTokenPrice.ts      # Real-time price updates
│   │   ├── useAlerts.ts          # Alert management
│   │   ├── useWhaleTracker.ts    # Whale monitoring
│   │   ├── useDeFiPositions.ts   # DeFi protocol data
│   │   └── useWallet.ts          # Seeker wallet connection
│   │
│   ├── services/
│   │   ├── helius.ts             # Helius RPC & DAS client
│   │   ├── jupiter.ts            # Jupiter price & swap client
│   │   ├── birdeye.ts            # Birdeye market data client
│   │   ├── protocols/
│   │   │   ├── marinade.ts       # Marinade staking
│   │   │   ├── raydium.ts        # Raydium LP
│   │   │   ├── kamino.ts         # Kamino lending
│   │   │   └── drift.ts          # Drift perps
│   │   ├── alerts.ts             # Alert engine & notification dispatch
│   │   ├── notifications.ts     # Push notification setup
│   │   └── cache.ts              # Local data caching layer
│   │
│   ├── store/
│   │   ├── portfolioStore.ts     # Zustand portfolio state
│   │   ├── alertStore.ts         # Zustand alert state
│   │   ├── settingsStore.ts      # Zustand settings state
│   │   └── whaleStore.ts         # Zustand whale tracker state
│   │
│   ├── types/
│   │   ├── token.ts              # Token types
│   │   ├── position.ts           # DeFi position types
│   │   ├── alert.ts              # Alert types
│   │   └── transaction.ts        # Transaction types
│   │
│   ├── utils/
│   │   ├── format.ts             # Number/currency formatting
│   │   ├── solana.ts             # Solana helpers
│   │   └── time.ts               # Time/date utilities
│   │
│   └── constants/
│       ├── tokens.ts             # Known token list
│       ├── protocols.ts          # Protocol addresses
│       └── theme.ts              # Colors, spacing, fonts
│
├── assets/                       # Icons, images, fonts
├── app.json                      # Expo config
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🗄️ Data Models

### Token Holding
```typescript
interface TokenHolding {
  mint: string;
  symbol: string;
  name: string;
  logoUri: string;
  balance: number;          // Raw token amount
  decimals: number;
  usdPrice: number;
  usdValue: number;
  priceChange24h: number;   // Percentage
  isVerified: boolean;
}
```

### DeFi Position
```typescript
interface DeFiPosition {
  id: string;
  protocol: 'marinade' | 'raydium' | 'kamino' | 'drift' | 'jito';
  type: 'stake' | 'lp' | 'lend' | 'borrow' | 'perp';
  label: string;            // e.g., "SOL-USDC LP"
  depositedValue: number;   // USD at time of deposit
  currentValue: number;     // Current USD value
  apy: number;              // Current APY
  rewardsEarned: number;    // USD value of unclaimed rewards
  healthFactor?: number;    // For lending/borrowing
  metadata: Record<string, any>;
}
```

### Alert
```typescript
interface Alert {
  id: string;
  type: 'price' | 'wallet' | 'portfolio' | 'defi' | 'whale';
  name: string;
  enabled: boolean;
  condition: {
    target: string;         // Token mint, wallet address, or 'portfolio'
    operator: 'above' | 'below' | 'change' | 'any_activity';
    value: number;
    timeframe?: string;     // For % change alerts
  };
  lastTriggered?: number;
  createdAt: number;
}
```

### Whale Watch
```typescript
interface WhaleWatch {
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
```

---

## 🔄 Data Flow

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  Helius RPC  │────▶│              │────▶│  Zustand     │
│  Birdeye API │────▶│  Services    │────▶│  Stores      │
│  Jupiter API │────▶│  (fetch,     │────▶│  (state)     │
│  Protocol    │────▶│   parse,     │     └──────┬──────┘
│  SDKs        │     │   cache)     │            │
└─────────────┘     └──────────────┘            │
                                                 ▼
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  Push        │◀────│  Alert       │◀────│  React       │
│  Notifications│    │  Engine      │     │  Components  │
└─────────────┘     └──────────────┘     └─────────────┘
                           │
                    ┌──────┴──────┐
                    │  SQLite     │
                    │  (history,  │
                    │   cache)    │
                    └─────────────┘
```

---

## 🚀 MVP Roadmap

### Phase 1 — Core (Week 1-2)
- [ ] Project setup (Expo, TypeScript, navigation)
- [ ] Wallet connection (Seeker wallet adapter)
- [ ] Dashboard screen with portfolio value
- [ ] Token holdings list with prices
- [ ] Token detail screen with price chart
- [ ] Basic transaction history

### Phase 2 — Alerts (Week 3)
- [ ] Alert creation UI
- [ ] Price alert engine (background polling)
- [ ] Push notification integration
- [ ] Alert history & management

### Phase 3 — DeFi (Week 4)
- [ ] Marinade staking position tracking
- [ ] Raydium LP position tracking
- [ ] Kamino lending/borrowing positions
- [ ] Unified DeFi positions view

### Phase 4 — Whale Tracker (Week 5)
- [ ] Add/remove wallet addresses to watch
- [ ] Helius webhook integration for real-time updates
- [ ] Activity feed with parsed transactions
- [ ] Whale activity push notifications

### Phase 5 — Polish (Week 6)
- [ ] Dark/light theme
- [ ] Onboarding flow
- [ ] Performance optimization
- [ ] Beta testing & bug fixes
- [ ] Seeker dApp Store submission

---

## 💰 Monetization Ideas

1. **Freemium Model**
   - Free: 3 alerts, 1 whale watch, basic portfolio
   - Pro ($4.99/mo): Unlimited alerts, unlimited whale watches, DeFi tracking, CSV export
   
2. **Swap Fees** — Take a small referral fee on Jupiter swaps done through the app

3. **Premium Alerts** — Advanced alerts (multi-condition, custom webhooks) as paid feature

4. **NFT Pass** — Mint a "SolPulse Pro" NFT for lifetime access (Web3-native monetization)

---

## 🔐 Security Considerations

- Never store private keys — use Seeker's built-in wallet adapter
- All API keys stored in secure storage (expo-secure-store)
- RPC calls only — no backend server required for core features
- Open source the core, keep premium features server-side

---

_Created: February 27, 2026_
_App: SolPulse v0.1 — Architecture Document_
