"use client"

import BouquetCard from "@/components/bouquet-card"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Loader2, Flower2, RefreshCw, ShoppingCart } from "lucide-react"
import { useContract } from "@/hooks/useContract"
import { toast } from "sonner"
import { useState } from "react"
import BuyMFIModal from "@/components/buy-mfi-modal"

interface SavingsGridProps {
  bouquetsData: {
    bouquets: any[]
    isLoading: boolean
    refresh: () => Promise<void>
  }
  onSelectBouquet: (tokenId: bigint) => void
  onDeposit: () => void
}

export default function SavingsGrid({ bouquetsData, onSelectBouquet, onDeposit }: SavingsGridProps) {
  const { bouquets, isLoading, refresh } = bouquetsData
  const { isConnected } = useContract()
  const [showBuyModal, setShowBuyModal] = useState(false)

  const handleRefresh = async () => {
    await refresh()
    toast.success("Savings refreshed!", {
      description: "All bouquet data has been updated.",
    })
  }

  if (!isConnected) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Your Savings</h2>
            <p className="text-muted-foreground mt-1">Grow your wealth with rose bouquet NFTs</p>
          </div>
        </div>

        <Card className="p-12 text-center border-2 border-dashed border-primary/30">
          <Flower2 className="w-16 h-16 mx-auto mb-4 text-primary/50" />
          <h3 className="text-xl font-semibold text-foreground mb-2">Connect Your Wallet</h3>
          <p className="text-muted-foreground">
            Please connect your wallet to view and manage your savings
          </p>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Your Savings</h2>
            <p className="text-muted-foreground mt-1">Grow your wealth with rose bouquet NFTs</p>
          </div>
        </div>

        <Card className="p-12 text-center">
          <Loader2 className="w-16 h-16 mx-auto mb-4 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading your bouquets...</p>
        </Card>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Your Savings</h2>
            <p className="text-muted-foreground mt-1">
              {bouquets.length === 0
                ? "Start saving by making your first deposit"
                : `${bouquets.length} bouquet${bouquets.length !== 1 ? "s" : ""} growing`}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleRefresh}
              disabled={isLoading}
              variant="ghost"
              className="gap-2"
              title="Refresh bouquet data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              onClick={() => setShowBuyModal(true)}
              variant="ghost"
              className="gap-2 border-green-500/30 text-green-600 hover:bg-green-500/10 dark:text-green-400"
            >
              <ShoppingCart className="w-4 h-4" />
              Buy MFI
            </Button>
            <Button
              onClick={onDeposit}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Deposit MFI
            </Button>
          </div>
        </div>

        {bouquets.length === 0 ? (
          <Card className="p-12 text-center border-2 border-dashed border-primary/30">
            <div className="text-6xl mb-4">🌹</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Start Your Savings Journey</h3>
            <p className="text-muted-foreground mb-6">
              Deposit MFI tokens and receive beautiful rose bouquet NFTs as receipts!
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => setShowBuyModal(true)} variant="outline" className="gap-2">
                <ShoppingCart className="w-4 h-4" />
                Buy MFI First
              </Button>
              <Button onClick={onDeposit} className="gap-2">
                <Plus className="w-4 h-4" />
                Make Your First Deposit
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bouquets.map((bouquet) => (
              <div key={bouquet.tokenId.toString()} onClick={() => onSelectBouquet(bouquet.tokenId)} className="cursor-pointer">
                <BouquetCard bouquet={bouquet} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Buy MFI Modal */}
      <BuyMFIModal 
        isOpen={showBuyModal} 
        onClose={() => setShowBuyModal(false)}
        onSuccess={refresh}
      />
    </>
  )
}
