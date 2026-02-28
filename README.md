# SolPulse 🟣

**Your Solana DeFi Command Center**

SolPulse is a mobile-first DeFi dashboard built for the Solana Seeker phone. Track your portfolio, set price alerts, monitor whale wallets, and manage DeFi positions — all in one beautiful app.

## ✨ Features

- **📊 Portfolio Dashboard** — Real-time portfolio value with holdings breakdown
- **📈 Price Charts** — Interactive OHLCV charts for any Solana token
- **🔔 Smart Alerts** — Price alerts, wallet activity alerts, portfolio alerts
- **👁️ Whale Tracker** — Monitor any wallet for activity
- **🏦 DeFi Positions** — Track staking, LP, lending across protocols
- **🔄 Quick Swap** — Swap tokens via Jupiter DEX
- **📜 Transaction History** — Parsed, categorized transaction feed
- **🌙 Dark Mode** — Beautiful dark theme (light mode too!)

## 🏗️ Tech Stack

- **React Native** (Expo) + **TypeScript**
- **Zustand** for state management
- **Solana Mobile Wallet Adapter** for Seeker integration
- **Helius** for enhanced RPC & transaction parsing
- **Jupiter** for prices & swaps
- **Birdeye** for market data & charts

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- Solana Seeker phone (or Android emulator)

### API Keys (free tiers available)
- **Helius**: [helius.dev](https://helius.dev) — 100K requests/day free
- **Birdeye**: [birdeye.so](https://birdeye.so) — 1,000 requests/day free
- **Jupiter**: No key needed for basic price/swap

### Setup

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/solpulse.git
cd solpulse

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Add your API keys to .env

# Start the dev server
npx expo start

# Run on Seeker
# Scan the QR code with Expo Go, or:
npx expo run:android
```

## 📂 Project Structure

```
solpulse/
├── app/                    # Expo Router screens
│   ├── (tabs)/             # Tab navigation screens
│   └── token/[mint].tsx    # Token detail page
├── src/
│   ├── components/         # Reusable UI components
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API clients (Helius, Jupiter, Birdeye)
│   ├── store/              # Zustand state stores
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Formatting & helper utilities
│   └── constants/          # Theme, tokens, protocol addresses
├── assets/                 # Icons, images, fonts
└── ARCHITECTURE.md         # Full technical architecture doc
```

## 🔑 Environment Variables

```env
HELIUS_API_KEY=your_helius_key
BIRDEYE_API_KEY=your_birdeye_key
JUPITER_API_KEY=optional_jupiter_key
```

## 📱 Screenshots

_Coming soon after Phase 1 build_

## 🗺️ Roadmap

- [x] Architecture & data models
- [ ] Phase 1: Core portfolio dashboard
- [ ] Phase 2: Alert system with push notifications
- [ ] Phase 3: DeFi position tracking
- [ ] Phase 4: Whale tracker
- [ ] Phase 5: Polish & Seeker dApp Store submission

## 📄 License

MIT

---

Built with 💜 for the Solana Seeker community
