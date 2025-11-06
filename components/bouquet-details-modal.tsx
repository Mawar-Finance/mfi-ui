"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Sparkles, Coins, TrendingDown, AlertTriangle } from "lucide-react"
import { Bouquet } from "@/types/contracts"
import { formatMFI, previewRedeem, redeemNFT } from "@/lib/contract"
import { useBouquets } from "@/hooks/useBouquets"
import { useContract } from "@/hooks/useContract"
import { toast } from "sonner"

interface BouquetDetailsModalProps {
  bouquet: Bouquet | null
  isOpen: boolean
  onClose: () => void
}

function renderRoses(count: number) {
  const roses = []
  for (let i = 0; i < count; i++) {
    roses.push(
      <span 
        key={i} 
        className="text-4xl animate-float inline-block"
        style={{ animationDelay: `${i * 0.1}s` }}
      >
        🌹
      </span>
    )
  }
  return roses
}

export default function BouquetDetailsModal({ bouquet, isOpen, onClose }: BouquetDetailsModalProps) {
  const { client, account } = useContract()
  const { refresh } = useBouquets()
  const [isLoading, setIsLoading] = useState(false)
  const [redeemPreview, setRedeemPreview] = useState<{
    principal: bigint
    fee: bigint
    payout: bigint
  } | null>(null)

  if (!bouquet) return null

  const progress = (bouquet.roseCount / 10) * 100
  const mfiValue = formatMFI(bouquet.totalValue)

  // Load preview when modal opens
  const loadPreview = async () => {
    if (!client || !bouquet) return
    try {
      const preview = await previewRedeem(client, bouquet.tokenId)
      setRedeemPreview(preview)
    } catch (err) {
      console.error("Error loading preview:", err)
    }
  }

  // Load preview on mount
  if (isOpen && !redeemPreview) {
    loadPreview()
  }

  const handleRedeem = async () => {
    if (!client || !account) {
      toast.error("Wallet not connected")
      return
    }

    setIsLoading(true)
    try {
      toast.info("Redeeming bouquet...", {
        description: "Please confirm the transaction",
      })

      await redeemNFT(client, account, bouquet.tokenId)

      toast.success("Bouquet redeemed!", {
        description: `You received ${redeemPreview ? formatMFI(redeemPreview.payout) : '—'} MFI 🎉`,
      })

      await refresh()
      onClose()
    } catch (err: any) {
      console.error("Error redeeming:", err)
      toast.error("Redemption failed", {
        description: err.message || "Please try again",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-3xl">🌹</span>
            Bouquet #{bouquet.tokenId.toString()}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Bouquet visualization */}
          <div className="h-48 rounded-lg flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-rose-50 to-pink-50 dark:from-rose-950 dark:to-pink-950">
            <div className="flex flex-wrap gap-2 justify-center items-center max-w-[250px]">
              {renderRoses(bouquet.roseCount)}
            </div>
            
            {bouquet.roseCount >= 5 && (
              <>
                <div className="absolute top-4 left-4 animate-bounce-in">
                  <Sparkles className="w-7 h-7 text-yellow-500" />
                </div>
                <div className="absolute top-6 right-6 text-3xl animate-pulse">✨</div>
              </>
            )}
            
            {bouquet.roseCount === 10 && (
              <>
                <div className="absolute bottom-6 left-6 text-2xl opacity-50 animate-bounce">🌺</div>
                <div className="absolute bottom-6 right-6 text-2xl opacity-50 animate-bounce delay-100">🦋</div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl animate-pulse opacity-20">
                  👑
                </div>
              </>
            )}
          </div>

          {/* Bouquet stats */}
          <div className="space-y-4">
            {/* Progress */}
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="flex items-center gap-1 text-foreground font-medium">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  Bouquet Progress
                </span>
                <span className="text-muted-foreground">{Math.floor(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {bouquet.roseCount} of 10 roses
                {bouquet.roseCount === 10 && " - Full bouquet! 👑"}
              </p>
            </div>

            {/* Value */}
            <Card className="p-4 bg-green-500/10 border-green-500/30">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Coins className="w-4 h-4 text-green-500" />
                  Total Value
                </span>
                <span className="font-bold text-lg text-green-600 dark:text-green-400">
                  {mfiValue} MFI
                </span>
              </div>
            </Card>

            {/* Redemption preview */}
            {redeemPreview && (
              <Card className="p-4 bg-rose-500/10 border-rose-500/30">
                <h4 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
                  <TrendingDown className="w-4 h-4" />
                  Redemption Preview
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Principal</span>
                    <span className="font-medium">{formatMFI(redeemPreview.principal)} MFI</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Platform Fee (2.5%)</span>
                    <span className="font-medium text-red-500">-{formatMFI(redeemPreview.fee)} MFI</span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between">
                    <span className="font-semibold">You Receive</span>
                    <span className="font-bold text-green-600 dark:text-green-400">
                      {formatMFI(redeemPreview.payout)} MFI
                    </span>
                  </div>
                </div>
              </Card>
            )}

            {/* Warning */}
            <Card className="p-3 bg-orange-500/10 border-orange-500/30">
              <div className="flex gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  <strong className="text-foreground">Warning:</strong> Redeeming will burn this NFT permanently and return your MFI minus the 2.5% platform fee.
                </p>
              </div>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Close
            </Button>
            <Button
              onClick={handleRedeem}
              disabled={isLoading}
              className="flex-1 gap-2 bg-rose-500 hover:bg-rose-600 text-white"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Redeeming...
                </>
              ) : (
                <>
                  <TrendingDown className="w-4 h-4" />
                  Redeem Now
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
