"use client"

import { Card } from "@/components/ui/card"
import { Flower2, Sparkles, Coins, TrendingUp } from "lucide-react"
import { useContract } from "@/hooks/useContract"
import { formatMFI } from "@/lib/contract"
import { CheckCircle } from "lucide-react"

interface StatsSidebarProps {
  bouquetsData: {
    bouquets: any[]
    mfiBalance: bigint
    nftCount: number
    isLoading: boolean
    error: string | null
    refresh: () => Promise<void>
  }
  selectedBouquetId: bigint | null
}

export default function StatsSidebar({ bouquetsData, selectedBouquetId }: StatsSidebarProps) {
  const { bouquets, mfiBalance, nftCount } = bouquetsData
  const { isConnected, address } = useContract()

  const totalRoses = bouquets.reduce((sum, b) => sum + b.roseCount, 0)
  const totalValue = bouquets.reduce((sum, b) => sum + b.totalValue, 0n)
  const fullBouquets = bouquets.filter((b) => b.roseCount === 10).length

  return (
    <div className="space-y-4 sticky top-24">
      {/* Savings Stats */}
      <Card className="p-4 bg-gradient-to-br from-card to-card/50 border border-border animate-slide-in-up hover:shadow-lg transition-all duration-300 ease-out">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Flower2 className="w-5 h-5 text-rose-500" />
          Savings Overview
        </h3>
        {isConnected ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 rounded bg-muted/50 hover:bg-muted transition-all duration-300 ease-out">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Flower2 className="w-4 h-4 text-rose-500" />
                Total Bouquets
              </span>
              <span className="font-semibold text-foreground">{nftCount}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-muted/50 hover:bg-muted transition-all duration-300 ease-out">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                Total Roses
              </span>
              <span className="font-semibold text-foreground">{totalRoses} 🌹</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-muted/50 hover:bg-muted transition-all duration-300 ease-out">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="w-4 h-4 text-green-500" />
                Full Bouquets
              </span>
              <span className="font-semibold text-foreground">{fullBouquets} 👑</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-rose-500/10 hover:bg-rose-500/20 transition-all duration-300 ease-out border border-rose-500/20">
              <span className="flex items-center gap-2 text-sm text-rose-600 dark:text-rose-400 font-medium">
                <Coins className="w-4 h-4" />
                Total Saved
              </span>
              <span className="font-bold text-rose-600 dark:text-rose-400">{formatMFI(totalValue)} MFI</span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">Connect wallet to view stats</p>
        )}
      </Card>

      {/* Wallet Info */}
      {isConnected && (
        <Card
          className="p-4 border border-border animate-slide-in-up transition-all duration-300 ease-out"
          style={{ animationDelay: "0.1s" }}
        >
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Coins className="w-5 h-5 text-green-500" />
            Wallet Balance
          </h3>
          <div className="space-y-2">
            <div className="p-3 rounded bg-green-500/10 border border-green-500/20">
              <p className="text-xs text-muted-foreground mb-1">Available MFI</p>
              <p className="text-lg font-bold text-foreground">{formatMFI(mfiBalance)} MFI</p>
            </div>
            <div className="p-2 rounded bg-muted/30">
              <p className="text-xs text-muted-foreground mb-1">Address</p>
              <p className="text-xs font-mono text-foreground truncate">{address}</p>
            </div>
          </div>
        </Card>
      )}

      {/* How It Works */}
      <Card
        className="p-4 border border-border animate-slide-in-up transition-all duration-300 ease-out"
        style={{ animationDelay: "0.2s" }}
      >
        <h3 className="font-semibold text-foreground mb-3">How It Works</h3>
        <div className="space-y-2 text-xs text-muted-foreground">
          <p>1. Buy $MFI tokens with ETH</p>
          <p>2. Deposit 10 MFI → Get 1 rose </p>
          <p>3. Keep depositing → Grow bouquet (max 10 roses)</p>
          <p>4. Redeem NFT → Get MFI back (minus 2.5% fee)</p>
          <p className="text-rose-500 font-semibold pt-2">💐 Each rose = 10 MFI deposited!</p>
        </div>
      </Card>

      {/* Exchange Rate */}
      <Card
        className="p-4 border border-border animate-slide-in-up transition-all duration-300 ease-out"
        style={{ animationDelay: "0.3s" }}
      >
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Exchange Rate
        </h3>
        <div className="space-y-3 text-sm">
          <div className="p-3 rounded bg-blue-500/10 border border-blue-500/20">
            <p className="text-xs text-muted-foreground mb-1">1 ETH</p>
            <p className="font-semibold text-foreground">= 300,000,000 MFI</p>
          </div>
          <div className="p-3 rounded bg-rose-500/10 border border-rose-500/20">
            <p className="text-xs text-muted-foreground mb-1">Redemption Fee</p>
            <p className="font-semibold text-foreground">2.5%</p>
          </div>
        </div>
      </Card>

      {/* Benefits */}
      <Card
        className="p-4 border border-border animate-slide-in-up transition-all duration-300 ease-out"
        style={{ animationDelay: "0.4s" }}
      >
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          Why Save Here?
        </h3>
        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span> On-chain proof of savings</span>
          </div>
          <div className="flex space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span> Beautiful NFT receipts</span>
          </div>  
          <div className="flex space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span> Withdraw anytime</span>
          </div>
          <div className="flex space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span> Transparent & secure</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
