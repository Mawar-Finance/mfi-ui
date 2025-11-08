# Mawar Finance DApp

Blockchain-based savings application where users save on-chain and receive NFT rose bouquets as deposit receipts.

## 🌹 Core Features

- **Buy $MFI Tokens**: Purchase MFI tokens with ETH via Exchange contract
- **Deposit & Save**: Deposit MFI → Mint/upgrade NFT bouquets (1-10 roses)
- **Redeem**: Burn NFT bouquets to withdraw MFI (minus 2.5% platform fee)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🏗️ Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19
- **Blockchain**: Lisk Sepolia testnet
- **Wallet**: Panna SDK (embedded wallet)
- **Smart Contracts**: ethers.js v6 + Thirdweb
- **UI**: Tailwind CSS 4 + shadcn/ui + Radix UI

## 💡 How It Works

1. **Buy MFI**: User sends ETH → receives MFI (3000 MFI per 1 ETH)
2. **Deposit**: User deposits 10 MFI → mints NFT with 1 rose (upgrades up to 10 roses/bouquet)
3. **Redeem**: User burns NFT → receives MFI back (97.5%, 2.5% fee to treasury)

## 📚 Documentation

See [`.github/copilot-instructions.md`](.github/copilot-instructions.md) for comprehensive AI coding guidelines and architecture details.

## 🛠️ Development

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 📁 Project Structure

```
app/           # Next.js app router pages
components/    # React UI components
hooks/         # Custom React hooks (useContract, useBouquets)
lib/           # Contract interaction utilities
types/         # TypeScript types & ABIs
```

## 🌐 Network

**Lisk Sepolia Testnet**
- Chain ID: 4202
- RPC: https://rpc.sepolia-api.lisk.com
- Explorer: https://sepolia-blockscout.lisk.com

---

Built with ❤️ by Mawar Finance Team
